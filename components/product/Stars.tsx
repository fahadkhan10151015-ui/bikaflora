"use client";
import { Star } from "lucide-react";
import { useRatings } from "./RatingsProvider";

/**
 * Star rating from real customer reviews only (never invented).
 * With no reviews yet: `size="sm"` (cards) shows grey stars + "New", `size="lg"` (product page) invites the first review.
 */
export default function Stars({ slug, size = "sm", className = "" }: { slug: string; size?: "sm" | "lg"; className?: string }) {
  const r = useRatings().get(slug);
  const lg = size === "lg";
  const star = lg ? "w-4 h-4" : "w-3.5 h-3.5";
  const full = r ? Math.round(r.avg) : 0;
  return (
    <div className={`flex items-center gap-1.5 ${lg ? "text-sm" : "text-xs"} ${className}`}
      aria-label={r ? `Rated ${r.avg.toFixed(1)} out of 5 from ${r.count} review${r.count > 1 ? "s" : ""}` : "No reviews yet"}>
      <span className="flex gap-px" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={`${star} ${i < full ? "fill-amber-400 text-amber-400" : r ? "fill-gray-200 text-gray-300" : "fill-transparent text-amber-400"}`} />
        ))}
      </span>
      {r ? (
        <>
          <span className="font-semibold text-ink">{r.avg.toFixed(1)}</span>
          {lg ? <a href="#reviews" className="text-muted underline underline-offset-2 hover:text-brand">{r.count} review{r.count > 1 ? "s" : ""}</a> : <span className="text-muted">({r.count})</span>}
        </>
      ) : lg ? (
        <a href="#reviews" className="text-muted underline underline-offset-2 hover:text-brand">No reviews yet. Be the first to review</a>
      ) : (
        <span className="text-muted">New</span>
      )}
    </div>
  );
}
