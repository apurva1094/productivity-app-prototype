import { useState, useEffect } from "react";

export default function PomodoroTimer() {

  const [time, setTime] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("pomodoroSessions");
    return saved ? Number(saved) : 0;
  });

  // TIMER LOGIC
  useEffect(() => {
    let timer;

    if (running) {
      timer = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [running]);

  // WHEN TIMER FINISHES
  useEffect(() => {
    if (time === 0) {

      setRunning(false);

      if (!isBreak) {
        setSessions((prev) => prev + 1);
        setIsBreak(true);
        setTime(5 * 60);
        alert("Focus session finished! Take a break.");
      } else {
        setIsBreak(false);
        setTime(25 * 60);
        alert("Break finished! Back to focus.");
      }

    }
  }, [time, isBreak]);

  // SAVE SESSIONS
  useEffect(() => {
    localStorage.setItem("pomodoroSessions", sessions);
  }, [sessions]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div style={{ border: "1px solid gray", padding: "20px", marginTop: "20px" }}>
      
      <h2>{isBreak ? "Break Time ☕" : "Focus Time 🎯"}</h2>

      <p>🔥 Completed Sessions: {sessions}</p>

      <h1>
        {minutes}:{seconds < 10 ? "0" : ""}{seconds}
      </h1>

      <button onClick={() => setRunning(true)}>Start</button>

      <button onClick={() => setRunning(false)}>Pause</button>

      <button
        onClick={() => {
          setRunning(false);
          setTime(isBreak ? 5 * 60 : 25 * 60);
        }}
      >
        Reset
      </button>

    </div>
  );
}