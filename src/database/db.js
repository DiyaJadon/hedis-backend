import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const dbPath = path.join(__dirname, "hedis.db");

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Failed to connect to SQLite database", err);
  } else {
    console.log("✅ Connected to SQLite database");
  }
});

// ================= CREATE TABLE =================
db.run(`
  CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    organization TEXT,
    category TEXT,
    message TEXT NOT NULL,
    product TEXT,                 -- ✅ NEW
    type TEXT DEFAULT 'general',  -- ✅ NEW
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// ================= AUTO-ADD MISSING COLUMNS =================
const addColumnIfNotExists = (column, definition) => {
  db.all(`PRAGMA table_info(enquiries)`, (err, columns) => {
    if (err) {
      console.error("❌ Failed to fetch table info", err);
      return;
    }

    const exists = columns.some(col => col.name === column);

    if (!exists) {
      db.run(`ALTER TABLE enquiries ADD COLUMN ${column} ${definition}`, (err) => {
        if (err) {
          console.error(`❌ Failed to add column ${column}`, err);
        } else {
          console.log(`✅ Column '${column}' added`);
        }
      });
    }
  });
};

// Ensure new columns exist
addColumnIfNotExists("product", "TEXT");
addColumnIfNotExists("type", "TEXT DEFAULT 'general'");

export default db;