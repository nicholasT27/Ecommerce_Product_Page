import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

if (process.argv.includes('--reset')) {
  const file = path.join(path.dirname(fileURLToPath(import.meta.url)), 'data', 'store.db');
  for (const suffix of ['', '-shm', '-wal']) if (fs.existsSync(file + suffix)) fs.rmSync(file + suffix);
}
await import('./db.js');
console.log('Demo database is ready.');
