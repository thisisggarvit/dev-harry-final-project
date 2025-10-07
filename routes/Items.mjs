import express from "express";
import Item from "../modules/Item.mjs"; // <- your Items.mjs
import auth from "../middleware/auth.mjs";

const router = express.Router();

// List with optional query
router.get("/", auth, async (req, res) => {
  const { q = "", category = "", store = "" } = req.query;
  const where = { userId: req.user.id };
  if (category) where.category = category;
  if (store) where.store = store;
  if (q) where.$or = [
    { itemName: { $regex: q, $options: "i" } },
    { store: { $regex: q, $options: "i" } },
    { notes: { $regex: q, $options: "i" } },
    { category: { $regex: q, $options: "i" } },
  ];

  const items = await Item.find(where).sort({ createdAt: -1 });
  res.json(items);
});

// Create
router.post("/", auth, async (req, res) => {
  const allowed = (({ itemName, category, quantity, store, pickupDate, pickupTime, highPriority, notes }) =>
    ({ itemName, category, quantity, store, pickupDate, pickupTime, highPriority, notes }))(req.body);

  if (!allowed.itemName || !allowed.category)
    return res.status(400).json({ message: "itemName and category are required" });

  const created = await Item.create({ ...allowed, userId: req.user.id });
  res.status(201).json(created);
});

// Update
router.put("/:id", auth, async (req, res) => {
  const allowed = (({ itemName, category, quantity, store, pickupDate, pickupTime, highPriority, notes }) =>
    ({ itemName, category, quantity, store, pickupDate, pickupTime, highPriority, notes }))(req.body);

  const updated = await Item.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    allowed,
    { new: true }
  );
  res.json(updated);
});

// Delete
router.delete("/:id", auth, async (req, res) => {
  await Item.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.json({ message: "Deleted" });
});

export default router;
