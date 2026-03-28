import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

import Auth from "./components/Auth";
import MainApp from "./MainApp";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 Loading screen
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>⏳ Loading...</h2>
      </div>
    );
  }

  return (
    <div>
      {user ? (
        <>
          {/* 🔥 HEADER */}
          <div className="app-header">
            <div className="user-info">
              👤 {user.email}
            </div>

            <button
              className="logout-btn"
              onClick={() => signOut(auth)}
            >
              Logout
            </button>
          </div>

          {/* 🔥 MAIN APP */}
          <MainApp user={user} />
        </>
      ) : (
        <Auth />
      )}
    </div>
  );
}

export default App;