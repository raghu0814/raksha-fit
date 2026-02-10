import ExcelJS from "exceljs";
import pool from "../config/db.js";

/**
 * GET /reports/weekly?gym_id=1
 */
export const weeklyReport = async (req, res) => {
  try {
    const { gym_id } = req.query;

    const result = await pool.query(
      `
      SELECT 
        m.name,
        m.phone,
        a.date,
        a.check_in
      FROM attendance a
      JOIN members m ON a.member_id = m.id
      WHERE a.gym_id = $1
      AND a.date >= CURRENT_DATE - INTERVAL '7 days'
      ORDER BY a.date DESC
      `,
      [gym_id]
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Weekly Attendance");

    sheet.columns = [
      { header: "Member Name", key: "name", width: 20 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Date", key: "date", width: 15 },
      { header: "Check-in Time", key: "check_in", width: 25 }
    ];

    result.rows.forEach(row => sheet.addRow(row));

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=weekly_attendance.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error("WEEKLY REPORT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /reports/monthly?gym_id=1
 */
export const monthlyReport = async (req, res) => {
  try {
    const { gym_id } = req.query;

    const result = await pool.query(
      `
      SELECT 
        m.name,
        m.phone,
        a.date,
        a.check_in
      FROM attendance a
      JOIN members m ON a.member_id = m.id
      WHERE a.gym_id = $1
      AND DATE_TRUNC('month', a.date) = DATE_TRUNC('month', CURRENT_DATE)
      ORDER BY a.date DESC
      `,
      [gym_id]
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Monthly Attendance");

    sheet.columns = [
      { header: "Member Name", key: "name", width: 20 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Date", key: "date", width: 15 },
      { header: "Check-in Time", key: "check_in", width: 25 }
    ];

    result.rows.forEach(row => sheet.addRow(row));

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=monthly_attendance.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error("MONTHLY REPORT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
