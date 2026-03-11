function AnalyticsDashboard({ total, completed, progress, streak }) {

  return (
    <div className="analytics-dashboard">

      <div className="stat-card">
        <h3>Total Tasks</h3>
        <p>{total}</p>
      </div>

      <div className="stat-card">
        <h3>Completed Tasks</h3>
        <p>{completed}</p>
      </div>

      <div className="stat-card">
        <h3>Productivity</h3>
        <p>{progress}%</p>
      </div>

      <div className="stat-card">
        <h3>Streak</h3>
        <p>{streak}</p>
      </div>

    </div>
  );
}

export default AnalyticsDashboard;