// src/MainApp.jsx
import { useState, useEffect } from "react";
import { auth, db } from "./firebase"; 
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import FocusTimer from "./components/FocusTimer";
import confetti from "canvas-confetti";
import "./style.css";

function MainApp({ user }) {
  if (!user) return <div>Loading...</div>;

  const [tasks, setTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState("All");
  const [streak, setStreak] = useState(0);
  const [search, setSearch] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [todayCount, setTodayCount] = useState(0);

  // Load streak & today sessions
  useEffect(() => {
    const savedStreak = localStorage.getItem("pomodoroStreak");
    if (savedStreak) setStreak(Number(savedStreak));

    const savedToday = localStorage.getItem("todaySessions");
    if (savedToday) setTodayCount(Number(savedToday));
  }, []);

  // Save streak & today sessions
  useEffect(() => {
    localStorage.setItem("pomodoroStreak", streak);
    localStorage.setItem("todaySessions", todayCount);
  }, [streak, todayCount]);

  // Apply dark mode
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  // Fetch tasks
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
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
          done: data.done || false,
        };
      });
      setTasks(taskList);
    };
    fetchTasks();
  }, [user]);

  // Add/update task
  const handleAddOrUpdate = async (task) => {
    if (!user?.uid) return;

    if (editingIndex !== null) {
      const taskToUpdate = tasks[editingIndex];
      await updateDoc(doc(db, "tasks", taskToUpdate.id), task);
      const updated = [...tasks];
      updated[editingIndex] = { ...task, id: taskToUpdate.id };
      setTasks(updated);
      setEditingIndex(null);
    } else {
      const docRef = await addDoc(collection(db, "tasks"), { ...task, userId: user.uid, done: false });
      setTasks([...tasks, { ...task, id: docRef.id, userId: user.uid, done: false }]);
    }
  };

  const handleEdit = (index) => setEditingIndex(index);

  // Delete task
  const handleDelete = async (index) => {
    const taskToDelete = tasks[index];
    await deleteDoc(doc(db, "tasks", taskToDelete.id));
    setTasks(tasks.filter((_, i) => i !== index));
  };

  // Toggle done
  const handleToggleDone = async (index) => {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;
    await updateDoc(doc(db, "tasks", updated[index].id), { done: updated[index].done });
    setTasks(updated);
  };

  // Clear completed
  const handleClearCompleted = async () => {
    const completedTasks = tasks.filter((task) => task.done);
    for (let task of completedTasks) await deleteDoc(doc(db, "tasks", task.id));
    setTasks(tasks.filter((task) => !task.done));
  };

  // Pomodoro end logic
  const handlePomodoroEnd = () => {
    setTodayCount((prev) => prev + 1);

    const firstIncompleteIndex = tasks.findIndex((task) => !task.done);
    if (firstIncompleteIndex !== -1) {
      const updatedTasks = [...tasks];
      updatedTasks[firstIncompleteIndex].done = true;
      setTasks(updatedTasks);
    }

    const newStreak = streak + 1;
    setStreak(newStreak);
    alert("🔥 Great job! Keep going!");
    setShowPopup(true);
    if (newStreak % 5 === 0) confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
  };

  // Overdue tasks
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
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const filteredTasks = updatedTasksWithOverdue
    .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()))
    .filter((task) =>
      filter === "All" ? true : filter === "Done" ? task.done : filter === "Pending" ? !task.done : task.overdue
    );

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      <h2>🚀 Stay Focused. Get Things Done.</h2>
      {/* TOP BAR */}
     <div className="top-bar">
  {/* Left side: Title + Email */}
  <div className="top-left">
    <h1>📋 StudyFlow</h1>
    <div className="user-email">👤 {user.email}</div>
  </div>

  {/* Right side: Logout + Dark/Light Toggle */}
  <div className="top-right">
    <button className="logout-btn" onClick={() => auth.signOut()}>
      Logout
    </button>

    <label className="switch">
      <input
        type="checkbox"
        checked={darkMode}
        onChange={() => setDarkMode(prev => !prev)}
      />
      <span className="slider"></span>
    </label>
  </div>
</div>

      {/* ANALYTICS */}
      <div className="analytics-box">
        <div>Total: {totalTasks}</div>
        <div>Completed: {completedTasks}</div>
        <div>Pending: {pendingTasks}</div>
        <div>Overdue: {overdueTasks}</div>
      </div>

      {/* PROGRESS */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progressPercent}%` }}>{progressPercent}%</div>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="🔎 Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {/* FILTER */}
      <div className="filter-buttons">
        {["All", "Done", "Pending", "Overdue"].map((f) => (
          <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>{f}</button>
        ))}
        <button onClick={handleClearCompleted} className="clear-btn">Clear Completed</button>
      </div>

      {/* TASK FORM & LIST */}
      <TaskForm onAdd={handleAddOrUpdate} editingTask={editingIndex !== null ? tasks[editingIndex] : null} onClearEdit={() => setEditingIndex(null)} />
      <TaskList tasks={filteredTasks} onEdit={handleEdit} onDelete={handleDelete} onToggleDone={handleToggleDone} />

      {/* STREAK & TIMER */}
      <div className="streak">🔥 Streak: {streak} | 📅 Today: {todayCount}</div>
      <FocusTimer onPomodoroEnd={handlePomodoroEnd} />

      {/* POPUP */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>🎉 Session Complete!</h2>
            <p>🔥 You're building consistency. Keep it up!</p>
            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainApp;