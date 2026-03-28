import React, { useState, useEffect, useRef } from "react";

const WORK_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

const FocusTimer = ({ onPomodoroEnd }) => {
  const [secondsLeft, setSecondsLeft] = useState(WORK_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("work"); // work / break
  const intervalRef = useRef(null);
  const progressRef = useRef(null);

  // ▶️ Start / Pause / Reset
  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);

  const resetTimer = () => {
    setIsRunning(false);
    setMode("work");
    setSecondsLeft(WORK_SECONDS);
  };

  // ⏳ Timer Logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);

            if (mode === "work") {
              // switch to break
              setMode("break");
              setSecondsLeft(BREAK_SECONDS);

              if (onPomodoroEnd) onPomodoroEnd();
            } else {
              // switch back to work
              setMode("work");
              setSecondsLeft(WORK_SECONDS);
            }

            return prev;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode]);

  // 🔵 Ring Animation
  useEffect(() => {
    const total = mode === "work" ? WORK_SECONDS : BREAK_SECONDS;
    const progress = total - secondsLeft;
    const circumference = 2 * Math.PI * 110; // ≈ 692
    const offset = circumference - (circumference * progress) / total;

    if (progressRef.current) {
      progressRef.current.style.strokeDashoffset = offset;
    }
  }, [secondsLeft, mode]);

  // ⏱ Format Time
  const formatTime = (secs) => {
    const min = Math.floor(secs / 60).toString().padStart(2, "0");
    const sec = (secs % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <div className="pomodoro-wrapper">
      <div className="streak">🔥 Pomodoro Streak</div>

      <div className="pomodoro-title">
        {mode === "work" ? "💼 Work Session" : "☕ Break Time"}
      </div>

      <div className="pomodoro-container">
        <svg className="pomodoro-ring" viewBox="0 0 260 260">

          <defs>
            <linearGradient id="gradient">
              <stop offset="0%" stopColor="#ff5722" />
              <stop offset="100%" stopColor="#ff9800" />
            </linearGradient>
          </defs>

          <circle className="bg" cx="130" cy="130" r="110" />

          <circle
            ref={progressRef}
            className="progress"
            cx="130"
            cy="130"
            r="110"
          />
        </svg>

        <div className="time-display">
          {formatTime(secondsLeft)}
        </div>
      </div>

      <div className="pomodoro-buttons">
        {!isRunning ? (
          <button onClick={startTimer}>Start</button>
        ) : (
          <button onClick={pauseTimer}>Pause</button>
        )}
        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
};

export default FocusTimer;