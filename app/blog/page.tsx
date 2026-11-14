import Link from "next/link";
import Photo from "@/components/ui/Photo";
import PageShell from "@/components/ui/PageShell";
import { posts } from "@/data/posts";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Flower Tips & Guides Malaysia | BikaFlora Blog", description: "Flower guides for Malaysia: convocation flowers, soap vs fresh flowers, flower colour meanings and gifting tips.", path: "/blog" });

export default function Blog() {
  return (
    <PageShell title="Flower tips & guides" path="/blog" intro="Helpful guides for choosing and sending flowers in Malaysia.">
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="bg-white rounded-3xl overflow-hidden border border-blush-2/70 card-hover">
            <div className="relative aspect-[4/3]"><Photo src={p.image} tone={p.tone} alt={p.title} w={420} h={315} /></div>
            <div className="p-5"><div className="text-xs text-muted">{new Date(p.date).toLocaleDateString("en-MY", { dateStyle: "medium" })}</div>
              <h2 className="mt-1 text-xl font-semibold leading-snug">{p.title}</h2><p className="mt-2 text-sm text-muted line-clamp-3">{p.description}</p></div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
