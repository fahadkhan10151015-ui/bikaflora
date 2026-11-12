import { Star } from "lucide-react";

/** Compact star rating: ★★★★★ 4.9 (128) */
export default function Stars({ rating, reviews, className = "" }: { rating?: number; reviews?: number; className?: string }) {
  if (!rating) return null;
  const full = Math.round(rating);
  return (
    <div className={`flex items-center gap-1 text-[11px] sm:text-xs ${className}`} aria-label={`Rated ${rating} out of 5${reviews ? ` from ${reviews} reviews` : ""}`}>
      <span className="flex" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${i < full ? "fill-gold text-gold" : "text-blush-2 fill-blush-2"}`} />
        ))}
      </span>
      <span className="font-semibold text-ink">{rating.toFixed(1)}</span>
      {reviews ? <span className="text-muted">({reviews})</span> : null}
    </div>
  );
}
