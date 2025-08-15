import express from "express";
import { getSameDestinationActivities } from "../controllers/travellers_controller.js";
import { authenticateUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/same-dest", authenticateUser, getSameDestinationActivities);

export default router;
