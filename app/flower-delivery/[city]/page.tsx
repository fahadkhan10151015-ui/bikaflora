import { notFound } from "next/navigation";
import FillImage from "@/components/ui/FillImage";
import Link from "next/link";
import { MapPin, Zap, Clock, Camera, Map } from "lucide-react";
import { siteImages } from "@/lib/images";
import { locations, getLocation } from "@/data/locations";
import { products } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Faq from "@/components/sections/Faq";
import ContactForm from "@/components/ui/ContactForm";
import WaCta from "@/components/sections/WaCta";
import JsonLd from "@/components/ui/JsonLd";
import SectionTitle from "@/components/sections/SectionTitle";
import { pageMeta } from "@/lib/seo";
import { locationSeo } from "@/data/location-seo";
import cityPhotosJson from "@/data/city-photos.json";

type CityPhoto = { src: string; alt: string; credit: string; source: string };
const cityPhotos = cityPhotosJson as Record<string, CityPhoto>;
import { absoluteUrl } from "@/lib/site";

export function generateStaticParams() { return locations.map((l) => ({ city: l.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }) {
  const l = getLocation((await params).city);
  if (!l) return {};
  const seo = locationSeo[l.slug];
  if (seo) return pageMeta({ title: seo.title, description: seo.description, path: `/flower-delivery/${l.slug}`, absoluteTitle: true });
  return pageMeta({
    title: `Florist ${l.name} | Flower Delivery ${l.name}`,
    description: `Flower delivery in ${l.name}, ${l.state}. Handmade bouquets, soap roses & convocation flowers delivered to ${l.landmarks[0]} and nearby. Order on WhatsApp.`,
    path: `/flower-delivery/${l.slug}`,
  });
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const l = getLocation((await params).city);
  if (!l) notFound();
  const seo = locationSeo[l.slug];
  const idx = locations.indexOf(l);
  const photo = cityPhotos[l.slug];
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${l.name}, ${l.state}, Malaysia`)}`;
  const picks = seo
    ? seo.featured.map((slug) => products.find((p) => p.slug === slug)).filter((p): p is (typeof products)[number] => Boolean(p))
    : [...products.slice(idx % products.length), ...products].slice(0, 4);
  const nearbyLinks = l.nearby.map((n) => locations.find((x) => x.name === n)).filter(Boolean);
  const sameState = locations.filter((x) => x.state === l.state && x.slug !== l.slug);

  const faqs = seo?.faqs ?? [
    { q: `Do you offer same-day flower delivery in ${l.name}?`, a: `Yes. Ready bouquets are delivered to ${l.name} the same day, any time.` },
    { q: `How much is delivery to ${l.name}?`, a: `The fee depends on the exact address in ${l.name}. We confirm the total on WhatsApp first, and payment is made in advance.` },
  ];

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Service", serviceType: "Flower delivery", name: seo?.h1 ?? `Flower delivery ${l.name}`, description: seo?.description,
        provider: { "@id": absoluteUrl("/#business") }, areaServed: { "@type": "City", name: l.name, containedInPlace: { "@type": "State", name: l.state } }, url: absoluteUrl(`/flower-delivery/${l.slug}`) }} />
      <div className="relative overflow-hidden text-white">
        {photo
          ? <FillImage src={photo.src} alt={photo.alt} w={1920} h={1080} sizes="100vw" quality={80} priority className="object-cover" />
          : <FillImage src={idx % 2 ? siteImages.klTowers : siteImages.klCity} alt={`Flower delivery in ${l.name}, ${l.state}`} w={1080} h={540} quality={70} priority className="object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-r from-deep/90 via-deep/60 to-deep/15" />
        <div className="relative container-x pb-14 md:pb-16 [&_nav]:text-white/70 [&_nav_span]:text-white">
          <div className="flex flex-wrap items-center justify-between gap-x-4">
            <Breadcrumbs items={[{ name: "Delivery Areas", path: "/flower-delivery" }, { name: l.name, path: `/flower-delivery/${l.slug}` }]} />
            <a href={mapUrl} target="_blank" rel="noopener" aria-label={`View ${l.name} on Google Maps`}
              className="mb-4 md:mb-0 inline-flex items-center gap-2 glass !bg-white/15 border border-white/30 hover:!bg-white hover:text-brand transition px-4 py-2 rounded-full text-sm font-semibold">
              <Map className="w-4 h-4" /> View on map
            </a>
          </div>
          <a href={mapUrl} target="_blank" rel="noopener" title={`See ${l.name} on Google Maps`}
            className="eyebrow !text-petal mb-3 inline-flex items-center gap-1 hover:!text-white hover:underline underline-offset-4">
            <MapPin className="w-4 h-4" /> {l.name}, {l.state}
          </a>
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight">{seo?.h1 ?? `Flower Delivery in ${l.name}`}</h1>
          {seo
            ? <div className="mt-5 max-w-3xl text-lg md:text-xl leading-relaxed text-white/90 location-intro" dangerouslySetInnerHTML={{ __html: seo.intro }} />
            : <p className="mt-4 text-white/85 max-w-3xl leading-relaxed">{l.blurb}</p>}
          <div className="mt-7 flex flex-wrap gap-3 text-sm md:text-base">
            <span className="flex items-center gap-2 glass !bg-white/15 border border-white/25 px-4 py-2 rounded-full"><Zap className="w-4 h-4" /> Same-day delivery</span>
            <span className="flex items-center gap-2 glass !bg-white/15 border border-white/25 px-4 py-2 rounded-full"><Clock className="w-4 h-4" /> Pre-order any date</span>
            <span className="flex items-center gap-2 glass !bg-white/15 border border-white/25 px-4 py-2 rounded-full"><Camera className="w-4 h-4" /> Photo before delivery</span>
          </div>
        </div>
      </div>

      <div className="container-x mt-12 md:mt-16">
        <SectionTitle eyebrow={`Popular in ${l.name}`} title={`Bouquets for ${l.name}`} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">{picks.map((p, i) => <ProductCard key={p.slug} p={p} priority={i < 4} />)}</div>
        <div className="text-center mt-8"><Link href="/shop" className="btn btn-outline">See all bouquets</Link></div>

        <div className="mt-16 md:mt-20 grid lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_400px] gap-8 lg:gap-10 items-start">
          {seo ? (
            <article className="prose-location bg-white rounded-3xl border border-blush-2/70 px-5 py-8 sm:px-10 sm:py-12" dangerouslySetInnerHTML={{ __html: seo.html }} />
          ) : (
          <div className="mt-16 prose-bf max-w-3xl mx-auto">
            <h2 className="!mt-0">Your florist for {l.name}</h2>
            <p>We prepare every bouquet by hand and deliver it to {l.name}. Message us on WhatsApp and we confirm the total before you pay.</p>
          </div>
          )}

          <aside className="lg:sticky lg:top-32 space-y-4" aria-labelledby="area-contact">
            <div className="rounded-3xl bg-gradient-to-br from-brand to-deep text-white p-6">
              <div className="eyebrow !text-gold mb-1 flex items-center gap-1"><MapPin className="w-4 h-4" /> {l.name}</div>
              <h2 id="area-contact" className="text-2xl md:text-3xl font-semibold leading-tight">Send flowers to {l.name}</h2>
              <p className="mt-2 text-white/80 text-[15px] leading-relaxed">Tell us the occasion, budget and date. Your message opens in WhatsApp, and our florist replies with the best bouquet and full price.</p>
              <ul className="mt-4 space-y-1.5 text-sm text-white/90">
                <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-gold" /> Same-day delivery to {l.name}</li>
                <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-gold" /> Pre-order for any date</li>
                <li className="flex items-center gap-2"><Camera className="w-4 h-4 text-gold" /> Photo before delivery</li>
              </ul>
            </div>
            <div className="rounded-3xl bg-white border border-blush-2/70 p-5 sm:p-6"><ContactForm area={l.name} /></div>
          </aside>
        </div>

        <section className="mt-16 md:mt-20">
          <h2 className="text-3xl md:text-4xl font-semibold text-center max-w-3xl mx-auto mb-8">{seo?.faqTitle ?? `Flower delivery ${l.name}: FAQ`}</h2>
          <Faq items={faqs} />
        </section>

        <section className="mt-16">
          <h2 className="text-2xl md:text-3xl font-semibold mb-5 text-center">More delivery areas in {l.state}</h2>
          <div className="flex flex-wrap justify-center gap-2.5">
            {[...nearbyLinks.map((n) => n!), ...sameState.filter((x) => !nearbyLinks.some((n) => n!.slug === x.slug))].map((x) => (
              <Link key={x.slug} href={`/flower-delivery/${x.slug}`} className="px-4 py-2 rounded-full bg-white border border-blush-2 text-sm md:text-base hover:bg-blush">Flower delivery {x.name}</Link>
            ))}
          </div>
        </section>
      </div>
      <WaCta title={`Sending flowers to ${l.name}?`} text="Chat with our florist on WhatsApp for recommendations, same-day delivery or pre-orders." />
    </>
  );
}
