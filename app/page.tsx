import Link from "next/link";
import FillImage from "@/components/ui/FillImage";
import Image from "next/image";
import { ArrowRight, Sparkles, MousePointerClick, MessageCircle, Truck, Heart, Leaf, ShieldCheck, MapPin } from "lucide-react";
import { featuredProducts, productsInCategory } from "@/data/products";
import CategoryCircles from "@/components/sections/CategoryCircles";
import { getCategory } from "@/data/categories";
import DeliveryWays from "@/components/sections/DeliveryWays";
import { selangor, kl } from "@/data/locations";
import { faqs } from "@/data/faqs";
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

export const metadata = pageMeta({
  title: `${site.name} | Florist & Flower Delivery in KL & Selangor`,
  description:
    "Long-lasting soap rose bouquets, Ferrero Rocher bouquets, heart bouquets and graduation bouquets. Same-day delivery or pre-order across Kuala Lumpur & Selangor. Order on WhatsApp in 1 minute.",
  path: "/",
});

const steps = [
  { icon: MousePointerClick, title: "Tap “Order now”", text: "Tap Order now on any bouquet. Want several? Tap + to add them to your order list." },
  { icon: MessageCircle, title: "Confirm & pay in advance", text: "WhatsApp opens with everything typed. We confirm the total with delivery, then you pay in advance." },
  { icon: Truck, title: "We prepare & deliver", text: "We send a photo of your bouquet, then deliver it by Grab Express, Lalamove or J&T Express." },
];

const reasons = [
  { icon: Heart, title: "Hand-tied with care", text: "Every bouquet is arranged by hand, never mass-produced." },
  { icon: Leaf, title: "Lasts for months", text: "Soap flowers keep their colour and shape without water." },
  { icon: ShieldCheck, title: "Confirmed before you pay", text: "We confirm your order and total on WhatsApp, then you pay in advance." },
  { icon: Truck, title: "KL & Selangor wide", text: "32 delivery areas, instant delivery or pre-order." },
];

export default function Home() {
  const popular = featuredProducts().slice(0, 4);
  const popularSlugs = new Set(popular.map((p) => p.slug));
  return (
    <>
      {/* HERO: 4 auto-changing slides (background + bouquet + flowers) */}
      <HeroSlider />

      <section className="bg-white border-b border-blush-2"><div className="container-x py-8"><TrustBar /></div></section>

      <CategoryCircles />

      {/* PRODUCTS (like a shop front). Rows with fewer than 2 products hide themselves. */}
      <ProductRow eyebrow="Customer favourites" title="Best Sellers" href="/shop" items={popular} priority />

      <ProductRow eyebrow="Long-lasting & elegant" title="Premium Flower's Bouquet" href="/category/premium-bouquets" items={productsInCategory("premium-bouquets").filter((p) => !popularSlugs.has(p.slug))} />
      {["fresh-flowers", "flower-gift-box", "below-100", "crochet-bouquets", "chocolate-flower-bouquets", "mini-bouquets", "pre-order", "add-ons"].map((slug) => {
        const c = getCategory(slug);
        const items = productsInCategory(slug).filter((p) => !popularSlugs.has(p.slug));
        return c && <ProductRow key={slug} eyebrow={c.short} title={c.name} href={`/category/${slug}`} items={items} />;
      })}

      {/* HOW IT'S MADE: 3D build of a real bouquet (after all the products) */}
      <BouquetCraft />

      {/* INSTANT / PRE-ORDER / CUSTOM + PARTNERS + PAYMENT */}
      <DeliveryWays />

      {/* HOW TO ORDER */}
      <section className="mt-24 bg-white border-y border-blush-2 petal-bg">
        <div className="container-x py-20">
          <SectionTitle eyebrow="Easy ordering" title="Order in 3 simple steps" sub="No checkout and no account needed. Choose your flowers and chat with a real florist on WhatsApp." />
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="tilt bg-cream rounded-3xl p-8 text-center border border-blush-2/70">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-brand to-deep text-white grid place-items-center"><Icon className="w-6 h-6" /></div>
                <h3 className="mt-5 text-xl font-semibold">{i + 1}. {title}</h3>
                <p className="mt-2 text-muted text-[15px] leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
        <FillImage src={siteImages.klNight} alt="Kuala Lumpur skyline with the Petronas Twin Towers" w={1080} h={608} quality={60} className="object-cover" />
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

      {/* SEO CONTENT */}
      <section className="container-x mt-24">
        <div className="max-w-4xl mx-auto prose-bf">
          <h2 className="text-3xl font-semibold text-center">Online florist in Kuala Lumpur & Selangor</h2>
          <p>
            Looking for a florist near you in the Klang Valley? {site.name} delivers premium soap flower bouquets to homes, offices, hospitals and campuses across Kuala Lumpur and Selangor, from Shah Alam, Petaling Jaya and Subang Jaya to Cheras, Bangsar and Mont Kiara.
          </p>
          <p>
            Shop our best-selling Soap Rose Heart bouquet, Ferrero Rocher soap rose bouquets in pink or red, Blue Noir for him, Bestie Blossoms for your best friend and The Graduation Signature for convocation day. Soap flowers look real, smell lovely and last for months without water.
          </p>
          <h2>Instant delivery or pre-order</h2>
          <p>
            Need flowers today? Choose Instant Delivery and we send it the same day, any time by Grab Express or Lalamove. Planning ahead? Pre-order and tell us exactly what you want and the date. You can even send us a photo and we will make it for you. Payment is made in advance once we confirm your order on WhatsApp.
          </p>
          <h2>Flowers for every Malaysian celebration</h2>
          <p>
            From Hari Raya open houses and Chinese New Year visits to Deepavali, convocations, Mother&apos;s Day, Valentine&apos;s Day and 520, we prepare bouquets in the colours and styles each celebration calls for.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-x mt-20">
        <SectionTitle eyebrow="FAQ" title="Frequently asked questions" />
        <Faq items={faqs.slice(0, 6)} />
      </section>

      <MomentsCarousel />

      <VideoBand />
    </>
  );
}
