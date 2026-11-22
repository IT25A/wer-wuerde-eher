import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const dataDirectory = join(process.cwd(), 'data');
mkdirSync(dataDirectory, { recursive: true });
const databasePath = join(dataDirectory, 'Fragen.db');

export const database = new Database(databasePath);
database.pragma('foreign_keys = ON');

