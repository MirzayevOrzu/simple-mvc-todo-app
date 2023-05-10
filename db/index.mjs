import { fileURLToPath } from 'url';
import path from 'path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

// db.json file path
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, 'db.json');

// Configure lowdb to write data to JSON file
const adapter = new JSONFile(file);
const defaultData = { todos: [], users: [] };
const db = new Low(adapter, defaultData);

// Util for e2e tests
export const clearDb = async () => {
  await db.read();
  db.data = defaultData;
  await db.write();
  return null;
};

export default db;
