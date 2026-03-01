// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Task schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
  completed: { type: Boolean, default: false },
  dueDate: Date,
  order: { type: Number, default: 0 } // for drag-and-drop ordering
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);

// Get all tasks sorted by "order"
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find().sort({ order: 1 });
  res.json(tasks);
});

// Create new task
app.post("/tasks", async (req, res) => {
  const { title, description, priority, dueDate } = req.body;
  const maxOrderTask = await Task.findOne().sort({ order: -1 });
  const order = maxOrderTask ? maxOrderTask.order + 1 : 0;

  const task = await Task.create({ title, description, priority, dueDate, order });
  res.json(task);
});

// Update task
app.put("/tasks/:id", async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedTask);
});

// Toggle completed
app.patch("/tasks/:id", async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedTask);
});

// Delete task
app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

// Reorder tasks (drag-and-drop)
app.patch("/tasks/reorder", async (req, res) => {
  const { order } = req.body; // array of task IDs in new order
  for (let i = 0; i < order.length; i++) {
    await Task.findByIdAndUpdate(order[i], { order: i });
  }
  res.json({ message: "Order updated" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));