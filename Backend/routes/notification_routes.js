// routes/notificationRoutes.js
import express from "express";
import { getMyNotifications } from "../controllers/notification_controller.js";
import { authenticateUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", authenticateUser, getMyNotifications);

export default router;
