import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from './app.js';
import { db } from './db.js';

beforeEach(() => db.prepare('DELETE FROM cart_items').run());

describe('store API', () => {
  it('lists seeded products and filters categories', async () => {
    const response = await request(app).get('/api/products?category=men');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(1);
    expect(response.body.every((p) => p.category.slug === 'men')).toBe(true);
  });
  it('adds and updates cart items', async () => {
    await request(app).post('/api/cart').send({ productId: 1, quantity: 2 }).expect(201);
    const response = await request(app).patch('/api/cart/1').send({ quantity: 1 }).expect(200);
    expect(response.body[0].quantity).toBe(1);
  });
  it('rejects orders with missing checkout data', async () => {
    const response = await request(app).post('/api/orders').send({ customerName: 'Alex' });
    expect(response.status).toBe(400);
  });
});
