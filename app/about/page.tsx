import Photo from "@/components/ui/Photo";
import { siteImages } from "@/lib/images";
import PageShell from "@/components/ui/PageShell";
import WaCta from "@/components/sections/WaCta";
import { pageMeta } from "@/lib/seo";
import { pageCopy } from "@/data/page-copy";

const c = pageCopy.about;
export const metadata = pageMeta({ title: c.title, description: c.description, path: "/about", absoluteTitle: true });

export default function About() {
  return (
    <>
      <PageShell title={c.h1} path="/about" introHtml={c.intro}>
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          <article className="lg:col-span-3 prose-location bg-white rounded-3xl border border-blush-2/70 px-5 py-8 sm:px-10 sm:py-12" dangerouslySetInnerHTML={{ __html: c.html! }} />
          <div className="lg:col-span-2 grid grid-cols-2 gap-4 lg:sticky lg:top-28">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden"><Photo src={siteImages.florist} alt="BikaFlora florist wrapping a handmade soap flower bouquet" sizes="(min-width:1024px) 20vw, 50vw" /></div>
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mt-10"><Photo src={siteImages.holdingBouquet} alt="Handmade bouquet ready for delivery in KL" sizes="(min-width:1024px) 20vw, 50vw" /></div>
          </div>
        </div>
      </PageShell>
      <WaCta />
    </>
  );
}
