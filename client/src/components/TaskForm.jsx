import React, { useState, useEffect } from "react";

function TaskForm({ onAdd, editingTask, onClearEdit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [urgency, setUrgency] = useState("Medium");
  const [category, setCategory] = useState("Study");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setDueDate(editingTask.dueDate !== "N/A" ? editingTask.dueDate : "");
      setUrgency(editingTask.urgency);
      setCategory(editingTask.category || "Study");
    } else {
      setTitle("");
      setDescription("");
      setDueDate("");
      setUrgency("Medium");
      setCategory("Study");
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
      category,
      done: editingTask?.done || false,
      overdue: editingTask?.overdue || false,
    });

    setTitle("");
    setDescription("");
    setDueDate("");
    setUrgency("Medium");
    setCategory("Study");

    if (onClearEdit) onClearEdit();
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">

      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Task Title"
        required
      />

      <input
        type="text"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Task Description"
      />

      <p>Priority:</p>
      <select value={urgency} onChange={e => setUrgency(e.target.value)}>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      <p>Category:</p>
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="Study">Study</option>
        <option value="Coding">Coding</option>
        <option value="Personal">Personal</option>
        <option value="Other">Other</option>
      </select>

      <input
        type="date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
        placeholder="MM/DD/YYYY"
      />

      <button type="submit">
        {editingTask ? "Update Task" : "Add Task"}
      </button>

    </form>
  );
}

export default TaskForm;