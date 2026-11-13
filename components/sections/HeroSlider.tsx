"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import Petals from "./Petals";
import { Rose, Daisy, Sunflower, GoldBall, Sprig, Orchid } from "./Flowers";
import WhatsAppButton from "@/components/whatsapp/WhatsAppButton";

/**
 * Hero: a looping video of our bouquets (public/video/hero-*.mp4, 4 seconds per bouquet).
 * The text and the floating flowers change with the bouquet on screen.
 */
const SHOT = 4; // seconds per bouquet in the video
const slides = [
  { eyebrow: "Top Seller", title: ["25 roses,", "one heart"], text: "Our best-selling soap rose heart. It looks real, smells lovely and lasts for months.", flowers: [<Rose key="a" tint="red" />, <Sprig key="b" color="#b98a96" />, <Rose key="c" tint="blush" />] },
  { eyebrow: "Sweet & long-lasting", title: ["Roses &", "Ferrero Rocher"], text: "Pink soap roses with Ferrero Rocher chocolates, wrapped as one sweet gift.", flowers: [<Rose key="a" tint="pink" />, <GoldBall key="b" />, <Sprig key="c" color="#b0227a" />] },
  { eyebrow: "Convocation season", title: ["Celebrate their", "big day"], text: "Sunflowers, blue and white roses and a little graduate teddy for their special day.", flowers: [<Sunflower key="a" />, <Daisy key="b" />, <Rose key="c" tint="blue" />] },
  { eyebrow: "For him", title: ["Bold, elegant,", "made for him"], text: "Twenty-five blue and black soap roses in sleek black wrapping.", flowers: [<Rose key="a" tint="blue" />, <Orchid key="b" />, <Rose key="c" tint="black" />] },
];
const spots = ["left-[4%] top-[18%] w-14 md:w-20", "left-[38%] bottom-[10%] w-10 md:w-14", "right-[5%] top-[12%] w-12 md:w-16"];

export default function HeroSlider() {
  const video = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);
  const [videoOk, setVideoOk] = useState(true);

  // Follow the video: bouquet n is on screen between n*4s and (n+1)*4s.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const onTime = () => setActive(Math.min(slides.length - 1, Math.floor(v.currentTime / SHOT)));
    v.addEventListener("timeupdate", onTime);
    v.play().catch(() => setVideoOk(false));
    return () => v.removeEventListener("timeupdate", onTime);
  }, []);

  // If the video can't play (data saver, very old phone), still change the text every 4 seconds.
  useEffect(() => {
    if (videoOk) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % slides.length), SHOT * 1000);
    return () => clearTimeout(t);
  }, [active, videoOk]);

  const goTo = (i: number) => {
    const n = (i + slides.length) % slides.length;
    setActive(n);
    if (video.current && videoOk) video.current.currentTime = n * SHOT + 0.05;
  };
  const s = slides[active];

  return (
    <section className="relative overflow-hidden bg-deep text-white min-h-[92svh] md:min-h-[640px] lg:min-h-[78vh] flex items-end md:items-center" aria-roledescription="carousel" aria-label="Featured bouquets">
      <video ref={video} className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline preload="auto"
        poster="/video/hero-desktop-poster.webp" onError={() => setVideoOk(false)} aria-hidden="true">
        <source src="/video/hero-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
        <source src="/video/hero-desktop.mp4" type="video/mp4" />
      </video>
      {/* shading so the text is always easy to read */}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,#10172a_0%,#10172a_30%,rgba(16,23,42,.8)_50%,rgba(16,23,42,0)_72%)] md:bg-[linear-gradient(to_right,rgba(16,23,42,.92)_0%,rgba(16,23,42,.6)_40%,rgba(16,23,42,0)_70%)]" />
      <Petals />

      {/* floating flowers that match the bouquet on screen */}
      {spots.map((pos, i) => (
        <div key={i} className={`absolute ${pos} aspect-square hero-float drop-shadow-[0_8px_12px_rgba(0,0,0,.35)] pointer-events-none`} style={{ animationDelay: `${i * 1.3}s` }} aria-hidden="true">
          {slides.map((sl, si) => (
            <div key={si} className={`absolute inset-0 transition-all duration-700 [&>svg]:w-full [&>svg]:h-full ${si === active ? "opacity-90 scale-100" : "opacity-0 scale-50"}`}>{sl.flowers[i]}</div>
          ))}
        </div>
      ))}

      <button onClick={() => goTo(active - 1)} aria-label="Previous slide" className="hidden md:grid absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 border border-white/25 backdrop-blur place-items-center hover:bg-white/20 transition"><ChevronLeft className="w-6 h-6" /></button>
      <button onClick={() => goTo(active + 1)} aria-label="Next slide" className="hidden md:grid absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 border border-white/25 backdrop-blur place-items-center hover:bg-white/20 transition"><ChevronRight className="w-6 h-6" /></button>

      <div className="relative container-x w-full pb-10 pt-40 md:py-20">
        <div className="max-w-xl text-center md:text-left mx-auto md:mx-0">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/25 rounded-full px-4 py-1.5 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-gold" /> Florist in Kuala Lumpur & Selangor
          </div>
          <h1 className="sr-only">BikaFlora – soap flower bouquet delivery in Kuala Lumpur & Selangor</h1>
          <div key={active} className="hero-text-in" aria-live="polite">
            <p className="mt-5 text-xs md:text-sm uppercase tracking-[0.25em] text-gold font-semibold">{s.eyebrow}</p>
            <p className="mt-2 font-serif text-4xl sm:text-5xl xl:text-7xl font-semibold leading-[1.05]">
              {s.title[0]} <span className="italic text-petal">{s.title[1]}</span>
            </p>
            <p className="mt-4 text-base md:text-lg text-white/85 leading-relaxed">{s.text} Same-day delivery, any time.</p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3 justify-center md:justify-start">
            <Link href="/shop" className="btn bg-white text-brand hover:bg-blush !px-7 !py-3.5 md:!py-4">Shop Bouquets <ArrowRight className="w-4 h-4" /></Link>
            <WhatsAppButton label="Order on WhatsApp" className="btn btn-wa !px-7 !py-3.5 md:!py-4 shadow-xl shadow-wa/30" />
          </div>
          <div className="mt-7 flex items-center gap-2 justify-center md:justify-start" role="tablist" aria-label="Featured bouquets">
            <button onClick={() => goTo(active - 1)} aria-label="Previous slide" className="md:hidden w-8 h-8 rounded-full bg-white/10 grid place-items-center mr-1"><ChevronLeft className="w-4 h-4" /></button>
            {slides.map((sl, i) => (
              <button key={i} role="tab" aria-selected={i === active} aria-label={`Show ${sl.title.join(" ")}`} onClick={() => goTo(i)}
                className={`relative h-1.5 rounded-full overflow-hidden transition-all ${i === active ? "w-14 bg-white/25" : "w-6 bg-white/25 hover:bg-white/40"}`}>
                {i === active && <span key={active} className="absolute inset-y-0 left-0 bg-gold hero-progress" style={{ animationDuration: `${SHOT * 1000}ms` }} />}
              </button>
            ))}
            <button onClick={() => goTo(active + 1)} aria-label="Next slide" className="md:hidden w-8 h-8 rounded-full bg-white/10 grid place-items-center ml-1"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
