import express from "express";
import users from "./routes/user_route.js";
import tripRoutes from "./routes/trip_routes.js";
import ChatMessage from "./models/Message.js"
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/messageRoutes.js"; 
import tbRoutes from "./routes/travellers_routes.js"; 
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const port = 3000;

console.log("🔄 Starting backend...");

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:8080",
    // origin: "https://40z329b0-8080.inc1.devtunnels.ms",
    credentials: true,
  })
);

const connectToMongoDB = async () => {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

await connectToMongoDB();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

console.log("📦 Configured Cloudinary");

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp/",
  })
);

// Create HTTP server and Socket.IO instance before routes
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:8080", credentials: true },
  // cors: { origin: "https://40z329b0-8080.inc1.devtunnels.ms", credentials: true },
});

// Socket.IO logic here:
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinActivity", (activityId) => {
    socket.join(activityId);
    console.log(`Socket ${socket.id} joined activity ${activityId}`);
  });

  socket.on("sendMessage", async (data) => {
  console.log("sendMessage received:", data); // Add this line

  try {
    // existing logic
    const newMessage = await ChatMessage.create({
      activity: data.activityId,
      sender: data.senderId,
      message: data.message,
    });

    const populatedMsg = await newMessage.populate("sender", "firstName lastName image");

    console.log("Emitting newMessage to room", data.activityId); // Add this line
    io.to(data.activityId).emit("newMessage", populatedMsg);
  } catch (err) {
    console.error("Error saving message:", err);
  }
});


  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


// Routes
console.log("⚡ Setting up routes...");
app.use("/api/v1/users", users);
app.use("/api/v1/trips", tripRoutes);
app.use("/api/v1/tb", tbRoutes);
app.use("/api/v1/chat", chatRoutes);  // Use after import

// Listen on HTTP server, not app
server.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
