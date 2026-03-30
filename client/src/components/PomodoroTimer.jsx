import React,{ useState, useEffect } from "react";
 function FocusTimer({ onPomodoroEnd }) {

  const [time, setTime] = useState(1500); // 25 minutes
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setRunning(false);

          if (onPomodoroEnd) {
            onPomodoroEnd(); // notify App.jsx
          }

          alert("⏰ Pomodoro finished!");
          return 1500; // reset to 25 min
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);

  }, [running, onPomodoroEnd]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="timer-box">

      <h2>⏱ Focus Timer</h2>

      <h1>
        {minutes}:{seconds < 10 ? "0" : ""}
        {seconds}
      </h1>

      <button onClick={() => setRunning(true)}>Start</button>

      <button onClick={() => setRunning(false)}>Pause</button>

      <button
        onClick={() => {
          setRunning(false);
          setTime(1500);
        }}
      >
        Reset
      </button>

    </div>
  );
}