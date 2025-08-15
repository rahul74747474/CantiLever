import Activity from "../models/trip_model.js";

export const getSameDestinationActivities = async (req, res) => {
  try {
    // 1. Fetch your activities
    const myActivities = await Activity.find({ host: req.user._id });

    // 2. Extract unique locations from your activities
    const myLocations = [...new Set(myActivities.map((act) => act.location))];

    // 3. Find activities with matching locations, but hosted by others
    const matchingActivities = await Activity.find({
      location: { $in: myLocations },
      host: { $ne: req.user._id }, // exclude your own activities
    }).sort({ date: 1 });

    res.status(200).json({ success: true, data: matchingActivities });
  } catch (error) {
    console.error("Get same destination activities error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
