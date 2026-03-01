import { updateTask, deleteTask } from '../api.js';

export default function TaskList(tasks, onUpdate, onDelete) {
  const container = document.createElement('ul');
  container.className = 'task-list';

  const render = () => {
    container.innerHTML = '';
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = task.completed ? 'completed' : '';

      const label = document.createElement('span');
      label.textContent = task.title;

      const toggleBtn = document.createElement('button');
      toggleBtn.textContent = task.completed ? 'Undo' : 'Complete';
      toggleBtn.onclick = async () => {
        const updated = await updateTask(task._id, { completed: !task.completed });
        onUpdate(updated);
      };

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.onclick = async () => {
        await deleteTask(task._id);
        onDelete(task._id);
      };

      li.append(label, toggleBtn, deleteBtn);
      container.appendChild(li);
    });
  };

  render();
  return { container, render };
}