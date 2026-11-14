"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/** Light / dark switch. Light is the default; the choice is remembered on this device. */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("bf-theme", next ? "dark" : "light"); } catch {}
  };
  return (
    <button type="button" onClick={toggle} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} title={dark ? "Light mode" : "Dark mode"}
      className={`grid place-items-center w-9 h-9 rounded-full hover:bg-blush transition ${className}`}>
      {dark ? <Sun className="w-5 h-5 text-gold" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
