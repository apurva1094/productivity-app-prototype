import React, { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import FocusTimer from "./components/FocusTimer";
import confetti from "canvas-confetti";
import "./style.css";

import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

function MainApp({ user }) {
  const [tasks, setTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState("All");
  const [streak, setStreak] = useState(0);
  const [search, setSearch] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [todayCount, setTodayCount] = useState(0);
  // 🔥 Load streak from localStorage
  useEffect(() => {
    const savedStreak = localStorage.getItem("pomodoroStreak");
    if (savedStreak) setStreak(Number(savedStreak));
  }, []);
  useEffect(() => {
  const saved = localStorage.getItem("todaySessions");
  if (saved) setTodayCount(Number(saved));
}, []);

  // 🔥 Save streak to localStorage
  useEffect(() => {
    localStorage.setItem("pomodoroStreak", streak);
  }, [streak]);
  useEffect(() => {
  localStorage.setItem("todaySessions", todayCount);
}, [todayCount]);

  // 🔥 Apply dark mode class to body
  useEffect(() => {
    if (darkMode) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
  }, [darkMode]);

  // ✅ Fetch user-specific tasks from Firestore
  useEffect(() => {
    if (!user?.uid) return;

    const fetchTasks = async () => {
      const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const taskList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          dueDate: data.dueDate
            ? data.dueDate.toDate?.() || new Date(data.dueDate)
            : null,
          done: data.done || false,
        };
      });

      setTasks(taskList);
    };

    fetchTasks();
  }, [user]);

  // 🔥 Add or update task
  const handleAddOrUpdate = async (task) => {
    if (!user?.uid) return;

    if (editingIndex !== null) {
      // Update existing task
      const taskToUpdate = tasks[editingIndex];
      await updateDoc(doc(db, "tasks", taskToUpdate.id), task);

      const updated = [...tasks];
      updated[editingIndex] = { ...task, id: taskToUpdate.id };
      setTasks(updated);
      setEditingIndex(null);
    } else {
      // Add new task
      const docRef = await addDoc(collection(db, "tasks"), {
        ...task,
        userId: user.uid,
        done: false,
      });

      setTasks([...tasks, { ...task, id: docRef.id, userId: user.uid, done: false }]);
    }
  };

  const handleEdit = (index) => setEditingIndex(index);

  // 🔥 Delete task
  const handleDelete = async (index) => {
    const taskToDelete = tasks[index];
    await deleteDoc(doc(db, "tasks", taskToDelete.id));
    setTasks(tasks.filter((_, i) => i !== index));
  };

  // 🔥 Toggle done
  const handleToggleDone = async (index) => {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;

    await updateDoc(doc(db, "tasks", updated[index].id), {
      done: updated[index].done,
    });

    setTasks(updated);
  };

  // 🔥 Clear completed tasks
  const handleClearCompleted = async () => {
    const completedTasks = tasks.filter((task) => task.done);
    for (let task of completedTasks) {
      await deleteDoc(doc(db, "tasks", task.id));
    }
    setTasks(tasks.filter((task) => !task.done));
  };

  // 🔥 Pomodoro end logic
  const handlePomodoroEnd = () => {
    setTodayCount(prev => prev + 1);
    // Mark first incomplete task as done
    const firstIncompleteIndex = tasks.findIndex((task) => !task.done);
    if (firstIncompleteIndex !== -1) {
      const updatedTasks = [...tasks];
      updatedTasks[firstIncompleteIndex].done = true;
      setTasks(updatedTasks);
    }

    // Update streak
    const newStreak = streak + 1;
    setStreak(newStreak);

    // Celebrate milestone
    setShowPopup(true); // always show popup

if (newStreak % 5 === 0) {
  confetti({
    particleCount: 200,
    spread: 90,
    origin: { y: 0.6 },
  });
}
  };

  // 🔥 Overdue calculations
  const today = new Date();
  const updatedTasksWithOverdue = tasks.map((task) => {
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      return { ...task, overdue: !task.done && dueDate < today };
    }
    return { ...task, overdue: false };
  });

  const totalTasks = updatedTasksWithOverdue.length;
  const completedTasks = updatedTasksWithOverdue.filter((t) => t.done).length;
  const pendingTasks = updatedTasksWithOverdue.filter((t) => !t.done).length;
  const overdueTasks = updatedTasksWithOverdue.filter((t) => t.overdue).length;

  const progressPercent =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // 🔥 Filtered & searched tasks
  const filteredTasks = updatedTasksWithOverdue
    .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()))
    .filter((task) =>
      filter === "All"
        ? true
        : filter === "Done"
        ? task.done
        : filter === "Pending"
        ? !task.done
        : task.overdue
    );

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      {/* 🔥 Top bar */}
      <div className="top-bar">
        <h1>📋 StudyFlow</h1>
        <label className="switch">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode((prev) => !prev)}
          />
          <span className="slider"></span>
        </label>
      </div>

      {/* 🔥 Analytics */}
      <div className="analytics-box">
        <div>Total: {totalTasks}</div>
        <div>Completed: {completedTasks}</div>
        <div>Pending: {pendingTasks}</div>
        <div>Overdue: {overdueTasks}</div>
      </div>

      {/* 🔥 Progress bar */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progressPercent}%` }}>
          {progressPercent}%
        </div>
      </div>

      {/* 🔥 Search */}
      <input
        type="text"
        placeholder="🔎 Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {/* 🔥 Filters */}
      <div className="filter-buttons">
        {["All", "Done", "Pending", "Overdue"].map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
        <button onClick={handleClearCompleted} className="clear-btn">
          Clear Completed
        </button>
      </div>

      {/* 🔥 Task components */}
      <TaskForm
        onAdd={handleAddOrUpdate}
        editingTask={editingIndex !== null ? tasks[editingIndex] : null}
        onClearEdit={() => setEditingIndex(null)}
      />

      <TaskList
        tasks={filteredTasks}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleDone={handleToggleDone}
      />


      {/* 🔥 Pomodoro Timer */}
      {/* 🔥 Pomodoro Timer */}
      <div className="streak">
  🔥 Streak: {streak} | 📅 Today: {todayCount}
</div>
<FocusTimer onPomodoroEnd={handlePomodoroEnd} />


{/* 🔥 Popup */}
{showPopup && (
  <div className="popup-overlay">
    <div className="popup-box">
      <h2>🎉 Session Complete!</h2>
      <p>Take a short break 😄</p>

      <button onClick={() => setShowPopup(false)}>
        OK
      </button>
    </div>
  </div>
)}
    </div>
  );
}


export default MainApp;