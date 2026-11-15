import PageShell from "@/components/ui/PageShell";
import PageSidebar from "@/components/ui/PageSidebar";
import Faq from "@/components/sections/Faq";
import WaCta from "@/components/sections/WaCta";
import JsonLd from "@/components/ui/JsonLd";
import { faqSchema, pageMeta } from "@/lib/seo";
import { pageCopy } from "@/data/page-copy";

const c = pageCopy.faq;
export const metadata = pageMeta({ title: c.title, description: c.description, path: "/faq", absoluteTitle: true });

export default function FaqPage() {
  const groups = c.groups!;
  return (
    <>
      <PageShell title={c.h1} path="/faq" introHtml={c.intro}>
        <JsonLd data={faqSchema(groups.flatMap((g) => g.faqs))} />
        <nav aria-label="FAQ topics" className="flex flex-wrap gap-2 mb-10">
          {groups.map((g, i) => <a key={g.title} href={`#faq-${i}`} className="px-4 py-2 rounded-full bg-white border border-blush-2 text-sm md:text-base hover:bg-blush">{g.title}</a>)}
        </nav>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-8 lg:gap-10 items-start">
        <div className="space-y-12 min-w-0">
          {groups.map((g, i) => (
            <section key={g.title} id={`faq-${i}`} className="scroll-mt-28">
              <h2 className="text-2xl md:text-3xl font-semibold mb-5">{g.title}</h2>
              <Faq items={g.faqs} schema={false} />
            </section>
          ))}
        </div>
        <PageSidebar path="/faq" src={c.image} alt={c.imageAlt} />
        </div>
      </PageShell>
      <WaCta title="Still have a question?" />
    </>
  );
}
