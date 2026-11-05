import { dbConfig } from '../src/db.js';
import { resetDatabase } from '../src/reset-db.js';

try {
  await resetDatabase();
  console.log(`Database "${dbConfig.database}" reset to seed data.`);
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
