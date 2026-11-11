"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Rose, Blossom, Leaf, Sparkle, Hibiscus, Orchid } from "./Flowers";

/** Bouquets that take turns in the centre of the stage (transparent cut-outs). */
const bouquets = ["/images/hero/bouquet-a.webp", "/images/hero/bouquet-b.webp"];
/** Flowers that orbit the bouquet (drawn in SVG). */
const orbiters = [
  <Hibiscus key="h1" />, <Rose key="r1" tint="pink" />, <Orchid key="o1" />, <Leaf key="l1" />, <Blossom key="b1" tint="blush" />,
  <Hibiscus key="h2" />, <Rose key="r2" tint="peach" />, <Orchid key="o2" />, <Leaf key="l2" />, <Blossom key="b2" tint="white" />,
];

/** Twinkles placed around the halo. */
const sparkles = [
  { top: "12%", left: "22%", delay: 0 }, { top: "18%", left: "78%", delay: 1.2 }, { top: "70%", left: "10%", delay: 2.1 },
  { top: "82%", left: "70%", delay: 0.6 }, { top: "45%", left: "92%", delay: 1.7 }, { top: "38%", left: "4%", delay: 2.6 },
];

const RING_TEXT = "BIKAFLORA · BUNGA SEGAR · KUALA LUMPUR · SELANGOR · MALAYSIA · ";

/** Animated 3D hero: floating bouquet, orbiting flower medallions and a rotating text ring. */
export default function HeroStage() {
  const stage = useRef<HTMLDivElement>(null);
  const orbit = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % bouquets.length), 6000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const el = stage.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let tiltX = 0, tiltY = 0, targetX = 0, targetY = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      targetY = ((e.clientX - r.left) / r.width - 0.5) * 16;
      targetX = -((e.clientY - r.top) / r.height - 0.5) * 12;
    };
    window.addEventListener("pointermove", onMove);

    const tick = (t: number) => {
      tiltX += (targetX - tiltX) * 0.06;
      tiltY += (targetY - tiltY) * 0.06;
      el.style.setProperty("--tilt-x", `${tiltX}deg`);
      el.style.setProperty("--tilt-y", `${tiltY}deg`);

      const n = orbit.current.length;
      orbit.current.forEach((node, i) => {
        if (!node) return;
        const angle = t / 3200 + (i / n) * Math.PI * 2;
        const depth = Math.sin(angle); // -1 = behind, 1 = in front
        const x = Math.cos(angle) * 44;
        const y = depth * 12 + Math.sin(t / 1100 + i) * 2;
        const scale = 0.55 + (depth + 1) * 0.3;
        const spin = (t / 30 + i * 47) % 360;
        node.style.transform = `translate(-50%, -50%) translate(${x}cqw, ${y}cqw) scale(${scale}) rotate(${spin}deg)`;
        node.style.zIndex = depth > 0 ? "30" : "5";
        node.style.opacity = String(0.5 + (depth + 1) * 0.25);
        node.style.filter = depth < -0.2 ? `blur(${(-depth * 2).toFixed(1)}px)` : "none";
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={stage} className="relative w-full max-w-[560px] aspect-square mx-auto" style={{ containerType: "inline-size" }} aria-hidden="true">
      {/* glowing halo */}
      <div className="absolute inset-[14%] rounded-full bg-[radial-gradient(circle_at_40%_35%,#fff8f5_0%,#f6cdd8_38%,#2b3b62_72%,transparent_74%)] opacity-90" />
      <div className="absolute inset-[9%] rounded-full border border-gold/40" />
      <div className="absolute inset-[3%] rounded-full border border-white/10" />

      {/* rotating text ring */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-spin-slow">
        <defs><path id="hero-ring" d="M100,100 m-90,0 a90,90 0 1,1 180,0 a90,90 0 1,1 -180,0" /></defs>
        <text fill="#e2c98f" fontSize="7" letterSpacing="3">
          <textPath href="#hero-ring" textLength="560" lengthAdjust="spacing">{RING_TEXT}</textPath>
        </text>
      </svg>

      {/* twinkling sparkles */}
      {sparkles.map((s, i) => (
        <span key={i} className="absolute w-[4%] sparkle" style={{ top: s.top, left: s.left, animationDelay: `${s.delay}s` }}><Sparkle className="w-full h-full" /></span>
      ))}

      {/* orbiting flowers */}
      {orbiters.map((flower, i) => (
        <div key={i} ref={(n) => { orbit.current[i] = n; }}
          className="absolute left-1/2 top-[55%] w-[14%] aspect-square will-change-transform drop-shadow-[0_10px_14px_rgba(0,0,0,.35)] [&>svg]:w-full [&>svg]:h-full">
          {flower}
        </div>
      ))}

      {/* bouquet in 3D */}
      <div className="absolute inset-0 z-20 [perspective:1200px] pointer-events-none">
        <div className="absolute inset-[10%] hero-float" style={{ transform: "rotateX(var(--tilt-x,0deg)) rotateY(var(--tilt-y,0deg))", transformStyle: "preserve-3d" }}>
          {bouquets.map((src, i) => (
            <Image key={src} src={src} alt="" fill priority={i === 0} sizes="(max-width:1024px) 80vw, 500px"
              className={`object-contain drop-shadow-[0_30px_40px_rgba(5,10,25,.6)] transition-all duration-1000 ${i === active ? "opacity-100 [transform:rotateY(0deg)_scale(1)]" : "opacity-0 [transform:rotateY(90deg)_scale(.9)]"}`} />
          ))}
        </div>
      </div>

      <div className="absolute left-1/2 bottom-[5%] w-[44%] h-[5%] rounded-[50%] bg-black/40 blur-xl hero-shadow" />
    </div>
  );
}
