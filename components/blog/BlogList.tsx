"use client";
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import Photo from "@/components/ui/Photo";
import { ArrowRight, ChevronLeft, ChevronRight, Clock } from "lucide-react";

export type BlogCard = { slug: string; title: string; description: string; date: string; dateLabel: string; image: string; imageAlt: string; tone?: string; category?: string; read: number };

const PER_PAGE = 15;

/** Blog grid: 15 posts a page, category filter. Paging stays on /blog (no ?page= in the address),
 *  and every post link stays in the page HTML so search engines can still find them all. */
export default function BlogList({ items, categories }: { items: BlogCard[]; categories: string[] }) {
  const [cat, setCat] = useState("All");
  const [page, setPage] = useState(1);
  const top = useRef<HTMLDivElement>(null);
  const list = useMemo(() => (cat === "All" ? items : items.filter((p) => p.category === cat)), [items, cat]);
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const shown = new Set(list.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((p) => p.slug));
  const featured = page === 1 && cat === "All" ? items[0] : undefined;
  const go = (n: number) => { setPage(n); top.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const cats = ["All", ...categories.filter((c) => items.some((p) => p.category === c))];

  return (
    <div ref={top} className="scroll-mt-28">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Blog categories">
        {cats.map((c) => (
          <button key={c} role="tab" aria-selected={cat === c} onClick={() => { setCat(c); setPage(1); }}
            className={`rounded-full px-4 py-2 text-sm font-semibold border transition ${cat === c ? "bg-brand text-white border-brand" : "bg-white border-blush-2 text-ink hover:border-brand hover:text-brand"}`}>{c}</button>
        ))}
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
        {items.map((p) => {
          const isFeatured = featured?.slug === p.slug;
          const hidden = !shown.has(p.slug);
          if (isFeatured)
            return (
              <Link key={p.slug} href={`/blog/${p.slug}`} className={`${hidden ? "hidden" : ""} group sm:col-span-2 lg:col-span-3 grid lg:grid-cols-2 items-center bg-white rounded-[2rem] overflow-hidden border border-blush-2/70 card-hover`}>
                <div className="relative aspect-[3/2]"><Photo src={p.image} tone={p.tone} alt={p.imageAlt} w={640} h={427} priority /></div>
                <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                  <span className="eyebrow">Latest post</span>
                  <Meta p={p} className="mt-3" />
                  <h2 className="mt-2 text-2xl md:text-3xl font-semibold leading-snug group-hover:text-brand transition">{p.title}</h2>
                  <p className="mt-3 text-muted leading-relaxed line-clamp-3">{p.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-brand font-semibold">Read the guide <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" /></span>
                </div>
              </Link>
            );
          return (
            <Link key={p.slug} href={`/blog/${p.slug}`} className={`${hidden ? "hidden" : "flex"} group flex-col bg-white rounded-3xl overflow-hidden border border-blush-2/70 card-hover`}>
              <div className="relative aspect-[3/2]"><Photo src={p.image} tone={p.tone} alt={p.imageAlt} w={400} h={267} /></div>
              <div className="p-5 flex flex-col flex-1">
                <Meta p={p} />
                <h2 className="mt-2 text-lg font-semibold leading-snug group-hover:text-brand transition">{p.title}</h2>
                <p className="mt-2 text-sm text-muted line-clamp-2">{p.description}</p>
                <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-sm text-brand font-semibold">Read more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" /></span>
              </div>
            </Link>
          );
        })}
      </div>

      {pages > 1 && (
        <nav aria-label="Blog pages" className="mt-10 flex items-center justify-center gap-2">
          <button onClick={() => go(page - 1)} disabled={page === 1} aria-label="Previous page" className="w-10 h-10 rounded-full border border-blush-2 bg-white grid place-items-center disabled:opacity-40 hover:border-brand"><ChevronLeft className="w-4 h-4" /></button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button key={n} onClick={() => go(n)} aria-current={n === page ? "page" : undefined}
              className={`w-10 h-10 rounded-full text-sm font-semibold border ${n === page ? "bg-brand text-white border-brand" : "bg-white border-blush-2 hover:border-brand"}`}>{n}</button>
          ))}
          <button onClick={() => go(page + 1)} disabled={page === pages} aria-label="Next page" className="w-10 h-10 rounded-full border border-blush-2 bg-white grid place-items-center disabled:opacity-40 hover:border-brand"><ChevronRight className="w-4 h-4" /></button>
        </nav>
      )}
    </div>
  );
}

function Meta({ p, className = "" }: { p: BlogCard; className?: string }) {
  return (
    <div className={`text-xs text-muted flex flex-wrap items-center gap-x-2.5 gap-y-1 ${className}`}>
      {p.category && <span className="rounded-full bg-blush text-brand font-semibold px-2.5 py-0.5">{p.category}</span>}
      <span>{p.dateLabel}</span>
      <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {p.read} min read</span>
    </div>
  );
}
