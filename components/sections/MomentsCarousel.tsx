"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { getProduct } from "@/data/products";
import { formatPrice } from "@/lib/site";

/**
 * "Moments" 3D card carousel (before the video, after the FAQ).
 * Each card: a moment photo (free Pexels licence, /public/images/moments/) + OUR bouquet as a cut-out badge
 * (/public/images/badges/<product>.webp) with its name and price. Replace a photo with your own any time
 * (same file name). Moves one card every 2.3 seconds; swipe / drag / tap a side card. No arrows.
 */
const moments = [
  { photo: "proposal", slug: "red-soap-rose-heart-large", title: "Proposals", text: "The moment she says yes" },
  { photo: "nikah", slug: "pink-soap-rose-heart-large", title: "Nikah & Weddings", text: "For the happiest day" },
  { photo: "graduation", slug: "graduation-signature", title: "Graduation Day", text: "Celebrate the big day in style" },
  { photo: "anniversary", slug: "365-days-of-love", title: "Anniversaries", text: "Another year of loving you" },
  { photo: "birthday", slug: "pink-charm", title: "Birthdays", text: "Make her wish come true" },
  { photo: "date-day", slug: "ferrero-rocher-red-roses", title: "Date Day", text: "Roses and chocolate for two" },
  { photo: "convocation", slug: "graduates-sunshine", title: "Convocation", text: "Sunflowers for a bright future" },
  { photo: "engagement", slug: "pink-white-rose-heart-large", title: "Engagements", text: "A heart full of roses" },
  { photo: "mothers-day", slug: "everlasting-stem", title: "Mother's Day", text: "Thank you, Mama" },
].flatMap((m) => {
  const p = getProduct(m.slug);
  return p ? [{ ...m, src: `/images/moments/${m.photo}-2.webp`, badge: `/images/badges/${m.slug}.webp`, product: p.name, price: p.price, href: `/product/${p.slug}` }] : [];
});

const STEP_MS = 2300;

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
        <h2 id="moments-title" className="mt-4 text-3xl md:text-5xl font-semibold">A bouquet for every moment</h2>
        <p className="mt-3 text-muted max-w-2xl">Proposals, birthdays, graduations, anniversaries and little surprises. Tap a card to see the bouquet.</p>
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
              <Image src={m.src} alt={m.title} fill sizes="(min-width: 768px) 330px, 240px" quality={80} draggable={false}
                className={`object-cover transition duration-700 ${center ? "" : "saturate-[.75] brightness-[.92]"}`} />
              <div className={`absolute inset-0 transition duration-700 ${center ? "bg-gradient-to-t from-deep/90 via-deep/10 to-transparent" : "bg-gradient-to-t from-deep/80 via-white/10 to-white/25"}`} />
              {/* Our bouquet, floating as a badge */}
              <div className={`absolute right-2 md:right-3 bottom-[4.6rem] md:bottom-[5.2rem] w-[42%] aspect-square transition duration-700 ${center ? "opacity-100 scale-100" : "opacity-90 scale-90"}`}>
                <div className="absolute inset-[12%] rounded-full bg-white/70 blur-xl" />
                <Image src={m.badge} alt={m.product} fill sizes="160px" quality={85} draggable={false} className="object-contain drop-shadow-[0_10px_14px_rgba(0,0,0,.45)] moment-float" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-white">
                <div className="font-serif text-xl md:text-2xl font-semibold leading-tight">{m.title}</div>
                <div className="text-xs md:text-sm text-white/85 mt-1 line-clamp-1">{m.text}</div>
                <span className={`mt-3 flex items-center justify-between gap-2 rounded-full bg-white/95 text-brand text-xs font-semibold pl-3 pr-1 py-1 transition ${center ? "opacity-100" : "opacity-0"}`}>
                  <span className="truncate">{m.product}</span>
                  <span className="shrink-0 rounded-full bg-brand text-white px-2.5 py-1">{formatPrice(m.price)}</span>
                </span>
              </div>
            </div>
          );
          return (
            <div key={m.photo} aria-hidden={!show} className="absolute left-1/2 top-4 w-[230px] h-[330px] md:w-[330px] md:h-[460px] transition-all duration-700 ease-[cubic-bezier(.22,.8,.26,1)] [transform-style:preserve-3d]" style={style}>
              {center ? (
                <Link href={m.href} draggable={false} onClick={(e) => drag.current?.moved && e.preventDefault()} className="block w-full h-full" aria-label={`${m.title}: ${m.product}`}>{card}</Link>
              ) : (
                <button type="button" tabIndex={show ? 0 : -1} onClick={() => !drag.current?.moved && setActive(i)} className="block w-full h-full cursor-pointer" aria-label={`Show ${m.title}`}>{card}</button>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-1.5 -mt-4 md:-mt-6" aria-hidden="true">
        {moments.map((m, i) => <span key={m.photo} className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-6 bg-gold" : "w-1.5 bg-blush-2"}`} />)}
      </div>
    </section>
  );
}
