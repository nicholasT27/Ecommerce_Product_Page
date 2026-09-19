import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(root, 'data');
fs.mkdirSync(dataDir, { recursive: true });

export const db = new Database(process.env.DB_PATH || path.join(dataDir, 'store.db'));
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY, slug TEXT UNIQUE NOT NULL, category_id INTEGER NOT NULL,
    brand TEXT NOT NULL, name TEXT NOT NULL, description TEXT NOT NULL,
    price_cents INTEGER NOT NULL, compare_at_cents INTEGER, stock INTEGER NOT NULL DEFAULT 0,
    featured INTEGER NOT NULL DEFAULT 0, image_set INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY(category_id) REFERENCES categories(id)
  );
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '', address TEXT NOT NULL DEFAULT '',
    city TEXT NOT NULL DEFAULT '', postal_code TEXT NOT NULL DEFAULT ''
  );
  CREATE TABLE IF NOT EXISTS cart_items (
    user_id INTEGER NOT NULL, product_id INTEGER NOT NULL, quantity INTEGER NOT NULL,
    PRIMARY KEY(user_id, product_id),
    FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(product_id) REFERENCES products(id)
  );
  CREATE TABLE IF NOT EXISTS wishlist_items (
    user_id INTEGER NOT NULL, product_id INTEGER NOT NULL,
    PRIMARY KEY(user_id, product_id),
    FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(product_id) REFERENCES products(id)
  );
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT, order_number TEXT UNIQUE NOT NULL, user_id INTEGER NOT NULL,
    customer_name TEXT NOT NULL, email TEXT NOT NULL, address TEXT NOT NULL, city TEXT NOT NULL,
    postal_code TEXT NOT NULL, subtotal_cents INTEGER NOT NULL, shipping_cents INTEGER NOT NULL,
    status TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER NOT NULL, product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL, unit_price_cents INTEGER NOT NULL, quantity INTEGER NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(id), FOREIGN KEY(product_id) REFERENCES products(id)
  );
`);

// Existing demo databases predate the editable profile fields.
const userColumns = new Set(db.prepare('PRAGMA table_info(users)').all().map((column) => column.name));
for (const column of ['phone', 'address', 'city', 'postal_code']) {
  if (!userColumns.has(column)) db.exec(`ALTER TABLE users ADD COLUMN ${column} TEXT NOT NULL DEFAULT ''`);
}

export function seed() {
  const count = db.prepare('SELECT COUNT(*) count FROM products').get().count;
  if (count) return;
  const categories = [['collections', 'Collections'], ['men', 'Men'], ['women', 'Women']];
  const insertCategory = db.prepare('INSERT INTO categories (slug, name) VALUES (?, ?)');
  categories.forEach((category) => insertCategory.run(...category));
  const ids = Object.fromEntries(db.prepare('SELECT id, slug FROM categories').all().map((x) => [x.slug, x.id]));
  const products = [
    ['fall-limited-edition-sneakers', ids.men, 'Sneaker Company', 'Fall Limited Edition Sneakers', "These low-profile sneakers are your perfect casual wear companion. Featuring a durable rubber outer sole, they'll withstand everything the weather can offer.", 12500, 25000, 12, 1, 1],
    ['desert-classic-low', ids.men, 'Sneaker Company', 'Desert Classic Low', 'A warm neutral everyday sneaker with a soft lining and a grippy sole for all-day city walks.', 9800, 14000, 7, 1, 2],
    ['trail-sunset-runner', ids.women, 'Sneaker Company', 'Trail Sunset Runner', 'Lightweight cushioning and a stable heel make this bright runner ready for everyday adventures.', 11800, null, 4, 1, 3],
    ['weekend-court-white', ids.women, 'Sneaker Company', 'Weekend Court White', 'A clean court-inspired silhouette finished with subtle orange detailing and a padded collar.', 8900, 11000, 0, 0, 4],
    ['urban-canvas-high', ids.men, 'Northstar', 'Urban Canvas High', 'A durable high-top made for easy layering, with a flexible vulcanized sole and classic profile.', 10500, null, 15, 0, 2],
    ['everyday-slip-on', ids.women, 'Northstar', 'Everyday Slip-On', 'Minimal, comfortable, and easy to wear with a memory-foam footbed and breathable upper.', 7600, 9500, 9, 0, 4],
    ['heritage-suede-runner', ids.collections, 'Archive Co.', 'Heritage Suede Runner', 'A retro runner combining rich suede panels, lightweight foam, and a timeless gum outsole.', 14500, null, 3, 0, 3],
    ['studio-knit-trainer', ids.collections, 'Form', 'Studio Knit Trainer', 'A flexible knit trainer designed for light workouts, errands, and travel days.', 11200, 13000, 18, 0, 1]
  ];
  const insertProduct = db.prepare(`INSERT INTO products
    (slug, category_id, brand, name, description, price_cents, compare_at_cents, stock, featured, image_set)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  products.forEach((product) => insertProduct.run(...product));
  db.prepare('INSERT INTO users (id, email, name) VALUES (1, ?, ?)').run('alex@example.com', 'Alex Morgan');
}

seed();

export function productSelect(where = '') {
  return `SELECT p.*, c.name category, c.slug category_slug
    FROM products p JOIN categories c ON c.id = p.category_id ${where}`;
}

export function shapeProduct(row) {
  if (!row) return null;
  return {
    id: row.id, slug: row.slug, brand: row.brand, name: row.name, description: row.description,
    price: row.price_cents / 100, compareAtPrice: row.compare_at_cents ? row.compare_at_cents / 100 : null,
    stock: row.stock, featured: Boolean(row.featured), imageSet: row.image_set,
    category: { name: row.category, slug: row.category_slug },
  };
}
