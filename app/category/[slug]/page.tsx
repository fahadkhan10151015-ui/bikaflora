import { notFound } from "next/navigation";
import Link from "next/link";
import { categories, getCategory } from "@/data/categories";
import { productsInCategory } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import WaCta from "@/components/sections/WaCta";
import JsonLd from "@/components/ui/JsonLd";
import { pageMeta } from "@/lib/seo";
import { collectionSeo } from "@/data/collection-seo";
import CollectionGuide from "@/components/sections/CollectionGuide";
import FillImage from "@/components/ui/FillImage";
import { Zap, Camera, Hourglass, ArrowDown } from "lucide-react";
import { absoluteUrl } from "@/lib/site";

export function generateStaticParams() { return categories.map((c) => ({ slug: c.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCategory((await params).slug);
  if (!c) return {};
  const seo = collectionSeo[c.slug];
  if (seo) return pageMeta({ title: seo.title, description: seo.description, path: `/category/${c.slug}`, image: c.image, absoluteTitle: true });
  return pageMeta({ title: c.seoTitle, description: c.seoDescription, path: `/category/${c.slug}`, image: c.image });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCategory((await params).slug);
  if (!c) notFound();
  const items = productsInCategory(c.slug);
  const seo = collectionSeo[c.slug];
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: seo?.h1 ?? c.name, description: seo?.description ?? c.seoDescription, url: absoluteUrl(`/category/${c.slug}`),
        mainEntity: { "@type": "ItemList", itemListElement: items.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/product/${p.slug}`), name: p.name })) } }} />
      <div className="cat-hero relative overflow-hidden bg-gradient-to-br from-blush via-[#fbf3ee] to-cream border-b border-blush-2">
        <div className="container-x pb-12 md:pb-14 grid md:grid-cols-[minmax(0,1fr)_380px] lg:grid-cols-[minmax(0,1fr)_440px] gap-8 lg:gap-12 items-center">
          <div>
            <Breadcrumbs items={[{ name: "Shop", path: "/shop" }, { name: c.name, path: `/category/${c.slug}` }]} />
            <p className="eyebrow mb-3">{items.length} bouquet{items.length === 1 ? "" : "s"} · handmade in KL</p>
            <h1 className="text-4xl md:text-6xl font-semibold leading-[1.05] text-ink">{seo?.h1 ?? c.name}</h1>
            {seo
              ? <div className="mt-5 text-lg md:text-xl text-ink/75 max-w-3xl leading-relaxed prose-intro" dangerouslySetInnerHTML={{ __html: seo.intro }} />
              : <p className="mt-5 text-lg md:text-xl text-ink/75 max-w-2xl leading-relaxed">{c.intro}</p>}
            <div className="mt-6 flex flex-wrap gap-2.5 text-sm md:text-[15px]">
              {[[Zap, "Same-day delivery"], [Camera, "Photo before delivery"], [Hourglass, "Lasts for months"]].map(([I, t]) => {
                const Icon = I as typeof Zap;
                return <span key={t as string} className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-blush-2 px-4 py-2 font-medium text-ink"><Icon className="w-4 h-4 text-brand" />{t as string}</span>;
              })}
            </div>
            <a href="#bouquets" className="mt-7 btn btn-primary">See the bouquets <ArrowDown className="w-4 h-4" /></a>
          </div>
          {c.image && (
            <div className="relative hidden md:block aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl shadow-brand/15 rotate-1">
              <FillImage src={c.image} alt={`${c.name} by BikaFlora`} w={440} h={550} sizes="440px" quality={75} loading="eager" className="object-cover" />
            </div>
          )}
        </div>
      </div>
      <div className="container-x mt-10 md:mt-14">
        <div id="bouquets" className="scroll-mt-32 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">{items.map((p, i) => <ProductCard key={p.slug} p={p} priority={i < 4} />)}</div>
        {seo ? (
          <CollectionGuide name={c.name} html={seo.html} faqTitle={seo.faqTitle} faqs={seo.faqs} />
        ) : (
          <CollectionGuide name={c.name} html={c.content.map((x) => `<h2>${x.heading}</h2><p>${x.body}</p>`).join("")} />
        )}
        <p className="mt-16 text-center eyebrow">More categories</p>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {categories.filter((x) => x.slug !== c.slug).map((x) => <Link key={x.slug} href={`/category/${x.slug}`} className="px-4 py-2 rounded-full bg-white border border-blush-2 text-sm hover:bg-blush">{x.name}</Link>)}
        </div>
      </div>
      <WaCta />
    </>
  );
}
