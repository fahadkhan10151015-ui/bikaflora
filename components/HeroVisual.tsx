import Image from "next/image";
import { site } from "@/lib/site";
import { tones } from "@/lib/tones";

/**
 * Animated hero background.
 * - If `site.heroVideo` is set (e.g. "/video/hero.mp4"), your video plays.
 * - Otherwise a soft, video-like slideshow of your bouquets is shown (very light & fast for SEO).
 */
const slides = [
  { src: "/images/products/bouquet-a.webp", bg: tones.blush },
  { src: "/images/products/bouquet-b.webp", bg: tones.cream },
  { src: "/images/products/bouquet-a.webp", bg: tones.peach },
  { src: "/images/products/bouquet-b.webp", bg: tones.lavender },
];

export default function HeroVisual() {
  if (site.heroVideo) {
    return (
      <video className="absolute inset-0 w-full h-full object-cover object-right" autoPlay muted loop playsInline aria-hidden="true">
        <source src={site.heroVideo} type="video/mp4" />
      </video>
    );
  }
  const dur = slides.length * 5;
  return (
    <div className="absolute inset-0" aria-hidden="true">
      {slides.map((s, i) => (
        <div key={i} className="hero-slide absolute inset-0" style={{ background: s.bg, animationDuration: `${dur}s`, animationDelay: `${i * 5 - 0.01}s`, opacity: i === 0 ? 1 : 0 }}>
          <div className="hero-zoom absolute right-[-10%] md:right-[4%] top-[6%] bottom-[2%] aspect-[4/5]" style={{ animationDuration: `${dur}s`, animationDelay: `${i * 5}s` }}>
            <Image src={s.src} alt="" fill priority={i === 0} sizes="(max-width:768px) 90vw, 45vw" className="object-contain" />
          </div>
        </div>
      ))}
      {/* floating petals */}
      {[12, 28, 46, 63, 81].map((left, i) => (
        <span key={left} className="petal" style={{ left: `${left}%`, animationDelay: `${i * 2.3}s`, animationDuration: `${11 + i}s` }} />
      ))}
    </div>
  );
}
