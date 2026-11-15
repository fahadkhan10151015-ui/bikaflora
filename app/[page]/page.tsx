import { notFound } from "next/navigation";
import PageShell from "@/components/ui/PageShell";
import PageSidebar from "@/components/ui/PageSidebar";
import Faq from "@/components/sections/Faq";
import WaCta from "@/components/sections/WaCta";
import { pageMeta } from "@/lib/seo";
import { customPages, getCustomPage } from "@/lib/custom-pages";

export const dynamicParams = false;
export function generateStaticParams() {
  // Next needs at least one entry; "__none" never matches a real page and shows a 404.
  return customPages.length ? customPages.map((p) => ({ page: p.slug })) : [{ page: "__none" }];
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const p = getCustomPage((await params).page);
  if (!p) return { robots: { index: false } };
  return pageMeta({ title: p.title, description: p.description, path: `/${p.slug}`, image: p.image, absoluteTitle: true });
}

export default async function CustomPageView({ params }: { params: Promise<{ page: string }> }) {
  const p = getCustomPage((await params).page);
  if (!p) notFound();
  return (
    <>
      <PageShell title={p.h1 || p.title} path={`/${p.slug}`} introHtml={p.intro}>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-8 lg:gap-10 items-start">
          <div className="min-w-0 space-y-12">
            {p.html && <article className="prose-location bg-white rounded-3xl border border-blush-2/70 px-5 py-8 sm:px-10 sm:py-12" dangerouslySetInnerHTML={{ __html: p.html }} />}
            {p.faqs && p.faqs.length > 0 && (
              <section><h2 className="text-2xl md:text-3xl font-semibold mb-5">{p.faqTitle || "Frequently asked questions"}</h2><Faq items={p.faqs} /></section>
            )}
          </div>
          <PageSidebar path={`/${p.slug}`} src={p.image} alt={p.imageAlt} />
        </div>
      </PageShell>
      <WaCta />
    </>
  );
}
