let tasks = [
  {
    id: 1,
    name: "Finish Math Homework",
    description: "Complete exercises 1–10 from Chapter 5 (Integration Techniques).",
    priority: "High",
    dueDate: "2026-03-01",
    completed: false
  },
  {
    id: 2,
    name: "Prepare DBMS Viva Questions",
    description: "Revise normalization, indexing, transactions, and ACID properties.",
    priority: "Medium",
    dueDate: "2026-03-02",
    completed: false
  },
  {
    id: 3,
    name: "Practice SQL Queries",
    description: "Solve at least 20 SELECT, JOIN, and GROUP BY problems.",
    priority: "Medium",
    dueDate: "2026-03-04",
    completed: false
  },
  {
    id: 4,
    name: "Read AI Research Paper",
    description: "Summarize key points from “Attention is All You Need” paper.",
    priority: "Low",
    dueDate: "2026-03-05",
    completed: false
  },
  {
    id: 5,
    name: "Complete Mini Project Backend",
    description: "Finalize API routes, test MongoDB connection, and handle errors properly.",
    priority: "High",
    dueDate: "2026-03-07",
    completed: false
  }
];

export const getTasks = async () => tasks;
export const addTask = async (task) => tasks.push(task);
export const deleteTask = async (id) => { tasks = tasks.filter(t => t.id !== id); };
export const updateTask = async (id, updatedTask) => { tasks = tasks.map(t => t.id === id ? { ...t, ...updatedTask } : t); };
export const toggleComplete = async (id, completed) => { tasks = tasks.map(t => t.id === id ? { ...t, completed } : t); };