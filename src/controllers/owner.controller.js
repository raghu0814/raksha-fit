import pool from "../config/db.js";

/**
 * GET /owner/dashboard/today?gym_id=1
 */
export const todayAttendance = async (req, res) => {
  try {
    const { gym_id } = req.query;

    const result = await pool.query(
      `
      SELECT m.id, m.name, m.phone, a.check_in
      FROM attendance a
      JOIN members m ON m.id = a.member_id
      WHERE a.gym_id = $1 AND a.date = CURRENT_DATE
      ORDER BY a.check_in DESC
      `,
      [gym_id]
    );

    res.json({
      count: result.rows.length,
      members: result.rows
    });
  } catch (err) {
    console.error("TODAY ATTENDANCE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /owner/dashboard/absent?gym_id=1
 */
export const absentToday = async (req, res) => {
  try {
    const { gym_id } = req.query;

    const result = await pool.query(
      `
      SELECT id, name, phone
      FROM members
      WHERE gym_id = $1
      AND id NOT IN (
        SELECT member_id
        FROM attendance
        WHERE date = CURRENT_DATE AND gym_id = $1
      )
      `,
      [gym_id]
    );

    res.json({
      count: result.rows.length,
      members: result.rows
    });
  } catch (err) {
    console.error("ABSENT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /owner/dashboard/expired?gym_id=1
 */
export const expiredMembers = async (req, res) => {
  try {
    const { gym_id } = req.query;

    const result = await pool.query(
      `
      SELECT id, name, phone, valid_till
      FROM members
      WHERE gym_id = $1
      AND valid_till < CURRENT_DATE
      ORDER BY valid_till
      `,
      [gym_id]
    );

    res.json({
      count: result.rows.length,
      members: result.rows
    });
  } catch (err) {
    console.error("EXPIRED ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
