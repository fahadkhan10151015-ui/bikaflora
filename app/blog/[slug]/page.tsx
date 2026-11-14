import { notFound } from "next/navigation";
import Photo from "@/components/ui/Photo";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import WaCta from "@/components/sections/WaCta";
import JsonLd from "@/components/ui/JsonLd";
import { posts, getPost } from "@/data/posts";
import { pageMeta } from "@/lib/seo";
import { site, absoluteUrl } from "@/lib/site";

export function generateStaticParams() { return posts.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug); if (!p) return {};
  return pageMeta({ title: p.title, description: p.description, path: `/blog/${p.slug}`, image: p.image });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug); if (!p) notFound();
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BlogPosting", headline: p.title, description: p.description, datePublished: p.date, image: absoluteUrl(p.image),
        author: { "@type": "Organization", name: site.name }, publisher: { "@id": absoluteUrl("/#business") }, mainEntityOfPage: absoluteUrl(`/blog/${p.slug}`) }} />
      <article className="container-x max-w-3xl">
        <Breadcrumbs items={[{ name: "Blog", path: "/blog" }, { name: p.title, path: `/blog/${p.slug}` }]} />
        <h1 className="text-3xl md:text-5xl font-semibold leading-tight">{p.title}</h1>
        <p className="mt-3 text-sm text-muted">{new Date(p.date).toLocaleDateString("en-MY", { dateStyle: "long" })} · {site.name}</p>
        <div className="relative aspect-[16/10] rounded-3xl overflow-hidden mt-8"><Photo src={p.image} tone={p.tone} alt={p.title} priority w={768} h={480} quality={70} /></div>
        <div className="prose-bf mt-8"><p className="text-lg">{p.description}</p>{p.sections.map((s) => <div key={s.heading}><h2>{s.heading}</h2><p>{s.body}</p></div>)}</div>
      </article>
      <WaCta />
    </>
  );
}
