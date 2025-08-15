import express from "express";
import { signup , login, logout , getAllTravelersExceptMe , updateProfile , updateProfilePicture , deleteAccount , getMe, getUsersByIds } from "../controllers/user_controller.js";
import { getUsersOverlappingWithMe} from "../controllers/matchTravel_controller.js";
// import { login } from "../controllers/user_controller.js";
import { authenticateUser } from "../middlewares/auth.js";

const router = express.Router();

router.post("/signup", signup); // Route: /api/v1/users/signup
router.post("/login", login); // Route: /api/v1/users/login
router.get("/logout", logout); // Route: /api/v1/users/logout
router.get('/me', authenticateUser, getMe);
router.get("/explore", authenticateUser, getAllTravelersExceptMe);
router.get("/travel-buddies", authenticateUser, getUsersOverlappingWithMe);
router.put("/me", authenticateUser, updateProfile);
router.patch("/me/image", authenticateUser, updateProfilePicture);
router.delete("/me", authenticateUser, deleteAccount);
router.get("/:id",authenticateUser,getUsersByIds)


export default router;
