"use client";
import Image from "next/image";
import { toneBg } from "@/lib/tones";
import { useState } from "react";

export default function Gallery({ images, tones = [], alt }: { images: string[]; tones?: string[]; alt: string }) {
  const [i, setI] = useState(0);
  return (
    <div>
      <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden transition-all" style={toneBg(tones[i])}>
        <Image src={images[i]} alt={alt} fill priority sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((src, idx) => (
            <button key={src + idx} style={toneBg(tones[idx])} onClick={() => setI(idx)} className={`relative aspect-square rounded-2xl overflow-hidden border-2 ${idx === i ? "border-brand" : "border-transparent"}`} aria-label={`View image ${idx + 1}`}>
              <Image src={src} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
