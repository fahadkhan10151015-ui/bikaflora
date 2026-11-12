import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, Zap, CalendarClock, Camera, ShieldCheck } from "lucide-react";
import { products, getProduct, relatedProducts, isAddOn, addOns } from "@/data/products";
import { getCategory } from "@/data/categories";
import Gallery from "@/components/product/Gallery";
import OrderPanel from "@/components/product/OrderPanel";
import MobileOrderBar from "@/components/product/MobileOrderBar";
import ProductCard from "@/components/product/ProductCard";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import JsonLd from "@/components/ui/JsonLd";
import Faq from "@/components/sections/Faq";
import SectionTitle from "@/components/sections/SectionTitle";
import { pageMeta } from "@/lib/seo";
import { site, absoluteUrl, paymentMethods } from "@/lib/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) return {};
  return pageMeta({
    title: `${p.name} – RM${p.price} | Delivery KL & Selangor`,
    description: `${p.short} Order on WhatsApp with instant delivery or pre-order in Kuala Lumpur & Selangor. From RM${p.price}.`,
    path: `/product/${p.slug}`,
    image: p.images[0],
  });
}

const perks = [
  { icon: Zap, text: "Instant delivery" },
  { icon: CalendarClock, text: "Pre-order & custom" },
  { icon: Camera, text: "Photo before delivery" },
  { icon: ShieldCheck, text: "Confirmed on WhatsApp" },
];

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const cat = getCategory(p.categories[0]);
  const prices = [p.price, ...(p.options?.map((o) => o.price) ?? [])];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.sku,
    image: p.images.map((i) => (i.startsWith("http") ? i : absoluteUrl(i))),
    description: p.description,
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "MYR",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/product/${p.slug}`),
    },
  };

  const faqs = [
    { q: `Can ${p.name} be delivered today?`, a: p.categories.includes("pre-order") ? `This item is made to order, so please pre-order and tell us your date on WhatsApp.` : `Yes. Choose Instant Delivery and order before ${site.sameDayCutoff}. We deliver by Grab Express or Lalamove within Kuala Lumpur and Selangor.` },
    { q: "Will it look exactly like the photo?", a: "We follow the design closely. Flowers and wrapping may vary slightly with the season, and we always send you a photo of your actual bouquet before delivery." },
    { q: "How do I pay?", a: `Payment is made in advance. After you message us on WhatsApp we confirm the total including delivery, then share payment details: ${paymentMethods}. We start preparing once payment is received.` },
  ];

  return (
    <div className="container-x pb-24 lg:pb-0">
      <JsonLd data={schema} />
      <MobileOrderBar p={p} />
      <Breadcrumbs items={[...(cat ? [{ name: cat.name, path: `/category/${cat.slug}` }] : []), { name: p.name, path: `/product/${p.slug}` }]} />

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
        <Gallery images={p.images} tones={p.tones} alt={`${p.name} by ${site.name}`} />
        <div>
          {p.badge && <span className="inline-block bg-blush text-brand text-xs font-semibold px-3 py-1 rounded-full">{p.badge}</span>}
          <h1 className="mt-3 text-3xl md:text-4xl font-semibold leading-tight">{p.name}</h1>
          <p className="mt-1 text-sm text-muted">Product code: {p.sku}</p>
          <p className="mt-4 text-muted leading-relaxed">{p.short}</p>
          <div className="mt-6"><OrderPanel p={p} /></div>
          <ul className="mt-8 grid grid-cols-2 gap-3 text-sm">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 border border-blush-2/70"><Icon className="w-4 h-4 text-brand" /> {text}</li>
            ))}
          </ul>
        </div>
      </div>

      <section className="mt-16 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 prose-bf">
          <h2 className="!mt-0">About this bouquet</h2>
          <p>{p.description}</p>
          <h2>Delivery in Kuala Lumpur & Selangor</h2>
          <p>
            Choose <strong>Instant Delivery</strong> (order before {site.sameDayCutoff}, sent by Grab Express or Lalamove) or <strong>Pre-order</strong> for your chosen date. Want something different? Send us a photo and we&apos;ll customise it. Payment is made in advance. We deliver to homes, offices, hospitals and campuses across KL and Selangor — see all <Link href="/flower-delivery" className="text-brand underline">delivery areas</Link>.
          </p>
        </div>
        <aside className="bg-white rounded-3xl border border-blush-2/70 p-6 h-fit">
          <h3 className="font-sans font-semibold mb-3">What&apos;s included</h3>
          <ul className="space-y-2 text-sm">{p.includes.map((x) => <li key={x} className="flex gap-2"><Check className="w-4 h-4 text-sage mt-0.5" /> {x}</li>)}</ul>
          <h3 className="font-sans font-semibold mt-6 mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {p.categories.map((slug) => {
              const c = getCategory(slug);
              return c && <Link key={slug} href={`/category/${slug}`} className="text-xs px-3 py-1 rounded-full bg-blush text-brand">{c.name}</Link>;
            })}
          </div>
        </aside>
      </section>

      <section className="mt-16"><SectionTitle title="Questions about this bouquet" /><Faq items={faqs} /></section>

      {!isAddOn(p) && (
        <section className="mt-16">
          <SectionTitle eyebrow="Make it extra special" title="Add a little extra" sub="Tap + to add these to your order list with this bouquet." />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">{addOns().map((r) => <ProductCard key={r.slug} p={r} />)}</div>
        </section>
      )}

      <section className="mt-20">
        <SectionTitle eyebrow="You may also like" title="Related bouquets" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">{relatedProducts(p).map((r) => <ProductCard key={r.slug} p={r} />)}</div>
      </section>
    </div>
  );
}
