import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import pool from "../src/config/db.js";

const directory = new URL("../migrations/", import.meta.url);
const files = (await fs.readdir(directory)).filter(file => /^\d+_.*\.sql$/.test(file)).sort();
try {
  await pool.query("CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())");
  for (const file of files) {
    const applied = await pool.query("SELECT 1 FROM schema_migrations WHERE name=$1", [file]);
    if (applied.rowCount) continue;
    const sql = await fs.readFile(new URL(`../migrations/${file}`, import.meta.url), "utf8");
    const client = await pool.connect();
    try { await client.query("BEGIN"); await client.query(sql); await client.query("INSERT INTO schema_migrations(name) VALUES($1)", [file]); await client.query("COMMIT"); console.log(`Applied ${file}`); }
    catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
  }
} finally { await pool.end(); }
