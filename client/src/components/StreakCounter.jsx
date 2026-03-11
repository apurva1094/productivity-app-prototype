import { useEffect, useState } from "react";

function StreakCounter({ tasks }) {

  const [streak, setStreak] = useState(0);

  useEffect(() => {

    const storedStreak = JSON.parse(localStorage.getItem("studyStreak")) || {
      count: 0,
      lastDate: null
    };

    const today = new Date().toDateString();

    const completedToday = tasks.some(
      (task) =>
        task.completed &&
        new Date(task.completedAt).toDateString() === today
    );

    if (completedToday) {

      if (storedStreak.lastDate !== today) {

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (
          storedStreak.lastDate === yesterday.toDateString()
        ) {
          storedStreak.count += 1;
        } else {
          storedStreak.count = 1;
        }

        storedStreak.lastDate = today;

        localStorage.setItem(
          "studyStreak",
          JSON.stringify(storedStreak)
        );
      }
    }

    setStreak(storedStreak.count);

  }, [tasks]);

  return (
    <div className="streak-box">
      🔥 Study Streak: <strong>{streak} days</strong>
    </div>
  );
}

export default StreakCounter;