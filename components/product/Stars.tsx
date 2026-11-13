"use client";
import { Star } from "lucide-react";
import { useRatings } from "./RatingsProvider";

/** Star rating from real customer reviews. Shows nothing until a product has its first review. */
export default function Stars({ slug, className = "" }: { slug: string; className?: string }) {
  const r = useRatings().get(slug);
  if (!r) return null;
  const full = Math.round(r.avg);
  return (
    <div className={`flex items-center gap-1 text-[11px] sm:text-xs ${className}`} aria-label={`Rated ${r.avg.toFixed(1)} out of 5 from ${r.count} review${r.count > 1 ? "s" : ""}`}>
      <span className="flex" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${i < full ? "fill-gold text-gold" : "text-blush-2 fill-blush-2"}`} />
        ))}
      </span>
      <span className="font-semibold text-ink">{r.avg.toFixed(1)}</span>
      <span className="text-muted">({r.count})</span>
    </div>
  );
}
