"use client";
import { useEffect, useRef } from "react";
import { Camera, Flower2, Gift, Truck, Check } from "lucide-react";
import { Rose, Blossom, Leaf, Hibiscus, Orchid } from "./Flowers";

/** Flowers start scattered (x0,y0) and gather into the bouquet (x1,y1). Values are % of the stage. */
const blooms = [
  { el: <Leaf />, x0: -38, y0: -30, x1: -14, y1: -20, size: 22, r: -40 },
  { el: <Leaf />, x0: 40, y0: -34, x1: 14, y1: -22, size: 22, r: 50 },
  { el: <Rose tint="pink" />, x0: -40, y0: 20, x1: -10, y1: -14, size: 24, r: 0 },
  { el: <Hibiscus />, x0: 38, y0: 24, x1: 11, y1: -12, size: 24, r: 0 },
  { el: <Orchid />, x0: -30, y0: -42, x1: -2, y1: -28, size: 22, r: 0 },
  { el: <Rose tint="peach" />, x0: 34, y0: -44, x1: 2, y1: -6, size: 26, r: 0 },
  { el: <Blossom tint="blush" />, x0: 0, y0: 44, x1: -16, y1: -2, size: 18, r: 0 },
  { el: <Blossom tint="white" />, x0: 44, y0: 0, x1: 16, y1: -2, size: 18, r: 0 },
];

const steps = [
  { icon: Flower2, title: "Premium blooms selected", text: "We pick the best soap roses, orchids and fillers for every design." },
  { icon: Gift, title: "Hand-tied & wrapped", text: "Arranged by hand, wrapped and finished with a ribbon." },
  { icon: Camera, title: "Photo sent to you", text: "You see your actual bouquet on WhatsApp first." },
  { icon: Truck, title: "Delivered with care", text: "Instant delivery today or on your pre-order date." },
];

/** "How your bouquet is made" — an animated 3D assembly that plays when it scrolls into view. */
export default function BouquetCraft() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => el.classList.toggle("is-playing", entry.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="container-x mt-24">
      <div ref={ref} className="craft grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Animated stage */}
        <div className="relative aspect-square max-w-[520px] w-full mx-auto rounded-[2.5rem] overflow-hidden bg-[radial-gradient(circle_at_50%_40%,#fff_0%,#fbe7ec_45%,#f1d4dc_100%)] ring-1 ring-blush-2 shadow-xl shadow-brand/10 [perspective:900px]">
          <div className="absolute inset-0 craft-turn" style={{ transformStyle: "preserve-3d" }}>
            {/* wrapping paper */}
            <svg viewBox="0 0 200 200" className="absolute left-1/2 top-1/2 w-[62%] -translate-x-1/2 -translate-y-[8%] craft-wrap" aria-hidden="true">
              <defs>
                <linearGradient id="wrap-g" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#e9e4ec" />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#ddd6e1" />
                </linearGradient>
              </defs>
              <path d="M20 40 L100 190 L180 40 L140 70 L100 30 L60 70 Z" fill="url(#wrap-g)" stroke="#d8cfdc" strokeWidth="1.5" />
              <path d="M100 30 L100 190" stroke="#ece6ef" strokeWidth="2" />
            </svg>

            {/* flowers */}
            {blooms.map((b, i) => (
              <div key={i} className="craft-bloom absolute left-1/2 top-1/2 drop-shadow-[0_8px_10px_rgba(31,42,68,.25)] [&>svg]:w-full [&>svg]:h-full"
                style={{ width: `${b.size}%`, aspectRatio: "1", "--x0": `${b.x0 * 4}%`, "--y0": `${b.y0 * 4}%`, "--x1": `${b.x1 * 4}%`, "--y1": `${b.y1 * 4}%`, "--r": `${b.r}deg`, animationDelay: `${i * 0.08}s` } as React.CSSProperties}>
                {b.el}
              </div>
            ))}

            {/* ribbon */}
            <svg viewBox="0 0 100 60" className="absolute left-1/2 top-[66%] w-[26%] -translate-x-1/2 craft-ribbon" aria-hidden="true">
              <path d="M50 30 C 30 5, 8 12, 12 28 C 16 42, 36 38, 50 30Z M50 30 C 70 5, 92 12, 88 28 C 84 42, 64 38, 50 30Z" fill="#c9a45c" />
              <path d="M46 32 L36 58 M54 32 L64 58" stroke="#c9a45c" strokeWidth="5" strokeLinecap="round" />
              <circle cx="50" cy="30" r="7" fill="#b28c45" />
            </svg>
          </div>

          {/* camera flash + badges */}
          <div className="absolute inset-0 bg-white craft-flash pointer-events-none" />
          <div className="absolute top-5 left-1/2 -translate-x-1/2 craft-badge-photo glass rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2 shadow-lg">
            <Check className="w-4 h-4 text-wa" /> Photo sent on WhatsApp
          </div>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 craft-badge-van bg-brand text-white rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2 shadow-lg whitespace-nowrap">
            <Truck className="w-4 h-4 text-gold" /> On its way to you
          </div>
        </div>

        {/* Steps */}
        <div>
          <div className="eyebrow mb-3">How it&apos;s made</div>
          <h2 className="text-4xl md:text-5xl leading-tight">From our hands to your doorstep</h2>
          <p className="mt-4 text-muted leading-relaxed">Every BikaFlora bouquet goes through the same careful steps, so it arrives looking exactly as beautiful as you imagined.</p>
          <ol className="mt-8 space-y-3">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className={`craft-step craft-step-${i + 1} flex gap-4 items-start rounded-2xl p-4 border border-transparent`}>
                <span className="craft-step-icon w-11 h-11 rounded-full grid place-items-center shrink-0 bg-blush text-brand"><Icon className="w-5 h-5" /></span>
                <div>
                  <h3 className="font-sans font-semibold">{i + 1}. {title}</h3>
                  <p className="text-sm text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
