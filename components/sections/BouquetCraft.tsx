"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Layers, Flower2, Heart, Ribbon, Gift, Check, ArrowRight } from "lucide-react";
import { Sparkle } from "./Flowers";

/**
 * "How your bouquet is made": our real Red Soap Rose Heart, split into layers,
 * builds itself in 3D: paper, roses row by row, ribbon, then the finished bouquet.
 */
const steps = [
  { icon: Layers, title: "Layer the premium paper", text: "Soft blush paper and caspia, folded by hand into shape." },
  { icon: Flower2, title: "Place the first roses", text: "Long-lasting soap roses, set one row at a time." },
  { icon: Heart, title: "Shape the heart", text: "25 roses arranged into a perfect heart." },
  { icon: Ribbon, title: "Tie the satin ribbon", text: "A burgundy bow to finish the look." },
  { icon: Gift, title: "Ready to deliver", text: "Photographed, then delivered the same day." },
];
const STEP_MS = 2200;
const HOLD_MS = 3200; // the finished bouquet stays on screen a little longer

export default function BouquetCraft() {
  const ref = useRef<HTMLElement>(null);
  const [step, setStep] = useState(-1); // -1 = empty stage
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setStep((s) => (s >= steps.length - 1 ? -1 : s + 1)), step === steps.length - 1 ? HOLD_MS : step === -1 ? 700 : STEP_MS);
    return () => clearTimeout(t);
  }, [step, visible]);

  const on = (n: number) => step >= n;
  const done = step === steps.length - 1;

  return (
    <section ref={ref} className="relative overflow-hidden bg-[radial-gradient(ellipse_at_70%_30%,#24335a_0%,#141c33_55%,#0b1121_100%)] text-white mt-20 md:mt-24" aria-labelledby="craft-title">
      <div className="relative container-x py-16 md:py-24 grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center">
        <div>
          <div className="eyebrow !text-gold mb-3">Handmade in Kuala Lumpur</div>
          <h2 id="craft-title" className="text-4xl md:text-5xl leading-tight">How your bouquet is made</h2>
          <p className="mt-4 text-white/70 max-w-lg">Watch our best-selling Red Soap Rose Heart come together, from the first sheet of paper to the finished bouquet.</p>

          <ol className="mt-8 relative">
            <span className="absolute left-[19px] top-3 bottom-3 w-px bg-white/15" aria-hidden />
            <span className="absolute left-[19px] top-3 w-px bg-gold transition-all duration-700" style={{ height: `${Math.max(0, step) * 22}%` }} aria-hidden />
            {steps.map((s, n) => {
              const Icon = s.icon;
              const active = n === step;
              const past = n < step;
              return (
                <li key={s.title} className="relative flex gap-4 py-2.5">
                  <span className={`relative z-10 w-10 h-10 shrink-0 rounded-full grid place-items-center transition-all duration-500 ${active ? "bg-gold text-deep scale-110 shadow-lg shadow-gold/30" : past ? "bg-[#26345a] text-gold" : "bg-[#16203a] text-white/40 border border-white/10"}`}>
                    {past ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </span>
                  <div className={`transition-opacity duration-500 ${active ? "opacity-100" : past ? "opacity-70" : "opacity-40"}`}>
                    <div className="font-semibold">{s.title}</div>
                    <div className={`text-sm text-white/65 overflow-hidden transition-all duration-500 ${active ? "max-h-12 mt-0.5" : "max-h-0"}`}>{s.text}</div>
                  </div>
                </li>
              );
            })}
          </ol>
          <Link href="/product/red-soap-rose-heart-large" className="mt-8 inline-flex items-center gap-2 text-gold font-semibold hover:gap-3 transition-all">
            See this bouquet <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3D stage */}
        <div className="relative mx-auto w-full max-w-[540px] aspect-square" style={{ perspective: "1400px" }}>
          <div className="absolute inset-x-[8%] top-[2%] h-[72%] rounded-full bg-[radial-gradient(circle,rgba(255,236,214,.22)_0%,transparent_65%)]" />
          {/* podium */}
          <div className="absolute left-1/2 bottom-[5%] w-[78%] h-[13%]" style={{ transform: "translateX(-50%) rotateX(68deg)" }}>
            <div className="absolute inset-0 rounded-[50%] bg-gradient-to-b from-[#2a3a63] to-[#121a30] ring-2 ring-gold/50 shadow-[0_30px_60px_rgba(0,0,0,.6)]" />
            <div className={`absolute inset-[12%] rounded-[50%] bg-gold/25 blur-xl transition-opacity duration-1000 ${done ? "opacity-100" : "opacity-0"}`} />
          </div>

          {/* bouquet built from layers of the real photo */}
          <div className={`absolute left-1/2 bottom-[10%] w-[64%] ${done ? "craft-sway" : ""}`} style={{ aspectRatio: "1079 / 1206", transform: "translateX(-50%)", transformStyle: "preserve-3d" }}>
            <Layer src="/images/build/paper.webp" show={on(0)} from="rotateX(75deg) scale(.55) translateY(30%)" />
            <Layer src="/images/build/roses-1.webp" show={on(1)} from="translateY(-55%) scale(1.25)" />
            <Layer src="/images/build/roses-2.webp" show={on(2)} from="translateY(-60%) scale(1.25)" />
            <Layer src="/images/build/roses-3.webp" show={on(2)} from="translateY(-65%) scale(1.25)" delay={250} />
            <Layer src="/images/build/ribbon.webp" show={on(3)} from="scale(0) rotate(-20deg)" />
            <div className={`absolute inset-0 pointer-events-none overflow-hidden ${done ? "" : "hidden"}`}
              style={{ WebkitMaskImage: "url(/images/build/full.webp)", maskImage: "url(/images/build/full.webp)", WebkitMaskSize: "100% 100%", maskSize: "100% 100%" }}>
              <div className="craft-shine absolute -inset-y-10 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
          </div>

          {[[14, 22], [82, 18], [88, 52], [10, 58], [50, 4]].map(([x, y], i) => (
            <div key={i} className={`absolute w-6 h-6 text-gold transition-all duration-700 ${done ? "opacity-100 scale-100" : "opacity-0 scale-0"}`} style={{ left: `${x}%`, top: `${y}%`, transitionDelay: `${i * 120}ms` }}>
              <Sparkle className="w-full h-full sparkle" />
            </div>
          ))}
          <div className={`absolute top-[6%] right-[2%] bg-white/95 text-brand rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-1.5 shadow-xl transition-all duration-700 ${done ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`}>
            <Check className="w-4 h-4 text-wa" /> Ready to deliver
          </div>
          <div className="absolute bottom-0 inset-x-0 text-center text-xs uppercase tracking-[0.25em] text-white/50">Step {Math.max(1, step + 1)} of {steps.length}</div>
        </div>
      </div>
    </section>
  );
}

function Layer({ src, show, from, delay = 0 }: { src: string; show: boolean; from: string; delay?: number }) {
  return (
    <div className="absolute inset-0 transition-all duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] will-change-transform"
      style={{ opacity: show ? 1 : 0, transform: show ? "none" : from, transitionDelay: show ? `${delay}ms` : "0ms" }}>
      <Image src={src} alt="" fill sizes="(max-width:1024px) 70vw, 360px" quality={90} className="object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,.4)]" />
    </div>
  );
}
