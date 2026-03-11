import { useState } from "react";

function TaskList({ tasks = [], toggleComplete, deleteTask, setEditingTask }) {

  const [filter, setFilter] = useState("all");

  /* FILTER TASKS */

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  /* PRIORITY SORTING */

  const priorityOrder = {
    High: 3,
    Medium: 2,
    Low: 1
  };

  const sortedTasks = [...filteredTasks].sort((a, b) => {

    if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }

    if (!a.dueDate || !b.dueDate) return 0;

    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  return (
    <div className="task-list">

      {/* FILTER BUTTONS */}

      <div className="filter-buttons">

        <button
          className={filter === "all" ? "active-filter" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className={filter === "active" ? "active-filter" : ""}
          onClick={() => setFilter("active")}
        >
          Active
        </button>

        <button
          className={filter === "completed" ? "active-filter" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>

      </div>

      {sortedTasks.length === 0 && <p>No tasks found.</p>}

      {sortedTasks.map((task) => {

        const badgeClass =
          task.priority === "High"
            ? "badge-high"
            : task.priority === "Medium"
            ? "badge-medium"
            : "badge-low";

        return (
          <div key={task.id} className="task-item">

            <div className="task-info">

              <h4
                style={{
                  textDecoration: task.completed ? "line-through" : "none"
                }}
              >
                {task.title}
              </h4>

              <p>{task.description}</p>

              <small>
                <span className={`priority-badge ${badgeClass}`}>
                  {task.priority}
                </span>{" "}
                | Due: {task.dueDate || "No date"}
              </small>

            </div>

            <div className="task-actions">

              <button
                className="complete-btn"
                onClick={() => toggleComplete(task.id)}
              >
                {task.completed ? "Undo" : "Complete"}
              </button>

              <button onClick={() => setEditingTask(task)}>
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>

            </div>

          </div>
        );
      })}

    </div>
  );
}

export default TaskList;