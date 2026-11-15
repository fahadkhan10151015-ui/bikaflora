import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SocialLinks from "@/components/ui/SocialLinks";
import BlogList from "@/components/blog/BlogList";
import JsonLd from "@/components/ui/JsonLd";
import { posts, blogCategories } from "@/data/posts";
import { pageMeta } from "@/lib/seo";
import { readMinutes, fmtDate } from "@/lib/blog";
import { absoluteUrl, site } from "@/lib/site";

export const metadata = pageMeta({ title: "Flower Tips & Gift Guides Malaysia | BikaFlora Blog", description: "Flower tips and gift guides for Malaysia: gift ideas for every occasion, card messages, soap flower care and same-day delivery advice from our KL florists.", path: "/blog" });

export default function Blog() {
  const items = posts.map((p) => ({ slug: p.slug, title: p.title, description: p.description, date: p.date, dateLabel: fmtDate(p.date), image: p.image, imageAlt: p.imageAlt || p.title, tone: p.tone, category: p.category, read: readMinutes(p) }));
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Blog", name: `${site.name} Blog`, url: absoluteUrl("/blog"), publisher: { "@id": absoluteUrl("/#business") },
        blogPost: posts.slice(0, 20).map((p) => ({ "@type": "BlogPosting", headline: p.title, url: absoluteUrl(`/blog/${p.slug}`), datePublished: p.date })) }} />
      <section className="bg-gradient-to-b from-blush/70 to-transparent">
        <div className="container-x pb-10">
          <Breadcrumbs items={[{ name: "Blog", path: "/blog" }]} />
          <div className="max-w-3xl">
            <p className="eyebrow">The BikaFlora journal</p>
            <h1 className="mt-2 text-4xl md:text-5xl font-semibold leading-tight">Flower tips &amp; gift guides</h1>
            <p className="mt-4 text-lg text-muted leading-relaxed">Gift ideas for every occasion, card messages that sound like you, and simple care tips from our florists in Kuala Lumpur.</p>
            <SocialLinks variant="pills" className="mt-6" />
          </div>
        </div>
      </section>
      <div className="container-x pb-16">
        <BlogList items={items} categories={blogCategories} />
      </div>
    </>
  );
}
