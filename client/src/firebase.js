// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔑 Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC1S3PCZuE88ZhuSoBLgDatpPGX57_SvPY",
  authDomain: "productivity-app-prototype.firebaseapp.com",
  projectId: "productivity-app-prototype",
  storageBucket: "productivity-app-prototype.appspot.com",
  messagingSenderId: "116214554157",
  appId: "1:116214554157:web:b3b844937f69e080c7a2a4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth, firestore, and Google provider
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;