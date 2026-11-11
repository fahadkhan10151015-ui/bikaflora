import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Truck, Clock, Camera, Building2 } from "lucide-react";
import { locations, getLocation } from "@/data/locations";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import Faq from "@/components/Faq";
import WaCta from "@/components/WaCta";
import JsonLd from "@/components/JsonLd";
import SectionTitle from "@/components/SectionTitle";
import { pageMeta } from "@/lib/seo";
import { site, absoluteUrl } from "@/lib/site";

export function generateStaticParams() { return locations.map((l) => ({ city: l.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }) {
  const l = getLocation((await params).city);
  if (!l) return {};
  return pageMeta({
    title: `Florist ${l.name} | Same-Day Flower Delivery ${l.name}`,
    description: `Flower delivery in ${l.name}, ${l.state}. Handmade bouquets, soap roses & convocation flowers delivered to ${l.landmarks[0]} and nearby. Order on WhatsApp.`,
    path: `/flower-delivery/${l.slug}`,
  });
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const l = getLocation((await params).city);
  if (!l) notFound();
  // rotate featured products per city so each page is a little different
  const idx = locations.indexOf(l);
  const picks = [...products.slice(idx % products.length), ...products].slice(0, 4);
  const nearbyLinks = l.nearby.map((n) => locations.find((x) => x.name === n)).filter(Boolean);
  const sameState = locations.filter((x) => x.state === l.state && x.slug !== l.slug).slice(0, 10);

  const faqs = [
    { q: `Do you offer same-day flower delivery in ${l.name}?`, a: `Yes. Orders confirmed before ${site.sameDayCutoff} can usually be delivered to ${l.name} on the same day, subject to stock and traffic.${l.slug === "kuala-selangor" || l.slug === "banting" ? " For this area we recommend ordering one day ahead." : ""}` },
    { q: `Can you deliver to ${l.landmarks[0]}?`, a: `Yes. Share the exact location, the recipient's name and phone number on WhatsApp, and we will coordinate the drop-off at ${l.landmarks[0]}.` },
    { q: `How much is delivery to ${l.name}?`, a: `The fee depends on the exact address in ${l.name} and the time slot. We confirm the total on WhatsApp before you pay.` },
    { q: `Do you also deliver near ${l.name}?`, a: `Yes, we also cover ${l.nearby.join(", ")} and other areas in ${l.state}.` },
  ];

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Service", serviceType: "Flower delivery", name: `Flower delivery ${l.name}`,
        provider: { "@id": absoluteUrl("/#business") }, areaServed: { "@type": "City", name: l.name, containedInPlace: { "@type": "State", name: l.state } }, url: absoluteUrl(`/flower-delivery/${l.slug}`) }} />
      <div className="bg-blush/60 border-b border-blush-2">
        <div className="container-x pb-12">
          <Breadcrumbs items={[{ name: "Delivery Areas", path: "/flower-delivery" }, { name: l.name, path: `/flower-delivery/${l.slug}` }]} />
          <div className="eyebrow mb-2 flex items-center gap-1"><MapPin className="w-4 h-4" /> {l.state}</div>
          <h1 className="text-4xl md:text-5xl font-semibold">Flower Delivery in {l.name}</h1>
          <p className="mt-4 text-muted max-w-3xl leading-relaxed">{l.blurb}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full"><Truck className="w-4 h-4 text-brand" /> Same-day to {l.name}</span>
            <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full"><Clock className="w-4 h-4 text-brand" /> Order by {site.sameDayCutoff}</span>
            <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full"><Camera className="w-4 h-4 text-brand" /> Photo before delivery</span>
          </div>
        </div>
      </div>

      <div className="container-x mt-12">
        <SectionTitle eyebrow={`Popular in ${l.name}`} title={`Bouquets delivered to ${l.name}`} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">{picks.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
        <div className="text-center mt-8"><Link href="/shop" className="btn btn-outline">See all bouquets</Link></div>

        <div className="mt-16 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 prose-bf">
            <h2 className="!mt-0">Your local florist for {l.name}</h2>
            <p>Whether it is a birthday surprise, an anniversary, a hospital visit or a graduation, {site.name} prepares every bouquet by hand and sends it to {l.name} with care. We focus on long-lasting soap, crochet and dried flower bouquets that stay beautiful even in Malaysia&apos;s heat.</p>
            <h2>Popular delivery spots in {l.name}</h2>
            <p>We regularly deliver to {l.landmarks.slice(0, -1).join(", ")} and {l.landmarks[l.landmarks.length - 1]}, as well as homes and condos throughout the area. For condos and offices, please include the block, unit number and a contact number for the guardhouse or reception.</p>
            <h2>How to order flowers to {l.name}</h2>
            <p>Open any bouquet, choose <strong>{l.name}</strong> as the delivery area, pick your date and tap &quot;Order on WhatsApp&quot;. Your order details arrive in our chat instantly, and we confirm the total before you pay.</p>
          </div>
          <aside className="bg-white rounded-3xl border border-blush-2/70 p-6 h-fit">
            <h3 className="font-sans font-semibold flex items-center gap-2"><Building2 className="w-4 h-4 text-brand" /> Landmarks we deliver to</h3>
            <ul className="mt-3 space-y-1.5 text-sm text-muted">{l.landmarks.map((x) => <li key={x}>• {x}</li>)}</ul>
            {nearbyLinks.length > 0 && (<>
              <h3 className="font-sans font-semibold mt-6">Nearby areas</h3>
              <div className="mt-3 flex flex-wrap gap-2">{nearbyLinks.map((n) => <Link key={n!.slug} href={`/flower-delivery/${n!.slug}`} className="text-xs px-3 py-1.5 rounded-full bg-blush text-brand">{n!.name}</Link>)}</div>
            </>)}
          </aside>
        </div>

        <section className="mt-16"><SectionTitle title={`Flower delivery ${l.name}: FAQ`} /><Faq items={faqs} /></section>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold mb-4 text-center">More delivery areas in {l.state}</h2>
          <div className="flex flex-wrap justify-center gap-2">{sameState.map((x) => <Link key={x.slug} href={`/flower-delivery/${x.slug}`} className="px-4 py-2 rounded-full bg-white border border-blush-2 text-sm hover:bg-blush">Florist {x.name}</Link>)}</div>
        </section>
      </div>
      <WaCta title={`Sending flowers to ${l.name}?`} text="Chat with our florist on WhatsApp for recommendations and same-day availability." message={`Hi BikaFlora, I want to send flowers to ${l.name}. Can you help?`} />
    </>
  );
}
