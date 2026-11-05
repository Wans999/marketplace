import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db.js';
import { HttpError } from '../http-error.js';

z.config(z.locales.id()); // Indonesian validation messages in error details

const DEFAULT_LIMIT = 12; // BR-02
const MAX_LIMIT = 48; // BR-02

// Treat "?minPrice=" like an absent param, so a cleared form field is not read as 0.
const emptyToUndefined = (v) => (v === '' ? undefined : v);
const intParam = (min) => z.preprocess(emptyToUndefined, z.coerce.number().int().min(min).optional());

const listQuerySchema = z
  .object({
    q: z.preprocess(emptyToUndefined, z.string().trim().optional()),
    category: z.preprocess(emptyToUndefined, z.string().optional()),
    minPrice: intParam(0),
    maxPrice: intParam(0),
    sort: z.preprocess(emptyToUndefined, z.enum(['newest', 'price_asc', 'price_desc']).default('newest')),
    page: intParam(1).transform((n) => n ?? 1),
    limit: intParam(1).transform((n) => Math.min(n ?? DEFAULT_LIMIT, MAX_LIMIT)),
  })
  .refine((p) => p.minPrice === undefined || p.maxPrice === undefined || p.minPrice <= p.maxPrice, {
    path: ['minPrice'],
    message: 'Harga minimum tidak boleh lebih besar dari harga maksimum',
  }); // BR-03

// id is the tiebreaker so equal prices or timestamps never shuffle between pages.
const ORDER_BY = {
  newest: 'p.created_at DESC, p.id DESC',
  price_asc: 'p.price ASC, p.id ASC',
  price_desc: 'p.price DESC, p.id DESC',
};

const FROM = `FROM products p
  JOIN stores s ON s.id = p.store_id
  JOIN categories c ON c.id = p.category_id`;

const COLUMNS = `p.id, p.name, p.price, p.stock, p.image_url,
  s.id AS store_id, s.name AS store_name,
  c.id AS category_id, c.name AS category_name, c.slug AS category_slug`;

const toProduct = (row) => ({
  id: row.id,
  name: row.name,
  price: row.price,
  stock: row.stock,
  imageUrl: row.image_url,
  store: { id: row.store_id, name: row.store_name },
  category: { id: row.category_id, name: row.category_name, slug: row.category_slug },
});

const productNotFound = () => new HttpError(404, 'PRODUCT_NOT_FOUND', 'Produk tidak ditemukan');

export const catalogRouter = Router();

catalogRouter.get('/categories', async (req, res) => {
  const [rows] = await pool.query('SELECT id, name, slug FROM categories ORDER BY id');
  res.json({ items: rows });
});

catalogRouter.get('/products', async (req, res) => {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    const details = parsed.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
    throw new HttpError(400, 'VALIDATION_ERROR', 'Parameter pencarian tidak valid', details);
  }
  const { q, category, minPrice, maxPrice, sort, page, limit } = parsed.data;

  // Only fixed SQL fragments are joined; every user value goes through a ? placeholder.
  const where = [];
  const params = [];
  if (q) {
    // Escape LIKE wildcards so "%" or "_" are searched literally. Column collation is
    // case-insensitive (utf8mb4_0900_ai_ci), which covers AC-02.1.
    where.push('p.name LIKE ?');
    params.push(`%${q.replace(/[\\%_]/g, '\\$&')}%`);
  }
  if (category) {
    where.push('c.slug = ?');
    params.push(category);
  }
  if (minPrice !== undefined) {
    where.push('p.price >= ?');
    params.push(minPrice);
  }
  if (maxPrice !== undefined) {
    where.push('p.price <= ?');
    params.push(maxPrice);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total ${FROM} ${whereSql}`, params);
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} ${FROM} ${whereSql} ORDER BY ${ORDER_BY[sort]} LIMIT ? OFFSET ?`,
    [...params, limit, (page - 1) * limit],
  );

  // A page past the end returns an empty list, not an error (AC-01.3).
  res.json({ items: rows.map(toProduct), page, limit, total, totalPages: Math.ceil(total / limit) });
});

catalogRouter.get('/products/:id', async (req, res) => {
  // Without this check MySQL would cast "12abc" to 12 and return product 12.
  if (!/^\d+$/.test(req.params.id)) throw productNotFound();

  const [[row]] = await pool.query(`SELECT ${COLUMNS}, p.description ${FROM} WHERE p.id = ?`, [
    req.params.id,
  ]);
  if (!row) throw productNotFound();
  res.json({ ...toProduct(row), description: row.description });
});
