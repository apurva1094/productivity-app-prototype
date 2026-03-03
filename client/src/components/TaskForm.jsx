import React, { useState, useEffect } from "react";

const TaskForm = ({ onAdd, onUpdate, editingTask }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (editingTask) {
      setName(editingTask.name);
      setDescription(editingTask.description);
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueDate);
    } else {
      setName("");
      setDescription("");
      setPriority("Low");
      setDueDate("");
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const task = { name, description, priority, dueDate, completed: editingTask ? editingTask.completed : false };
    if (editingTask) onUpdate(editingTask.id, task);
    else onAdd(task);

    setName("");
    setDescription("");
    setPriority("Low");
    setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input type="text" placeholder="Task title" value={name} onChange={e => setName(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required rows={3} />
      <select value={priority} onChange={e => setPriority(e.target.value)}>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>
      <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
      <button type="submit">{editingTask ? "Update Task" : "Add Task"}</button>
    </form>
  );
};

export default TaskForm;