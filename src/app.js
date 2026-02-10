import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import reportRoutes from "./routes/report.routes.js";
import memberRoutes from "./routes/member.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 THIS SERVES scan.html, dashboard.html
app.use(express.static(path.join(__dirname, "../public")));

app.use("/auth", authRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/notify", notificationRoutes);
app.use("/reports", reportRoutes);
app.use("/members", memberRoutes);
app.use(express.static("public"));


export default app;

