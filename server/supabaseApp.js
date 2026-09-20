import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) throw new Error('Supabase URL and publishable key are required.');

const clientFor = (req) => createClient(url, key, {
  global: { headers: req.headers.authorization ? { Authorization: req.headers.authorization } : {} },
  auth: { persistSession: false, autoRefreshToken: false },
});

const shapeProduct = (row) => ({
  id: row.id, slug: row.slug, brand: row.brand, name: row.name, description: row.description,
  price: row.price_cents / 100, compareAtPrice: row.compare_at_cents ? row.compare_at_cents / 100 : null,
  stock: row.stock, featured: row.featured, imageSet: row.image_set,
  category: row.category,
});
const requireUser = async (req) => {
  const client = clientFor(req);
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) throw Object.assign(new Error('Please sign in to continue.'), { status: 401 });
  return { client, user: data.user };
};
const unwrap = (result) => { if (result.error) throw result.error; return result.data; };
const cartRows = async (client, userId) => {
  const rows = unwrap(await client.from('cart_items').select('quantity, product:products(*, category:categories(name, slug))').eq('user_id', userId));
  return rows.map((row) => ({ ...shapeProduct(row.product), quantity: row.quantity }));
};

export const app = express();
app.use(express.json());

app.get('/api/categories', async (req, res, next) => { try { res.json(unwrap(await clientFor(req).from('categories').select('slug,name').order('id'))); } catch (error) { next(error); } });
app.get('/api/products', async (req, res, next) => {
  try {
    let query = clientFor(req).from('products').select('*, category:categories!inner(name, slug)');
    if (req.query.category) query = query.eq('category.slug', req.query.category);
    if (req.query.featured === 'true') query = query.eq('featured', true);
    if (req.query.inStock === 'true') query = query.gt('stock', 0);
    // PostgREST uses punctuation in its filter syntax, so keep search input to
    // plain words before composing the multi-column `or` expression.
    const search = String(req.query.search || '').replace(/[,%.()]/g, ' ').trim();
    if (search) query = query.or(`name.ilike.*${search}*,brand.ilike.*${search}*,description.ilike.*${search}*`);
    if (req.query.sort === 'price-asc') query = query.order('price_cents');
    else if (req.query.sort === 'price-desc') query = query.order('price_cents', { ascending: false });
    else query = query.order('featured', { ascending: false }).order('id');
    res.json(unwrap(await query).map(shapeProduct));
  } catch (error) { next(error); }
});
app.get('/api/products/:slug', async (req, res, next) => { try { const product = unwrap(await clientFor(req).from('products').select('*, category:categories(name, slug)').eq('slug', req.params.slug).single()); res.json(shapeProduct(product)); } catch (error) { next(error); } });

app.get('/api/cart', async (req, res, next) => { try { const { client, user } = await requireUser(req); res.json(await cartRows(client, user.id)); } catch (error) { next(error); } });
app.post('/api/cart', async (req, res, next) => {
  try {
    const { client, user } = await requireUser(req); const productId = Number(req.body.productId); const quantity = Number(req.body.quantity || 1);
    const product = unwrap(await client.from('products').select('stock').eq('id', productId).single());
    const current = unwrap(await client.from('cart_items').select('quantity').eq('user_id', user.id).eq('product_id', productId).maybeSingle())?.quantity || 0;
    if (quantity < 1 || current + quantity > product.stock) throw Object.assign(new Error(`Only ${product.stock} available.`), { status: 409 });
    unwrap(await client.from('cart_items').upsert({ user_id: user.id, product_id: productId, quantity: current + quantity }));
    res.status(201).json(await cartRows(client, user.id));
  } catch (error) { next(error); }
});
app.patch('/api/cart/:productId', async (req, res, next) => {
  try {
    const { client, user } = await requireUser(req); const quantity = Number(req.body.quantity);
    const product = unwrap(await client.from('products').select('stock').eq('id', req.params.productId).single());
    if (quantity < 1 || quantity > product.stock) throw Object.assign(new Error('Quantity is not available.'), { status: 400 });
    unwrap(await client.from('cart_items').update({ quantity }).eq('user_id', user.id).eq('product_id', req.params.productId));
    res.json(await cartRows(client, user.id));
  } catch (error) { next(error); }
});
app.delete('/api/cart/:productId', async (req, res, next) => { try { const { client, user } = await requireUser(req); unwrap(await client.from('cart_items').delete().eq('user_id', user.id).eq('product_id', req.params.productId)); res.json(await cartRows(client, user.id)); } catch (error) { next(error); } });

app.get('/api/wishlist', async (req, res, next) => { try { const { client, user } = await requireUser(req); const rows = unwrap(await client.from('wishlist_items').select('product:products(*, category:categories(name, slug))').eq('user_id', user.id)); res.json(rows.map((row) => shapeProduct(row.product))); } catch (error) { next(error); } });
app.post('/api/wishlist/:productId', async (req, res, next) => { try { const { client, user } = await requireUser(req); unwrap(await client.from('wishlist_items').upsert({ user_id: user.id, product_id: Number(req.params.productId) })); res.status(201).json({ ok: true }); } catch (error) { next(error); } });
app.delete('/api/wishlist/:productId', async (req, res, next) => { try { const { client, user } = await requireUser(req); unwrap(await client.from('wishlist_items').delete().eq('user_id', user.id).eq('product_id', req.params.productId)); res.json({ ok: true }); } catch (error) { next(error); } });

app.get('/api/account', async (req, res, next) => {
  try {
    const { client, user } = await requireUser(req);
    let profile = unwrap(await client.from('profiles').select('*').eq('id', user.id).maybeSingle());
    if (!profile) profile = unwrap(await client.from('profiles').upsert({ id: user.id, full_name: user.user_metadata?.full_name || '' }).select().single());
    const orders = unwrap(await client.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }));
    res.json({ id: user.id, name: profile.full_name, email: user.email, phone: profile.phone, address: profile.address, city: profile.city, postalCode: profile.postal_code, avatarPath: profile.avatar_path, orders: orders.map((order) => ({ ...order, total: (order.subtotal_cents + order.shipping_cents) / 100 })) });
  } catch (error) { next(error); }
});
app.patch('/api/account', async (req, res, next) => {
  try {
    const { client, user } = await requireUser(req);
    const profile = unwrap(await client.from('profiles').upsert({ id: user.id, full_name: req.body.fullName || '', phone: req.body.phone || '', address: req.body.address || '', city: req.body.city || '', postal_code: req.body.postalCode || '', updated_at: new Date().toISOString() }).select().single());
    res.json({ name: profile.full_name, phone: profile.phone, address: profile.address, city: profile.city, postalCode: profile.postal_code, avatarPath: profile.avatar_path });
  } catch (error) { next(error); }
});
app.get('/api/orders/:orderNumber', async (req, res, next) => { try { const { client, user } = await requireUser(req); const order = unwrap(await client.from('orders').select('*, items:order_items(*)').eq('user_id', user.id).eq('order_number', req.params.orderNumber).single()); res.json({ ...order, total: (order.subtotal_cents + order.shipping_cents) / 100 }); } catch (error) { next(error); } });
app.post('/api/orders', async (req, res, next) => {
  try {
    const { client, user } = await requireUser(req); const { customerName, email, address, city, postalCode } = req.body;
    const orderNumber = unwrap(await client.rpc('checkout', { customer_name: customerName, customer_email: email, delivery_address: address, delivery_city: city, delivery_postal_code: postalCode }));
    unwrap(await client.from('profiles').upsert({ id: user.id, full_name: customerName, address, city, postal_code: postalCode, updated_at: new Date().toISOString() }));
    res.status(201).json({ orderNumber });
  } catch (error) { next(error); }
});

app.use((error, _req, res, next) => {
  void next; // Keep Express's required four-argument error-middleware signature.
  res.status(error.status || (error.code === 'PGRST116' ? 404 : 400)).json({ error: error.message });
});
const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
app.use(express.static(dist));
app.get('*path', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
