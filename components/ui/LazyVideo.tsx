"use client";
import { useEffect, useRef, useState } from "react";

/** Video that only downloads when it scrolls near the screen, so the page opens fast. */
export default function LazyVideo({ src, mobileSrc, poster, className = "" }: { src: string; mobileSrc?: string; poster?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setLoad(true); io.disconnect(); } }, { rootMargin: "600px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // Sources are added only now, so tell the browser to pick them up, then play.
  useEffect(() => {
    const v = ref.current;
    if (!load || !v) return;
    v.load();
    v.play().catch(() => {});
  }, [load]);
  return (
    <video ref={ref} className={className} muted loop playsInline preload="none" poster={load ? poster : undefined} autoPlay={load}>
      {load && mobileSrc && <source src={mobileSrc} type="video/mp4" media="(max-width: 767px)" />}
      {load && <source src={src} type="video/mp4" />}
    </video>
  );
}
