import React from "react";

const TaskList = ({ tasks, onDelete, onToggle, onEdit }) => {
  return (
    <div className="task-list">
      {tasks.map(task => (
        <div key={task.id} className={`task-item ${task.completed ? "completed" : ""}`}>
          <div className="task-info">
            <h4>{task.name}</h4>
            <p>{task.description}</p>
            <div className="task-meta">
              <span>Priority: {task.priority}</span>
              <span>Due: {task.dueDate}</span>
              {!task.completed && (
                new Date(task.dueDate) < new Date()
                  ? <span className="badge overdue">Overdue</span>
                  : <span className="badge soon">Due Soon</span>
              )}
            </div>
          </div>
          <div className="task-buttons">
            <button className="toggle" onClick={() => onToggle(task.id, !task.completed)}>
              {task.completed ? "Undo" : "Done"}
            </button>
            <button className="edit" onClick={() => onEdit(task)}>Edit</button>
            <button className="delete" onClick={() => onDelete(task.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;