import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

// GET all tasks (sorted by position)
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ position: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create task
router.post("/", async (req, res) => {
  try {
    const count = await Task.countDocuments();
    const task = new Task({
      ...req.body,
      position: count // add at the end
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update task
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH toggle completed or reorder
router.patch("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH reorder tasks
// body: [{ _id, position }]
router.patch("/reorder", async (req, res) => {
  try {
    const tasks = req.body;
    const updates = tasks.map(t => Task.findByIdAndUpdate(t._id, { position: t.position }));
    await Promise.all(updates);
    res.json({ message: "Order updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE task
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;