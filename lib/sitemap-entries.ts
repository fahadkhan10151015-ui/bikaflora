import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { locations } from "@/data/locations";
import { posts } from "@/data/posts";
import { absoluteUrl } from "@/lib/site";
import { overrides } from "@/lib/overrides";
import { customPages } from "@/lib/custom-pages";
import lastmodJson from "@/data/lastmod.json";

export type SitemapEntry = { url: string; changeFrequency: "daily" | "weekly" | "monthly"; priority: number; images?: string[]; lastmod: string };
export type SitemapGroup = { file: string; title: string; entries: SitemapEntry[] };

/** When the site content was last rebuilt by hand (pages not edited in the admin panel keep this date). */
const SITE_UPDATED = "2026-11-15";
const lastmods = lastmodJson as Record<string, string>;
const lastmodFor = (path: string, fallback = SITE_UPDATED) => (lastmods[path] && lastmods[path] > fallback ? lastmods[path] : fallback);
const s = (path: string, priority: number, changeFrequency: SitemapEntry["changeFrequency"] = "weekly", date?: string): SitemapEntry => ({ url: absoluteUrl(path), priority, changeFrequency, path, lastmod: lastmodFor(path, date) } as SitemapEntry & { path: string });

/** Pages switched off in the admin panel (sitemap off or noindex) are left out. */
const keep = (e: SitemapEntry) => { const o = overrides.seo[(e as SitemapEntry & { path: string }).path]; return !o || (o.inSitemap !== false && !o.noindex); };

/** The sub-sitemaps listed in /sitemap.xml (like Rank Math: page, product, category, post). */
export function allSitemapGroups(): SitemapGroup[] {
  return [
    { file: "page-sitemap.xml", title: "Pages", entries: [
      s("/", 1, "daily"), s("/shop", 0.9, "daily"),
      ...["/about", "/contact", "/faq", "/reviews", "/delivery-information"].map((p) => s(p, 0.5, "monthly")),
      ...["/privacy-policy", "/terms", "/refund-policy"].map((p) => s(p, 0.2, "monthly")),
      s("/flower-delivery", 0.8), ...locations.map((l) => s(`/flower-delivery/${l.slug}`, 0.7)),
      ...customPages.map((p) => s(`/${p.slug}`, 0.5, "monthly")),
    ] },
    { file: "product-sitemap.xml", title: "Products", entries: products.map((p) => ({ ...s(`/product/${p.slug}`, 0.8), images: p.images.slice(0, 4).map((i) => (i.startsWith("http") ? i : absoluteUrl(i))) })) },
    { file: "category-sitemap.xml", title: "Categories", entries: categories.map((c) => s(`/category/${c.slug}`, 0.9)) },
    { file: "post-sitemap.xml", title: "Blog posts", entries: [s("/blog", 0.6), ...posts.map((p) => s(`/blog/${p.slug}`, 0.6, "monthly", p.date))] },
  ];
}

/** Every page, including ones switched off in the admin panel (used by the admin SEO list). */
export const allPagePaths = () => allSitemapGroups().flatMap((g) => g.entries.map((e) => ({ group: g.title, path: (e as SitemapEntry & { path: string }).path })));

export function sitemapGroups(): SitemapGroup[] {
  return allSitemapGroups().map((g) => ({ ...g, entries: g.entries.filter(keep) }));
}
