import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  priority: { type: String, default: "Medium" },
  completed: { type: Boolean, default: false },
  dueDate: Date,
  position: { type: Number, default: 0 } // for ordering tasks
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);