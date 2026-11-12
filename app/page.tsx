import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, MousePointerClick, MessageCircle, Truck, Heart, Leaf, ShieldCheck, MapPin } from "lucide-react";
import { featuredProducts, productsInCategory } from "@/data/products";
import CategoryCircles from "@/components/sections/CategoryCircles";
import DeliveryWays from "@/components/sections/DeliveryWays";
import { selangor, kl } from "@/data/locations";
import { faqs } from "@/data/faqs";
import ProductRow from "@/components/product/ProductRow";
import HeroStage from "@/components/sections/HeroStage";
import Petals from "@/components/sections/Petals";
import VideoBand from "@/components/sections/VideoBand";
import BouquetCraft from "@/components/sections/BouquetCraft";
import SectionTitle from "@/components/sections/SectionTitle";
import TrustBar from "@/components/sections/TrustBar";
import Reviews from "@/components/sections/Reviews";
import Faq from "@/components/sections/Faq";
import WhatsAppButton from "@/components/whatsapp/WhatsAppButton";
import { site } from "@/lib/site";
import { siteImages } from "@/lib/images";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: `${site.name} | Florist & Flower Delivery in KL & Selangor`,
  description:
    "Fresh flowers, premium bouquets, flower gift boxes, crochet and chocolate bouquets. Instant delivery or pre-order across Kuala Lumpur & Selangor. Order on WhatsApp in 1 minute.",
  path: "/",
});

const steps = [
  { icon: MousePointerClick, title: "Tap “Order now”", text: "Tap Order now on any bouquet. Want several? Tap + to add them to your order list." },
  { icon: MessageCircle, title: "Confirm & pay in advance", text: "WhatsApp opens with everything typed. We confirm the total with delivery, then you pay in advance." },
  { icon: Truck, title: "We prepare & deliver", text: "We send a photo of your bouquet, then deliver it by Grab Express, Lalamove or J&T Express." },
];

const reasons = [
  { icon: Heart, title: "Hand-tied with care", text: "Every bouquet is arranged by hand, never mass-produced." },
  { icon: Leaf, title: "Fresh every morning", text: "Flowers sourced daily from trusted growers." },
  { icon: ShieldCheck, title: "Confirmed before you pay", text: "We confirm your order and total on WhatsApp, then you pay in advance." },
  { icon: Truck, title: "KL & Selangor wide", text: "32 delivery areas, instant delivery or pre-order." },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_70%_40%,#2b3b62_0%,#172036_50%,#0b1121_100%)] text-white">
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-petal/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-[360px] h-[360px] rounded-full bg-gold/10 blur-3xl" />
        <Image src={siteImages.klNight} alt="" fill priority sizes="100vw" className="object-cover object-center opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-deep via-deep/75 to-deep/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep/80 via-transparent to-deep/40" />
        <Petals />
        <div className="relative container-x pt-10 pb-16 lg:py-20 grid lg:grid-cols-2 gap-8 items-center">
          <div className="max-w-2xl order-2 lg:order-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 glass !bg-white/10 border border-white/25 rounded-full px-4 py-1.5 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-gold" /> Florist in Kuala Lumpur & Selangor, Malaysia
            </div>
            <h1 className="mt-6 text-4xl sm:text-6xl xl:text-7xl font-semibold leading-[1.05]">
              Flowers that say it <span className="italic text-petal">beautifully</span>
            </h1>
            <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Fresh bouquets, flower gift boxes, crochet and chocolate bouquets. Instant delivery today or pre-order for your date, ordered in one tap on WhatsApp.
            </p>
            <div className="mt-9 flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link href="/shop" className="btn bg-white text-brand hover:bg-blush !px-7 !py-4">Shop Bouquets <ArrowRight className="w-4 h-4" /></Link>
              <WhatsAppButton label="Order on WhatsApp" className="btn btn-wa !px-7 !py-4 shadow-xl shadow-wa/30" />
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              {[["32", "delivery areas"], ["Instant", "or pre-order"], ["100%", "handmade"]].map(([value, label]) => (
                <div key={label}><dt className="font-serif text-2xl sm:text-3xl font-semibold text-gold whitespace-nowrap">{value}</dt><dd className="text-xs text-white/70">{label}</dd></div>
              ))}
            </dl>
          </div>
          <div className="order-1 lg:order-2"><HeroStage /></div>
        </div>
      </section>

      <section className="bg-white border-b border-blush-2"><div className="container-x py-8"><TrustBar /></div></section>

      <CategoryCircles />

      {/* PRODUCTS BY CATEGORY (like a shop front) */}
      <ProductRow eyebrow="Customer favourites" title="Best Seller" href="/category/best-seller" items={featuredProducts()} priority />
      <ProductRow eyebrow="Hand-tied today" title="Fresh Flowers" href="/category/fresh-flowers" items={productsInCategory("fresh-flowers")} />
      <ProductRow eyebrow="No vase needed" title="Flower Gift Box" href="/category/flower-gift-box" items={productsInCategory("flower-gift-box")} />

      {/* HOW IT'S MADE (animated) */}
      <BouquetCraft />

      <ProductRow eyebrow="Big moments" title="Premium Flower's Bouquet" href="/category/premium-bouquets" items={productsInCategory("premium-bouquets")} />
      <ProductRow eyebrow="Great value" title="Below RM100 Bouquet" href="/category/below-100" items={productsInCategory("below-100")} />
      <ProductRow eyebrow="Handmade, forever" title="Crochet Bouquet" href="/category/crochet-bouquets" items={productsInCategory("crochet-bouquets")} />
      <ProductRow eyebrow="Sweet gifts" title="Chocolate & Flower Bouquets" href="/category/chocolate-flower-bouquets" items={productsInCategory("chocolate-flower-bouquets")} />
      <ProductRow eyebrow="Small & cute" title="Mini Bouquet Series" href="/category/mini-bouquets" items={productsInCategory("mini-bouquets")} />
      <ProductRow eyebrow="Made to your idea" title="Pre-Order" href="/category/pre-order" items={productsInCategory("pre-order")} />
      <ProductRow eyebrow="Make it extra special" title="Add On" href="/category/add-ons" items={productsInCategory("add-ons")} />

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
            <Image src={siteImages.florist} alt="BikaFlora florist arranging a bouquet" fill sizes="(max-width:1024px) 100vw, 40vw" className="object-cover" />
          </div>
          <div className="absolute -bottom-6 right-0 md:right-10 w-40 md:w-52 aspect-square rounded-3xl overflow-hidden border-8 border-cream shadow-xl">
            <Image src={siteImages.holdingBouquet} alt="Bouquet ready for delivery" fill sizes="220px" className="object-cover" />
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
        <Image src={siteImages.klNight} alt="Kuala Lumpur skyline with the Petronas Twin Towers" fill sizes="100vw" className="object-cover" />
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
            Looking for a florist near you in the Klang Valley? {site.name} delivers fresh flowers, premium bouquets and flower gift boxes to homes, offices, hospitals and campuses across Kuala Lumpur and Selangor, from Shah Alam, Petaling Jaya and Subang Jaya to Cheras, Bangsar and Mont Kiara.
          </p>
          <p>
            Shop our best sellers, fresh flower bouquets, handmade crochet bouquets that last forever, chocolate and flower bouquets with Ferrero Rocher, cute mini bouquets and beautiful bouquets below RM100. Add a teddy bear, balloons or chocolates to make it extra special.
          </p>
          <h2>Instant delivery or pre-order</h2>
          <p>
            Need flowers today? Choose Instant Delivery: order before {site.sameDayCutoff} and we send it by Grab Express or Lalamove. Planning ahead? Pre-order and tell us exactly what you want and the date. You can even send us a photo and we will make it for you. Payment is made in advance once we confirm your order on WhatsApp.
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

      <VideoBand />
    </>
  );
}
