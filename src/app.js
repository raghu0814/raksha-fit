import express from "express";
import cors from "cors";

import attendanceRoutes from "./routes/attendance.routes.js";
import authRoutes from "./routes/auth.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import reportRoutes from "./routes/report.routes.js";

const app = express();

/* =====================
   MIDDLEWARE
===================== */
app.use(cors());
app.use(express.json());

/* =====================
   STATIC FILES (FRONTEND)
===================== */
app.use(express.static("public"));

/* =====================
   API ROUTES
===================== */
app.use("/auth", authRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/notify", notificationRoutes);
app.use("/reports", reportRoutes);

/* =====================
   ROOT HEALTH PAGE
===================== */
app.get("/", (req, res) => {
  res.send(`
    <h2>Raksha Fit Backend is Live 🚀</h2>
    <ul>
      <li><a href="/scan.html">Scan QR Page</a></li>
      <li><a href="/dashboard.html">Owner Dashboard</a></li>
      <li><a href="/notify/expired?gym_id=1">Health Check API</a></li>
    </ul>
  `);
});

export default app;
