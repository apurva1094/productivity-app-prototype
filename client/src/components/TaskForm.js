import { createTask } from '../api.js';

export default function TaskForm(onAdd) {
  const form = document.createElement('form');
  form.className = 'task-form';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'New task...';
  input.required = true;

  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = 'Add';

  form.append(input, button);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const task = { title: input.value, completed: false };
    const newTask = await createTask(task);
    onAdd(newTask);
    input.value = '';
  });

  return form;
}