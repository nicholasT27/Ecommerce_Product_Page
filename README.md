# Sneakers demo store

A responsive, full-stack ecommerce prototype expanded from the original product-page challenge. The existing visual language, desktop product layout, mobile gallery, and hamburger navigation are preserved while the experience now supports browsing through simulated order confirmation.

## Stack

- React 19, React Router, Vite, and Tailwind CSS
- Express REST API
- SQLite via `better-sqlite3`
- Vitest and Supertest for API tests

## Run locally

```bash
npm install
npm run dev
```

The storefront runs at `http://localhost:5173`; Vite proxies API requests to the Express server at `http://localhost:3001`.

For a production-style run:

```bash
npm run build
npm start
```

Express serves both the API and built frontend at `http://localhost:3001`.

## Demo database

The SQLite database is created automatically at `server/data/store.db` and seeded on first run. Reset it at any time with:

```bash
npm run db:reset
```

The schema contains categories, products, a demo user, cart and wishlist items, orders, and immutable order line items. The app uses one simulated signed-in user (`alex@example.com`) so the full flow works without authentication setup.

## Available flows

- Browse seeded catalog and category pages
- Search, sort, and filter by stock
- View responsive product galleries and live inventory
- Add, update, and remove cart items with stock validation
- Save and remove wishlist items
- Complete a no-payment checkout that reserves inventory and creates an order
- View confirmation details and demo account order history

No payment details are collected and no payment gateway is integrated.

## Quality checks

```bash
npm run lint
npm test
npm run build
```
