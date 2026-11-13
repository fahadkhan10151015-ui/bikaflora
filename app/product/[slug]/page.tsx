import { notFound } from "next/navigation";
import Link from "next/link";
import { Zap, CalendarClock, Camera, ShieldCheck } from "lucide-react";
import { products, getProduct, relatedProducts, isAddOn, addOns } from "@/data/products";
import { getCategory } from "@/data/categories";
import Gallery from "@/components/product/Gallery";
import { VariantProvider } from "@/components/product/VariantProvider";
import ProductDetails from "@/components/product/ProductDetails";
import OrderPanel from "@/components/product/OrderPanel";
import HeartButton from "@/components/favourites/HeartButton";
import ProductReviews from "@/components/product/ProductReviews";
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
    description: `${p.short} Order on WhatsApp with ${p.instant ? "same-day delivery or pre-order" : "pre-order delivery"} in Kuala Lumpur & Selangor. From RM${p.price}.`,
    path: `/product/${p.slug}`,
    image: p.images[0],
  });
}

const perks = [
  { icon: Zap, text: "Same-day delivery", instant: true },
  { icon: CalendarClock, text: "Pre-order for any date" },
  { icon: Camera, text: "Photo before delivery" },
  { icon: ShieldCheck, text: "Confirmed on WhatsApp" },
];

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const cat = getCategory(p.categories[0]);
  const prices = [p.price];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.sku,
    image: [...new Set([...p.images, ...(p.variants?.flatMap((v) => v.images) ?? [])])].map((i) => (i.startsWith("http") ? i : absoluteUrl(i))),
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
    { q: `Can ${p.name} be delivered today?`, a: !p.instant ? `This item is made to order, so please pre-order and tell us your date on WhatsApp.` : `Yes. Choose Instant Delivery and we deliver it the same day, any time. We deliver by Grab Express or Lalamove within Kuala Lumpur and Selangor.` },
    { q: "Can I order it for a future date?", a: "Yes. Choose Pre-order and tell us the date and time in your WhatsApp message. We prepare it for you and deliver on the day." },
    { q: "Will it look exactly like the photo?", a: "We follow the design closely. Flowers and wrapping may vary slightly with the season, and we always send you a photo of your actual bouquet before delivery." },
    { q: "How do I pay?", a: `Payment is made in advance. After you message us on WhatsApp we confirm the total including delivery, then share payment details: ${paymentMethods}. We start preparing once payment is received.` },
  ];

  return (
    <div className="container-x pb-24 lg:pb-0">
      <JsonLd data={schema} />
      <VariantProvider p={p}>
      <MobileOrderBar p={p} />
      <Breadcrumbs items={[...(cat ? [{ name: cat.name, path: `/category/${cat.slug}` }] : []), { name: p.name, path: `/product/${p.slug}` }]} />

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
        <Gallery alt={`${p.name} by ${site.name}`} />
        <div>
          {p.badge && <span className="inline-block bg-blush text-brand text-xs font-semibold px-3 py-1 rounded-full">{p.badge}</span>}
          <div className="mt-3 flex items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold leading-tight">{p.name}</h1>
              {p.nameZh && <p className="mt-1 text-lg text-muted">{p.nameZh}</p>}
            </div>
            <HeartButton slug={p.slug} name={p.name} className="w-11 h-11 shrink-0 border border-blush-2" />
          </div>
          <p className="mt-1 text-sm text-muted">Product code: {p.sku}</p>
          <p className="mt-4 text-muted leading-relaxed">{p.short}</p>
          <div className="mt-6"><OrderPanel p={p} /></div>
          <ul className="mt-8 grid grid-cols-2 gap-3 text-sm">
            {perks.filter((k) => !("instant" in k) || p.instant).map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 border border-blush-2/70"><Icon className="w-4 h-4 text-brand" /> {text}</li>
            ))}
          </ul>
        </div>
      </div>

      <ProductDetails p={p}>
        <div className="mt-6 prose-bf">
          <h2>Delivery in Kuala Lumpur & Selangor</h2>
          <p>
            Choose <strong>Instant Delivery</strong> (delivered the same day at any time, by Grab Express or Lalamove) or <strong>Pre-order</strong> for your chosen date. Want something different? Send us a photo and we&apos;ll customise it. Payment is made in advance. We deliver to homes, offices, hospitals and campuses across KL and Selangor. See all <Link href="/flower-delivery" className="text-brand underline">delivery areas</Link>.
          </p>
        </div>
      </ProductDetails>
      </VariantProvider>

      <ProductReviews slug={p.slug} productName={p.name} />

      <section className="mt-16"><SectionTitle title="Questions about this bouquet" /><Faq items={faqs} /></section>

      {!isAddOn(p) && addOns().length > 0 && (
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
