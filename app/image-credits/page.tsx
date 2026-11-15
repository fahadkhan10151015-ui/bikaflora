import Link from "next/link";
import PageShell from "@/components/ui/PageShell";
import { pageMeta } from "@/lib/seo";
import { locations } from "@/data/locations";
import cityPhotosJson from "@/data/city-photos.json";

type CityPhoto = { from: string; credit: string; source: string };
const photos = cityPhotosJson as Record<string, CityPhoto>;

export const metadata = { ...pageMeta({ title: "Image Credits | BikaFlora", description: "Credits for the city photos used on BikaFlora's delivery area pages.", path: "/image-credits", absoluteTitle: true }), robots: { index: false, follow: true } };

export default function ImageCredits() {
  const rows = locations.filter((l) => photos[l.slug]);
  return (
    <PageShell title="Image Credits" path="/image-credits" intro="Our delivery area pages use free-licence city photos from Wikimedia Commons. Thank you to these photographers.">
      <div className="max-w-3xl bg-white rounded-3xl border border-blush-2/70 divide-y divide-blush-2/70">
        {rows.map((l) => {
          const p = photos[l.slug];
          return (
            <div key={l.slug} className="px-6 py-4 text-[15px]">
              <Link href={`/flower-delivery/${l.slug}`} className="font-semibold text-ink hover:text-brand">{l.name}</Link>
              <p className="text-muted">{p.from}. Photo: <a href={p.source} target="_blank" rel="nofollow noopener" className="underline underline-offset-2 hover:text-brand">{p.credit}</a></p>
            </div>
          );
        })}
        {rows.length === 0 && <p className="px-6 py-4 text-muted">No third-party photos in use.</p>}
      </div>
    </PageShell>
  );
}
