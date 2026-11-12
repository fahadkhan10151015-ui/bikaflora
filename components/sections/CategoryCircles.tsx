"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { categories } from "@/data/categories";

/** "Shop by category": round photos that slide by themselves; customers can also swipe or use the arrows. */
export default function CategoryCircles({ compact = false }: { compact?: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const pausedUntil = useRef(0);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const item = el.querySelector("a")?.getBoundingClientRect().width || 100;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else el.scrollBy({ left: dir * (item + 16), behavior: "smooth" });
  };

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => {
      const el = track.current;
      if (!el || Date.now() < pausedUntil.current || el.scrollWidth <= el.clientWidth + 4) return;
      step(1);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const pause = () => (pausedUntil.current = Date.now() + 7000);

  return (
    <section className={`container-x ${compact ? "mt-6" : "mt-10 md:mt-14"}`} aria-labelledby="shop-by-category">
      <div className="flex items-end justify-between mb-4 md:mb-6">
        <div>
          {!compact && <div className="eyebrow mb-1">Browse</div>}
          <h2 id="shop-by-category" className={compact ? "text-xl sm:text-2xl font-semibold" : "text-[22px] sm:text-3xl md:text-4xl font-semibold"}>Shop by category</h2>
        </div>
        <div className="hidden sm:flex gap-2">
          <button onClick={() => { pause(); step(-1); }} className="w-10 h-10 rounded-full border border-brand/25 grid place-items-center hover:bg-blush" aria-label="Previous categories"><ChevronLeft className="w-5 h-5" /></button>
          <button onClick={() => { pause(); step(1); }} className="w-10 h-10 rounded-full border border-brand/25 grid place-items-center hover:bg-blush" aria-label="More categories"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>
      <div ref={track} onPointerDown={pause} onTouchStart={pause} onMouseEnter={pause} onWheel={pause}
        className="-mx-4 px-4 md:mx-0 md:px-0 flex gap-4 md:gap-7 overflow-x-auto snap-x scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((c) => (
          <Link key={c.slug} href={`/category/${c.slug}`} className="group snap-start shrink-0 w-[76px] sm:w-[100px] md:w-[124px] text-center">
            <span className="block p-[3px] rounded-full bg-gradient-to-br from-gold via-petal to-brand shadow-md shadow-brand/10 group-hover:scale-105 transition">
              <span className="relative block aspect-square rounded-full overflow-hidden border-[3px] border-cream bg-blush">
                <Image src={c.image} alt={c.name} fill sizes="124px" className="object-cover group-hover:scale-110 transition duration-500" />
              </span>
            </span>
            <span className="mt-2 block text-[11px] sm:text-sm font-medium leading-tight line-clamp-2 group-hover:text-brand">{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
