import React from "react";

const ProductivityInsights = ({ tasks }) => {
  const completed = tasks.filter(t => t.done).length;
  const pending = tasks.filter(t => !t.done).length;
  const focusScore = Math.round((completed / (tasks.length || 1)) * 100);

  return (
    <div className="analytics-box">
      <div>✅ Completed: {completed}</div>
      <div>⏳ Pending: {pending}</div>
      <div>⚡ Focus Score: {focusScore}%</div>
    </div>
  );
};

export default ProductivityInsights;