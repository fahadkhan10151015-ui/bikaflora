import Link from "next/link";
import Image from "next/image";
import { siteImages } from "@/lib/images";
import { MapPin } from "lucide-react";
import { selangor, kl } from "@/data/locations";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import WaCta from "@/components/sections/WaCta";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Flower Delivery Areas in Kuala Lumpur & Selangor",
  description: "BikaFlora delivers flowers to 32 areas across Kuala Lumpur and Selangor, including Shah Alam, PJ, Subang Jaya, Cheras, Bangsar and Mont Kiara. Same-day delivery available.",
  path: "/flower-delivery",
});

export default function Areas() {
  return (
    <>
      <div className="container-x">
        <Breadcrumbs items={[{ name: "Delivery Areas", path: "/flower-delivery" }]} />
        <h1 className="text-4xl md:text-5xl font-semibold">Flower delivery areas</h1>
        <p className="mt-3 text-muted max-w-2xl">We deliver across Kuala Lumpur and Selangor. Orders confirmed before {site.sameDayCutoff} are delivered the same day by Grab Express or Lalamove, or pre-order for your date. Choose your area for local delivery details.</p>
        <div className="relative mt-8 h-56 md:h-80 rounded-[2rem] overflow-hidden">
          <Image src={siteImages.klNight} alt="Kuala Lumpur skyline at night" fill priority sizes="(max-width:1240px) 100vw, 1240px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-deep/70 to-transparent" />
          <p className="absolute bottom-6 left-6 text-white font-serif text-2xl md:text-3xl">Kuala Lumpur · Selangor</p>
        </div>
        <div className="mt-10 grid md:grid-cols-2 gap-8">
          {[{ t: "Kuala Lumpur (Federal Territory)", list: kl }, { t: "Selangor", list: selangor }].map((g) => (
            <div key={g.t} className="bg-white rounded-3xl border border-blush-2/70 p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-5">{g.t}</h2>
              <ul className="grid sm:grid-cols-2 gap-2">
                {g.list.map((l) => (
                  <li key={l.slug}><Link href={`/flower-delivery/${l.slug}`} className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-blush"><MapPin className="w-4 h-4 text-brand" /> Florist {l.name}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <WaCta title="Is your area not listed?" text="Message us on WhatsApp. We may still be able to deliver to your location." />
    </>
  );
}
