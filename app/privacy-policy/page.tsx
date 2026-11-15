import PageShell from "@/components/ui/PageShell";
import PageSidebar from "@/components/ui/PageSidebar";
import { pageMeta } from "@/lib/seo";
import { pageCopy } from "@/data/page-copy";

const c = pageCopy.privacy;
export const metadata = pageMeta({ title: c.title, description: c.description, path: "/privacy-policy", absoluteTitle: true });

export default function PrivacyPage() {
  return (
    <PageShell title={c.h1} path="/privacy-policy" introHtml={c.intro}>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-8 lg:gap-10 items-start">
        <article className="prose-location bg-white rounded-3xl border border-blush-2/70 px-5 py-8 sm:px-10 sm:py-12" dangerouslySetInnerHTML={{ __html: c.html! }} />
        <PageSidebar path="/privacy-policy" image="holdingBouquet" />
      </div>
    </PageShell>
  );
}
