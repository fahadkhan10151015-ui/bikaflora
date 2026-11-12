"use client";
import { Heart } from "lucide-react";
import { useFavourites } from "./FavouritesProvider";

/** Tap to save / unsave a bouquet. */
export default function HeartButton({ slug, name, className = "" }: { slug: string; name: string; className?: string }) {
  const { isFav, toggle } = useFavourites();
  const on = isFav(slug);
  return (
    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(slug); }} aria-pressed={on}
      aria-label={on ? `Remove ${name} from favourites` : `Save ${name} to favourites`}
      className={`grid place-items-center rounded-full bg-white/90 backdrop-blur shadow-md transition hover:scale-110 ${className}`}>
      <Heart className={`w-[55%] h-[55%] transition ${on ? "fill-rose-500 text-rose-500" : "text-ink"}`} />
    </button>
  );
}
