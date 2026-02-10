import 'dotenv/config';   // 🔥 THIS LINE FIXES EVERYTHING
import pkg from 'pg';

const { Pool } = pkg;

console.log('DB_PASSWORD TYPE:', typeof process.env.DB_PASSWORD);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // must already be string
});

export default pool;
