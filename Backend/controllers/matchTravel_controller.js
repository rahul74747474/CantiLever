import Activity from "../models/trip_model.js";
import User from "../models/user_model.js";


export const getUsersOverlappingWithMe = async (req, res) => {
  try {
    const userId = req.user._id;

    // Step 1: Fetch current user's future activities
    const myActivities = await Activity.find({
      date: { $gte: new Date() },
      $or: [
        { host: userId },
        { participants: userId }
      ]
    });

    const overlappingUserIds = new Set();

    // Step 2: For each activity, find overlaps
    for (const activity of myActivities) {
      const overlaps = await Activity.find({
        _id: { $ne: activity._id },
        location: activity.location,
        date: activity.date,
        $or: [
          { host: { $ne: userId } },
          { participants: { $in: [ { $ne: userId } ] } }
        ]
      });

      // Step 3: Collect user IDs from overlapping activities
      for (const act of overlaps) {
        if (act.host.toString() !== userId.toString()) {
          overlappingUserIds.add(act.host.toString());
        }

        act.participants.forEach(participantId => {
          if (participantId.toString() !== userId.toString()) {
            overlappingUserIds.add(participantId.toString());
          }
        });
      }
    }

    // Step 4: Fetch user info
    const users = await User.find({
      _id: { $in: Array.from(overlappingUserIds) }
    }).select("firstName lastName profilePicture location interests");

    res.status(200).json({ success: true, data: users });
  } catch (err) {
    console.error("Error fetching overlapping users:", err);
    res.status(500).json({ message: "Server error" });
  }
};
