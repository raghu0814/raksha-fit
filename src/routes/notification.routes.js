import express from "express";
import {
  absentMessages,
  expiredMessages,
  expiringSoonMessages
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/absent", absentMessages);
router.get("/expired", expiredMessages);
router.get("/expiring", expiringSoonMessages);

export default router;
