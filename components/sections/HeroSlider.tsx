"use client";
import Link from "next/link";
import FillImage from "@/components/ui/FillImage";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import Petals from "./Petals";
import { siteImages } from "@/lib/images";
import HeroStage, { type StageSlide } from "./HeroStage";
import { Rose, Daisy, Sunflower, GoldBall, Sprig, Orchid, Leaf } from "./Flowers";
import WhatsAppButton from "@/components/whatsapp/WhatsAppButton";

type Slide = StageSlide & { slug: string; bg: string; eyebrow: string; title: [string, string]; text: string };

/** Each slide shows one of our bouquets, with the same flowers it is made of floating around it. */
const slides: Slide[] = [
  {
    slug: "red-soap-rose-heart-large",
    bg: siteImages.klNight,
    image: "/images/hero/red-soap-rose-heart-large.webp",
    alt: "Red Soap Rose Heart Large bouquet",
    eyebrow: "Top Seller",
    title: ["25 roses,", "one heart"],
    text: "Our best-selling soap rose heart. It looks real, smells lovely and lasts for months. Same-day delivery across KL & Selangor, any time.",
    orbiters: [<Rose key="1" tint="red" />, <Sprig key="2" color="#b98a96" />, <Rose key="3" tint="red" />, <Leaf key="4" />, <Rose key="5" tint="blush" />],
  },
  {
    slug: "ferrero-rocher-pink-roses",
    bg: siteImages.klTowers,
    image: "/images/hero/ferrero-rocher-pink-roses.webp",
    alt: "Ferrero Rocher Pink Roses soap bouquet",
    eyebrow: "Sweet & long-lasting",
    title: ["Roses &", "Ferrero Rocher"],
    text: "Ten pink soap roses with seven Ferrero Rocher chocolates, wrapped as one sweet gift for someone special.",
    orbiters: [<Rose key="1" tint="pink" />, <GoldBall key="2" />, <Sprig key="3" color="#b0227a" />, <Rose key="4" tint="blush" />, <GoldBall key="5" />],
  },
  {
    slug: "graduation-signature",
    bg: siteImages.klCity,
    image: "/images/hero/graduation-signature.webp",
    alt: "The Graduation Signature soap bouquet with sunflowers and teddy",
    eyebrow: "Convocation season",
    title: ["Celebrate their", "big day"],
    text: "Sunflowers, blue and white roses and a little graduate teddy. Available in your university's colours on pre-order.",
    orbiters: [<Sunflower key="1" />, <Daisy key="2" />, <Rose key="3" tint="blue" />, <Sunflower key="4" />, <Rose key="5" tint="ivory" />],
  },
  {
    slug: "blue-noir-for-him",
    bg: siteImages.cover,
    image: "/images/hero/blue-noir-for-him.webp",
    alt: "Blue Noir For Him soap rose bouquet",
    eyebrow: "For him",
    title: ["Bold, elegant,", "made for him"],
    text: "Twenty-five blue and black soap roses in sleek black wrapping. A bouquet he will actually keep.",
    orbiters: [<Rose key="1" tint="blue" />, <Rose key="2" tint="black" />, <Orchid key="3" />, <Rose key="4" tint="blue" />, <Rose key="5" tint="black" />],
  },
];

const DURATION = 4000;
/** Slide 1: a florist making a bouquet from start to finish (Pexels clips 4621364-4621356, free licence, edited and stored on our site). Plays once, then the photo slides follow. */
const VIDEO_MS = 26000; // safety limit only; the slide moves on when the video ends (~15.6s)
const videoSlide = { eyebrow: "Handmade by our florists", title: ["Made by hand,", "start to finish"] as [string, string], text: "Every BikaFlora bouquet is hand-tied with care and delivered across KL & Selangor, any time." };

export default function HeroSlider() {
  const [active, setActive] = useState(0);
  const total = slides.length + 1;
  const isVideo = active === 0;
  const video = useRef<HTMLVideoElement>(null);
  // The 4 photo slides (backgrounds, bouquets, flowers) are only added a few seconds after the page
  // has loaded — the video slide shows first, so the first load stays light and fast.
  const [ready, setReady] = useState(false);
  const [changed, setChanged] = useState(false);
  useEffect(() => { if (active !== 0) { setReady(true); setChanged(true); } }, [active]);
  // Phones (portrait) get a vertical edit that fills the screen; tablets 720p; desktop 1080p.
  const [src, setSrc] = useState<{ v: string; p: string } | null>(null);
  useEffect(() => {
    const pick = () => {
      const w = window.innerWidth, portrait = window.innerHeight > w;
      setSrc(w < 768 || (portrait && w < 1024)
        ? { v: "/video/hero-making-vertical.mp4", p: "/video/hero-making-vertical-poster.webp" }
        : w < 1280 ? { v: "/video/hero-making-720.mp4", p: "/video/hero-making-poster.webp" }
        : { v: "/video/hero-making-1080.mp4", p: "/video/hero-making-poster.webp" });
    };
    // Start the video only after the page (photos, text) has loaded, so it doesn't slow them down.
    // The still poster image shows in the meantime.
    const idle = (fn: () => void, ms: number) => setTimeout(() => ("requestIdleCallback" in window ? (window as Window & { requestIdleCallback: (f: () => void) => void }).requestIdleCallback(fn) : fn()), ms);
    const startWhenLoaded = () => { idle(pick, 900); };
    if (document.readyState === "complete") startWhenLoaded();
    else window.addEventListener("load", startWhenLoaded, { once: true });
    const m = window.matchMedia("(orientation: portrait)");
    m.addEventListener("change", pick);
    return () => m.removeEventListener("change", pick);
  }, []);
  useEffect(() => {
    const v = video.current;
    if (!v || !src) return;
    if (!isVideo) { v.pause(); return; }
    // iPhone only autoplays when the video is muted *before* play() — set it on the element itself.
    v.muted = true; v.defaultMuted = true; v.playsInline = true;
    v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("webkit-playsinline", "");
    v.currentTime = 0;
    const start = () => { if (v.paused) v.play().catch(() => {}); };
    start();
    v.addEventListener("canplay", start);
    v.addEventListener("loadeddata", start);
    // If the phone still blocks autoplay (e.g. Low Power Mode), start on the first touch or scroll.
    const kick = () => start();
    const opts = { passive: true } as AddEventListenerOptions;
    window.addEventListener("touchstart", kick, opts);
    window.addEventListener("scroll", kick, opts);
    window.addEventListener("click", kick);
    return () => {
      v.removeEventListener("canplay", start); v.removeEventListener("loadeddata", start);
      window.removeEventListener("touchstart", kick); window.removeEventListener("scroll", kick); window.removeEventListener("click", kick);
    };
  }, [isVideo, src]);
  const [paused, setPaused] = useState(false);
  // Pause only while the visitor is on another browser tab.
  useEffect(() => {
    const v = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", v);
    return () => document.removeEventListener("visibilitychange", v);
  }, []);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % total), isVideo ? VIDEO_MS : DURATION);
    return () => clearTimeout(t);
  }, [active, paused, isVideo, total]);

  const go = (d: number) => setActive((a) => (a + d + total) % total);
  const s = isVideo ? videoSlide : slides[active - 1];

  return (
    <section className={`relative overflow-hidden bg-deep text-white ${changed ? "" : "hero-first"}`} aria-roledescription="carousel" aria-label="Featured bouquets"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}>
      {/* backgrounds: one per slide, cross-fading with a slow zoom */}
      {ready && slides.map((sl, i) => (
        <div key={sl.bg} className={`absolute inset-0 transition-opacity duration-[1400ms] ${i + 1 === active ? "opacity-100" : "opacity-0"}`} aria-hidden="true">
          <FillImage src={sl.bg} alt="" w={1080} h={720} quality={70}
            className={`object-cover object-center opacity-80 ${i + 1 === active ? "hero-bg-zoom" : ""}`} />
        </div>
      ))}
      {/* slide 1: video */}
      <div className={`absolute inset-0 transition-opacity duration-[1200ms] ${isVideo ? "opacity-100" : "opacity-0"}`} aria-hidden="true">
        {/* Still frame shown instantly (only the right size is downloaded); the video takes over once loaded. */}
        <picture>
          <source media="(min-width: 768px)" srcSet="/video/hero-making-poster.webp" width={1280} height={720} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/video/hero-making-vertical-poster.webp" alt="" width={540} height={960} fetchPriority="high" decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-center lg:object-[center_18%]" />
        </picture>
        {src && (
          <video key={src.v} ref={video} src={src.v} poster={src.p} muted playsInline autoPlay preload="auto" onEnded={() => setActive(1)}
            className="absolute inset-0 w-full h-full object-cover object-center lg:object-[center_18%] bg-deep" />
        )}
      </div>
      <div className={`absolute inset-0 bg-gradient-to-r from-deep/95 via-deep/65 to-deep/15 transition-opacity duration-700 ${isVideo ? "max-lg:opacity-0" : ""}`} />
      <div className={`absolute inset-0 transition-opacity duration-700 ${isVideo ? "bg-[linear-gradient(to_top,rgba(16,23,42,.95)_0%,rgba(16,23,42,.75)_40%,rgba(16,23,42,0)_65%)] md:bg-gradient-to-t md:from-deep/80 md:via-transparent md:to-deep/30" : "bg-gradient-to-t from-deep/80 via-transparent to-deep/30"}`} />
      <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-petal/10 blur-3xl" />
      {!isVideo && <Petals />}

      {/* arrows */}
      <button onClick={() => go(-1)} aria-label="Previous slide" className="hidden md:grid absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 border border-white/25 place-items-center hover:bg-white/20 transition"><ChevronLeft className="w-6 h-6" /></button>
      <button onClick={() => go(1)} aria-label="Next slide" className="hidden md:grid absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 border border-white/25 place-items-center hover:bg-white/20 transition"><ChevronRight className="w-6 h-6" /></button>

      <div className="relative container-x pt-8 pb-14 lg:py-16 grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
      <div className="max-w-2xl order-2 lg:order-1 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 glass !bg-white/10 border border-white/25 rounded-full px-4 py-1.5 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-gold" /> Florist in Kuala Lumpur & Selangor, Malaysia
        </div>
        <h1 className="sr-only">BikaFlora – soap flower bouquet delivery in Kuala Lumpur & Selangor</h1>

        <div key={active} className="hero-text-in" aria-live="polite">
          <p className="mt-6 text-sm uppercase tracking-[0.25em] text-gold font-semibold">{s.eyebrow}</p>
          <p className="mt-3 font-serif text-4xl sm:text-6xl xl:text-7xl font-semibold leading-[1.05]">
            {s.title[0]} <span className="italic text-petal">{s.title[1]}</span>
          </p>
          <p className="mt-5 text-lg text-white/80 leading-relaxed max-w-xl mx-auto lg:mx-0">{s.text}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
          <Link href="/shop" className="btn bg-white text-brand hover:bg-blush !px-7 !py-4">Shop Bouquets <ArrowRight className="w-4 h-4" /></Link>
          <WhatsAppButton label="Order on WhatsApp" className="btn btn-wa !px-7 !py-4 shadow-xl shadow-wa/30" />
        </div>

        {/* slide controls */}
        <div className="mt-8 flex items-center gap-2 justify-center lg:justify-start">
          <button onClick={() => go(-1)} aria-label="Previous slide" className="md:hidden w-8 h-8 rounded-full bg-white/10 grid place-items-center mr-1"><ChevronLeft className="w-4 h-4" /></button>
          <div className="flex items-center gap-2" role="tablist" aria-label="Featured bouquets">
          {["How we make a bouquet", ...slides.map((sl) => sl.alt)].map((label, i) => (
            <button key={label} role="tab" aria-selected={i === active} aria-label={`Show ${label}`} onClick={() => setActive(i)}
              className={`relative h-1.5 rounded-full overflow-hidden transition-all ${i === active ? "w-14 bg-white/25" : "w-6 bg-white/25 hover:bg-white/40"}`}>
              {i === active && <span key={`${active}-${paused}`} className={`absolute inset-y-0 left-0 bg-gold ${paused ? "w-full" : "hero-progress"}`} style={{ animationDuration: `${isVideo ? 15600 : DURATION}ms` }} />}
            </button>
          ))}
          </div>
          <button onClick={() => go(1)} aria-label="Next slide" className="md:hidden w-8 h-8 rounded-full bg-white/10 grid place-items-center ml-1"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
      <div className={`order-1 lg:order-2 transition-opacity duration-700 ${isVideo ? "opacity-0 pointer-events-none" : "opacity-100"}`}>{ready ? <HeroStage slides={slides} active={isVideo ? -1 : active - 1} /> : <div className="w-full max-w-[560px] aspect-square mx-auto" />}</div>
      </div>
    </section>
  );
}
