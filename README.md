# Pizzeria Websites

## 1) Projectbeschrijving en functionaliteiten

Deze applicatie is een deel van het interne IT systeem van een restaurantketen. Het project biedt statische HTML paginas met mogelijkheden om bestellingen en zaakgegevens rechtstreeks via de database te beheren. De applicatie bestaat uit verschillende paginas:

a) **Home pagina**: Overzicht van de restaurantvestigingen en algemene informatie
b) **Bestellen (Pickup)**: Pagina waar klanten bestellingen kunnen plaatsen voor afhaling
c) **Bestellen (Delivery)**: Pagina waar klanten bestellingen kunnen plaatsen voor bezorging
d) **Reservaties**: Pagina voor het maken van tafels reservaties

De applicatie wordt aangevuld door een volledig React-based dashboard systeem (pizzeria-app) voor bedrijfsleiding en drivers.

## 2) Gebruikte API's

Voor deze applicatie heb ik een backend gebouwd die API endpoints verstuurt. Hierdoor kan de applicatie informatie doorsturen naar en ontvangen van de database.

## 3) Implementatie van elke technische vereiste:

### 3.1) DOM Manipulatie
- **A) Elementen selecteren:** [pizzeria-websites/bestellen/pickupOrder.html](pizzeria-websites/bestellen/pickupOrder.html#L165-L179)
- **B) Elementen manipuleren:** [pizzeria-websites/bestellen/pickupOrder.html](pizzeria-websites/bestellen/pickupOrder.html#L142-L157)
- **C) Events aan elementen koppelen:** [pizzeria-websites/bestellen/pickupOrder.html](pizzeria-websites/bestellen/pickupOrder.html#L209-L212)

### 3.2) Modern JavaScript
- **A) Gebruik van constanten:** [pizzeria-app/backend/server.js](pizzeria-app/backend/server.js#L5-L12)
- **B) Template literals:** [pizzeria-app/backend/routes/driver.js](pizzeria-app/backend/routes/driver.js#L159)
- **C) Iteratie over arrays:** [pizzeria-app/frontend/src/pages/FrontDashboard.jsx](pizzeria-app/frontend/src/pages/FrontDashboard.jsx#L196-L204)
- **D) Array methods:** [pizzeria-app/frontend/src/pages/DriverNavigationPage.jsx](pizzeria-app/frontend/src/pages/DriverNavigationPage.jsx#L82-L84)
- **E) Arrow functions:** [pizzeria-app/frontend/src/pages/DriverDashboard.jsx](pizzeria-app/frontend/src/pages/DriverDashboard.jsx#L28-L46)
- **F) Conditional operator:** [pizzeria-app/frontend/src/config/api.js](pizzeria-app/frontend/src/config/api.js#L29)
- **G) Callback functions:** [pizzeria-app/frontend/src/pages/FrontDashboard.jsx](pizzeria-app/frontend/src/pages/FrontDashboard.jsx#L67-L90)
- **H) Promises:** [pizzeria-app/frontend/src/pages/FrontDashboard.jsx](pizzeria-app/frontend/src/pages/FrontDashboard.jsx#L358)
- **I) Async & Await:** [pizzeria-app/backend/scripts/insert_testData.js](pizzeria-app/backend/scripts/insert_testData.js#L187-L204)
- **J) Observer API:** Geïmplementeerd via Socket.IO event listeners

### 3.3) Data & API
- **A) Fetch om data op te halen:** [pizzeria-app/frontend/src/pages/FrontDashboard.jsx](pizzeria-app/frontend/src/pages/FrontDashboard.jsx#L406-L413)
- **B) JSON manipuleren en weergeven:** [pizzeria-app/frontend/src/pages/FrontDashboard.jsx](pizzeria-app/frontend/src/pages/FrontDashboard.jsx#L413-L415) en [pizzeria-app/frontend/src/pages/FrontDashboard.jsx](pizzeria-app/frontend/src/pages/FrontDashboard.jsx#L646-L657)

### 3.4) Opslag & Validatie
- **A) Formulier validatie:** [pizzeria-app/frontend/src/pages/LoginPage.jsx](pizzeria-app/frontend/src/pages/LoginPage.jsx#L68-L89)
- **B) Gebruik van LocalStorage:** [pizzeria-app/frontend/src/lib/session.js](pizzeria-app/frontend/src/lib/session.js#L1-L22)

### 3.5) Styling & Layout
- **A) Basis HTML layout:** [pizzeria-app/frontend/src/components/DashboardLayout.jsx](pizzeria-app/frontend/src/components/DashboardLayout.jsx#L33-L56)
- **B) Basis CSS:** [pizzeria-app/frontend/src/index.css](pizzeria-app/frontend/src/index.css#L1-L40)
- **C) Gebruiksvriendelijke elementen:** [pizzeria-app/frontend/src/pages/FrontDashboard.jsx](pizzeria-app/frontend/src/pages/FrontDashboard.jsx#L538-L551) en [pizzeria-app/frontend/src/pages/FrontDashboard.jsx](pizzeria-app/frontend/src/pages/FrontDashboard.jsx#L561-L578)

### 3.6) Tooling & Structuur
- **A) Project opgezet met Vite:** [pizzeria-app/frontend/package.json](pizzeria-app/frontend/package.json#L6-L10) en [pizzeria-app/frontend/vite.config.js](pizzeria-app/frontend/vite.config.js#L1-L47)
- **B) Correcte folderstructuur:** [pizzeria-app/frontend/src](pizzeria-app/frontend/src) (components/, pages/, lib/, config/)

## 4) Installatiehandleiding

### Vereisten
- Node.js + npm
- PostgreSQL lokaal (zelfde database als pizzeria-app, met tabellen `branch` en `orders`)

### 1. Database verbinding instellen (.env)
Maak bestand `.env` aan met:

```env
USE_SUPABASE=false
PGHOST=localhost
PGPORT=5432
PGDATABASE=pizzeria
PGUSER=postgres
PGPASSWORD=jouwwachtwoord
```

### 2. Dependencies installeren
```bash
npm install
```

### 3. Server starten
```bash
npm run dev
```

### 4. Open in browser
- Home: `http://localhost:3000/`
- Bestellen pickup: `http://localhost:3000/bestellen/pickupOrder.html`
- Bestellen delivery: `http://localhost:3000/bestellen/delivery.html`
- API health: `http://localhost:3000/api/health`

## 5) Screenshots

*Screenshots worden hier toegevoegd*

## 6) Gebruikte bronnen

Voor het maken van deze applicatie heb ik voornamelijk gewerkt met de GitHub Copilot extensie van Visual Studio Code. De chatlogs zijn te vinden in `ChatlogsCopilot/`
