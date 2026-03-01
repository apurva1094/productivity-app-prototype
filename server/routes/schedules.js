// routes/schedules.js
import express from "express";
import Schedule from "../models/Schedule.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const schedules = await Schedule.find();
  res.json(schedules);
});

router.post("/", async (req, res) => {
  const schedule = new Schedule(req.body);
  await schedule.save();
  res.json(schedule);
});

router.delete("/:id", async (req, res) => {
  await Schedule.findByIdAndDelete(req.params.id);
  res.json({ message: "Schedule deleted" });
});

export default router;