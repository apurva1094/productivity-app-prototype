function AnalyticsDashboard({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const completionRate =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="analytics-box">
      <h2>📊 Productivity Analytics</h2>

      <div className="analytics-stats">
        <div>
          <span>Total Tasks</span>
          <strong>{total}</strong>
        </div>

        <div>
          <span>Completed</span>
          <strong>{completed}</strong>
        </div>

        <div>
          <span>Pending</span>
          <strong>{pending}</strong>
        </div>

        <div>
          <span>Completion Rate</span>
          <strong>{completionRate}%</strong>
        </div>
      </div>

      <div className="analytics-progress">
        <div
          className="analytics-fill"
          style={{ width: `${completionRate}%` }}
        ></div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;