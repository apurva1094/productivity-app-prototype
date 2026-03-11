import { useState, useEffect } from "react";
import TaskList from "./components/TaskList";
import FocusTimer from "./components/FocusTimer";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import StreakCounter from "./components/StreakCounter";

function App() {

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  /* LOAD TASKS */

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(saved);
  }, []);

  /* SAVE TASKS */

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  /* DARK MODE */

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  /* ADD TASK */

  const addTask = () => {

    if (!title.trim()) return;

    const newTask = {
      id: Date.now(),
      title,
      description,
      priority,
      dueDate,
      completed: false,
      completedAt: null
    };

    setTasks([...tasks, newTask]);

    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
  };

  /* UPDATE TASK */

  const updateTask = () => {

    setTasks(
      tasks.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              title,
              description,
              priority,
              dueDate
            }
          : task
      )
    );

    setEditingTask(null);
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
  };

  /* TOGGLE COMPLETE */

  const toggleComplete = (id) => {

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date() : null
            }
          : task
      )
    );

  };

  /* DELETE TASK */

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  /* EDIT TASK */

  useEffect(() => {

    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueDate);
    }

  }, [editingTask]);

  /* PROGRESS BAR */

  const completedTasks = tasks.filter((t) => t.completed).length;

  const progress =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100);

  /* CLEAR COMPLETED */

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  return (
    <div className="app-container">

      <header>
        <h1>StudyFlow</h1>

        <button
          className="dark-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </header>

      {/* DASHBOARD */}

      <AnalyticsDashboard tasks={tasks} />

      {/* STREAK */}

      <StreakCounter tasks={tasks} />

      {/* TIMER */}

      <FocusTimer />

      {/* TASK FORM */}

      <div className="task-form">

        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        {editingTask ? (
          <button onClick={updateTask}>Update Task</button>
        ) : (
          <button onClick={addTask}>Add Task</button>
        )}

      </div>

      {/* PROGRESS BAR */}

      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>
      </div>

      {/* TASK LIST */}

      <TaskList
        tasks={tasks}
        toggleComplete={toggleComplete}
        deleteTask={deleteTask}
        setEditingTask={setEditingTask}
      />

      {/* CLEAR COMPLETED */}

      {tasks.some((t) => t.completed) && (
        <button className="clear-btn" onClick={clearCompleted}>
          Clear Completed
        </button>
      )}

    </div>
  );
}

export default App;