import React from "react";

const SuggestionsPanel = ({ tasks, calculateUrgency }) => {
  const overdueCount = tasks.filter(t => !t.completed && calculateUrgency(t) > 7).length;
  const dueSoonCount = tasks.filter(t => !t.completed && calculateUrgency(t) > 3 && calculateUrgency(t) <= 7).length;

  return (
    <div className="suggestions-panel">
      <h3>⚡ Focus Suggestions</h3>
      <ul>
        <li>Overdue tasks: {overdueCount}</li>
        <li>Due soon: {dueSoonCount}</li>
      </ul>
    </div>
  );
};

export default SuggestionsPanel;