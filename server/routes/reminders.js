// routes/reminders.js
import express from "express";
import Reminder from "../models/Reminder.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const reminders = await Reminder.find();
  res.json(reminders);
});

router.post("/", async (req, res) => {
  const reminder = new Reminder(req.body);
  await reminder.save();
  res.json(reminder);
});

router.delete("/:id", async (req, res) => {
  await Reminder.findByIdAndDelete(req.params.id);
  res.json({ message: "Reminder deleted" });
});

export default router;