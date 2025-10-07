import mongoose from "mongoose";

/**
 * Grocery Planner Item Schema
 * Shared fields for all grocery items
 */
const itemsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Vegetables", "Fruits", "Dairy", "Beverages"],
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: [1, "Quantity must be at least 1"],
    },
    store: {
      type: String,
      default: "",
      trim: true,
    },
    pickupDate: {
      type: String,
      default: "",
    },
    pickupTime: {
      type: String,
      default: "",
    },
    highPriority: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemsSchema);
export default Item;
