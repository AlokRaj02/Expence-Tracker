import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true' || Boolean(process.env.NOW_REGION);
const dbDir = isVercel ? '/tmp' : __dirname;
const dbPath = path.join(dbDir, 'finance.db');

const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      color TEXT NOT NULL,
      icon TEXT NOT NULL,
      allocated_budget REAL DEFAULT 0.0
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      category_id INTEGER,
      description TEXT NOT NULL,
      status TEXT DEFAULT 'completed',
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      target_amount REAL NOT NULL,
      current_amount REAL DEFAULT 0.0,
      target_date TEXT NOT NULL,
      color TEXT DEFAULT '#6366f1',
      category TEXT DEFAULT 'General'
    );
  `);
}

export default db;
