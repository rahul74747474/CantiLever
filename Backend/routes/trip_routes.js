import express from "express";
import { getMyActivities , createTrip , getAllActivities , joinActivity , getUpcomingTrips , getActivity, getJoinedActivities} from "../controllers/trip_controller.js";
import { authenticateUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/my-activities", authenticateUser, getMyActivities);
router.get("/activities", authenticateUser, getAllActivities);
router.post("/", authenticateUser, createTrip);
router.post("/activities/:id/join", authenticateUser, joinActivity);
router.get("/activities/my-upcoming-trips", authenticateUser, getUpcomingTrips);
router.get("/activities/my-joined-trips", authenticateUser, getJoinedActivities);
router.get("/activities/:activityId",authenticateUser,getActivity);


export default router;