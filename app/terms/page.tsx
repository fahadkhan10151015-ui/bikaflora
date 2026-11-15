import PageShell from "@/components/ui/PageShell";
import { pageMeta } from "@/lib/seo";
import { pageCopy } from "@/data/page-copy";

const c = pageCopy.terms;
export const metadata = pageMeta({ title: c.title, description: c.description, path: "/terms", absoluteTitle: true });

export default function TermsPage() {
  return (
    <PageShell title={c.h1} path="/terms" introHtml={c.intro}>
      <article className="max-w-3xl prose-location bg-white rounded-3xl border border-blush-2/70 px-5 py-8 sm:px-10 sm:py-12" dangerouslySetInnerHTML={{ __html: c.html! }} />
    </PageShell>
  );
}
