import pool from "../config/db.js";
import bcrypt from "bcryptjs";

/**
 * LOGIN CONTROLLER
 */
export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password required" });
    }

    const result = await pool.query(
      "SELECT id, phone, password_hash, role FROM users WHERE phone = $1",
      [phone]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ADD MEMBER CONTROLLER
 */
export const addMember = async (req, res) => {
  try {
    const { name, phone, gym_id } = req.body;

    if (!name || !phone || !gym_id) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Check duplicate phone
    const existing = await pool.query(
      "SELECT id FROM members WHERE phone = $1",
      [phone]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "Member already exists" });
    }

    const result = await pool.query(
      `INSERT INTO members (name, phone, gym_id)
       VALUES ($1, $2, $3)
       RETURNING id, name, phone`,
      [name, phone, gym_id]
    );

    res.status(201).json({
      message: "Member added successfully",
      member: result.rows[0],
    });
  } catch (err) {
    console.error("ADD MEMBER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
