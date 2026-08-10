import "dotenv/config";
import fs from "node:fs/promises";
import pool from "../src/config/db.js";

const sql = await fs.readFile(new URL("../migrations/001_initial.sql", import.meta.url), "utf8");
await pool.query(sql);
await pool.end();
console.log("Migration 001_initial applied successfully.");
