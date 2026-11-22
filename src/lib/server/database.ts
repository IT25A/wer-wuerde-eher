import Database from 'better-sqlite3';
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const databasePath = process.env.DATABASE_PATH ?? join(process.cwd(), 'data', 'Fragen.db');
const seedPath = process.env.DATABASE_SEED_PATH;

mkdirSync(dirname(databasePath), { recursive: true });
// Ein neues Volume (Server, Preview) ist leer: dann die mitgelieferte Datenbank als Startbestand kopieren.
if (seedPath && !existsSync(databasePath)) copyFileSync(seedPath, databasePath);

export const database = new Database(databasePath);
database.pragma('foreign_keys = ON');
