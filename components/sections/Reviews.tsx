"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Star, Quote, PenLine } from "lucide-react";
import { loadSupabase } from "@/lib/supabase-config";
import { getProduct } from "@/data/products";
import { waLink } from "@/lib/whatsapp";

export function Stars({ n }: { n: number }) {
  return <div className="flex gap-0.5" aria-label={`${n} out of 5 stars`}>{[1, 2, 3, 4, 5].map((i) => <Star key={i} className={`w-4 h-4 ${i <= n ? "fill-gold text-gold" : "text-blush-2"}`} />)}</div>;
}

type Review = { id: string; product_slug: string; name: string; rating: number; comment: string; created_at: string };

/** Real reviews written by signed-in customers on product pages (newest first). */
export default function Reviews({ limit = 6 }: { limit?: number }) {
  const [reviews, setReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    (async () => {
    const sb = await loadSupabase();
    if (!sb) return setReviews([]);
    sb.from("reviews").select("id,product_slug,name,rating,comment,created_at").order("created_at", { ascending: false }).limit(limit)
      .then(({ data }) => setReviews((data as Review[]) || []));
    })();
  }, [limit]);

  if (reviews === null) return <div className="h-40" />;

  if (!reviews.length)
    return (
      <div className="max-w-2xl mx-auto text-center bg-white rounded-3xl border border-blush-2/70 p-8">
        <div className="flex justify-center"><Stars n={5} /></div>
        <p className="mt-4 font-serif text-2xl">Be one of our first reviewers</p>
        <p className="mt-2 text-muted">Received a BikaFlora bouquet? Open the bouquet you ordered and tap <b>Write a review</b>. Your review appears here for everyone to see.</p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link href="/shop" className="btn btn-primary"><PenLine className="w-4 h-4" /> Find your bouquet</Link>
          <a href={waLink("Hi BikaFlora, I would like to share my feedback about my order:")} target="_blank" rel="noopener" className="btn btn-outline">Send feedback on WhatsApp</a>
        </div>
      </div>
    );

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((r) => {
        const p = getProduct(r.product_slug);
        return (
          <figure key={r.id} className="bg-white rounded-3xl p-6 border border-blush-2/70 relative">
            <Quote className="w-8 h-8 text-blush-2 absolute top-5 right-5" />
            <Stars n={r.rating} />
            <blockquote className="mt-3 text-[15px] leading-relaxed text-ink/90 whitespace-pre-line">“{r.comment}”</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blush text-brand font-semibold grid place-items-center">{r.name[0]?.toUpperCase()}</div>
              <div>
                <div className="font-semibold text-sm">{r.name}</div>
                <div className="text-xs text-muted">
                  {p ? <Link href={`/product/${p.slug}`} className="hover:text-brand">{p.name}</Link> : null}
                  {p ? " · " : ""}{new Date(r.created_at).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
