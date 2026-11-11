import Link from "next/link";
import Photo from "@/components/Photo";
import HeroVisual from "@/components/HeroVisual";
import { ArrowRight, Sparkles, MousePointerClick, MessageCircle, Truck, Heart, Leaf, ShieldCheck, Clock } from "lucide-react";
import { categories } from "@/data/categories";
import { featuredProducts } from "@/data/products";
import { selangor, kl } from "@/data/locations";
import { faqs } from "@/data/faqs";
import ProductCard from "@/components/ProductCard";
import SectionTitle from "@/components/SectionTitle";
import TrustBar from "@/components/TrustBar";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import WaCta from "@/components/WaCta";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { site } from "@/lib/site";
import { waLink } from "@/lib/whatsapp";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: `${site.name} | Florist & Same-Day Flower Delivery in KL & Selangor`,
  description:
    "Order handmade bouquets, soap rose bouquets, crochet tulips and convocation flowers online. Same-day flower delivery across Kuala Lumpur & Selangor. Order on WhatsApp in 1 minute.",
  path: "/",
});

const occasions = [
  { label: "Birthday", href: "/category/birthday-flowers", emoji: "🎂" },
  { label: "Anniversary", href: "/category/anniversary-flowers", emoji: "💕" },
  { label: "Convocation", href: "/category/graduation-flowers", emoji: "🎓" },
  { label: "Get Well Soon", href: "/category/soap-flower-bouquets", emoji: "🌷" },
  { label: "Thank You", href: "/category/dried-preserved-flowers", emoji: "🙏" },
  { label: "Just Because", href: "/category/tulip-bouquets", emoji: "✨" },
];

export default function Home() {
  const featured = featuredProducts();
  return (
    <>
      {/* HERO with video */}
      <section className="relative overflow-hidden bg-blush">
        <HeroVisual />
        <div className="absolute inset-0 bg-white/80 md:bg-transparent md:bg-gradient-to-r md:from-white/95 md:via-white/50 md:to-transparent" />
        <div className="relative container-x py-20 md:py-32 lg:py-40">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur rounded-full px-4 py-1.5 text-xs font-semibold text-brand shadow-sm">
              <Sparkles className="w-4 h-4" /> Handmade bouquets · KL & Selangor
            </div>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] text-ink">
              Flowers that say it <span className="text-brand italic">beautifully</span>
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted leading-relaxed">
              Soap roses, crochet tulips and everlasting bouquets, wrapped by hand and delivered same-day across Kuala Lumpur & Selangor.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-primary !px-7 !py-3.5">Shop Bouquets <ArrowRight className="w-4 h-4" /></Link>
              <a href={waLink(`Hi ${site.name}! I'd like to order a bouquet.`)} target="_blank" rel="noopener" className="btn btn-wa !px-7 !py-3.5">
                <WhatsAppIcon /> Order on WhatsApp
              </a>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-muted">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-brand" /> Order by {site.sameDayCutoff}</span>
              <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-brand" /> 32 delivery areas</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x -mt-8 relative z-10"><TrustBar /></section>

      {/* OCCASIONS */}
      <section className="container-x mt-16">
        <div className="flex gap-3 overflow-x-auto pb-2 justify-start md:justify-center">
          {occasions.map((o) => (
            <Link key={o.label} href={o.href} className="shrink-0 flex items-center gap-2 bg-white border border-blush-2 rounded-full px-5 py-2.5 text-sm font-medium hover:bg-blush hover:border-brand transition">
              <span>{o.emoji}</span> {o.label}
            </Link>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-x mt-16">
        <SectionTitle eyebrow="Shop by category" title="Find the perfect bouquet" sub="From timeless roses to handmade crochet tulips, every bouquet is wrapped by hand in Klang Valley." />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className="group relative aspect-[4/5] rounded-3xl overflow-hidden card-hover">
              <Photo src={c.image} tone={c.tone} alt={`${c.name} delivery KL Selangor`} sizes="(max-width:768px) 50vw, 25vw" imgClassName="group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-950/80 via-rose-950/10 to-transparent" />
              <div className="absolute bottom-0 p-4 md:p-5 text-white">
                <h3 className="font-serif text-base md:text-xl font-semibold leading-tight">{c.name}</h3>
                <p className="hidden sm:block text-xs md:text-sm text-white/80">{c.short}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="container-x mt-20">
        <div className="flex items-end justify-between gap-4 mb-10">
          <SectionTitle eyebrow="Customer favourites" title="Best-selling bouquets" center={false} />
          <Link href="/shop" className="hidden md:flex items-center gap-1 text-brand font-semibold mb-10">View all <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
          {featured.map((p, i) => <ProductCard key={p.slug} p={p} priority={i < 3} />)}
        </div>
      </section>

      {/* HOW TO ORDER */}
      <section className="mt-24 bg-white border-y border-blush-2 petal-bg">
        <div className="container-x py-20">
          <SectionTitle eyebrow="Easy ordering" title="Order in 3 simple steps" sub="No cart, no long checkout forms. Just pick a bouquet and chat with a real florist on WhatsApp." />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: MousePointerClick, t: "1. Choose a bouquet", d: "Browse our collection and open the bouquet you like. Pick the size, delivery area and date." },
              { icon: MessageCircle, t: "2. Tap “Order on WhatsApp”", d: "Your order details are sent to us automatically, so we know exactly which bouquet you want." },
              { icon: Truck, t: "3. Confirm & we deliver", d: "We confirm the total, send a photo of your bouquet, and deliver it to your loved one." },
            ].map(({ icon: I, t, d }) => (
              <div key={t} className="bg-cream rounded-3xl p-8 text-center border border-blush-2/70">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-brand text-white grid place-items-center"><I className="w-6 h-6" /></div>
                <h3 className="mt-5 text-xl font-semibold">{t}</h3>
                <p className="mt-2 text-muted text-[15px] leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="container-x mt-24 grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[4/5] max-w-md w-full mx-auto rounded-[2rem] overflow-hidden">
          <Photo src="/images/products/bouquet-b.webp" tone="white" alt="Handmade tulip bouquet by BikaFlora florist" sizes="(max-width:1024px) 100vw, 40vw" />
        </div>
        <div>
          <div className="eyebrow mb-2">Why BikaFlora</div>
          <h2 className="text-3xl md:text-4xl font-semibold">A florist that treats every bouquet like a gift of its own</h2>
          <p className="mt-4 text-muted leading-relaxed">
            We are a Klang Valley florist focused on handmade, long-lasting bouquets. Every order is checked by hand and photographed before it leaves, so you know exactly what your loved one will receive.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 gap-5">
            {[
              { icon: Heart, t: "Made with care", d: "Each bouquet is wrapped by hand, never mass-produced." },
              { icon: Leaf, t: "Lasts for months", d: "Soap, crochet and dried flowers that don't wilt." },
              { icon: ShieldCheck, t: "Pay after confirming", d: "We confirm the total on WhatsApp before you pay." },
              { icon: Truck, t: "KL & Selangor wide", d: "32 delivery areas with same-day options." },
            ].map(({ icon: I, t, d }) => (
              <div key={t} className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-blush text-brand grid place-items-center shrink-0"><I className="w-5 h-5" /></div>
                <div><h3 className="font-sans font-semibold">{t}</h3><p className="text-sm text-muted">{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="container-x mt-24">
        <SectionTitle eyebrow="Happy customers" title="Loved across Klang Valley" />
        <Reviews />
        <div className="text-center mt-8"><Link href="/reviews" className="btn btn-outline">Read more reviews</Link></div>
      </section>

      {/* AREAS */}
      <section className="mt-24 bg-white border-y border-blush-2">
        <div className="container-x py-20">
          <SectionTitle eyebrow="Delivery areas" title="Flower delivery across KL & Selangor" sub="Tap your area to see delivery details, popular bouquets and local tips." />
          <div className="grid md:grid-cols-2 gap-10">
            {[{ t: "Kuala Lumpur", list: kl }, { t: "Selangor", list: selangor }].map((g) => (
              <div key={g.t}>
                <h3 className="text-xl font-semibold mb-4">{g.t}</h3>
                <div className="flex flex-wrap gap-2">
                  {g.list.map((l) => (
                    <Link key={l.slug} href={`/flower-delivery/${l.slug}`} className="px-4 py-2 rounded-full bg-cream border border-blush-2 text-sm hover:bg-blush hover:border-brand transition">{l.name}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="container-x mt-24">
        <div className="max-w-4xl mx-auto prose-bf">
          <h2 className="text-3xl font-semibold text-center">Online florist in Kuala Lumpur & Selangor</h2>
          <p>
            Looking for a florist near you in the Klang Valley? {site.name} delivers handmade bouquets to homes, offices, hospitals and university campuses across Kuala Lumpur and Selangor, from Shah Alam, Petaling Jaya and Subang Jaya to Cheras, Bangsar and Mont Kiara.
          </p>
          <p>
            Our collection focuses on long-lasting flowers: soap rose bouquets that keep their colour and light fragrance for months, crochet tulips that last for years, and dried and preserved flower mixes. They are perfect for convocations, anniversaries and birthdays, and for anyone who wants a gift that does not wilt in Malaysia's heat.
          </p>
          <h2>Same-day flower delivery, ordered on WhatsApp</h2>
          <p>
            Instead of a long online checkout, you order directly with our florist on WhatsApp. Choose a bouquet, tap the WhatsApp button, and your selected bouquet, size and delivery details are sent to us automatically. Orders confirmed before {site.sameDayCutoff} can usually be delivered the same day.
          </p>
          <h2>Flowers for every Malaysian celebration</h2>
          <p>
            From Hari Raya open houses and Chinese New Year visits to Deepavali, Mother's Day, Valentine's Day and 520, we prepare bouquets that suit the colours and customs of each celebration. Need something special? Send us a reference photo and we will create a custom bouquet within your budget.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-x mt-20">
        <SectionTitle eyebrow="FAQ" title="Frequently asked questions" />
        <Faq items={faqs.slice(0, 6)} />
      </section>

      <WaCta />
    </>
  );
}
