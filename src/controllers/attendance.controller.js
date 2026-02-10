import pool from "../config/db.js";

/**
 * POST /attendance/mark
 * Body: { member_id, gym_id }
 */
export const markAttendance = async (req, res) => {
  try {
    const { member_id, gym_id } = req.body;

    if (!member_id || !gym_id) {
      return res.status(400).json({ message: "member_id and gym_id required" });
    }

    // 1️⃣ Check member exists
    const memberResult = await pool.query(
      `SELECT id, valid_till FROM members WHERE id = $1 AND gym_id = $2`,
      [member_id, gym_id]
    );

    if (memberResult.rowCount === 0) {
      return res.status(404).json({ message: "Member not found" });
    }

    const member = memberResult.rows[0];

    // 2️⃣ Check membership expired
    if (member.valid_till && new Date(member.valid_till) < new Date()) {
      return res.status(403).json({
        message: "Membership expired. Please renew."
      });
    }

    // 3️⃣ Insert attendance (unique member_id + date enforced)
    const attendanceResult = await pool.query(
      `
      INSERT INTO attendance (member_id, gym_id, date, check_in)
      VALUES ($1, $2, CURRENT_DATE, CURRENT_TIMESTAMP)
      ON CONFLICT (member_id, date)
      DO NOTHING
      RETURNING *
      `,
      [member_id, gym_id]
    );

    // 4️⃣ Already marked today
    if (attendanceResult.rowCount === 0) {
      return res.status(409).json({
        message: "Attendance already marked for today"
      });
    }

    // 5️⃣ Success
    res.status(201).json({
      message: "Attendance marked successfully",
      attendance: attendanceResult.rows[0]
    });

  } catch (err) {
    console.error("ATTENDANCE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /attendance/today?gym_id=1
 */
export const todayAttendanceCount = async (req, res) => {
  try {
    const { gym_id } = req.query;

    const result = await pool.query(
      `
      SELECT COUNT(*) 
      FROM attendance
      WHERE gym_id = $1 AND date = CURRENT_DATE
      `,
      [gym_id]
    );

    res.json({
      count: Number(result.rows[0].count)
    });
  } catch (err) {
    console.error("TODAY COUNT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * GET /attendance/member/:id
 * Member attendance history
 */
export const getMemberAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT date
      FROM attendance
      WHERE member_id = $1
      ORDER BY date DESC
      `,
      [id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("MEMBER ATTENDANCE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
