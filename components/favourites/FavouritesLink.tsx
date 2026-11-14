"use client";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavourites } from "./FavouritesProvider";

export default function FavouritesLink() {
  const { slugs } = useFavourites();
  return (
    <Link rel="nofollow" href="/favourites" className="relative p-2 rounded-full hover:bg-blush" aria-label={`Favourites, ${slugs.length} saved`}>
      <Heart className="w-5 h-5" />
      {slugs.length > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-rose-500 text-white text-[11px] font-bold grid place-items-center">{slugs.length}</span>
      )}
    </Link>
  );
}
