"use client";
import FillImage from "@/components/ui/FillImage";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Palette, X, ZoomIn } from "lucide-react";
import { useVariant } from "./VariantProvider";

/** Product photos: big image with a soft fade between photos, arrows, swipe on phones and thumbnails. */
export default function Gallery({ alt }: { alt: string }) {
  const { images, paper, setPaper } = useVariant();
  const [i, setI] = useState(0);
  const [showPaper, setShowPaper] = useState(false);
  // Full-screen zoom: loads the full-resolution original only when opened.
  const [zoom, setZoom] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  useEffect(() => {
    if (!zoom) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") setZoom(false); };
    document.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [zoom]);
  const touchX = useRef<number | null>(null);

  // New colour picked: start again from its first photo.
  useEffect(() => setI(0), [images]);
  // New wrapping colour picked: show its preview (it is not one of the normal photos).
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setShowPaper(!!paper);
    // On phones the colour buttons sit below the photo: bring the photo into view so the change is seen.
    const el = box.current;
    if (paper && el) {
      const r = el.getBoundingClientRect();
      if (r.bottom < 120 || r.top > window.innerHeight - 120) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [paper]);

  const go = (d: number) => { setShowPaper(false); setI((n) => (n + d + images.length) % images.length); };
  const previewing = showPaper && paper?.image;
  const src = previewing ? paper!.image! : images[Math.min(i, images.length - 1)];

  return (
    <div>
      <div ref={box} className="relative aspect-square rounded-[1.75rem] overflow-hidden bg-blush group scroll-mt-28"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}>
        <FillImage key={src} src={src} alt={previewing ? `${alt} – ${paper!.label} wrapping preview` : `${alt} – photo ${i + 1}`} w={540} h={540} priority className="object-cover gallery-in" />
        <button type="button" onClick={() => { setZoom(true); setZoomed(false); }} aria-label="Zoom photo"
          className="absolute inset-0 z-[1] cursor-zoom-in" />
        <span className="pointer-events-none absolute right-3 bottom-3 sm:bottom-auto sm:top-3 z-[2] w-9 h-9 rounded-full bg-white/85 text-ink grid place-items-center shadow-md"><ZoomIn className="w-4 h-4" /></span>
        {previewing && (
          <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2">
            <span className="glass text-brand text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Palette className="w-4 h-4" /> {paper!.label} wrapping preview
            </span>
            <button onClick={() => setPaper(undefined)} className="glass text-ink text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1" aria-label="Back to original wrapping">
              <X className="w-3.5 h-3.5" /> Original
            </button>
          </div>
        )}
        {images.length > 1 && (
          <>
            <button onClick={() => go(-1)} aria-label="Previous photo" className="z-[2] absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 backdrop-blur grid place-items-center shadow-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => go(1)} aria-label="Next photo" className="z-[2] absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 backdrop-blur grid place-items-center shadow-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition"><ChevronRight className="w-5 h-5" /></button>
            <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 sm:hidden">
              {images.map((_, idx) => <span key={idx} className={`h-1.5 rounded-full transition-all ${idx === i && !previewing ? "w-5 bg-white" : "w-1.5 bg-white/60"}`} />)}
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2 sm:gap-3">
          {images.map((s, idx) => (
            <button key={s} onClick={() => { setShowPaper(false); setI(idx); }} aria-label={`View photo ${idx + 1}`}
              className={`relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden border-2 transition ${idx === i && !previewing ? "border-brand" : "border-transparent opacity-75 hover:opacity-100"}`}>
              <FillImage src={s} alt="" w={120} h={120} className="object-cover" />
            </button>
          ))}
        </div>
      )}
      {zoom && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" role="dialog" aria-label="Zoomed photo"
          onClick={() => setZoom(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} draggable={false}
            onClick={(e) => {
              e.stopPropagation();
              const r = e.currentTarget.getBoundingClientRect();
              setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
              setZoomed((z) => !z);
            }}
            style={{ transformOrigin: origin }}
            className={`max-w-[96vw] max-h-[90vh] object-contain select-none transition-transform duration-300 ${zoomed ? "scale-[2.2] cursor-zoom-out" : "cursor-zoom-in"}`} />
          <button onClick={() => setZoom(false)} aria-label="Close" className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/15 text-white grid place-items-center"><X className="w-6 h-6" /></button>
          {images.length > 1 && !previewing && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setZoomed(false); go(-1); }} aria-label="Previous photo" className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 text-white grid place-items-center"><ChevronLeft className="w-6 h-6" /></button>
              <button onClick={(e) => { e.stopPropagation(); setZoomed(false); go(1); }} aria-label="Next photo" className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 text-white grid place-items-center"><ChevronRight className="w-6 h-6" /></button>
            </>
          )}
          <p className="absolute bottom-4 inset-x-0 text-center text-white/70 text-sm">Tap the photo to zoom in · tap outside to close</p>
        </div>
      )}
    </div>
  );
}
