import raw from "@/data/overrides.json";

/** Edits saved in the admin panel, pulled in at build time (see scripts/pull-overrides.mjs). */
export type ProductOverride = { price?: number; compareAt?: number; stock?: number; bestSeller?: boolean };
export type SeoOverride = { title?: string; description?: string; noindex?: boolean; inSitemap?: boolean };
export const overrides = raw as { products: Record<string, ProductOverride>; seo: Record<string, SeoOverride> };
