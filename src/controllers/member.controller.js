import pool from "../config/db.js";

/**
 * GET /members/by-phone?phone=9999999999
 * Used for member login
 */
export const getMemberByPhone = async (req, res) => {
  try {
    const { phone } = req.query;

    const result = await pool.query(
      `
      SELECT id, name, phone, valid_till
      FROM members
      WHERE phone = $1
      `,
      [phone]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("GET MEMBER BY PHONE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /members/:id
 * Used to load member profile
 */
export const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT id, name, phone, valid_till
      FROM members
      WHERE id = $1
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("GET MEMBER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
