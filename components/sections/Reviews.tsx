import { Star, Quote } from "lucide-react";
import { reviews } from "@/data/reviews";
import { site } from "@/lib/site";

export function Stars({ n }: { n: number }) {
  return <div className="flex gap-0.5" aria-label={`${n} out of 5 stars`}>{[1,2,3,4,5].map((i) => <Star key={i} className={`w-4 h-4 ${i <= n ? "fill-gold text-gold" : "text-blush-2"}`} />)}</div>;
}

export default function Reviews({ limit = 6 }: { limit?: number }) {
  return (
    <div>
      {site.reviewsAreSamples && (
        <p className="text-center text-xs text-muted -mt-6 mb-8 italic">Sample reviews shown for preview. Real customer reviews coming soon.</p>
      )}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {reviews.slice(0, limit).map((r) => (
          <figure key={r.name + r.date} className="bg-white rounded-3xl p-6 border border-blush-2/70 relative">
            <Quote className="w-8 h-8 text-blush-2 absolute top-5 right-5" />
            <Stars n={r.rating} />
            <blockquote className="mt-3 text-[15px] leading-relaxed text-ink/90">“{r.text}”</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blush text-brand font-semibold grid place-items-center">{r.name[0]}</div>
              <div>
                <div className="font-semibold text-sm">{r.name}</div>
                <div className="text-xs text-muted">{r.area}{r.product ? ` · ${r.product}` : ""}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
