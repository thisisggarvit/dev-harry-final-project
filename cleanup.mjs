import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./modules/userModel.mjs";
import Item from "./modules/Item.mjs";

dotenv.config();

(async () => {
  await mongoose.connect(process.env.MONGO_URI, { dbName: "smart_planner" });
  console.log("🧹 Cleaning DB …");
  await Item.deleteMany({});
  await User.deleteMany({});
  console.log("✅ Cleared users & items.");
  await mongoose.disconnect();
})();
