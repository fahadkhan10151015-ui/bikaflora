"use client";
import Link from "next/link";
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
/** Slide 5: our bouquet video (public/video). It plays once in full, then the slides start again. */
const VIDEO_MS = 16000;
const videoSlide = { eyebrow: "Handmade in Kuala Lumpur", title: ["Made with love,", "delivered today"] as [string, string], text: "Every BikaFlora bouquet is hand-tied by our florists and delivered across KL & Selangor, any time." };

export default function HeroSlider() {
  const [active, setActive] = useState(0);
  const total = slides.length + 1;
  const isVideo = active === slides.length;
  const video = useRef<HTMLVideoElement>(null);
  const [preload, setPreload] = useState<"none" | "auto">("none");
  // Start downloading the video quietly after the page has loaded, so it is ready (and smooth) when its turn comes.
  useEffect(() => { const t = setTimeout(() => setPreload("auto"), 2500); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (isVideo) { v.currentTime = 0; v.play().catch(() => {}); } else v.pause();
  }, [isVideo]);
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
  const s = isVideo ? videoSlide : slides[active];

  return (
    <section className="relative overflow-hidden bg-deep text-white" aria-roledescription="carousel" aria-label="Featured bouquets"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}>
      {/* backgrounds: one per slide, cross-fading with a slow zoom */}
      {slides.map((sl, i) => (
        <div key={sl.bg} className={`absolute inset-0 transition-opacity duration-[1400ms] ${i === active ? "opacity-100" : "opacity-0"}`} aria-hidden="true">
          <Image src={sl.bg} alt="" fill priority={i === 0} sizes="100vw" quality={70}
            className={`object-cover object-center opacity-80 ${i === active ? "hero-bg-zoom" : ""}`} />
        </div>
      ))}
      {/* slide 5: video */}
      <div className={`absolute inset-0 transition-opacity duration-[1200ms] ${isVideo ? "opacity-100" : "opacity-0"}`} aria-hidden="true">
        <video ref={video} className="absolute inset-0 w-full h-full object-cover" muted playsInline preload={preload} poster="/video/hero-desktop-poster.webp">
          <source src="/video/hero-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
          <source src="/video/hero-desktop.mp4" type="video/mp4" />
        </video>
      </div>
      <div className={`absolute inset-0 bg-gradient-to-r from-deep/95 via-deep/65 to-deep/15 transition-opacity duration-700 ${isVideo ? "max-md:opacity-0" : ""}`} />
      <div className={`absolute inset-0 transition-opacity duration-700 ${isVideo ? "bg-[linear-gradient(to_top,rgba(16,23,42,.95)_0%,rgba(16,23,42,.75)_40%,rgba(16,23,42,0)_65%)] md:bg-gradient-to-t md:from-deep/80 md:via-transparent md:to-deep/30" : "bg-gradient-to-t from-deep/80 via-transparent to-deep/30"}`} />
      <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-petal/10 blur-3xl" />
      <Petals />

      {/* arrows */}
      <button onClick={() => go(-1)} aria-label="Previous slide" className="hidden md:grid absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 border border-white/25 backdrop-blur place-items-center hover:bg-white/20 transition"><ChevronLeft className="w-6 h-6" /></button>
      <button onClick={() => go(1)} aria-label="Next slide" className="hidden md:grid absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 border border-white/25 backdrop-blur place-items-center hover:bg-white/20 transition"><ChevronRight className="w-6 h-6" /></button>

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
        <div className="mt-8 flex items-center gap-2 justify-center lg:justify-start" role="tablist" aria-label="Featured bouquets">
          <button onClick={() => go(-1)} aria-label="Previous slide" className="md:hidden w-8 h-8 rounded-full bg-white/10 grid place-items-center mr-1"><ChevronLeft className="w-4 h-4" /></button>
          {[...slides.map((sl) => sl.alt), "Our bouquet video"].map((label, i) => (
            <button key={label} role="tab" aria-selected={i === active} aria-label={`Show ${label}`} onClick={() => setActive(i)}
              className={`relative h-1.5 rounded-full overflow-hidden transition-all ${i === active ? "w-14 bg-white/25" : "w-6 bg-white/25 hover:bg-white/40"}`}>
              {i === active && <span key={`${active}-${paused}`} className={`absolute inset-y-0 left-0 bg-gold ${paused ? "w-full" : "hero-progress"}`} style={{ animationDuration: `${isVideo ? VIDEO_MS : DURATION}ms` }} />}
            </button>
          ))}
          <button onClick={() => go(1)} aria-label="Next slide" className="md:hidden w-8 h-8 rounded-full bg-white/10 grid place-items-center ml-1"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
      <div className={`order-1 lg:order-2 transition-opacity duration-700 ${isVideo ? "opacity-0 pointer-events-none" : "opacity-100"}`}><HeroStage slides={slides} active={isVideo ? -1 : active} /></div>
      </div>
    </section>
  );
}
