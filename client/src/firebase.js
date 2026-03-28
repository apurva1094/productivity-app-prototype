import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC1S3PCZuE88ZhuSoBLgDatpPGX57_SvPY",
  authDomain: "productivity-app-prototype.firebaseapp.com",
  projectId: "productivity-app-prototype",
  storageBucket: "productivity-app-prototype.appspot.com",
  messagingSenderId: "116214554157",
  appId: "1:116214554157:web:b3b844937f69e080c7a2a4"
};

// ✅ FIRST initialize app
const app = initializeApp(firebaseConfig);

// ✅ THEN use it
export const auth = getAuth(app);
export const db = getFirestore(app);