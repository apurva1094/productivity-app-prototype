// src/App.jsx
import React, { useState, useEffect } from "react";
import Auth from "./components/Auth.jsx"; // ✅ default import
import MainApp from "./MainApp.jsx";
import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
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

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>⏳ Loading...</h2>
      </div>
    );

  if (!user) return <Auth setUser={setUser} />;

  return (
    <div>
      {/* HEADER */}
      <div className="top-bar">
       <div className="user-info" style={{ color: darkMode ? "#fff" : "#333" }}></div>
        
      </div>

      {/* MAIN APP */}
      <MainApp user={user} darkMode={darkMode} setDarkMode={setDarkMode}/>
    </div>
  );
}

export default App; // ✅ default export