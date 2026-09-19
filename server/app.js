import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db, productSelect, shapeProduct } from './db.js';

export const app = express();
app.use(express.json());
const userId = 1;

const cartRows = () => db.prepare(`${productSelect('JOIN cart_items ci ON ci.product_id = p.id')} WHERE ci.user_id = ?`).all(userId)
  .map((row) => ({ ...shapeProduct(row), quantity: db.prepare('SELECT quantity FROM cart_items WHERE user_id=? AND product_id=?').get(userId, row.id).quantity }));

app.get('/api/categories', (_req, res) => res.json(db.prepare('SELECT slug, name FROM categories ORDER BY id').all()));
app.get('/api/products', (req, res) => {
  const terms = [];
  const values = [];
  if (req.query.category) { terms.push('c.slug = ?'); values.push(req.query.category); }
  if (req.query.featured === 'true') terms.push('p.featured = 1');
  if (req.query.search) {
    terms.push('(p.name LIKE ? OR p.brand LIKE ? OR p.description LIKE ?)');
    const q = `%${req.query.search}%`; values.push(q, q, q);
  }
  if (req.query.inStock === 'true') terms.push('p.stock > 0');
  const where = terms.length ? `WHERE ${terms.join(' AND ')}` : '';
  const sort = req.query.sort === 'price-asc' ? 'p.price_cents ASC' : req.query.sort === 'price-desc' ? 'p.price_cents DESC' : 'p.featured DESC, p.id';
  res.json(db.prepare(`${productSelect(where)} ORDER BY ${sort}`).all(...values).map(shapeProduct));
});
app.get('/api/products/:slug', (req, res) => {
  const product = shapeProduct(db.prepare(productSelect('WHERE p.slug = ?')).get(req.params.slug));
  if (!product) return res.status(404).json({ error: 'Product not found.' });
  res.json(product);
});
app.get('/api/cart', (_req, res) => res.json(cartRows()));
app.post('/api/cart', (req, res) => {
  const product = db.prepare('SELECT stock FROM products WHERE id=?').get(req.body.productId);
  const quantity = Number(req.body.quantity || 1);
  if (!product || quantity < 1) return res.status(400).json({ error: 'Invalid product or quantity.' });
  const current = db.prepare('SELECT quantity FROM cart_items WHERE user_id=? AND product_id=?').get(userId, req.body.productId)?.quantity || 0;
  if (current + quantity > product.stock) return res.status(409).json({ error: `Only ${product.stock} available.` });
  db.prepare(`INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)
    ON CONFLICT(user_id, product_id) DO UPDATE SET quantity=excluded.quantity`).run(userId, req.body.productId, current + quantity);
  res.status(201).json(cartRows());
});
app.patch('/api/cart/:productId', (req, res) => {
  const quantity = Number(req.body.quantity);
  const product = db.prepare('SELECT stock FROM products WHERE id=?').get(req.params.productId);
  if (!product || quantity < 1 || quantity > product.stock) return res.status(400).json({ error: 'Quantity is not available.' });
  db.prepare('UPDATE cart_items SET quantity=? WHERE user_id=? AND product_id=?').run(quantity, userId, req.params.productId);
  res.json(cartRows());
});
app.delete('/api/cart/:productId', (req, res) => {
  db.prepare('DELETE FROM cart_items WHERE user_id=? AND product_id=?').run(userId, req.params.productId);
  res.json(cartRows());
});
app.get('/api/wishlist', (_req, res) => res.json(db.prepare(`${productSelect('JOIN wishlist_items wi ON wi.product_id=p.id')} WHERE wi.user_id=?`).all(userId).map(shapeProduct)));
app.post('/api/wishlist/:productId', (req, res) => {
  db.prepare('INSERT OR IGNORE INTO wishlist_items (user_id, product_id) VALUES (?, ?)').run(userId, req.params.productId);
  res.status(201).json({ ok: true });
});
app.delete('/api/wishlist/:productId', (req, res) => {
  db.prepare('DELETE FROM wishlist_items WHERE user_id=? AND product_id=?').run(userId, req.params.productId);
  res.json({ ok: true });
});
app.get('/api/account', (_req, res) => {
  const user = db.prepare('SELECT id, name, email, phone, address, city, postal_code postalCode FROM users WHERE id=?').get(userId);
  const orders = db.prepare('SELECT * FROM orders WHERE user_id=? ORDER BY id DESC').all(userId).map((o) => ({ ...o, total: (o.subtotal_cents + o.shipping_cents) / 100 }));
  res.json({ ...user, orders });
});
app.patch('/api/account', (req, res) => {
  const { fullName = '', phone = '', address = '', city = '', postalCode = '' } = req.body;
  db.prepare('UPDATE users SET name=?, phone=?, address=?, city=?, postal_code=? WHERE id=?').run(fullName, phone, address, city, postalCode, userId);
  res.json({ name: fullName, phone, address, city, postalCode });
});
app.get('/api/orders/:orderNumber', (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE order_number=? AND user_id=?').get(req.params.orderNumber, userId);
  if (!order) return res.status(404).json({ error: 'Order not found.' });
  const items = db.prepare('SELECT * FROM order_items WHERE order_id=?').all(order.id);
  res.json({ ...order, items, total: (order.subtotal_cents + order.shipping_cents) / 100 });
});
app.post('/api/orders', (req, res) => {
  const { customerName, email, address, city, postalCode } = req.body;
  if (![customerName, email, address, city, postalCode].every((x) => String(x || '').trim())) return res.status(400).json({ error: 'Please complete every checkout field.' });
  try {
    const result = db.transaction(() => {
      const items = cartRows();
      if (!items.length) throw new Error('Your cart is empty.');
      items.forEach((item) => { if (item.quantity > item.stock) throw new Error(`${item.name} no longer has enough stock.`); });
      const subtotal = items.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0);
      const shipping = subtotal >= 10000 ? 0 : 800;
      const orderNumber = `SNK-${Date.now().toString().slice(-8)}`;
      const order = db.prepare(`INSERT INTO orders (order_number,user_id,customer_name,email,address,city,postal_code,subtotal_cents,shipping_cents,status)
        VALUES (?,?,?,?,?,?,?,?,?,'confirmed')`).run(orderNumber, userId, customerName, email, address, city, postalCode, subtotal, shipping);
      const addItem = db.prepare('INSERT INTO order_items (order_id,product_id,product_name,unit_price_cents,quantity) VALUES (?,?,?,?,?)');
      const reduce = db.prepare('UPDATE products SET stock=stock-? WHERE id=?');
      items.forEach((item) => { addItem.run(order.lastInsertRowid, item.id, item.name, Math.round(item.price * 100), item.quantity); reduce.run(item.quantity, item.id); });
      db.prepare('DELETE FROM cart_items WHERE user_id=?').run(userId);
      return orderNumber;
    })();
    res.status(201).json({ orderNumber: result });
  } catch (error) { res.status(409).json({ error: error.message }); }
});

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
app.use(express.static(dist));
app.get('*path', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
