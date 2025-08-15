import express from "express";
import Message from "../models/Message.js";
import Activity from "../models/trip_model.js";
import { authenticateUser } from "../middlewares/auth.js";

const router = express.Router();

// Middleware: Check if user is participant
async function checkParticipant(req, res, next) {
  const userId = req.user._id;
  const activity = await Activity.findById(req.params.activityId);
  if (!activity) return res.status(404).json({ error: "Activity not found" });

  if (!activity.participants.some(p => p.toString() === userId.toString()))
    return res.status(403).json({ error: "Not a participant" });

  next();
}

// Get messages for activity
router.get("/:activityId/messages",authenticateUser, checkParticipant, async (req, res) => {
  const messages = await Message.find({ activity: req.params.activityId })
    .populate("sender", "firstName lastName image")
    .sort({ timestamp: 1 });
  res.json(messages);
});

// Post a new message
router.post("/:activityId/messages", authenticateUser, checkParticipant, async (req, res) => {
  const { message, type, tempId } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: "Message required" });

  const newMessage = await Message.create({
    activity: req.params.activityId,
    sender: req.user._id,
    message: message.trim(),
    type: type || "text",
  });

  await newMessage.populate("sender", "firstName lastName image");

  // Convert to plain object
  const msgObj = newMessage.toObject();
  if (tempId) msgObj.tempId = tempId;

  res.status(201).json(msgObj);
});

export default router;


