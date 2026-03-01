// models/Schedule.js
import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Schedule", scheduleSchema);