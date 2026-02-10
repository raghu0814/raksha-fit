import express from "express";
import {
  todayAttendance,
  absentToday,
  expiredMembers
} from "../controllers/owner.controller.js";

const router = express.Router();

router.get("/dashboard/today", todayAttendance);
router.get("/dashboard/absent", absentToday);
router.get("/dashboard/expired", expiredMembers);

export default router;
