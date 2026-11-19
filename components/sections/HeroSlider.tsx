"use client";
import Link from "next/link";
import FillImage from "@/components/ui/FillImage";
import { useEffect, useRef, useState } from "react";
import Image, { getImageProps } from "next/image";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import Petals from "./Petals";
import { siteImages } from "@/lib/images";
import HeroStage, { type StageSlide } from "./HeroStage";
import { Rose, Daisy, Sunflower, GoldBall, Sprig, Orchid, Leaf } from "./Flowers";
import WhatsAppButton from "@/components/whatsapp/WhatsAppButton";
import { siteConfig } from "@/lib/site-config";

type Slide = StageSlide & { slug: string; bg: string; eyebrow: string; title: [string, string]; text: string };

/** Each slide shows one of our bouquets, with the same flowers it is made of floating around it. */
const slides: Slide[] = [
  {
    slug: "red-soap-rose-heart-large",
    bg: siteImages.klNight,
    image: "/images/hero/red-soap-rose-heart-large.webp",
    alt: "Red Soap Rose Heart Large bouquet",
    eyebrow: "Best seller in KL",
    title: ["Soap rose heart,", "made to last"],
    text: "Twenty-five red soap roses shaped into one big heart. It looks real, smells lovely and stays bright for months. Order today for same-day delivery in KL.",
    orbiters: [<Rose key="1" tint="red" />, <Sprig key="2" color="#b98a96" />, <Rose key="3" tint="red" />, <Leaf key="4" />, <Rose key="5" tint="blush" />],
  },
  {
    slug: "ferrero-rocher-pink-roses",
    bg: siteImages.klTowers,
    image: "/images/hero/ferrero-rocher-pink-roses.webp",
    alt: "Ferrero Rocher Pink Roses soap bouquet",
    eyebrow: "Chocolate bouquets",
    title: ["Ferrero bouquet,", "sweet & pretty"],
    text: "Ten pink soap roses with seven Ferrero Rocher chocolates. A gift that tastes as good as it looks, delivered across KL and Selangor.",
    orbiters: [<Rose key="1" tint="pink" />, <GoldBall key="2" />, <Sprig key="3" color="#b0227a" />, <Rose key="4" tint="blush" />, <GoldBall key="5" />],
  },
  {
    slug: "graduation-signature",
    bg: siteImages.klCity,
    image: "/images/hero/graduation-signature.webp",
    alt: "The Graduation Signature soap bouquet with sunflowers and teddy",
    eyebrow: "Convocation season",
    title: ["Graduation bouquets", "for convo day"],
    text: "Sunflowers, roses and a little graduate teddy. Pre-order a graduation bouquet in their university colours, delivered on the big day.",
    orbiters: [<Sunflower key="1" />, <Daisy key="2" />, <Rose key="3" tint="blue" />, <Sunflower key="4" />, <Rose key="5" tint="ivory" />],
  },
  {
    slug: "blue-noir-for-him",
    bg: siteImages.cover,
    image: "/images/hero/blue-noir-for-him.webp",
    alt: "Blue Noir For Him soap rose bouquet",
    eyebrow: "Flowers for him",
    title: ["Bold, elegant,", "made for him"],
    text: "Twenty-five blue and black soap roses in sleek black wrap. A bouquet for him that he will actually keep on his desk.",
    orbiters: [<Rose key="1" tint="blue" />, <Rose key="2" tint="black" />, <Orchid key="3" />, <Rose key="4" tint="blue" />, <Rose key="5" tint="black" />],
  },
];

// Hero text and photos edited in the admin panel (Pages → Homepage hero).
type HeroEdit = { eyebrow?: string; title1?: string; title2?: string; text?: string; image?: string; alt?: string };
const heroEdits = siteConfig.hero as { slides?: HeroEdit[]; video?: HeroEdit } | undefined;
heroEdits?.slides?.forEach((e, i) => {
  const sl = slides[i];
  if (!sl || !e) return;
  if (e.eyebrow) sl.eyebrow = e.eyebrow;
  if (e.title1) sl.title = [e.title1, e.title2 ?? ""];
  if (e.text) sl.text = e.text;
  if (e.image) sl.image = e.image;
  if (e.alt) sl.alt = e.alt;
});

const DURATION = 4000;

/** Slide 1: a florist making a bouquet from start to finish (Pexels clips 4621364-4621356, free licence, edited and stored on our site). Plays once, then the photo slides follow. */
const VIDEO_MS = 16000; // safety limit only; the slide moves on when the video ends (10s)
const VIDEO_LEN = 10000; // progress bar length for the video slide
const videoSlide: { eyebrow: string; title: [string, string]; text: string } = { eyebrow: "Online florist in KL & Selangor", title: ["Soap flower bouquets", "that last for months"] as [string, string], text: "Handmade by our florists, then delivered the same day across Kuala Lumpur and Selangor. No cut-off time, and you see a photo before it goes out." };
if (heroEdits?.video?.title1) videoSlide.title = [heroEdits.video.title1, heroEdits.video.title2 ?? ""];
if (heroEdits?.video?.eyebrow) videoSlide.eyebrow = heroEdits.video.eyebrow;
if (heroEdits?.video?.text) videoSlide.text = heroEdits.video.text;

/** Default hero content (used by the admin hero editor). */
export const heroDefaults = { video: { ...videoSlide }, slides: slides.map((s) => ({ eyebrow: s.eyebrow, title1: s.title[0], title2: s.title[1], text: s.text, image: s.image, alt: s.alt })) };

export default function HeroSlider() {
  const [active, setActive] = useState(0);
  const total = slides.length + 1;
  const isVideo = active === 0;
  const video = useRef<HTMLVideoElement>(null);
  // The 4 photo slides (backgrounds, bouquets, flowers) are only added a few seconds after the page
  // has loaded — the video slide shows first, so the first load stays light and fast.
  const [ready, setReady] = useState(false);
  const [changed, setChanged] = useState(false);
  // Phones skip the video: they start on the first photo slide (red rose heart), text on top, bouquet below.
  const [mobile, setMobile] = useState(false);
  const auto = useRef(false);
  useEffect(() => {
    const m = window.matchMedia("(max-width: 767px)");
    const on = () => {
      setMobile(m.matches);
      if (m.matches) { auto.current = true; setReady(true); setActive((a) => (a === 0 ? 1 : a)); }
    };
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  useEffect(() => {
    if (active === 0) return;
    setReady(true);
    // The automatic switch on phones looks identical to the first paint, so no entry animation for it.
    if (auto.current) { auto.current = false; return; }
    setChanged(true);
  }, [active]);
  // Phones (portrait) get a sharp vertical edit (720x1280, 2 MB); laptops 1280p (2.1 MB); big / retina screens 1080p (3.2 MB). No sound track.
  const [src, setSrc] = useState<{ v: string; p: string } | null>(null);
  useEffect(() => {
    const pick = () => {
      const w = window.innerWidth, portrait = window.innerHeight > w, px = w * Math.min(window.devicePixelRatio || 1, 2);
      if (w < 768) { setSrc(null); return; }
      setSrc(portrait && w < 1024
        ? { v: "/video/hero-v4-vertical.mp4", p: "/video/hero-v4-vertical-poster.webp" }
        : px > 1400 ? { v: "/video/hero-v4-1920.mp4", p: "/video/hero-v4-poster.webp" }
        : { v: "/video/hero-v4-1280.mp4", p: "/video/hero-v4-poster.webp" });
    };
    // Start the video only after the page (photos, text) has loaded, so it doesn't slow them down.
    // The still poster image shows in the meantime.
    // Start right after the page becomes interactive (the first picture is already on screen by then).
    const t0 = setTimeout(pick, 150);
    const m = window.matchMedia("(orientation: portrait)");
    m.addEventListener("change", pick);
    return () => { clearTimeout(t0); m.removeEventListener("change", pick); };
  }, []);
  useEffect(() => {
    const v = video.current;
    if (!v || !src) return;
    if (!isVideo) { v.pause(); return; }
    // iPhone only autoplays when the video is muted *before* play() — set it on the element itself.
    v.muted = true; v.defaultMuted = true; v.playsInline = true;
    v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("webkit-playsinline", "");
    v.currentTime = 0;
    // Play as soon as the first frames are ready (the file streams while it plays).
    const start = () => { if (v.paused) v.play().catch(() => {}); };
    if (v.readyState >= 3) start();
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
    const t = setTimeout(() => setActive((a) => { const n = (a + 1) % total; return mobile && n === 0 ? 1 : n; }), isVideo ? VIDEO_MS : DURATION);
    return () => clearTimeout(t);
  }, [active, paused, isVideo, total, mobile]);

  const go = (d: number) => setActive((a) => {
    const n = (a + d + total) % total;
    return mobile && n === 0 ? (d > 0 ? 1 : total - 1) : n;
  });
  const first = getImageProps({ src: slides[0].image, alt: slides[0].alt, width: 500, height: 500, quality: 80 }).props;
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
      <div className={`absolute inset-0 max-md:hidden transition-opacity duration-[1200ms] ${isVideo ? "opacity-100" : "opacity-0"}`} aria-hidden="true">
        {/* Still frame shown instantly (only the right size is downloaded); the video takes over once loaded. */}
        <picture>
          <source media="(max-width: 767px)" srcSet="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
          <source media="(min-width: 768px)" type="image/avif" srcSet="/video/hero-v4-poster.avif" />
          <source media="(min-width: 768px)" srcSet="/video/hero-v4-poster.webp" width={1600} height={900} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/video/hero-v4-vertical-poster.webp" alt="" width={540} height={960} /* tablets in portrait */ fetchPriority="high" decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-center lg:object-[center_18%]" />
        </picture>
        {src && (
          <video key={src.v} ref={video} src={src.v} muted playsInline autoPlay preload="auto" aria-hidden="true" disablePictureInPicture onEnded={() => setActive(1)}
            className="absolute inset-0 w-full h-full object-cover object-center lg:object-[center_18%]" />
        )}
      </div>
      <div className={`absolute inset-0 transition-opacity duration-700 ${isVideo ? "max-lg:opacity-0 bg-[linear-gradient(to_right,rgba(16,23,42,.82)_0%,rgba(16,23,42,.55)_32%,rgba(16,23,42,0)_58%)]" : "bg-gradient-to-r from-deep/95 via-deep/65 to-deep/15"}`} />
      <div className={`absolute inset-0 transition-opacity duration-700 ${isVideo ? "bg-[linear-gradient(to_top,rgba(16,23,42,.9)_0%,rgba(16,23,42,.6)_34%,rgba(16,23,42,0)_58%)] lg:bg-none" : "bg-gradient-to-t from-deep/80 via-transparent to-deep/30"}`} />
      {!isVideo && <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-petal/10 blur-3xl" />}
      {!isVideo && <Petals />}

      {/* arrows */}
      <button onClick={() => go(-1)} aria-label="Previous slide" className="hidden md:grid absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 border border-white/25 place-items-center hover:bg-white/20 transition"><ChevronLeft className="w-6 h-6" /></button>
      <button onClick={() => go(1)} aria-label="Next slide" className="hidden md:grid absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 border border-white/25 place-items-center hover:bg-white/20 transition"><ChevronRight className="w-6 h-6" /></button>

      <div className="relative container-x pt-8 pb-14 lg:py-16 grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
      <div className="max-w-2xl order-2 lg:order-1 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 bg-deep/45 border border-white/25 rounded-full px-4 py-1.5 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-gold" /> Same-day flower delivery in KL & Selangor
        </div>

        <div key={active} className={`hero-text-in ${isVideo ? "max-md:hidden [text-shadow:0_2px_16px_rgba(16,23,42,.75)]" : ""}`} aria-live="polite">
          <p className="mt-6 text-sm uppercase tracking-[0.25em] text-gold font-semibold">{s.eyebrow}</p>
          <h1 className="mt-3 font-serif text-[2.6rem] sm:text-6xl xl:text-7xl font-semibold leading-[1.05]">
            {s.title[0]} <span className="block italic text-petal">{s.title[1]}</span>
          </h1>
          <p className="mt-5 text-lg md:text-xl text-white/85 leading-relaxed max-w-xl mx-auto lg:mx-0">{s.text}</p>
        </div>

        {/* Phones, before the page script runs: the same text the first photo slide shows (no jump when it takes over). */}
        {isVideo && (
          <div className="md:hidden" aria-hidden="true">
            <p className="mt-6 text-sm uppercase tracking-[0.25em] text-gold font-semibold">{slides[0].eyebrow}</p>
            <p className="mt-3 font-serif text-[2.6rem] sm:text-6xl xl:text-7xl font-semibold leading-[1.05]">
              {slides[0].title[0]} <span className="block italic text-petal">{slides[0].title[1]}</span>
            </p>
            <p className="mt-5 text-lg md:text-xl text-white/85 leading-relaxed max-w-xl mx-auto lg:mx-0">{slides[0].text}</p>
          </div>
        )}
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
              className={`relative h-1.5 rounded-full overflow-hidden transition-all ${i === 0 ? "max-md:hidden " : ""}${i === active ? "w-14 bg-white/25" : "w-6 bg-white/25 hover:bg-white/40"}`}>
              {i === active && <span key={`${active}-${paused}`} className={`absolute inset-y-0 left-0 bg-gold ${paused ? "w-full" : "hero-progress"}`} style={{ animationDuration: `${isVideo ? VIDEO_LEN : DURATION}ms` }} />}
            </button>
          ))}
          </div>
          <button onClick={() => go(1)} aria-label="Next slide" className="md:hidden w-8 h-8 rounded-full bg-white/10 grid place-items-center ml-1"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
      <div className={`order-1 lg:order-2 transition-opacity duration-700 ${isVideo ? "md:opacity-0 md:pointer-events-none" : "opacity-100"}`}>
        {ready ? <HeroStage slides={slides} active={isVideo ? -1 : active - 1} /> : (
          <div className="relative w-full max-w-[560px] aspect-square mx-auto">
            {/* Phones: the red rose heart shows straight away, in the same spot the animated stage puts it. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img {...first} alt={slides[0].alt} fetchPriority="high" decoding="async" className="md:hidden absolute inset-[10%] w-[80%] h-[80%] object-contain drop-shadow-[0_30px_40px_rgba(5,10,25,.6)]" />
          </div>
        )}
      </div>
      </div>
    </section>
  );
}
