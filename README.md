# Sneakers demo store

A responsive, full-stack ecommerce prototype expanded from the original product-page challenge. The existing visual language, desktop product layout, mobile gallery, and hamburger navigation are preserved while the experience now supports browsing through simulated order confirmation.

## Stack

- React 19, React Router, Vite, and Tailwind CSS
- Express REST API
- Supabase Postgres and Auth when configured
- SQLite via `better-sqlite3` as a zero-setup local fallback
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

## Supabase setup

The production-style demo stores products, profiles, carts, wishlists, inventory,
and orders in Supabase. Authentication uses Supabase email/password accounts and
every customer-owned table is protected by row-level security.

1. Create a Supabase project.
2. Copy `.env.example` to `.env` and add the project's URL and publishable key.
   The publishable key is safe to use in the browser; never add a service-role
   key to this project.
3. Sign in to the Supabase CLI and apply the migration plus demo seed:

```bash
npx supabase login
npx supabase link --project-ref your-project-ref
npx supabase db push --include-seed
npm run dev
```

The migration in `supabase/migrations` creates the full schema, explicit API
grants, row-level-security policies, and an atomic checkout database function.
The catalog is populated from `supabase/seed.sql`.

For local Supabase development with Docker, use:

```bash
npx supabase start
npx supabase db reset
```

Copy the local API URL and publishable key printed by `supabase start` into
`.env`, then run `npm run dev`.

## Zero-setup local database

If Supabase variables are absent, the app automatically uses SQLite and a
simulated demo account. The database is created at `server/data/store.db` and
seeded on first run. Reset it at any time with:

```bash
npm run db:reset
```

This fallback keeps the complete shopping flow available without external
configuration. Its simulated user is `alex@example.com`.

## Available flows

- Browse seeded catalog and category pages
- Search, sort, and filter by stock
- View responsive product galleries and live inventory
- Add, update, and remove cart items with stock validation
- Save and remove wishlist items
- Complete a no-payment checkout that reserves inventory and creates an order
- Create an account, sign in/out, and save profile and delivery details with Supabase
- Show the signed-in customer's first initial in the header account circle
- View confirmation details and personal order history

No payment details are collected and no payment gateway is integrated.

## Quality checks

```bash
npm run lint
npm test
npm run build
```
