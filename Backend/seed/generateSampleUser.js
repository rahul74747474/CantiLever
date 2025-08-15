import mongoose from "mongoose";
import User from "../models/user_model.js"; // Adjust path
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import bcrypt from "bcrypt";

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const interestsList = ["Trekking", "Camping", "Beaches", "Mountains", "Food", "Culture", "Backpacking"];

const createUsers = async () => {
  const users = [];

  for (let i = 1; i <= 30; i++) {
    const password = await bcrypt.hash("password123", 10);

    users.push({
      firstName: `User${i}`,
      lastName: `Test${i}`,
      email: `user${i}@example.com`,
      password,
      bio: `I am User${i} who loves to explore and travel the world. Always up for new adventures.`,
      location: `City${(i % 10) + 1}`,
      interests: interestsList.sort(() => 0.5 - Math.random()).slice(0, 3),
      profilePicture: "",
    });
  }

  await User.insertMany(users);
  console.log("✅ Sample users inserted.");
  process.exit();
};

createUsers().catch((err) => console.error("Error inserting users:", err));
