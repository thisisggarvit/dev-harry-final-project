import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./modules/userModel.mjs";
import Item from "./modules/Item.mjs";

dotenv.config();

(async () => {
  await mongoose.connect(process.env.MONGO_URI, { dbName: "grocery_planner" });
  console.log("🌱 Seeding …");

  const pass = await bcrypt.hash("test123", 10);
  const user = await User.create({
    username: "demo",
    email: "demo@example.com",
    password: pass,
  });

  await Item.insertMany([
    { userId: user._id, itemName: "Milk", quantity: 2, category: "Food", store: "Whole Foods", pickupDate: "2025-10-10", pickupTime: "10:30", highPriority: true },
    { userId: user._id, itemName: "Finish assignment", category: "Task", store: "Home", pickupDate: "2025-10-09", highPriority: true, notes: "Push to Git, open PR" },
    { userId: user._id, itemName: "Call mom", category: "Reminder", pickupTime: "20:00", notes: "Ask about weekend" },
  ]);

  console.log("✅ Demo user & items inserted.");
  await mongoose.disconnect();
})();
