import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, CalendarDays, ArrowRight } from "lucide-react";
import Photo from "@/components/ui/Photo";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import JsonLd from "@/components/ui/JsonLd";
import SocialLinks from "@/components/ui/SocialLinks";
import ContactForm from "@/components/ui/ContactForm";
import { posts, getPost } from "@/data/posts";
import { pageMeta } from "@/lib/seo";
import { readMinutes, postFaqs, fmtDate } from "@/lib/blog";
import { site, absoluteUrl } from "@/lib/site";

export function generateStaticParams() { return posts.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug); if (!p) return {};
  return pageMeta({ title: p.seoTitle || p.title, description: p.description, path: `/blog/${p.slug}`, image: p.image, absoluteTitle: Boolean(p.seoTitle) });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug); if (!p) notFound();
  const faqs = postFaqs(p.html);
  const read = readMinutes(p);
  const author = p.author || site.name;
  const related = [...posts.filter((x) => x.slug !== p.slug && x.category && x.category === p.category), ...posts.filter((x) => x.slug !== p.slug && x.category !== p.category)].slice(0, 3);
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BlogPosting", headline: p.title, description: p.description, datePublished: p.date, dateModified: p.date, image: absoluteUrl(p.image),
        author: author !== site.name ? { "@type": "Person", name: author } : { "@type": "Organization", name: site.name, url: absoluteUrl("/") }, ...(p.keyword && { keywords: p.keyword }), ...(p.category && { articleSection: p.category }),
        timeRequired: `PT${read}M`, inLanguage: "en-MY", publisher: { "@id": absoluteUrl("/#business") }, mainEntityOfPage: absoluteUrl(`/blog/${p.slug}`) }} />
      {faqs.length > 0 && <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />}

      <header className="bg-gradient-to-b from-blush/70 to-transparent">
        <div className="container-x pb-10 lg:pb-14">
          <Breadcrumbs items={[{ name: "Blog", path: "/blog" }, { name: p.title, path: `/blog/${p.slug}` }]} />
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-14 items-center">
            <div>
              {p.category && <span className="inline-block rounded-full bg-white border border-blush-2 text-brand text-xs font-semibold px-3 py-1">{p.category}</span>}
              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-[1.15]">{p.title}</h1>
              <p className="mt-4 text-lg text-muted leading-relaxed">{p.description}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted">
                <span className="inline-flex items-center gap-2.5"><span className="w-9 h-9 rounded-full bg-brand text-white grid place-items-center font-semibold">{author.charAt(0)}</span><span><span className="block text-ink font-semibold leading-tight">{author}</span><span className="text-xs">Florists in Kuala Lumpur</span></span></span>
                <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> <time dateTime={p.date}>{fmtDate(p.date, "long")}</time></span>
                <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4" /> {read} min read</span>
              </div>
            </div>
            <div className="relative aspect-[4/3] w-full max-w-xl lg:ml-auto rounded-[2rem] overflow-hidden shadow-[0_24px_60px_-28px_rgba(16,23,42,.45)] ring-1 ring-blush-2/60">
              <Photo src={p.image} tone={p.tone} alt={p.imageAlt || p.title} priority w={576} h={432} quality={72} sizes="(max-width: 1024px) 92vw, 560px" />
            </div>
          </div>
        </div>
      </header>

      <div className="container-x grid lg:grid-cols-[minmax(0,1fr)_340px] gap-10 xl:gap-16 pb-16">
        <div className="min-w-0 max-w-[760px]">
          {p.html
            ? <article className="prose-location prose-blog" dangerouslySetInnerHTML={{ __html: p.html }} />
            : <article className="prose-location prose-blog"><p>{p.description}</p>{p.sections.map((s) => <div key={s.heading}><h2>{s.heading}</h2><p>{s.body}</p></div>)}</article>}
          <div className="mt-12 rounded-3xl bg-cream border border-blush-2/70 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex-1"><p className="font-semibold text-lg text-ink">Liked this guide?</p><p className="text-sm text-muted mt-1">Follow @bikaflora for new bouquets, gift ideas and behind-the-scenes photos.</p></div>
            <SocialLinks variant="pills" />
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 self-start" aria-label="Contact our florist">
          <div className="rounded-3xl bg-white border border-blush-2/70 p-6 shadow-[0_18px_40px_-28px_rgba(16,23,42,.35)]">
            <p className="eyebrow">Need help choosing?</p>
            <h2 className="mt-1 text-xl font-semibold">Ask our florist</h2>
            <p className="mt-1.5 mb-5 text-sm text-muted">Tell us the occasion and budget. Your message opens in WhatsApp, and we usually reply within minutes.</p>
            <ContactForm compact />
          </div>
          <div className="rounded-3xl bg-white border border-blush-2/70 p-6">
            <h2 className="text-lg font-semibold">Follow us</h2>
            <p className="mt-1 mb-4 text-sm text-muted">New designs and real deliveries, every week.</p>
            <SocialLinks variant="list" />
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="bg-cream/60 border-t border-blush-2/60 py-14">
          <div className="container-x">
            <div className="flex items-end justify-between gap-4"><h2 className="text-2xl md:text-3xl font-semibold">More from the blog</h2><Link href="/blog" className="text-brand font-semibold text-sm inline-flex items-center gap-1">All posts <ArrowRight className="w-4 h-4" /></Link></div>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="group bg-white rounded-3xl overflow-hidden border border-blush-2/70 card-hover">
                  <div className="relative aspect-[3/2]"><Photo src={r.image} tone={r.tone} alt={r.imageAlt || r.title} w={400} h={267} /></div>
                  <div className="p-5"><div className="text-xs text-muted">{r.category ? `${r.category} · ` : ""}{fmtDate(r.date)}</div><h3 className="mt-1.5 font-semibold leading-snug group-hover:text-brand transition">{r.title}</h3></div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
