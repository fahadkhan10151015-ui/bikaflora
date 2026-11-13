"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, Flower2, Sparkles, Layers, Ribbon, Gift, Sun } from "lucide-react";
import Petals from "./Petals";

/** Close-ups from our own bouquets, played like a short film. */
const scenes = [
  { img: "/images/craft/1-rose.jpg", icon: Flower2, title: "Choosing every rose", text: "Soft, long-lasting soap roses picked one by one." },
  { img: "/images/craft/2-gerbera.jpg", icon: Sparkles, title: "Adding colour", text: "Gerberas and fillers for a cheerful, full look." },
  { img: "/images/craft/3-orchid.jpg", icon: Flower2, title: "Elegant orchids", text: "Cymbidium orchids for a touch of luxury." },
  { img: "/images/craft/3b-sunflower.jpg", icon: Sun, title: "Bright sunflowers", text: "Sunshine for graduations and new beginnings." },
  { img: "/images/craft/4-paper.jpg", icon: Layers, title: "Layering the paper", text: "Premium textured papers, folded by hand." },
  { img: "/images/craft/5-ribbon.jpg", icon: Ribbon, title: "Tying the ribbon", text: "Satin and organza, finished with a neat bow." },
  { img: "/products/bestie-blossoms/02.jpg", icon: Gift, title: "Ready to make them smile", text: "Photographed, then delivered to their door." },
];
const SCENE_MS = 3200;
// Each scene drifts a little differently, like a camera move.
const moves = ["kb-in-left", "kb-in-right", "kb-out", "kb-in-left", "kb-pan", "kb-in-right", "kb-out"];

export default function BouquetCraft() {
  const ref = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !playing) return;
    const t = setTimeout(() => setI((n) => (n + 1) % scenes.length), SCENE_MS);
    return () => clearTimeout(t);
  }, [i, visible, playing]);

  const s = scenes[i];
  const Icon = s.icon;

  return (
    <section ref={ref} className="relative overflow-hidden bg-deep text-white mt-20 md:mt-24" aria-labelledby="craft-title">
      <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-petal/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-[380px] h-[380px] rounded-full bg-gold/10 blur-3xl" />
      <div className="relative container-x py-16 md:py-24 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <div className="eyebrow !text-gold mb-3">Handmade in Kuala Lumpur</div>
          <h2 id="craft-title" className="text-4xl md:text-5xl leading-tight">How your bouquet is made</h2>
          <p className="mt-4 text-white/70 max-w-lg">Every BikaFlora bouquet is made by hand, one bloom at a time. Here is what goes into yours.</p>
          <ol className="mt-8 space-y-1.5">
            {scenes.map((sc, n) => (
              <li key={sc.title}>
                <button onClick={() => setI(n)} className={`w-full text-left flex items-center gap-3 rounded-2xl px-3 py-2 transition ${n === i ? "bg-white/10" : "hover:bg-white/5"}`}>
                  <span className={`w-8 h-8 shrink-0 rounded-full grid place-items-center text-sm font-semibold transition ${n === i ? "bg-gold text-deep" : n < i ? "bg-white/20 text-white" : "bg-white/5 text-white/50"}`}>{n + 1}</span>
                  <span className={n === i ? "font-semibold" : "text-white/60"}>{sc.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        {/* the "film" */}
        <div className="relative mx-auto w-full max-w-[520px]">
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden ring-1 ring-gold/30 shadow-2xl shadow-black/50 bg-black">
            {scenes.map((sc, n) => (
              <div key={sc.img} className={`absolute inset-0 transition-opacity duration-1000 ${n === i ? "opacity-100" : "opacity-0"}`}>
                <Image src={sc.img} alt={sc.title} fill sizes="(max-width:1024px) 90vw, 520px" quality={90}
                  className={`object-cover ${n === i && visible ? moves[n] : ""}`} style={{ animationDuration: `${SCENE_MS + 1000}ms`, animationPlayState: playing ? "running" : "paused" }} />
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/30" />
            <Petals />

            {/* story-style progress */}
            <div className="absolute top-4 inset-x-4 flex gap-1.5">
              {scenes.map((_, n) => (
                <span key={n} className="h-1 flex-1 rounded-full bg-white/25 overflow-hidden">
                  {n < i && <span className="block h-full w-full bg-white" />}
                  {n === i && <span key={`${i}-${playing}-${visible}`} className={`block h-full bg-white ${playing && visible ? "hero-progress" : "w-0"}`} style={{ animationDuration: `${SCENE_MS}ms` }} />}
                </span>
              ))}
            </div>

            <div key={i} className="absolute bottom-0 inset-x-0 p-6 hero-text-in">
              <div className="flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-[0.2em]"><Icon className="w-4 h-4" /> Step {i + 1} of {scenes.length}</div>
              <div className="mt-2 font-serif text-3xl leading-tight">{s.title}</div>
              <p className="mt-1 text-white/80">{s.text}</p>
            </div>

            <button onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"}
              className="absolute top-8 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur grid place-items-center hover:bg-black/60">
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
