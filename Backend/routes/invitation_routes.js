import express from "express";
import {
  sendInvitation,
  getMyInvitations,
  respondToInvitation
} from "../controllers/invitation_controller.js";
import { authenticateUser } from "../middlewares/auth.js";

const router = express.Router();

router.post("/send", authenticateUser, sendInvitation);
router.get("/", authenticateUser, getMyInvitations);
router.post("/:id/respond", authenticateUser, respondToInvitation);

export default router;
