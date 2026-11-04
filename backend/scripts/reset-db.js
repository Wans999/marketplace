import { readFile } from 'node:fs/promises';
import mysql from 'mysql2/promise';
import { dbConfig } from '../src/db.js';

// schema.sql drops every table, so refuse to touch a database that is not one of ours.
if (!dbConfig.database?.startsWith('marketplace_')) {
  console.error(`Refusing to reset "${dbConfig.database}": DB_NAME must start with "marketplace_".`);
  process.exit(1);
}

const readSql = (file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8');

// multipleStatements lets one query() run a whole .sql file. Only this script uses it,
// never the app pool, because it widens the impact of SQL injection.
const connection = await mysql.createConnection({ ...dbConfig, multipleStatements: true });
try {
  await connection.query(await readSql('schema.sql'));
  await connection.query(await readSql('seed.sql'));
  console.log(`Database "${dbConfig.database}" reset to seed data.`);
} finally {
  await connection.end();
}
