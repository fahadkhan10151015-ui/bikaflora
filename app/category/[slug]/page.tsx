import { notFound } from "next/navigation";
import Link from "next/link";
import { categories, getCategory } from "@/data/categories";
import { productsInCategory } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import WaCta from "@/components/sections/WaCta";
import JsonLd from "@/components/ui/JsonLd";
import { pageMeta } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export function generateStaticParams() { return categories.map((c) => ({ slug: c.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCategory((await params).slug);
  if (!c) return {};
  return pageMeta({ title: c.seoTitle, description: c.seoDescription, path: `/category/${c.slug}`, image: c.image });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCategory((await params).slug);
  if (!c) notFound();
  const items = productsInCategory(c.slug);
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: c.name, description: c.seoDescription, url: absoluteUrl(`/category/${c.slug}`),
        mainEntity: { "@type": "ItemList", itemListElement: items.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/product/${p.slug}`), name: p.name })) } }} />
      <div className="bg-blush/60 border-b border-blush-2">
        <div className="container-x pb-10">
          <Breadcrumbs items={[{ name: "Shop", path: "/shop" }, { name: c.name, path: `/category/${c.slug}` }]} />
          <h1 className="text-4xl md:text-5xl font-semibold">{c.name}</h1>
          <p className="mt-3 text-muted max-w-2xl leading-relaxed">{c.intro}</p>
        </div>
      </div>
      <div className="container-x mt-10">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">{items.map((p, i) => <ProductCard key={p.slug} p={p} priority={i < 4} />)}</div>
        <div className="max-w-3xl mx-auto mt-16 prose-bf">
          {c.content.map((s) => (<div key={s.heading}><h2>{s.heading}</h2><p>{s.body}</p></div>))}
        </div>
        <div className="mt-10 flex flex-wrap gap-2 justify-center">
          {categories.filter((x) => x.slug !== c.slug).map((x) => <Link key={x.slug} href={`/category/${x.slug}`} className="px-4 py-2 rounded-full bg-white border border-blush-2 text-sm hover:bg-blush">{x.name}</Link>)}
        </div>
      </div>
      <WaCta />
    </>
  );
}
