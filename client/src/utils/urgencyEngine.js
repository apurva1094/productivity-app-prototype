export function calculateUrgency(task) {
  const today = new Date();
  const due = new Date(task.dueDate);

  const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

  let priorityScore = 0;

  if (task.priority === "High") priorityScore = 30;
  else if (task.priority === "Medium") priorityScore = 20;
  else priorityScore = 10;

  let timeScore = 0;

  if (diffDays < 0) timeScore = 40;
  else if (diffDays <= 1) timeScore = 30;
  else if (diffDays <= 3) timeScore = 20;
  else if (diffDays <= 7) timeScore = 10;

  return priorityScore + timeScore;
}