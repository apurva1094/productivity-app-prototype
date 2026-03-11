// App.jsx
import React, { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import FocusTimer from "./components/FocusTimer";
import * as confetti from "canvas-confetti";
import "./style.css";

function App() {
  const [tasks, setTasks] = useState(() => {
  const savedTasks = localStorage.getItem("tasks");
  return savedTasks ? JSON.parse(savedTasks) : [];
});
  const [editingIndex, setEditingIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState("All");
  const [streak, setStreak] = useState(0);
const [search, setSearch] = useState("");
  // Load streak from localStorage
  useEffect(() => {
    const savedStreak = localStorage.getItem("pomodoroStreak");
    if (savedStreak) setStreak(Number(savedStreak));
  }, []);

  // Save streak to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("pomodoroStreak", streak);
  }, [streak]);
  useEffect(() => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}, [tasks]);

  // ---- TASK HANDLERS ----
  const handleAddOrUpdate = (task) => {
    if (editingIndex !== null) {
      const updated = [...tasks];
      updated[editingIndex] = task;
      setTasks(updated);
      setEditingIndex(null);
    } else {
      setTasks([...tasks, task]);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleToggleDone = (index) => {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;
    setTasks(updated);
  };

  const handleClearCompleted = () => {
    setTasks(tasks.filter(task => !task.done));
  };

  // ---- POMODORO END HANDLER ----
  const handlePomodoroEnd = () => {
    const firstIncompleteIndex = tasks.findIndex(task => !task.done);
    if (firstIncompleteIndex !== -1) {
      const updatedTasks = [...tasks];
      updatedTasks[firstIncompleteIndex].done = true;
      setTasks(updatedTasks);
    }

    const newStreak = streak + 1;
    setStreak(newStreak);

    if (newStreak % 5 === 0) {
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 },
      });
      alert(`🎉 Milestone! ${newStreak} Pomodoro sessions completed!`);
    }
  };
// ---- CALCULATE PROGRESS & FILTERS ----

// Detect overdue tasks
const today = new Date();

tasks.forEach(task => {
  if (task.dueDate && task.dueDate !== "N/A") {
    const dueDate = new Date(task.dueDate);
    task.overdue = !task.done && dueDate < today;
  }
});

// Progress calculations
const totalTasks = tasks.length;
const completedTasks = tasks.filter(t => t.done).length;
const pendingTasks = tasks.filter(t => !t.done).length;
const overdueTasks = tasks.filter(t => t.overdue).length;
const focusScore = totalTasks === 0
  ? 0
  : Math.round((completedTasks / totalTasks) * 100);
const progressPercent =
  totalTasks === 0
    ? 0
    : Math.round((completedTasks / totalTasks) * 100);

// Filter + search + sorting
const filteredTasks = tasks
  .filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase())
  )
  .filter(task =>
    filter === "All" ? true :
    filter === "Done" ? task.done :
    filter === "Pending" ? !task.done :
    task.overdue
  )
  .sort((a, b) => {
    if (a.overdue && !b.overdue) return -1;
    if (!a.overdue && b.overdue) return 1;

    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    return (priorityOrder[a.urgency] || 4) - (priorityOrder[b.urgency] || 4);
  });

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      {/* Theme toggle */}
      <button className="theme-toggle" onClick={() => setDarkMode(prev => !prev)}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <h1>📋 My Tasks & Focus App</h1>

      {/* Progress bar */}
      <div className="analytics-box">
  <div>Total: {totalTasks}</div>
  <div>Completed: {completedTasks}</div>
  <div>Pending: {pendingTasks}</div>
  <div>Overdue: {overdueTasks}</div>
</div>
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progressPercent}%` }}>
          {progressPercent}%
        </div>
      </div>
      <div className="focus-score">
  🎯 Focus Score: {focusScore}%
</div>

      {/* Celebration Message */}
      {totalTasks > 0 && completedTasks === totalTasks && (
        <p className="celebration-text">🎉 All tasks completed! Great job! 🎉</p>
      )}

      {/* Filter buttons */}
      <input
  type="text"
  placeholder="🔎 Search tasks..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="search-input"
/>
      <div className="filter-buttons">
        {["All","Done","Pending","Overdue"].map(f => (
          <button 
            key={f} 
            className={filter===f?"active":""} 
            onClick={()=>setFilter(f)}
          >{f}</button>
        ))}
        <button onClick={handleClearCompleted} className="clear-btn">Clear Completed</button>
      </div>

      {/* Task Form */}
      <TaskForm
        onAdd={handleAddOrUpdate}
        editingTask={editingIndex !== null ? tasks[editingIndex] : null}
        onClearEdit={() => setEditingIndex(null)}
      />

      {/* Task List */}
      <TaskList
        tasks={filteredTasks}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleDone={handleToggleDone}
      />

      {/* Pomodoro Streak Display */}
      <div className="streak-display">
        🔥 Pomodoro Streak: {streak} {streak === 1 ? "session" : "sessions"}
      </div>

      {/* Pomodoro Timer */}
      <FocusTimer onPomodoroEnd={handlePomodoroEnd} />
    </div>
  );
}

export default App;