// src/App.jsx
import React, { useState, useEffect } from "react";
import Login from "./LoginTemp";
import MainApp from "./MainApp";
import { auth, googleProvider } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./style.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>⏳ Loading...</h2>
      </div>
    );
  }

  // If not logged in, show login page
  if (!user) return <Login setUser={setUser} />;

  // If logged in, show MainApp
  return (
    <MainApp
      user={user}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
    />
  );
}

export default App;