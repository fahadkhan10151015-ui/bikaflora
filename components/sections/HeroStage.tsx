"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Blossom from "./Blossom";

/** Bouquets that take turns in the centre of the stage. */
const bouquets = ["/images/hero/bouquet-a.webp", "/images/hero/bouquet-b.webp"];

/** Flowers that orbit the bouquet in 3D. */
const orbiters = [
  { kind: "rose", color: "#c2185b" },
  { kind: "daisy", color: "#f8bbd0" },
  { kind: "tulip", color: "#e5536f" },
  { kind: "leaf" },
  { kind: "rose", color: "#f48fb1" },
  { kind: "daisy", color: "#ffffff" },
  { kind: "tulip", color: "#ff8a80" },
  { kind: "leaf" },
] as const;

const RING_TEXT = "BIKAFLORA · FRESH FLOWERS · KUALA LUMPUR · SELANGOR · SAME-DAY EXPRESS · ";

export default function HeroStage() {
  const stage = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // Swap the bouquet every 6 seconds.
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % bouquets.length), 6000);
    return () => clearInterval(t);
  }, []);

  // Orbit + mouse-parallax animation.
  useEffect(() => {
    const el = stage.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let tiltX = 0, tiltY = 0, targetX = 0, targetY = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      targetY = ((e.clientX - r.left) / r.width - 0.5) * 18;
      targetX = -((e.clientY - r.top) / r.height - 0.5) * 14;
    };
    window.addEventListener("pointermove", onMove);

    const tick = (t: number) => {
      tiltX += (targetX - tiltX) * 0.06;
      tiltY += (targetY - tiltY) * 0.06;
      el.style.setProperty("--tilt-x", `${tiltX}deg`);
      el.style.setProperty("--tilt-y", `${tiltY}deg`);

      const n = items.current.length;
      items.current.forEach((node, i) => {
        if (!node) return;
        const angle = t / 2600 + (i / n) * Math.PI * 2;
        const depth = Math.sin(angle); // -1 back … 1 front
        const x = Math.cos(angle) * 46; // % of stage width
        const y = depth * 10 + Math.sin(t / 900 + i) * 3; // gentle bob
        const scale = 0.62 + (depth + 1) * 0.28;
        node.style.transform = `translate(-50%, -50%) translate(${x}cqw, ${y}cqw) scale(${scale}) rotate(${(t / 40 + i * 45) % 360}deg)`;
        node.style.zIndex = depth > 0 ? "30" : "5";
        node.style.opacity = String(0.55 + (depth + 1) * 0.225);
        node.style.filter = depth < -0.3 ? "blur(1.5px)" : "none";
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
    <div ref={stage} className="hero-stage relative w-full max-w-[560px] aspect-square mx-auto" style={{ containerType: "inline-size" }} aria-hidden="true">
      {/* glow disc */}
      <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle_at_40%_35%,#fde4ec_0%,#f48fb1_38%,#a3284f_70%,transparent_72%)] opacity-90 blur-[2px]" />
      <div className="absolute inset-[6%] rounded-full border border-white/15" />

      {/* rotating text ring */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-spin-slow">
        <defs><path id="ring" d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" /></defs>
        <text fill="#fbe9ee" fontSize="7.2" letterSpacing="3.2" fontFamily="var(--font-sans)">
          <textPath href="#ring" textLength="548" lengthAdjust="spacing">{RING_TEXT}</textPath>
        </text>
      </svg>

      {/* orbiting flowers */}
      {orbiters.map((o, i) => (
        <div key={i} ref={(n) => { items.current[i] = n; }} className="absolute left-1/2 top-[56%] w-[13%] will-change-transform drop-shadow-[0_8px_12px_rgba(0,0,0,.35)]">
          <Blossom kind={o.kind} color={"color" in o ? o.color : undefined} className="w-full h-full" />
        </div>
      ))}

      {/* bouquet in 3D */}
      <div className="absolute inset-0 z-20 [perspective:1200px] pointer-events-none">
        <div className="absolute inset-[8%] hero-float" style={{ transform: "rotateX(var(--tilt-x,0deg)) rotateY(var(--tilt-y,0deg))", transformStyle: "preserve-3d" }}>
          {bouquets.map((src, i) => (
            <Image key={src} src={src} alt="" fill priority={i === 0} sizes="(max-width:1024px) 80vw, 520px"
              className={`object-contain drop-shadow-[0_30px_40px_rgba(40,5,15,.55)] transition-all duration-1000 ${i === active ? "opacity-100 [transform:rotateY(0deg)_scale(1)]" : "opacity-0 [transform:rotateY(90deg)_scale(.9)]"}`} />
          ))}
        </div>
      </div>

      {/* shadow under bouquet */}
      <div className="absolute left-1/2 bottom-[4%] -translate-x-1/2 w-[46%] h-[6%] rounded-[50%] bg-black/35 blur-xl hero-shadow" />
    </div>
  );
}
