import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, MousePointerClick, MessageCircle, Truck, Heart, Leaf, ShieldCheck, Zap, CalendarClock, MapPin } from "lucide-react";
import { categories } from "@/data/categories";
import { featuredProducts } from "@/data/products";
import { selangor, kl } from "@/data/locations";
import { faqs } from "@/data/faqs";
import ProductCard from "@/components/product/ProductCard";
import Photo from "@/components/ui/Photo";
import HeroStage from "@/components/sections/HeroStage";
import Petals from "@/components/sections/Petals";
import VideoBand from "@/components/sections/VideoBand";
import SectionTitle from "@/components/sections/SectionTitle";
import TrustBar from "@/components/sections/TrustBar";
import Reviews from "@/components/sections/Reviews";
import Faq from "@/components/sections/Faq";
import WhatsAppButton from "@/components/whatsapp/WhatsAppButton";
import { site, deliveryMethods } from "@/lib/site";
import { siteImages } from "@/lib/images";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: `${site.name} | Florist & Same-Day Flower Delivery in KL & Selangor`,
  description:
    "Rose bouquets, tulips, sunflowers, flower boxes and convocation flowers. Same-day express or scheduled delivery across Kuala Lumpur & Selangor. Order on WhatsApp in 1 minute.",
  path: "/",
});

const occasions = [
  { label: "Birthday", href: "/category/birthday-flowers", emoji: "🎂" },
  { label: "Anniversary", href: "/category/anniversary-flowers", emoji: "💕" },
  { label: "Convocation", href: "/category/graduation-flowers", emoji: "🎓" },
  { label: "Get Well Soon", href: "/category/everlasting-bouquets", emoji: "🌷" },
  { label: "Luxury Boxes", href: "/category/flower-boxes", emoji: "🎁" },
  { label: "Just Because", href: "/category/tulip-bouquets", emoji: "✨" },
];

const steps = [
  { icon: MousePointerClick, title: "Choose a bouquet", text: "Open the bouquet you like, pick the size and Same-day Express or Scheduled delivery." },
  { icon: MessageCircle, title: "Pick a WhatsApp message", text: "Order, ask a question, request a custom version or check your area — the bouquet details are added for you." },
  { icon: Truck, title: "Confirm & we deliver", text: "We confirm the total, send a photo of your bouquet and deliver it with care." },
];

const reasons = [
  { icon: Heart, title: "Hand-tied with care", text: "Every bouquet is arranged by hand, never mass-produced." },
  { icon: Leaf, title: "Fresh every morning", text: "Flowers sourced daily from trusted growers." },
  { icon: ShieldCheck, title: "Pay after confirming", text: "We confirm the total on WhatsApp before you pay." },
  { icon: Truck, title: "KL & Selangor wide", text: "32 delivery areas, express or scheduled." },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_70%_40%,#2c6e54_0%,#0f2a20_50%,#07160f_100%)] text-white">
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-petal/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-[360px] h-[360px] rounded-full bg-gold/10 blur-3xl" />
        <Petals />
        <div className="relative container-x pt-10 pb-16 lg:py-20 grid lg:grid-cols-2 gap-8 items-center">
          <div className="max-w-2xl order-2 lg:order-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 glass !bg-white/10 border border-white/25 rounded-full px-4 py-1.5 text-xs font-semibold">
              <Sparkles className="w-4 h-4" /> Florist in Kuala Lumpur & Selangor
            </div>
            <h1 className="mt-6 text-4xl sm:text-6xl xl:text-7xl font-semibold leading-[1.05]">
              Flowers that say it <span className="italic text-petal">beautifully</span>
            </h1>
            <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Hand-tied bouquets and luxury flower boxes, delivered same-day or on the date you choose — ordered in one tap on WhatsApp.
            </p>
            <div className="mt-9 flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link href="/shop" className="btn bg-white text-brand hover:bg-blush !px-7 !py-4">Shop Bouquets <ArrowRight className="w-4 h-4" /></Link>
              <WhatsAppButton label="Order on WhatsApp" className="btn btn-wa !px-7 !py-4 shadow-xl shadow-wa/30" />
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              {[["32", "delivery areas"], ["Same-day", "express delivery"], ["100%", "hand-tied"]].map(([value, label]) => (
                <div key={label}><dt className="font-serif text-2xl sm:text-3xl font-semibold text-gold whitespace-nowrap">{value}</dt><dd className="text-xs text-white/70">{label}</dd></div>
              ))}
            </dl>
          </div>
          <div className="order-1 lg:order-2"><HeroStage /></div>
        </div>
      </section>

      <section className="bg-white border-b border-blush-2"><div className="container-x py-8"><TrustBar /></div></section>

      {/* OCCASIONS */}
      <section className="container-x mt-14">
        <div className="flex gap-3 overflow-x-auto pb-2 md:justify-center">
          {occasions.map((o) => (
            <Link key={o.label} href={o.href} className="shrink-0 flex items-center gap-2 bg-white border border-blush-2 rounded-full px-5 py-2.5 text-sm font-medium hover:bg-blush hover:border-brand transition">
              <span>{o.emoji}</span> {o.label}
            </Link>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-x mt-20">
        <SectionTitle eyebrow="Shop by category" title="Find the perfect bouquet" sub="From timeless roses to luxury flower boxes — every bouquet is hand-tied in the Klang Valley." />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className="group tilt relative aspect-[4/5] rounded-3xl overflow-hidden">
              <Photo src={c.image} tone={c.tone} alt={`${c.name} delivery KL Selangor`} sizes="(max-width:768px) 50vw, 25vw" imgClassName="group-hover:scale-110 transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/85 via-deep/10 to-transparent" />
              <div className="absolute bottom-0 p-4 md:p-5 text-white">
                <h3 className="font-serif text-base md:text-xl font-semibold leading-tight">{c.name}</h3>
                <p className="hidden sm:block text-xs md:text-sm text-white/80">{c.short}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="container-x mt-24">
        <div className="flex items-end justify-between gap-4">
          <SectionTitle eyebrow="Customer favourites" title="Best-selling bouquets" center={false} />
          <Link href="/shop" className="hidden md:flex items-center gap-1 text-brand font-semibold mb-10">View all <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts().map((p, i) => <ProductCard key={p.slug} p={p} priority={i < 4} />)}
        </div>
      </section>

      {/* DELIVERY OPTIONS */}
      <section className="container-x mt-24 grid md:grid-cols-2 gap-6">
        {deliveryMethods.map((d, i) => {
          const Icon = i === 0 ? Zap : CalendarClock;
          return (
            <div key={d.id} className={`rounded-[2rem] p-8 md:p-10 ${i === 0 ? "bg-gradient-to-br from-brand to-deep text-white" : "bg-white border border-blush-2"}`}>
              <Icon className={`w-10 h-10 ${i === 0 ? "text-petal" : "text-brand"}`} />
              <h3 className="mt-4 text-2xl md:text-3xl font-semibold">{d.label}</h3>
              <p className={`mt-2 ${i === 0 ? "text-white/80" : "text-muted"}`}>{d.detail}. {i === 0 ? "Perfect for last-minute surprises." : "Plan ahead for birthdays, anniversaries and events."}</p>
            </div>
          );
        })}
      </section>

      {/* HOW TO ORDER */}
      <section className="mt-24 bg-white border-y border-blush-2 petal-bg">
        <div className="container-x py-20">
          <SectionTitle eyebrow="Easy ordering" title="Order in 3 simple steps" sub="No cart, no long checkout. Choose a bouquet and chat with a real florist on WhatsApp." />
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
            Looking for a florist near you in the Klang Valley? {site.name} delivers hand-tied bouquets to homes, offices, hospitals and university campuses across Kuala Lumpur and Selangor — from Shah Alam, Petaling Jaya and Subang Jaya to Cheras, Bangsar and Mont Kiara.
          </p>
          <p>
            Choose from classic red rose bouquets, soft pink roses, tulips, bright sunflowers for convocation, fragrant lilies, luxury peonies and flower boxes that need no vase. Prefer something that lasts? Our soap rose and handmade bouquets stay beautiful for months.
          </p>
          <h2>Same-day express or scheduled delivery</h2>
          <p>
            Order before {site.sameDayCutoff} for Same-day Express delivery, or choose Scheduled Delivery for 1–2 days ahead. Ordering is simple: open a bouquet, tap the WhatsApp button and pick a message — the bouquet name, size, price and delivery choice are added for you.
          </p>
          <h2>Flowers for every Malaysian celebration</h2>
          <p>
            From Hari Raya open houses and Chinese New Year visits to Deepavali, Mother&apos;s Day, Valentine&apos;s Day and 520, we prepare bouquets in the colours and styles each celebration calls for. Need something special? Send a reference photo and we&apos;ll create a custom bouquet within your budget.
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
