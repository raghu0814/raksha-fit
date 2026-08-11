import "dotenv/config";
import pool from "../src/config/db.js";
import { runAutomation } from "../src/services/automation.js";

try { console.log(JSON.stringify(await runAutomation())); } finally { await pool.end(); }
