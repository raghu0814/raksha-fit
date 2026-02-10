import express from "express";
import {
  markAttendance,
  todayAttendanceCount,
  getMemberAttendance
} from "../controllers/attendance.controller.js";

const router = express.Router();

// Mark attendance (QR / scan)
router.post("/mark", markAttendance);

// Dashboard today count
router.get("/today", todayAttendanceCount);

router.get("/member/:id", getMemberAttendance);


export default router;
