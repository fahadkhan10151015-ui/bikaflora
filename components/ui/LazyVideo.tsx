"use client";
import { useEffect, useRef, useState } from "react";

/** Video that only downloads when it scrolls near the screen, so the page opens fast. */
export default function LazyVideo({ src, poster, className = "" }: { src: string; poster?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setLoad(true); io.disconnect(); } }, { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => { if (load) ref.current?.play().catch(() => {}); }, [load]);
  return (
    <video ref={ref} className={className} muted loop playsInline preload="none" poster={poster} autoPlay={load}>
      {load && <source src={src} type="video/mp4" />}
    </video>
  );
}
