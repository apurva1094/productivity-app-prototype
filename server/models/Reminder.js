// models/Reminder.js
import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  remindAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Reminder", reminderSchema);