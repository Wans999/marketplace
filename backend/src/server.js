import express from 'express';
import { pool } from './db.js';

const app = express();

// Log method, path, status and duration of every request (PRD section 6).
app.use((req, res, next) => {
  const start = performance.now();
  res.on('finish', () => {
    const ms = Math.round(performance.now() - start);
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });
  next();
});

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Health check failed:', err.message);
    res.status(503).json({
      error: { code: 'DB_UNAVAILABLE', message: 'Database tidak dapat dihubungi' },
    });
  }
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port} (${process.env.NODE_ENV})`);
});
