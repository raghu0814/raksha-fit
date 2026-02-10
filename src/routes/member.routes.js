import express from "express";
import {
  getMemberByPhone,
  getMemberById
} from "../controllers/member.controller.js";

const router = express.Router();

// Member login by phone
router.get("/by-phone", getMemberByPhone);

// Member profile
router.get("/:id", getMemberById);

export default router;
