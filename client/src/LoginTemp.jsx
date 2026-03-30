// src/LoginTemp.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
    } catch (err) {
      setError(err.message);
    }
  };

  const signInWithGoogle = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <button type="button" className="google-login-btn" onClick={signInWithGoogle}>
          Sign in with Google
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;