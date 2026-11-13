"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * "Moments" 3D card carousel (before the video, after the FAQ).
 * Photos: free Pexels licence, stored in /public/images/moments/. They show the kind of moments
 * our bouquets are for. Swap in real customer photos (with permission) any time.
 * Moves one card every 3 seconds; visitors can swipe / drag or tap a side card. No arrows.
 */
const moments = [
  { img: "surprise", title: "Surprise Moments", text: "The look when the roses arrive", href: "/product/365-days-of-love" },
  { img: "proposal", title: "Proposals", text: "Say \"will you\" with a grand bouquet", href: "/product/52-roses-heart" },
  { img: "birthday", title: "Birthdays", text: "Cake, candles and her favourite flowers", href: "/category/best-seller" },
  { img: "anniversary", title: "Anniversaries", text: "Another year of loving you", href: "/product/pink-white-rose-heart-large" },
  { img: "doorstep", title: "Doorstep Delivery", text: "Delivered today, any time in KL & Selangor", href: "/shop" },
  { img: "birthday-party", title: "Birthday Parties", text: "Make the celebration bloom", href: "/category/below-100" },
  { img: "just-because", title: "Just Because", text: "No reason needed to say I love you", href: "/product/hearts-desire" },
  { img: "proposal-night", title: "Engagement Nights", text: "Lights, a ring and red roses", href: "/category/pre-order" },
  { img: "date-day", title: "Date Days", text: "Flowers that make the day", href: "/category/premium-bouquets" },
  { img: "forever", title: "Forever Moments", text: "Roses that last as long as the memory", href: "/product/red-soap-rose-heart-large" },
];

const STEP_MS = 3000;

export default function MomentsCarousel() {
  const n = moments.length;
  const [active, setActive] = useState(0);
  const [wide, setWide] = useState(true);
  const [paused, setPaused] = useState(false);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(min-width: 768px)");
    const on = () => setWide(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);

  // Only run while on screen (saves battery, and visitors see it start from the first card).
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const go = useCallback((d: number) => setActive((a) => (a + d + n) % n), [n]);

  useEffect(() => {
    if (!visible || paused) return;
    const t = setTimeout(() => go(1), STEP_MS);
    return () => clearTimeout(t);
  }, [active, visible, paused, go]);

  const onDown = (x: number) => { drag.current = { x, moved: false }; setPaused(true); };
  const onMove = (x: number) => {
    const d = drag.current;
    if (!d || d.moved) return;
    if (Math.abs(x - d.x) > 40) { d.moved = true; go(x < d.x ? 1 : -1); }
  };
  const onUp = () => { setTimeout(() => (drag.current = null), 0); setPaused(false); };

  const spacing = wide ? 230 : 120;
  const reach = wide ? 2 : 1;

  return (
    <section ref={root} className="mt-24 overflow-hidden" aria-roledescription="carousel" aria-labelledby="moments-title">
      <div className="container-x">
        <span className="inline-block rounded-lg bg-blush px-3.5 py-1.5 text-xs font-semibold tracking-[0.2em] uppercase text-brand">Moments that bloom</span>
        <h2 id="moments-title" className="mt-4 text-3xl md:text-5xl font-semibold">Flowers for every love story</h2>
        <p className="mt-3 text-muted max-w-2xl">Proposals, birthdays, anniversaries and little surprises. Tap a moment to find the bouquet for yours.</p>
        <div className="mt-6 h-px bg-blush-2" />
      </div>

      <div
        className="relative mx-auto mt-10 h-[440px] md:h-[560px] select-none touch-pan-y [perspective:1600px]"
        onPointerDown={(e) => onDown(e.clientX)}
        onPointerMove={(e) => onMove(e.clientX)}
        onPointerUp={onUp}
        onPointerLeave={() => drag.current && onUp()}
      >
        {moments.map((m, i) => {
          let off = i - active;
          if (off > n / 2) off -= n;
          if (off < -n / 2) off += n;
          const abs = Math.abs(off);
          const show = abs <= reach;
          const center = off === 0;
          const style = {
            transform: `translateX(calc(-50% + ${off * spacing}px)) translateZ(${-abs * 120}px) rotateY(${Math.max(-2, Math.min(2, off)) * -14}deg) scale(${center ? 1 : 1 - abs * 0.08})`,
            zIndex: 20 - abs,
            opacity: show ? (center ? 1 : 1 - abs * 0.18) : 0,
            pointerEvents: show ? ("auto" as const) : ("none" as const),
          };
          const card = (
            <div className={`relative w-full h-full rounded-[22px] overflow-hidden bg-deep transition-shadow duration-700 ${center ? "ring-4 ring-gold/80 shadow-[0_30px_70px_-20px_rgba(16,23,42,.55)]" : "shadow-[0_20px_50px_-25px_rgba(16,23,42,.45)]"}`}>
              <Image src={`/images/moments/${m.img}.webp`} alt={m.title} fill sizes="(min-width: 768px) 330px, 240px" quality={80} draggable={false}
                className={`object-cover transition duration-700 ${center ? "" : "saturate-[.75] brightness-[.92]"}`} />
              <div className={`absolute inset-0 transition duration-700 ${center ? "bg-gradient-to-t from-deep/90 via-deep/10 to-transparent" : "bg-gradient-to-t from-deep/80 via-white/10 to-white/25"}`} />
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-white">
                <div className="font-serif text-xl md:text-2xl font-semibold leading-tight">{m.title}</div>
                <div className="text-xs md:text-sm text-white/85 mt-1 line-clamp-1">{m.text}</div>
                {center && <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-white text-brand text-xs font-semibold px-3 py-1.5">Shop for this moment →</span>}
              </div>
            </div>
          );
          return (
            <div key={m.img} aria-hidden={!show} className="absolute left-1/2 top-4 w-[230px] h-[330px] md:w-[330px] md:h-[460px] transition-all duration-700 ease-[cubic-bezier(.22,.8,.26,1)] [transform-style:preserve-3d]" style={style}>
              {center ? (
                <Link href={m.href} draggable={false} onClick={(e) => drag.current?.moved && e.preventDefault()} className="block w-full h-full" aria-label={`${m.title}: shop bouquets`}>{card}</Link>
              ) : (
                <button type="button" tabIndex={show ? 0 : -1} onClick={() => !drag.current?.moved && setActive(i)} className="block w-full h-full cursor-pointer" aria-label={`Show ${m.title}`}>{card}</button>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-1.5 -mt-4 md:-mt-6" aria-hidden="true">
        {moments.map((m, i) => <span key={m.img} className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-6 bg-gold" : "w-1.5 bg-blush-2"}`} />)}
      </div>
    </section>
  );
}
