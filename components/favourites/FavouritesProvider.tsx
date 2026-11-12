"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

/** Saved (hearted) bouquets, kept in the browser so they survive page changes and visits. */
type Ctx = { slugs: string[]; isFav: (slug: string) => boolean; toggle: (slug: string) => void; ready: boolean };
const FavCtx = createContext<Ctx | null>(null);
const KEY = "bf_favourites";

export function FavouritesProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { setSlugs(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch { /* ignore */ }
    setReady(true);
  }, []);
  const toggle = useCallback((slug: string) => {
    setSlugs((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev];
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);
  return <FavCtx.Provider value={{ slugs, ready, toggle, isFav: (s) => slugs.includes(s) }}>{children}</FavCtx.Provider>;
}

export function useFavourites() {
  const ctx = useContext(FavCtx);
  if (!ctx) throw new Error("useFavourites must be used inside FavouritesProvider");
  return ctx;
}
