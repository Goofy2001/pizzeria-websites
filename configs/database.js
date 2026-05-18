/**
 * DATABASE CONFIGURATION
 * Doel: PostgreSQL connection pool voor pizzeria-websites
 * Toggle: Lokale PostgreSQL of Supabase cloud database
 */

import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

function resolveUseSupabase(useSupabase) {
    if (typeof useSupabase === 'boolean') {
        return useSupabase;
    }

    return String(process.env.USE_SUPABASE || '').toLowerCase() === 'true';
}

export function createDatabasePool(useSupabase = undefined) {
    const useSupabaseConnection = resolveUseSupabase(useSupabase);
    const hasDatabaseUrl = Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim());

    if (useSupabaseConnection && !hasDatabaseUrl) {
        throw new Error('USE_SUPABASE is enabled, but DATABASE_URL is missing.');
    }

    const poolConfig = useSupabaseConnection
        ? {
            connectionString: process.env.DATABASE_URL,
            ssl: false,
        }
        : {
            user: process.env.PGUSER || 'postgres',
            host: process.env.PGHOST || 'localhost',
            database: process.env.PGDATABASE || 'pizzeria',
            password: process.env.PGPASSWORD || '',
            port: Number(process.env.PGPORT || 5432),
        };

    console.log(
        `📡 Connecting to: ${useSupabaseConnection ? 'Supabase (DATABASE_URL)' : 'Local PostgreSQL'}`,
    );

    if (useSupabaseConnection) {
        console.log(`   DATABASE_URL=${hasDatabaseUrl ? 'present' : '(missing)'}`);
    } else {
        console.log(`   PGHOST=${process.env.PGHOST || 'localhost'}`);
        console.log(`   PGDATABASE=${process.env.PGDATABASE || 'pizzeria'}`);
    }

    const pool = new Pool(poolConfig);

    pool.query('select now()', function (err, res) {
        if (err) {
            console.error('Database connection failed:', err);
        } else {
            console.log('Database connected:', res.rows[0]);
        }
    });

    pool.on('error', function (err) {
        console.error('Unexpected database error on idle client:', err);
    });

    return pool;
}

const pool = createDatabasePool();

export default pool;