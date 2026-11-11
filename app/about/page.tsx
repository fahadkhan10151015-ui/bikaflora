import Photo from "@/components/Photo";
import PageShell from "@/components/PageShell";
import WaCta from "@/components/WaCta";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({ title: "About Us – Handmade Florist in KL & Selangor", description: `Meet ${site.name}, a Klang Valley florist creating handmade soap, crochet and dried flower bouquets with same-day delivery across KL & Selangor.`, path: "/about" });

export default function About() {
  return (
    <>
      <PageShell title="About BikaFlora" path="/about" intro="Handmade bouquets, made with love in the Klang Valley.">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="prose-bf">
            <p>{site.name} started with a simple idea: flowers should keep making someone smile long after the day they arrive. That is why we specialise in handmade and long-lasting bouquets, from soap roses and crochet tulips to dried and preserved flower mixes.</p>
            <p>Every bouquet is wrapped by hand, checked carefully and photographed before delivery, so you always know what your loved one will receive. We deliver to 32 areas across Kuala Lumpur and Selangor, including homes, offices, hospitals and university campuses.</p>
            <p>We keep ordering personal. Instead of a long checkout, you chat directly with our florist on WhatsApp. Tell us the occasion, your budget and any special requests, and we will take care of the rest.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden"><Photo src="/images/products/bouquet-a.webp" tone="cream" alt="Soap rose bouquet by BikaFlora" sizes="25vw" /></div>
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mt-10"><Photo src="/images/products/bouquet-b.webp" tone="peach" alt="Handmade tulip bouquet by BikaFlora" sizes="25vw" /></div>
          </div>
        </div>
      </PageShell>
      <WaCta />
    </>
  );
}
