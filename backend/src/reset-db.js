import { readFile } from 'node:fs/promises';
import mysql from 'mysql2/promise';
import { dbConfig } from './db.js';

const readSql = (file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8');

// Shared by `npm run db:reset` and POST /api/test/reset.
export async function resetDatabase() {
  // schema.sql drops every table, so refuse to touch a database that is not one of ours.
  if (!dbConfig.database?.startsWith('marketplace_')) {
    throw new Error(`Refusing to reset "${dbConfig.database}": DB_NAME must start with "marketplace_".`);
  }

  // multipleStatements lets one query() run a whole .sql file. Only this function uses it,
  // never the app pool, because it widens the impact of SQL injection.
  const connection = await mysql.createConnection({ ...dbConfig, multipleStatements: true });
  try {
    await connection.query(await readSql('schema.sql'));
    await connection.query(await readSql('seed.sql'));
  } finally {
    await connection.end();
  }
}
