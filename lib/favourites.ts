"use client";
import { useEffect, useState, useCallback } from "react";
const KEY = "bf_favourites";
const read = (): string[] => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } };

export function useFavourites() {
  const [list, setList] = useState<string[]>([]);
  useEffect(() => {
    setList(read());
    const h = () => setList(read());
    window.addEventListener("bf-fav", h);
    return () => window.removeEventListener("bf-fav", h);
  }, []);
  const toggle = useCallback((slug: string) => {
    const cur = read();
    const next = cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug];
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    setList(next);
    window.dispatchEvent(new Event("bf-fav"));
  }, []);
  return { list, has: (s: string) => list.includes(s), toggle };
}
