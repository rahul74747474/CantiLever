import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  maxParticipants: {
    type: Number,
    required: [true, "Maximum participants is required"],
  },
  currentParticipants: {
    type: Number,
    default: 0,
  },
  location: {
    type: String,
    required: [true, "Location is required"],
  },
  date: {
    type: Date, // Better to store as Date object
    required: [true, "Date is required"],
  },
  time: {
    type: String, // Optionally merge with date or use Date + time lib
    required: [true, "Time is required"],
  },
  price: {
    type: Number,
    default: 0,
  },
  tags: [String],
}, {
  timestamps: true
});


export default mongoose.model("Activity", activitySchema);
