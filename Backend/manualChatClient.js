import { io } from "socket.io-client";
import readline from "readline";

const activityId = "688099cffb29fb118fd80ce9"; // Replace with actual activity ID
const userId = process.argv[2];

if (!userId) {
  console.error("Please provide your user ID as an argument");
  process.exit(1);
}

const socket = io("http://localhost:3000");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

socket.on("connect", () => {
  console.log(`Connected as user ${userId}, socket ID: ${socket.id}`);
  socket.emit("joinActivity", activityId);
  promptMessage();
});

socket.on("newMessage", (msg) => {
  console.log(`\n${msg.sender.firstName} ${msg.sender.lastName}: ${msg.message}`);
  promptMessage();
});

function promptMessage() {
  rl.question("Enter message: ", (msg) => {
    if (msg.trim()) {
      socket.emit("sendMessage", {
        activityId,
        senderId: userId,
        message: msg.trim(),
      });
    }
    promptMessage();
  });
}

socket.on("disconnect", () => {
  console.log("Disconnected from server");
  rl.close();
});

