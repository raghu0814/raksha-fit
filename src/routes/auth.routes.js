import express from "express";
import { login, addMember } from "../controllers/auth.controller.js";

const router = express.Router();

// Auth
router.post("/login", login);

// Members
router.post("/members", addMember);

export default router;
