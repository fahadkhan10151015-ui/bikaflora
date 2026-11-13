"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useVariant } from "./VariantProvider";

/** Product photos: big image with a soft fade between photos, arrows, swipe on phones and thumbnails. */
export default function Gallery({ alt }: { alt: string }) {
  const { images } = useVariant();
  const [i, setI] = useState(0);
  const touchX = useRef<number | null>(null);

  // New colour picked: start again from its first photo.
  useEffect(() => setI(0), [images]);

  const go = (d: number) => setI((n) => (n + d + images.length) % images.length);
  const src = images[Math.min(i, images.length - 1)];

  return (
    <div>
      <div className="relative aspect-square rounded-[1.75rem] overflow-hidden bg-blush group"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}>
        <Image key={src} src={src} alt={`${alt} – photo ${i + 1}`} fill priority quality={90}
          sizes="(max-width:1024px) 100vw, 50vw" className="object-cover gallery-in" />
        {images.length > 1 && (
          <>
            <button onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 backdrop-blur grid place-items-center shadow-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => go(1)} aria-label="Next photo" className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 backdrop-blur grid place-items-center shadow-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition"><ChevronRight className="w-5 h-5" /></button>
            <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 sm:hidden">
              {images.map((_, idx) => <span key={idx} className={`h-1.5 rounded-full transition-all ${idx === i ? "w-5 bg-white" : "w-1.5 bg-white/60"}`} />)}
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2 sm:gap-3">
          {images.map((s, idx) => (
            <button key={s} onClick={() => setI(idx)} aria-label={`View photo ${idx + 1}`}
              className={`relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden border-2 transition ${idx === i ? "border-brand" : "border-transparent opacity-75 hover:opacity-100"}`}>
              <Image src={s} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
