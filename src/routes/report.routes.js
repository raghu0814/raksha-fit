import express from "express";
import { weeklyReport, monthlyReport } from "../controllers/report.controller.js";

const router = express.Router();

router.get("/weekly", weeklyReport);
router.get("/monthly", monthlyReport);

export default router;
