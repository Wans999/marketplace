import { test, expect, request } from '@playwright/test';
import { API_URL } from '../fixtures/env.js';

test.beforeAll(async ({ playwright }) => {
  const api = await playwright.request.newContext({ baseURL: API_URL });
  const res = await api.post('/api/test/reset');
  expect(res.status()).toBe(204);
  await api.dispose();
});

test('[AC-01.1] daftar default berisi 12 produk terbaru', async ({ request }) => {
  const res = await request.get('/api/products');
  expect(res.status()).toBe(200);

  const body = await res.json();
  expect(body.items).toHaveLength(12);
  expect(body.total).toBe(50);
  expect(body.totalPages).toBe(5);
  expect(body.items[0].id).toBe(50);
  expect(body.items[11].id).toBe(39);
});

test('[AC-01.2][BR-01] produk stok 0 tetap tampil di daftar', async ({ request }) => {
  const body = await (await request.get('/api/products')).json();
  const product = body.items.find((p) => p.id === 46);

  expect(product).toBeDefined();
  expect(product.stock).toBe(0);
});

test('[AC-02.4][BR-03] minPrice lebih besar dari maxPrice ditolak 400', async ({ request }) => {
  const res = await request.get('/api/products?minPrice=50000&maxPrice=10000');
  expect(res.status()).toBe(400);

  const body = await res.json();
  expect(body.error.code).toBe('VALIDATION_ERROR');
});

test('[BR-02] limit di atas 48 dibatasi menjadi 48', async ({ request }) => {
  const res = await request.get('/api/products?limit=100');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.limit).toBe(48);
});