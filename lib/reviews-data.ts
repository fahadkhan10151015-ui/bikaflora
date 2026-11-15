import raw from "@/data/reviews.json";

/** Visible customer reviews, saved at build time (scripts/pull-overrides.mjs). Newest first. */
export type SiteReview = { id: string; product_slug: string; name: string; rating: number; comment: string; created_at: string };
export const siteReviews = raw as SiteReview[];

/** Average rating and count per product. */
export const ratingMap: Record<string, { avg: number; count: number }> = (() => {
  const m: Record<string, { sum: number; count: number }> = {};
  for (const r of siteReviews) { m[r.product_slug] ??= { sum: 0, count: 0 }; m[r.product_slug].sum += r.rating; m[r.product_slug].count++; }
  return Object.fromEntries(Object.entries(m).map(([k, v]) => [k, { avg: v.sum / v.count, count: v.count }]));
})();
