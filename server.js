import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './configs/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

const SUBMISSIONS_TABLE = 'website_submissions';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname));

async function ensureSubmissionsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${SUBMISSIONS_TABLE} (
      id SERIAL PRIMARY KEY,
      source TEXT NOT NULL DEFAULT 'unknown',
      payload JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

ensureSubmissionsTable().catch((error) => {
  console.error('Failed to initialize database tables:', error);
});

app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS now');
    res.json({ ok: true, database: 'connected', now: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ ok: false, database: 'disconnected', error: error.message });
  }
});

app.get('/api/submissions', async (req, res) => {
  try {
    const { source } = req.query;
    const query = source
      ? `SELECT * FROM ${SUBMISSIONS_TABLE} WHERE source = $1 ORDER BY created_at DESC, id DESC`
      : `SELECT * FROM ${SUBMISSIONS_TABLE} ORDER BY created_at DESC, id DESC`;
    const values = source ? [source] : [];

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch submissions', error: error.message });
  }
});

app.post('/api/submissions', async (req, res) => {
  try {
    const { source = 'unknown', payload = req.body } = req.body || {};

    const result = await pool.query(
      `INSERT INTO ${SUBMISSIONS_TABLE} (source, payload)
       VALUES ($1, $2)
       RETURNING *`,
      [source, payload],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save submission', error: error.message });
  }
});

app.get('/api/branches', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM branch ORDER BY name ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch branches', error: error.message });
  }
});

// POST: Delivery order
app.post('/api/orders/delivery', async (req, res) => {
  try {
    console.log('📦 [DELIVERY] New request received:', req.body);
    
    const { location, name, email, phone, streetname, housenumber, postalcode, municipality, orderDetails, notes } = req.body;

    if (!location || !name || !email || !phone || !streetname || !housenumber || !postalcode || !municipality) {
      console.warn('⚠️  [DELIVERY] Missing required fields:', { location, name, email, phone, streetname, housenumber, postalcode, municipality });
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const now = new Date();
    const requested_hour = now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });

    const result = await pool.query(
      `INSERT INTO orders (
        customer_name,
        customer_email,
        customer_telephonenumber,
        branch_id,
        type,
        delivery_streetname,
        delivery_housenumber,
        delivery_postalcode,
        delivery_municipality,
        requested_hour,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id, customer_name, status, created`,
      [
        name,
        email,
        phone,
        location,
        'delivery',
        streetname,
        housenumber,
        postalcode,
        municipality,
        requested_hour,
        'pending',
      ],
    );

    console.log('✅ [DELIVERY] Order created successfully. Order ID:', result.rows[0].id);
    res.status(201).json({ success: true, message: 'Delivery order created', order: result.rows[0] });
  } catch (error) {
    console.error('❌ [DELIVERY] Error creating delivery order:', error);
    res.status(500).json({ message: 'Failed to create delivery order', error: error.message });
  }
});

// POST: Pickup order
app.post('/api/orders/pickup', async (req, res) => {
  try {
    console.log('🍕 [PICKUP] New request received:', req.body);
    
    const { location, name, email, phone, pickupTime, orderDetails, notes } = req.body;

    if (!location || !name || !email || !phone || !pickupTime) {
      console.warn('⚠️  [PICKUP] Missing required fields:', { location, name, email, phone, pickupTime });
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Extract time from datetime-local format (format: "2026-05-13T19:30")
    const pickupDateTime = new Date(pickupTime);
    const requested_hour = pickupDateTime.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });

    const result = await pool.query(
      `INSERT INTO orders (
        customer_name,
        customer_email,
        customer_telephonenumber,
        branch_id,
        type,
        requested_hour,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, customer_name, status, created`,
      [name, email, phone, location, 'pickup', requested_hour, 'pending'],
    );

    console.log('✅ [PICKUP] Order created successfully. Order ID:', result.rows[0].id);
    res.status(201).json({ success: true, message: 'Pickup order created', order: result.rows[0] });
  } catch (error) {
    console.error('❌ [PICKUP] Error creating pickup order:', error);
    res.status(500).json({ message: 'Failed to create pickup order', error: error.message });
  }
});

// Redirect root to home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'website/anticoHomePage.html'));
});

app.listen(PORT, () => {
  console.log(`🍕 Server running at http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/health`);
  console.log('Available pages:');
  console.log(`  - http://localhost:${PORT}/website/anticoHomePage.html`);
  console.log(`  - http://localhost:${PORT}/website/anticoMenu.html`);
  console.log(`  - http://localhost:${PORT}/website/anticoLocations.html`);
  console.log(`  - http://localhost:${PORT}/website/anticoContact.html`);
  console.log(`  - http://localhost:${PORT}/bestellen/pickupOrder.html`);
  console.log(`  - http://localhost:${PORT}/bestellen/delivery.html`);
  console.log(`  - http://localhost:${PORT}/reservatie/reserveTable.html`);
  console.log('\nPress Ctrl+C to stop');
});
