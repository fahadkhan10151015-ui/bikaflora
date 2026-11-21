"use client";
import Link from "next/link";
import FillImage from "@/components/ui/FillImage";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** "Shop by category": round photos that move slowly and continuously right to left; customers can also swipe or use the arrows. */
export default function CategoryCirclesClient({ compact = false, categories }: { compact?: boolean; categories: { slug: string; name: string; image: string }[] }) {
  const track = useRef<HTMLDivElement>(null);
  const pausedUntil = useRef(0);

  const loopWidth = () => {
    const el = track.current;
    const n = categories.length;
    if (!el || el.children.length < n * 2) return 0;
    return (el.children[n] as HTMLElement).offsetLeft - (el.children[0] as HTMLElement).offsetLeft;
  };

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const item = el.querySelector("a")?.getBoundingClientRect().width || 100;
    const w = loopWidth();
    // Jump to the matching spot in the other copy first, so the arrows never hit an end.
    if (w && dir === -1 && el.scrollLeft < item + 20) el.scrollLeft += w;
    if (w && dir === 1 && el.scrollLeft >= w) el.scrollLeft -= w;
    el.scrollBy({ left: dir * (item + 16), behavior: "smooth" });
  };

  // Moves slowly and continuously right to left, never stopping on its own (about 35px a second).
  // The list is shown twice so it loops with no jump. It only waits while a customer is actually swiping it.
  useEffect(() => {
    const el = track.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const SPEED = 35; // px per second
    let raf = 0, last = 0, visible = true, pos = el.scrollLeft, held = false;
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      const dt = last ? Math.min(t - last, 50) : 0;
      last = t;
      const w = loopWidth();
      if (!visible || document.hidden || !w || el.scrollWidth <= el.clientWidth + 4) return;
      if (Date.now() < pausedUntil.current) { held = true; return; }
      if (held) { pos = el.scrollLeft; held = false; } // carry on from where the customer left it
      pos += (SPEED * dt) / 1000;
      if (pos >= w) pos -= w;
      el.scrollLeft = pos;
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(el);
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [categories.length]);

  const pause = () => (pausedUntil.current = Date.now() + 1500);

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
      <div ref={track} onPointerDown={pause} onTouchMove={pause} onWheel={pause}
        className="-mx-4 px-4 md:mx-0 md:px-0 flex gap-4 md:gap-7 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {[...categories, ...categories].map((c, i) => {
          const copy = i >= categories.length; // second copy is only for the seamless loop
          return (
          <Link key={c.slug + (copy ? "-2" : "")} href={`/category/${c.slug}`} aria-hidden={copy || undefined} tabIndex={copy ? -1 : undefined} className="group shrink-0 w-[76px] sm:w-[100px] md:w-[124px] text-center">
            <span className="block p-[3px] rounded-full bg-gradient-to-br from-gold via-petal to-brand shadow-md shadow-brand/10 group-hover:scale-105 transition">
              <span className="relative block aspect-square rounded-full overflow-hidden border-[3px] border-cream bg-blush">
                <FillImage src={c.image} alt={c.name} w={124} h={124} className="object-cover group-hover:scale-110 transition duration-500" />
              </span>
            </span>
            <span className="mt-2 block text-[11px] sm:text-sm font-medium leading-tight line-clamp-2 group-hover:text-brand">{c.name}</span>
          </Link>
          );
        })}
      </div>
    </section>
  );
}
