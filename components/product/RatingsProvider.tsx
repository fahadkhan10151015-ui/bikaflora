"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { restGet } from "@/lib/rest";
import { ratingMap } from "@/lib/reviews-data";

/** Real star ratings from customer reviews (Supabase), shared by every card and product page. */
type Agg = { avg: number; count: number };
type Ctx = { get: (slug: string) => Agg | undefined; reload: () => void };
const RatingsCtx = createContext<Ctx>({ get: () => undefined, reload: () => {} });

export function RatingsProvider({ children }: { children: React.ReactNode }) {
  const [map, setMap] = useState<Record<string, Agg>>(ratingMap); // in the HTML from the start, then refreshed
  const load = useCallback(async () => {
    const data = await restGet<{ product_slug: string; rating: number }[]>("reviews?select=product_slug,rating&limit=5000");
    if (!data) return;
    const m: Record<string, { sum: number; count: number }> = {};
    data.forEach((r: { product_slug: string; rating: number }) => {
      m[r.product_slug] ??= { sum: 0, count: 0 };
      m[r.product_slug].sum += r.rating;
      m[r.product_slug].count += 1;
    });
    setMap(Object.fromEntries(Object.entries(m).map(([k, v]) => [k, { avg: v.sum / v.count, count: v.count }])));
  }, []);
  // Refresh after the page is idle (keeps the Supabase library off the first load).
  useEffect(() => { const t = setTimeout(load, 4000); return () => clearTimeout(t); }, [load]);
  return <RatingsCtx.Provider value={{ get: (s) => map[s], reload: load }}>{children}</RatingsCtx.Provider>;
}

export const useRatings = () => useContext(RatingsCtx);
