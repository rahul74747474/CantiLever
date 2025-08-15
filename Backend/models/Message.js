import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  activity: { type: mongoose.Schema.Types.ObjectId, ref: "Activity", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  type: { type: String, default: "text" },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);