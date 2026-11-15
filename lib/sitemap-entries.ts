import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { locations } from "@/data/locations";
import { posts } from "@/data/posts";
import { absoluteUrl } from "@/lib/site";

export type SitemapEntry = { url: string; section: string; changeFrequency: "daily" | "weekly" | "monthly"; priority: number };

/** Every page that should be in the sitemap, with its section name (used by the readable sitemap view). */
export function sitemapEntries(): SitemapEntry[] {
  const s = (path: string, section: string, priority: number, changeFrequency: SitemapEntry["changeFrequency"] = "weekly") => ({ url: absoluteUrl(path), section, priority, changeFrequency });
  return [
    s("/", "Main pages", 1, "daily"), s("/shop", "Main pages", 0.9, "daily"), s("/flower-delivery", "Main pages", 0.8),
    ...categories.map((c) => s(`/category/${c.slug}`, "Categories", 0.9)),
    ...products.map((p) => s(`/product/${p.slug}`, "Products", 0.8)),
    ...locations.map((l) => s(`/flower-delivery/${l.slug}`, "Delivery areas", 0.7)),
    s("/blog", "Blog", 0.6), ...posts.map((p) => s(`/blog/${p.slug}`, "Blog", 0.6, "monthly")),
    ...["/about", "/contact", "/faq", "/reviews", "/delivery-information"].map((p) => s(p, "Info pages", 0.5, "monthly")),
    ...["/privacy-policy", "/terms", "/refund-policy"].map((p) => s(p, "Info pages", 0.2, "monthly")),
  ];
}
