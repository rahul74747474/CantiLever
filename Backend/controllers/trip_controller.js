import Activity from "../models/trip_model.js";
import User from "../models/user_model.js";
import Message from "../models/Message.js"
import mongoose from "mongoose";

export const getUpcomingTrips = async (req, res) => {
  try {
    const userId = req.user._id;

    const activities = await Activity.find({
      date: { $gte: new Date() },
      $or: [
        { host: userId },
        { participants: userId }
      ]
    }).sort({ date: 1 });

    res.status(200).json({ success: true, data: activities });
  } catch (err) {
    console.error("Error fetching upcoming trips:", err.message);
    res.status(500).json({ message: "Failed to fetch trips." });
  }
};



export const createTrip = async (req, res) => {
  try {
    const userId = req.user._id;

    // Step 1: Create activity with the host as the current user
    const activity = await Activity.create({
      ...req.body,
      host: userId,
      participants: [userId], // Add creator as first participant
      currentParticipants: 1,
    });

    // Step 2: Add this activity to user's joinedActivities
    await User.findByIdAndUpdate(userId, {
      $addToSet: { joinedActivities: activity._id },
    });

    // Step 3: Send final response
    res.status(201).json({ message: "Activity created", activity });
  } catch (error) {
    console.error("Create activity error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ host: req.user._id }).sort({ date: 1 });

    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    console.error("Get my activities error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller: getAllActivities
export const getAllActivities = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const activities = await Activity.find({ 
      host: { $ne: currentUserId },                      // not created by me
      participants: { $ne: currentUserId }               // not joined by me
    })
    .populate("host", "firstName lastName profilePicture rating")
    .populate("participants", "_id firstName lastName");

    res.status(200).json({ data: activities });
  } catch (err) {
    console.error("Get All Activities Error:", err);
    res.status(500).json({ message: "Failed to fetch activities" });
  }
};


export const joinActivity = async (req, res) => {
  try {
    const activityId = req.params.id;
    const userId = req.user._id;

    // Validate activity ID
    if (!mongoose.Types.ObjectId.isValid(activityId)) {
      return res.status(400).json({ message: "Invalid activity ID" });
    }

    // Fetch the activity
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Check if user already joined
    if (activity.participants.some(participantId => participantId.toString() === userId.toString())) {
      return res.status(400).json({ message: "You have already joined this activity." });
    }

    // Check if activity is full
    if (activity.currentParticipants >= activity.maxParticipants) {
      return res.status(400).json({ message: "This activity is full." });
    }

    // Add user to activity
    activity.participants.push(userId);
    activity.currentParticipants += 1;
    await activity.save();

    // Add activity to user's joinedActivities
    await User.findByIdAndUpdate(userId, {
      $addToSet: { joinedActivities: activityId },
    });

    res.status(200).json({ message: "Successfully joined the activity." });
  } catch (err) {
    console.error("Error joining activity:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

export const getJoinedActivities = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user's joinedActivities array
    const user = await User.findById(userId).populate({
      path: "joinedActivities",
      match: { host: { $ne: userId } }, // Optional: exclude own hosted
      options: { sort: { date: 1 } }
    });

    res.status(200).json({
      success: true,
      data: user.joinedActivities || []
    });
  } catch (err) {
    console.error("Get joined activities error:", err);
    res.status(500).json({ message: "Failed to fetch joined activities" });
  }
};

export const getActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    // Inside getActivity before findById
console.log("Activity ID received:", activityId);

const exists = await Activity.findById(activityId);
console.log("Activity found?", exists);
    // 1️⃣ Get activity with host + participants populated
    const activity = await Activity.findById(activityId)
      .populate("host", "firstName lastName avatar")
      .populate("participants", "firstName lastName avatar");

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // 2️⃣ Get messages for that activity with sender populated
    const messages = await Message.find({ activity: activityId })
      .populate("sender", "firstName lastName")
      .sort({ timestamp: 1 });

    // 3️⃣ Format participants with isHost flag
    const participants = activity.participants.map((user) => ({
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      avatar: user.avatar || null,
      isHost: String(user._id) === String(activity.host._id),
    }));

    // Ensure host is in participants even if not in array
    const hostExists = participants.some(
      (p) => String(p.id) === String(activity.host._id)
    );
    if (!hostExists) {
      participants.unshift({
        id: activity.host._id,
        name: `${activity.host.firstName} ${activity.host.lastName}`,
        avatar: activity.host.avatar || null,
        isHost: true,
      });
    }

    // 4️⃣ Format messages
    const formattedMessages = messages.map((msg) => ({
      id: msg._id,
      sender: `${msg.sender.firstName} ${msg.sender.lastName}`,
      senderId: msg.sender._id,
      message: msg.message,
      timestamp: msg.timestamp,
      type: msg.type || "text",
    }));

    // 5️⃣ Final structure
    const activityChat = {
      id: activity._id,
      activityName: activity.title,
      activityDate: activity.date.toISOString().split("T")[0],
      activityTime: activity.time,
      location: activity.location,
      host: `${activity.host.firstName} ${activity.host.lastName}`,
      participants,
      messages: formattedMessages,
    };

    res.json(activityChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
