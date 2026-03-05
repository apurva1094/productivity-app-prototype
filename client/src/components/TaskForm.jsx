import React, { useState, useEffect } from "react";

function TaskForm({ onAdd, editingTask, onClearEdit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [urgency, setUrgency] = useState("Medium");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setDueDate(editingTask.dueDate !== "N/A" ? editingTask.dueDate : "");
      setUrgency(editingTask.urgency);
    } else {
      setTitle(""); setDescription(""); setDueDate(""); setUrgency("Medium");
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title,
      description,
      dueDate: dueDate || "N/A",
      urgency,
      done: editingTask?.done || false,
      overdue: editingTask?.overdue || false,
    });

    setTitle(""); setDescription(""); setDueDate(""); setUrgency("Medium");
    if (onClearEdit) onClearEdit();
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Task Title" required />
      <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Task Description" />
      <p>Priority:</p>
      <select value={urgency} onChange={e => setUrgency(e.target.value)}>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} placeholder="MM/DD/YYYY" />
      <button type="submit">{editingTask ? "Update Task" : "Add Task"}</button>
    </form>
  );
}

export default TaskForm;