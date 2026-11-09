import Database from 'better-sqlite3';
import { fileURLToPath } from 'node:url';

const databasePath = fileURLToPath(new URL('../../../data/Fragen.db', import.meta.url));

export const database = new Database(databasePath);
database.pragma('foreign_keys = ON');

