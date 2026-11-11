import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, Truck, Camera, Gift, Clock } from "lucide-react";
import { products, getProduct, relatedProducts } from "@/data/products";
import { getCategory } from "@/data/categories";
import Gallery from "@/components/Gallery";
import OrderPanel from "@/components/OrderPanel";
import ProductCard from "@/components/ProductCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import Faq from "@/components/Faq";
import MobileOrderBar from "@/components/MobileOrderBar";
import SectionTitle from "@/components/SectionTitle";
import { pageMeta } from "@/lib/seo";
import { site, absoluteUrl } from "@/lib/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) return {};
  return pageMeta({
    title: `${p.name} – RM${p.price} | Delivery KL & Selangor`,
    description: `${p.short} Order ${p.name} on WhatsApp with same-day delivery in Kuala Lumpur & Selangor. From RM${p.price}.`,
    path: `/product/${p.slug}`,
    image: p.images[0],
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const cat = getCategory(p.categories[0]);
  const related = relatedProducts(p);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.sku,
    image: p.images.map((i) => absoluteUrl(i)),
    description: p.description,
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "MYR",
      lowPrice: Math.min(p.price, ...(p.options?.map((o) => o.price) || [])),
      highPrice: Math.max(p.price, ...(p.options?.map((o) => o.price) || [])),
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/product/${p.slug}`),
      seller: { "@type": "Organization", name: site.name },
    },
  };

  const productFaqs = [
    { q: `Can ${p.name} be delivered today?`, a: `Yes, if your order is confirmed before ${site.sameDayCutoff} and the delivery address is within our KL & Selangor delivery areas.` },
    { q: "Will the bouquet look exactly like the photo?", a: "We follow the design closely. Wrapping colours may vary slightly depending on stock, and we always send a photo of your actual bouquet before delivery." },
    { q: "How do I pay?", a: "After you send your order on WhatsApp, we confirm the total including delivery and share bank transfer / e-wallet details." },
  ];

  return (
    <div className="container-x pb-20 lg:pb-0">
      <JsonLd data={schema} />
      <MobileOrderBar p={p} />
      <Breadcrumbs items={[...(cat ? [{ name: cat.name, path: `/category/${cat.slug}` }] : []), { name: p.name, path: `/product/${p.slug}` }]} />
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
        <Gallery images={p.images} tones={p.tones} alt={`${p.name} – ${site.name} florist KL`} />
        <div>
          {p.badge && <span className="inline-block bg-blush text-brand text-xs font-semibold px-3 py-1 rounded-full">{p.badge}</span>}
          <h1 className="mt-3 text-3xl md:text-4xl font-semibold leading-tight">{p.name}</h1>
          <p className="mt-1 text-sm text-muted">Product code: {p.sku}</p>
          <p className="mt-4 text-muted leading-relaxed">{p.short}</p>
          <div className="mt-6"><OrderPanel p={p} /></div>
          <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
            {[{ i: Truck, t: "Same-day delivery" }, { i: Clock, t: `Order by ${site.sameDayCutoff}` }, { i: Camera, t: "Photo before delivery" }, { i: Gift, t: "Free gift card" }].map(({ i: I, t }) => (
              <div key={t} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 border border-blush-2/70"><I className="w-4 h-4 text-brand" /> {t}</div>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-16 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 prose-bf">
          <h2 className="!mt-0">About this bouquet</h2>
          <p>{p.description}</p>
          <h2>Delivery in Kuala Lumpur & Selangor</h2>
          <p>
            We deliver {p.name} to homes, offices, hospitals and campuses across KL and Selangor, including Shah Alam, Petaling Jaya, Subang Jaya, Cheras and Cyberjaya. See all <Link href="/flower-delivery" className="text-brand underline">delivery areas</Link>.
          </p>
        </div>
        <div className="bg-white rounded-3xl border border-blush-2/70 p-6 h-fit">
          <h3 className="font-sans font-semibold mb-3">What&apos;s included</h3>
          <ul className="space-y-2 text-sm">{p.includes.map((x) => <li key={x} className="flex gap-2"><Check className="w-4 h-4 text-sage mt-0.5" /> {x}</li>)}</ul>
          <h3 className="font-sans font-semibold mt-6 mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {p.categories.map((c) => { const cc = getCategory(c); return cc ? <Link key={c} href={`/category/${c}`} className="text-xs px-3 py-1 rounded-full bg-blush text-brand">{cc.name}</Link> : null; })}
          </div>
        </div>
      </section>

      <section className="mt-16"><SectionTitle title="Questions about this bouquet" /><Faq items={productFaqs} /></section>

      <section className="mt-20">
        <SectionTitle eyebrow="You may also like" title="Related bouquets" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">{related.map((r) => <ProductCard key={r.slug} p={r} />)}</div>
      </section>
    </div>
  );
}
