import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openDB() {
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database
  });

  // 🚀 यह कोड टेबल बना देगा (बिना किसी बैक टिक के झंझट के)
  await db.exec("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, category TEXT, slug TEXT, image TEXT, date DATETIME DEFAULT CURRENT_TIMESTAMP);");
  
  await db.exec("CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, postId INTEGER, name TEXT, email TEXT, text TEXT, date DATETIME DEFAULT CURRENT_TIMESTAMP);");

  return db;
}