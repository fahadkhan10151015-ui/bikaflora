import Link from "next/link";
import FillImage from "@/components/ui/FillImage";
import Image from "next/image";
import { ArrowRight, Sparkles, MessageCircle, Truck, Heart, Leaf, ShieldCheck, MapPin, Gift, Award, Clock, Wallet, Languages } from "lucide-react";
import { featuredProducts, productsInCategory } from "@/data/products";
import CategoryCircles from "@/components/sections/CategoryCircles";
import { getCategory } from "@/data/categories";
import DeliveryWays from "@/components/sections/DeliveryWays";
import { selangor, kl } from "@/data/locations";
import { pageCopy } from "@/data/page-copy";
import Reveal from "@/components/ui/Reveal";
import ProductRow from "@/components/product/ProductRow";
import HeroSlider from "@/components/sections/HeroSlider";
import Petals from "@/components/sections/Petals";
import VideoBand from "@/components/sections/VideoBand";
import BouquetCraft from "@/components/sections/BouquetCraft";
import SectionTitle from "@/components/sections/SectionTitle";
import TrustBar from "@/components/sections/TrustBar";
import Reviews from "@/components/sections/Reviews";
import Faq from "@/components/sections/Faq";
import MomentsCarousel from "@/components/sections/MomentsCarousel";
import WhatsAppButton from "@/components/whatsapp/WhatsAppButton";
import { site } from "@/lib/site";
import { siteImages } from "@/lib/images";
import { pageMeta } from "@/lib/seo";

const c = pageCopy.home;
export const metadata = pageMeta({ title: c.title, description: c.description, path: "/", absoluteTitle: true });

const copyIcons = [Gift, Award, Leaf, Clock, MessageCircle, Wallet, Languages];


const reasons = [
  { icon: Heart, title: "Hand-tied with care", text: "Every bouquet is arranged by hand, never mass-produced." },
  { icon: Leaf, title: "Lasts for months", text: "Soap flowers keep their colour and shape without water." },
  { icon: ShieldCheck, title: "Confirmed before you pay", text: "We confirm your order and total on WhatsApp, then you pay in advance." },
  { icon: Truck, title: "KL & Selangor wide", text: "32 delivery areas, instant delivery or pre-order." },
];

export default function Home() {
  // Hero picture hints: React lifts these <link> tags into <head>, so the picture starts downloading straight away
  // (before the inline styles). Plain <link> elements (not preload()) only apply on this page, not on prefetches.
  const popular = featuredProducts().slice(0, 4);
  return (
    <>
      <link rel="preload" as="image" href="/video/hero-vertical-poster-v2.avif" type="image/avif" media="(max-width: 767px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/video/hero-making-poster.avif" type="image/avif" media="(min-width: 768px)" fetchPriority="high" />
      {/* HERO: 4 auto-changing slides (background + bouquet + flowers) */}
      <HeroSlider />

      <section className="bg-white border-b border-blush-2"><div className="container-x py-8"><TrustBar /></div></section>

      <CategoryCircles />

      {/* PRODUCTS (like a shop front). Rows with fewer than 2 products hide themselves. */}
      <ProductRow eyebrow="Customer favourites" title="Best Sellers" href="/category/best-seller" items={popular} total={productsInCategory("best-seller").length} />

      {/* Everything below is drawn only when the visitor scrolls near it (much less work for phones on first load). */}
      <div className="home-lazy">
      {/* Each row shows 4 bouquets, preferring ones not already shown higher up (no repeats, smaller page). */}
      {(() => {
        const used = new Set(popular.map((p) => p.slug));
        const pick = (slug: string) => {
          const all = productsInCategory(slug);
          const fresh = all.filter((p) => !used.has(p.slug));
          const items = (fresh.length >= 2 ? [...fresh, ...all.filter((p) => used.has(p.slug))] : all).slice(0, 4);
          items.forEach((p) => used.add(p.slug));
          return { items, total: all.length };
        };
        return [["premium-bouquets", "Long-lasting & elegant", "Premium Soap Flower Bouquets"], ...["fresh-flowers", "flower-gift-box", "below-100", "crochet-bouquets", "chocolate-flower-bouquets", "mini-bouquets", "pre-order", "add-ons"].map((s) => [s])].map(([slug, eyebrow, title]) => {
          const c = getCategory(slug);
          if (!c) return null;
          const { items, total } = pick(slug);
          return <ProductRow key={slug} eyebrow={eyebrow ?? c.short} title={title ?? c.name} href={`/category/${slug}`} items={items} total={total} />;
        });
      })()}

      {/* HOW IT'S MADE: 3D build of a real bouquet (after all the products) */}
      <BouquetCraft />

      {/* INSTANT / PRE-ORDER / CUSTOM + PARTNERS + PAYMENT */}
      <DeliveryWays />

      {/* How to order is covered by the "How to Order in 3 Easy Steps" card in the homepage copy below (no duplicate section). */}

      {/* WHY US */}
      <section className="container-x mt-24 grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <div className="relative aspect-[4/5] max-w-md w-full rounded-[2rem] overflow-hidden shadow-2xl">
            <FillImage src={siteImages.florist} alt="BikaFlora florist arranging a bouquet" w={500} h={625} className="object-cover" />
          </div>
          <div className="absolute -bottom-6 right-0 md:right-10 w-40 md:w-52 aspect-square rounded-3xl overflow-hidden border-8 border-cream shadow-xl">
            <FillImage src={siteImages.holdingBouquet} alt="Bouquet ready for delivery" w={210} h={210} className="object-cover" />
          </div>
        </div>
        <div>
          <div className="eyebrow mb-2">Why {site.name}</div>
          <h2 className="text-3xl md:text-4xl font-semibold">A florist that treats every bouquet like a gift of its own</h2>
          <p className="mt-4 text-muted leading-relaxed">
            We are a Klang Valley florist. Every order is checked by hand and photographed before it leaves, so you know exactly what your loved one will receive.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 gap-5">
            {reasons.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-blush text-brand grid place-items-center shrink-0"><Icon className="w-5 h-5" /></div>
                <div><h3 className="font-sans font-semibold">{title}</h3><p className="text-sm text-muted">{text}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MALAYSIA / AREAS */}
      <section className="mt-28 relative overflow-hidden">
        <FillImage src={siteImages.klNight} alt="Kuala Lumpur skyline with the Petronas Twin Towers" w={1080} h={608} quality={70} className="object-cover" />
        <div className="absolute inset-0 bg-deep/80" />
        <div className="relative container-x py-20 text-white">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="eyebrow !text-petal mb-2 flex items-center justify-center gap-1"><MapPin className="w-4 h-4" /> Delivery areas</div>
            <h2 className="text-3xl md:text-5xl font-semibold">Delivering across Kuala Lumpur & Selangor</h2>
            <p className="mt-3 text-white/80">From KLCC towers to Shah Alam homes — tap your area for local delivery details.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            {[{ title: "Kuala Lumpur", list: kl }, { title: "Selangor", list: selangor }].map((g) => (
              <div key={g.title} className="glass !bg-white/10 border border-white/20 rounded-3xl p-6">
                <h3 className="text-xl font-semibold mb-4">{g.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {g.list.map((l) => (
                    <Link key={l.slug} href={`/flower-delivery/${l.slug}`} className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm hover:bg-white hover:text-brand transition">{l.name}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="container-x mt-24">
        <SectionTitle eyebrow="Happy customers" title="Loved across the Klang Valley" />
        <Reviews />
        <div className="text-center mt-8"><Link href="/reviews" className="btn btn-outline">Read more reviews</Link></div>
      </section>

      {/* SEO CONTENT (homepage copy as cards) */}
      <section className="mt-24 bg-white border-y border-blush-2 petal-bg">
        <div className="container-x py-16 md:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="eyebrow mb-2">Online florist in KL</div>
            <h2 className="text-3xl md:text-5xl font-semibold">Handmade bouquets for every moment</h2>
          </div>
          <div className="mt-12 grid md:grid-cols-2 gap-5 md:gap-6">
            {c.sections!.map((sec, i) => {
              const Icon = copyIcons[i % copyIcons.length];
              const dark = i === 0;
              const wide = i === c.sections!.length - 1 && c.sections!.length % 2 === 1;
              return (
                <Reveal key={sec.title} delay={(i % 2) * 120} className={wide ? "md:col-span-2" : ""}>
                  <div className={`home-card group relative h-full overflow-hidden rounded-[1.75rem] border p-6 md:p-8 ${dark ? "home-card-dark bg-gradient-to-br from-brand to-deep text-white border-transparent" : "bg-white border-blush-2/80"}`}>
                    <span aria-hidden className="home-card-bar" />
                    <span aria-hidden className="home-card-glow" />
                    <div className="relative flex items-center gap-3">
                      <span className={`home-card-icon w-12 h-12 rounded-2xl grid place-items-center shrink-0 ${dark ? "bg-white/15 text-gold" : "bg-blush text-brand"}`}><Icon className="w-6 h-6" /></span>
                      <span className={`text-xs font-semibold tracking-[0.2em] ${dark ? "text-gold" : "text-gold-deep"}`}>{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <h2 lang={/\b(kedai|bunga|dan|untuk|di)\b/i.test(sec.title) ? "ms" : undefined} className="relative mt-4 text-2xl md:text-[1.7rem] font-semibold leading-snug">{sec.title}</h2>
                    <div lang={/\b(kedai|bunga|dan|untuk|di)\b/i.test(sec.title) ? "ms" : undefined} className="relative mt-2" dangerouslySetInnerHTML={{ __html: sec.html }} />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-x mt-20">
        <SectionTitle eyebrow="FAQ" title={c.faqTitle!} />
        <Faq items={c.faqs!} />
      </section>

      <MomentsCarousel />

      <VideoBand />
      </div>
    </>
  );
}
