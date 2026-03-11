import React, { useState } from "react";

function TaskList({ tasks, onEdit, onDelete, onToggleDone }) {
  const [removingIndex, setRemovingIndex] = useState(null);

  const handleToggle = (index) => {
    if (!tasks[index].done) {
      // Animate removal only for marking done
      setRemovingIndex(index);
      setTimeout(() => {
        onToggleDone(index);
        setRemovingIndex(null);
      }, 400); // match animation duration
    } else {
      onToggleDone(index); // undo done immediately
    }
  };

  return (
    <div className="task-list">
      {tasks.length === 0 && <p>No tasks to display!</p>}
      {tasks.map((task, index) => (
        <div
          key={index}
          className={`task-card ${task.overdue ? "overdue" : ""} ${
            removingIndex === index ? "fade-slide-out" : ""
          }`}
        >
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          <p className={task.urgency.toLowerCase()}>{task.urgency}</p>
          <p>Due: {task.dueDate !== "N/A" ? new Date(task.dueDate).toLocaleDateString('en-US') : 'N/A'}</p>
          <div className="task-buttons">
            <button className="done-btn" onClick={() => handleToggle(index)}>
              {task.done ? "Undo" : "Done"}
            </button>
            <button className="edit-btn" onClick={() => onEdit(index)}>Edit</button>
            <button className="delete-btn" onClick={() => onDelete(index)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;