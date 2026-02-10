import pool from "../config/db.js";

/**
 * GET /notify/absent?gym_id=1
 */
export const absentMessages = async (req, res) => {
  try {
    const { gym_id } = req.query;

    const result = await pool.query(
      `
      SELECT name, phone
      FROM members
      WHERE gym_id = $1
      AND id NOT IN (
        SELECT member_id FROM attendance
        WHERE date = CURRENT_DATE AND gym_id = $1
      )
      `,
      [gym_id]
    );

    const messages = result.rows.map(m => ({
      phone: m.phone,
      message: `Hi ${m.name}, you missed your workout today 💪
Your fitness is important. See you tomorrow!`
    }));

    res.json({ count: messages.length, messages });
  } catch (err) {
    console.error("ABSENT MSG ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /notify/expired?gym_id=1
 */
export const expiredMessages = async (req, res) => {
  try {
    const { gym_id } = req.query;

    const result = await pool.query(
      `
      SELECT name, phone, valid_till
      FROM members
      WHERE gym_id = $1 AND valid_till < CURRENT_DATE
      `,
      [gym_id]
    );

    const messages = result.rows.map(m => ({
      phone: m.phone,
      message: `Hi ${m.name}, your gym membership expired on ${m.valid_till}.
Please renew to continue your fitness journey 💪`
    }));

    res.json({ count: messages.length, messages });
  } catch (err) {
    console.error("EXPIRED MSG ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /notify/expiring?gym_id=1
 */
export const expiringSoonMessages = async (req, res) => {
  try {
    const { gym_id } = req.query;

    const result = await pool.query(
      `
      SELECT name, phone, valid_till
      FROM members
      WHERE gym_id = $1
      AND valid_till BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '3 days'
      `,
      [gym_id]
    );

    const messages = result.rows.map(m => ({
      phone: m.phone,
      message: `Hi ${m.name}, your gym membership will expire on ${m.valid_till}.
Please renew early and stay consistent 💪`
    }));

    res.json({ count: messages.length, messages });
  } catch (err) {
    console.error("EXPIRING MSG ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
