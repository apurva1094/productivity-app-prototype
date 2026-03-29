import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  
  // ✅ Pre-bundle Firebase modules so Vercel/Vite doesn't fail
  optimizeDeps: {
    include: ["firebase/app", "firebase/auth", "firebase/firestore"]
  }
});