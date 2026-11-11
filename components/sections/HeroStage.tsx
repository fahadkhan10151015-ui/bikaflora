"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { heroFlowers } from "@/lib/images";

/** Bouquets that take turns in the centre of the stage (transparent cut-outs). */
const bouquets = ["/images/hero/bouquet-a.webp", "/images/hero/bouquet-b.webp"];
const RING_TEXT = "BIKAFLORA · FRESH FLOWERS · KUALA LUMPUR · SELANGOR · SAME-DAY EXPRESS · ";

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
        const scale = 0.6 + (depth + 1) * 0.25;
        node.style.transform = `translate(-50%, -50%) translate(${x}cqw, ${y}cqw) scale(${scale})`;
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
      <div className="absolute inset-[14%] rounded-full bg-[radial-gradient(circle_at_40%_35%,#fff5f8_0%,#f5b8cb_35%,#9b2c55_72%,transparent_74%)] opacity-90" />
      <div className="absolute inset-[9%] rounded-full border border-gold/30" />
      <div className="absolute inset-[3%] rounded-full border border-white/10" />

      {/* rotating text ring */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-spin-slow">
        <defs><path id="hero-ring" d="M100,100 m-90,0 a90,90 0 1,1 180,0 a90,90 0 1,1 -180,0" /></defs>
        <text fill="#e9d3a6" fontSize="7" letterSpacing="3">
          <textPath href="#hero-ring" textLength="560" lengthAdjust="spacing">{RING_TEXT}</textPath>
        </text>
      </svg>

      {/* orbiting flower medallions */}
      {heroFlowers.map((src, i) => (
        <div key={src} ref={(n) => { orbit.current[i] = n; }}
          className="absolute left-1/2 top-[55%] w-[17%] aspect-square rounded-full p-[3px] bg-gradient-to-br from-gold via-white to-gold shadow-[0_12px_30px_-6px_rgba(0,0,0,.55)] will-change-transform">
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <Image src={src} alt="" fill sizes="100px" className="object-cover" />
          </div>
        </div>
      ))}

      {/* bouquet in 3D */}
      <div className="absolute inset-0 z-20 [perspective:1200px] pointer-events-none">
        <div className="absolute inset-[10%] hero-float" style={{ transform: "rotateX(var(--tilt-x,0deg)) rotateY(var(--tilt-y,0deg))", transformStyle: "preserve-3d" }}>
          {bouquets.map((src, i) => (
            <Image key={src} src={src} alt="" fill priority={i === 0} sizes="(max-width:1024px) 80vw, 500px"
              className={`object-contain drop-shadow-[0_30px_40px_rgba(30,5,12,.6)] transition-all duration-1000 ${i === active ? "opacity-100 [transform:rotateY(0deg)_scale(1)]" : "opacity-0 [transform:rotateY(90deg)_scale(.9)]"}`} />
          ))}
        </div>
      </div>

      <div className="absolute left-1/2 bottom-[5%] w-[44%] h-[5%] rounded-[50%] bg-black/40 blur-xl hero-shadow" />
    </div>
  );
}
