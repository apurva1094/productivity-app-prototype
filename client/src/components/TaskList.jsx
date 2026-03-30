import React, { useState } from "react";

function TaskList({ tasks, onEdit, onDelete, onToggleDone }) {
  const [removingIndex, setRemovingIndex] = useState(null);
  const [filter, setFilter] = useState("All");

  const handleToggle = (index) => {
    if (!tasks[index].done) {
      setRemovingIndex(index);

      setTimeout(() => {
        onToggleDone(index);
        setRemovingIndex(null);
      }, 400);
    } else {
      onToggleDone(index);
    }
  };

  // Filtering tasks
  const filteredTasks =
    filter === "All"
      ? tasks
      : tasks.filter((task) => task.category === filter);

  return (
    <div className="task-list">

      {/* FILTER BUTTONS */}
      <div className="task-filters">
        <button onClick={() => setFilter("All")}>All</button>
        <button onClick={() => setFilter("Study")}>Study</button>
        <button onClick={() => setFilter("Coding")}>Coding</button>
        <button onClick={() => setFilter("Personal")}>Personal</button>
        <button onClick={() => setFilter("Other")}>Other</button>
      </div>

      {filteredTasks.length === 0 && <p>No tasks to display!</p>}

      {filteredTasks.map((task, index) => (
        <div
  key={index}
   className={`task-card ${task.urgency.toLowerCase()} ${task.overdue ? "overdue" : ""}`}
  
>
 

          <h4>{task.title}</h4>

          <p>{task.description}</p>

          {/* CATEGORY DISPLAY */}
          <p className="task-category">📂 {task.category}</p>

          <p className={`priority ${task.urgency}`}>
            ⚡ {task.urgency}
          </p>

          <p>
            Due:{" "}
            {task.dueDate !== "N/A"
              ? new Date(task.dueDate).toLocaleDateString("en-US")
              : "N/A"}
          </p>

          <div className="task-buttons">
            <button className="done-btn" onClick={() => handleToggle(index)}>
              {task.done ? "Undo" : "Done"}
            </button>

            <button className="edit-btn" onClick={() => onEdit(index)}>
              Edit
            </button>

            <button className="delete-btn" onClick={() => onDelete(index)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;