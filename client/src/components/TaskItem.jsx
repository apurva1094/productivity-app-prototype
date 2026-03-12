import React, { useState } from "react";

function TaskItem({ task, onDelete, onUpdate, onToggle }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(task);

  const handleSave = () => {
    onUpdate(task._id, form);
    setEditing(false);
  };

  return (
    <div className={`task-card ${task.completed ? "completed" : ""}`}>
      {editing ? (
        <>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <select
            value={form.priority}
            onChange={(e) =>
              setForm({ ...form, priority: e.target.value })
            }
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          {/* NEW: CATEGORY EDIT */}
          <select
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          >
            <option>Study</option>
            <option>Coding</option>
            <option>Personal</option>
            <option>Other</option>
          </select>

          <input
            type="date"
            value={form.dueDate ? form.dueDate.substring(0, 10) : ""}
            onChange={(e) =>
              setForm({ ...form, dueDate: e.target.value })
            }
          />

          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <label>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => onToggle(task._id, e.target.checked)}
            />
            Completed
          </label>

          <h3>{task.title}</h3>

          <p>{task.description}</p>

          {/* NEW: CATEGORY DISPLAY */}
          <p className="task-category">📂 {task.category}</p>

          <p>
            Due:{" "}
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString()
              : "N/A"}
          </p>

          <span className={`priority ${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>

          <div className="actions">
            <button onClick={() => setEditing(true)}>Edit</button>
            <button onClick={() => onDelete(task._id)}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskItem;