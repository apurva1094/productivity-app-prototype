import React, { useState, useEffect } from "react";
import { getTasks, addTask, deleteTask, updateTask, toggleComplete } from "./api";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./index.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  useEffect(() => { fetchTasks(); }, []);

  const calculateUrgency = (task) => {
    if (task.completed) return 0;
    const priorityMap = { High: 3, Medium: 2, Low: 1 };
    const priorityScore = priorityMap[task.priority] || 1;

    if (!task.dueDate) return priorityScore;

    const today = new Date();
    const due = new Date(task.dueDate);
    const diffDays = Math.ceil((due - today) / (1000*60*60*24));

    let timeScore = 1;
    if (diffDays < 0) timeScore = 5;
    else if (diffDays === 0) timeScore = 4;
    else if (diffDays <= 2) timeScore = 3;
    else if (diffDays <= 5) timeScore = 2;

    return priorityScore + timeScore;
  };

  const sortedTasks = [...tasks].sort((a,b) => calculateUrgency(b) - calculateUrgency(a));

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length === 0 ? 0 : (completedCount / tasks.length) * 100;
  const totalUrgency = tasks.reduce((sum,t) => sum + calculateUrgency(t), 0);

  const handleAdd = async (task) => {
    await addTask({ ...task, id: Date.now() });
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  const handleUpdate = async (id, updatedTask) => {
    await updateTask(id, updatedTask);
    setEditingTask(null);
    fetchTasks();
  };

  const handleToggle = async (id, completed) => {
    await toggleComplete(id, completed);
    fetchTasks();
  };

  const handleEdit = (task) => setEditingTask(task);

  return (
    <div className="container">
      <h1>StudyFlow – Smart Productivity Engine</h1>
      <h2>Focus Score: {totalUrgency}</h2>

      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      <TaskForm 
        onAdd={handleAdd} 
        onUpdate={handleUpdate} 
        editingTask={editingTask} 
      />

      <TaskList 
        tasks={sortedTasks} 
        onDelete={handleDelete} 
        onToggle={handleToggle} 
        onEdit={handleEdit} 
      />
    </div>
  );
}

export default App;