import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Apply saved dark mode preference on load
const savedPrefs = localStorage.getItem("mindspace-prefs");
if (savedPrefs) {
  const { darkMode } = JSON.parse(savedPrefs);
  if (darkMode) document.documentElement.classList.add("dark");
}

createRoot(document.getElementById("root")!).render(<App />);
