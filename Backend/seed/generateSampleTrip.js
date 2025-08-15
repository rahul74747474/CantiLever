import mongoose from "mongoose";
import User from "../models/user_model.js";
import Activity from "../models/trip_model.js";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
mongoose.connect(process.env.MONGO_URI);

const categories = ["Hiking", "Food Tour", "Photography", "Spiritual Walk", "Adventure"];
const tags = ["nature", "fun", "group", "learning", "budget"];

const createTrips = async () => {
  const users = await User.find();
  const activities = [];

  for (let i = 1; i <= 20; i++) {
    const host = users[Math.floor(Math.random() * users.length)];

    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() + Math.floor(Math.random() * 60)); // within 2 months

    activities.push({
      title: `Trip ${i} - ${categories[i % categories.length]}`,
      description: `This is a great trip for those who enjoy ${categories[i % categories.length].toLowerCase()}. Join us for an amazing experience.`,
      category: categories[i % categories.length],
      host: host._id,
      maxParticipants: Math.floor(Math.random() * 10) + 5,
      currentParticipants: 0,
      location: `Destination ${(i % 15) + 1}`,
      date: randomDate.toISOString().split("T")[0],
      time: "10:00 AM",
      price: Math.floor(Math.random() * 5000) + 1000,
      tags: tags.sort(() => 0.5 - Math.random()).slice(0, 2),
    });
  }

  await Activity.insertMany(activities);
  console.log("✅ Sample trips inserted.");
  process.exit();
};

createTrips().catch((err) => console.error("Error inserting trips:", err));
