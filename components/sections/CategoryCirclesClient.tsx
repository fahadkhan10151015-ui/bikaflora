"use client";
import Link from "next/link";
import FillImage from "@/components/ui/FillImage";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** "Shop by category": round photos that slide one by one, right to left, on their own; customers can also swipe or use the arrows. */
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

  // One category at a time: wait, then slide smoothly by one circle (right to left), and repeat.
  // The list is shown twice so it loops with no jump back to the start.
  // It pauses while someone touches, hovers or swipes, when it is off screen, and when the tab is hidden.
  useEffect(() => {
    const el = track.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const WAIT = 2200, SLIDE = 1100; // ms still, ms moving
    let visible = false, raf = 0, timer = 0;
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const slideOne = () => {
      const w = loopWidth();
      if (!visible || document.hidden || Date.now() < pausedUntil.current || !w || el.scrollWidth <= el.clientWidth + 4) { timer = window.setTimeout(slideOne, 600); return; }
      const a = el.querySelector("a") as HTMLElement | null;
      const gap = parseFloat(getComputedStyle(el).columnGap) || 16;
      const dist = (a?.offsetWidth || 100) + gap;
      let from = el.scrollLeft;
      if (from >= w) { from -= w; el.scrollLeft = from; } // hop to the same spot in the first copy (looks identical)
      // Line up with the nearest circle so every move ends neatly on one.
      const target = Math.round((from + dist) / dist) * dist;
      const t0 = performance.now();
      const frame = (t: number) => {
        if (Date.now() < pausedUntil.current) { timer = window.setTimeout(slideOne, 600); return; } // customer took over
        const k = Math.min((t - t0) / SLIDE, 1);
        el.scrollLeft = from + (target - from) * ease(k);
        if (k < 1) raf = requestAnimationFrame(frame);
        else timer = window.setTimeout(slideOne, WAIT);
      };
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(el);
    timer = window.setTimeout(slideOne, WAIT);
    return () => { cancelAnimationFrame(raf); clearTimeout(timer); io.disconnect(); };
  }, [categories.length]);

  const pause = () => (pausedUntil.current = Date.now() + 4000);

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
      <div ref={track} onPointerDown={pause} onTouchStart={pause} onTouchMove={pause} onMouseEnter={pause} onMouseMove={pause} onWheel={pause}
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
