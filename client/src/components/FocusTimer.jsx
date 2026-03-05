// FocusTimer.jsx
import { useState, useEffect } from "react";

function FocusTimer({ onPomodoroEnd }) {
  const [time, setTime] = useState(1500);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (running && time > 0) {
      timer = setInterval(() => setTime(t => t - 1), 1000);
    }
    if (running && time === 0) {
      setRunning(false);
      if (onPomodoroEnd) onPomodoroEnd();
    }
    return () => clearInterval(timer);
  }, [running, time]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className={`timer-box ${running ? "running" : ""}`}>
      <h3>⏱ Focus Timer</h3>
      <h2>{minutes}:{seconds < 10 ? "0" + seconds : seconds}</h2>
      <div className="timer-buttons">
        <button onClick={() => setRunning(true)}>Start</button>
        <button onClick={() => setRunning(false)}>Pause</button>
        <button onClick={() => setTime(1500)}>Reset</button>
      </div>
    </div>
  );
}

export default FocusTimer;