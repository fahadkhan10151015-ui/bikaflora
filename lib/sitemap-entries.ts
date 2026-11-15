import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { locations } from "@/data/locations";
import { posts } from "@/data/posts";
import { absoluteUrl } from "@/lib/site";

export type SitemapEntry = { url: string; changeFrequency: "daily" | "weekly" | "monthly"; priority: number };
export type SitemapGroup = { file: string; title: string; entries: SitemapEntry[] };

const s = (path: string, priority: number, changeFrequency: SitemapEntry["changeFrequency"] = "weekly"): SitemapEntry => ({ url: absoluteUrl(path), priority, changeFrequency });

/** The sub-sitemaps listed in /sitemap.xml (like Rank Math: page, product, category, post). */
export function sitemapGroups(): SitemapGroup[] {
  return [
    { file: "page-sitemap.xml", title: "Pages", entries: [
      s("/", 1, "daily"), s("/shop", 0.9, "daily"),
      ...["/about", "/contact", "/faq", "/reviews", "/delivery-information"].map((p) => s(p, 0.5, "monthly")),
      ...["/privacy-policy", "/terms", "/refund-policy"].map((p) => s(p, 0.2, "monthly")),
      s("/flower-delivery", 0.8), ...locations.map((l) => s(`/flower-delivery/${l.slug}`, 0.7)),
    ] },
    { file: "product-sitemap.xml", title: "Products", entries: products.map((p) => s(`/product/${p.slug}`, 0.8)) },
    { file: "category-sitemap.xml", title: "Categories", entries: categories.map((c) => s(`/category/${c.slug}`, 0.9)) },
    { file: "post-sitemap.xml", title: "Blog posts", entries: [s("/blog", 0.6), ...posts.map((p) => s(`/blog/${p.slug}`, 0.6, "monthly"))] },
  ];
}
