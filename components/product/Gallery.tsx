"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Palette, X } from "lucide-react";
import { useVariant } from "./VariantProvider";

/** Product photos: big image with a soft fade between photos, arrows, swipe on phones and thumbnails. */
export default function Gallery({ alt }: { alt: string }) {
  const { images, paper, setPaper } = useVariant();
  const [i, setI] = useState(0);
  const [showPaper, setShowPaper] = useState(false);
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
        <Image key={src} src={src} alt={previewing ? `${alt} – ${paper!.label} wrapping preview` : `${alt} – photo ${i + 1}`} fill priority quality={90}
          sizes="(max-width:1024px) 100vw, 50vw" className="object-cover gallery-in" />
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
            <button onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 backdrop-blur grid place-items-center shadow-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => go(1)} aria-label="Next photo" className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 backdrop-blur grid place-items-center shadow-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition"><ChevronRight className="w-5 h-5" /></button>
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
              <Image src={s} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
