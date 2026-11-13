"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import HeroStage, { type StageSlide } from "./HeroStage";
import { Rose, Daisy, Sunflower, GoldBall, Sprig, Orchid, Leaf } from "./Flowers";
import { getProduct } from "@/data/products";
import { formatPrice } from "@/lib/site";
import WhatsAppButton from "@/components/whatsapp/WhatsAppButton";

type Slide = StageSlide & { slug: string; eyebrow: string; title: [string, string]; text: string };

/** Each slide shows one of our bouquets, with the same flowers it is made of floating around it. */
const slides: Slide[] = [
  {
    slug: "red-soap-rose-heart-large",
    image: "/images/hero/red-soap-rose-heart-large.webp",
    alt: "Red Soap Rose Heart Large bouquet",
    eyebrow: "Top Seller",
    title: ["25 roses,", "one heart"],
    text: "Our best-selling soap rose heart. It looks real, smells lovely and lasts for months. Same-day delivery across KL & Selangor.",
    orbiters: [<Rose key="1" tint="red" />, <Sprig key="2" color="#b98a96" />, <Rose key="3" tint="red" />, <Leaf key="4" />, <Rose key="5" tint="blush" />],
  },
  {
    slug: "ferrero-rocher-pink-roses",
    image: "/images/hero/ferrero-rocher-pink-roses.webp",
    alt: "Ferrero Rocher Pink Roses soap bouquet",
    eyebrow: "Sweet & long-lasting",
    title: ["Roses &", "Ferrero Rocher"],
    text: "Ten pink soap roses with seven Ferrero Rocher chocolates, wrapped as one sweet gift for someone special.",
    orbiters: [<Rose key="1" tint="pink" />, <GoldBall key="2" />, <Sprig key="3" color="#b0227a" />, <Rose key="4" tint="blush" />, <GoldBall key="5" />],
  },
  {
    slug: "graduation-signature",
    image: "/images/hero/graduation-signature.webp",
    alt: "The Graduation Signature soap bouquet with sunflowers and teddy",
    eyebrow: "Convocation season",
    title: ["Celebrate their", "big day"],
    text: "Sunflowers, blue and white roses and a little graduate teddy. Available in your university's colours on pre-order.",
    orbiters: [<Sunflower key="1" />, <Daisy key="2" />, <Rose key="3" tint="blue" />, <Sunflower key="4" />, <Rose key="5" tint="ivory" />],
  },
  {
    slug: "blue-noir-for-him",
    image: "/images/hero/blue-noir-for-him.webp",
    alt: "Blue Noir For Him soap rose bouquet",
    eyebrow: "For him",
    title: ["Bold, elegant,", "made for him"],
    text: "Twenty-five blue and black soap roses in sleek black wrapping. A bouquet he will actually keep.",
    orbiters: [<Rose key="1" tint="blue" />, <Rose key="2" tint="black" />, <Orchid key="3" />, <Rose key="4" tint="blue" />, <Rose key="5" tint="black" />],
  },
];

const DURATION = 5000;

export default function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % slides.length), DURATION);
    return () => clearTimeout(t);
  }, [active, paused]);

  const go = (d: number) => setActive((a) => (a + d + slides.length) % slides.length);
  const s = slides[active];
  const p = getProduct(s.slug);

  return (
    <div className="relative container-x pt-8 pb-14 lg:py-16 grid lg:grid-cols-2 gap-6 lg:gap-8 items-center"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}>
      <div className="max-w-2xl order-2 lg:order-1 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 glass !bg-white/10 border border-white/25 rounded-full px-4 py-1.5 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-gold" /> Florist in Kuala Lumpur & Selangor, Malaysia
        </div>
        <h1 className="sr-only">BikaFlora – soap flower bouquet delivery in Kuala Lumpur & Selangor</h1>

        <div key={active} className="hero-text-in" aria-live="polite">
          <p className="mt-6 text-sm uppercase tracking-[0.25em] text-gold font-semibold">{s.eyebrow}</p>
          <p className="mt-3 font-serif text-4xl sm:text-6xl xl:text-7xl font-semibold leading-[1.05]">
            {s.title[0]} <span className="italic text-petal">{s.title[1]}</span>
          </p>
          <p className="mt-5 text-lg text-white/80 leading-relaxed max-w-xl mx-auto lg:mx-0">{s.text}</p>
          {p && (
            <Link href={`/product/${p.slug}`} className="mt-5 inline-flex items-center gap-3 rounded-full bg-white/10 border border-white/20 pl-5 pr-2 py-2 hover:bg-white/15 transition">
              <span className="text-sm text-left"><b className="line-clamp-1">{p.name}</b><span className="whitespace-nowrap">{formatPrice(p.price)}{p.compareAt && <s className="ml-1.5 text-white/50">{formatPrice(p.compareAt)}</s>}</span></span>
              <span className="w-8 h-8 rounded-full bg-gold text-deep grid place-items-center"><ArrowRight className="w-4 h-4" /></span>
            </Link>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
          <Link href="/shop" className="btn bg-white text-brand hover:bg-blush !px-7 !py-4">Shop Bouquets <ArrowRight className="w-4 h-4" /></Link>
          <WhatsAppButton label="Order on WhatsApp" className="btn btn-wa !px-7 !py-4 shadow-xl shadow-wa/30" />
        </div>

        {/* slide controls */}
        <div className="mt-8 flex items-center gap-2 justify-center lg:justify-start" role="tablist" aria-label="Featured bouquets">
          {slides.map((sl, i) => (
            <button key={sl.slug} role="tab" aria-selected={i === active} aria-label={`Show ${sl.alt}`} onClick={() => setActive(i)}
              className={`relative h-1.5 rounded-full overflow-hidden transition-all ${i === active ? "w-14 bg-white/25" : "w-6 bg-white/25 hover:bg-white/40"}`}>
              {i === active && <span key={`${active}-${paused}`} className={`absolute inset-y-0 left-0 bg-gold ${paused ? "w-full" : "hero-progress"}`} style={{ animationDuration: `${DURATION}ms` }} />}
            </button>
          ))}
        </div>
      </div>
      <div className="order-1 lg:order-2"><HeroStage slides={slides} active={active} /></div>
    </div>
  );
}
