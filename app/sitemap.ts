import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { locations } from "@/data/locations";
import { posts } from "@/data/posts";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const s = (path: string, priority: number, freq: "daily" | "weekly" | "monthly" = "weekly") => ({ url: absoluteUrl(path), lastModified: now, changeFrequency: freq, priority });
  return [
    s("/", 1, "daily"), s("/shop", 0.9, "daily"), s("/flower-delivery", 0.8),
    ...categories.map((c) => s(`/category/${c.slug}`, 0.9)),
    ...products.map((p) => s(`/product/${p.slug}`, 0.8)),
    ...locations.map((l) => s(`/flower-delivery/${l.slug}`, 0.7)),
    s("/blog", 0.6), ...posts.map((p) => s(`/blog/${p.slug}`, 0.6, "monthly")),
    ...["/about", "/contact", "/faq", "/reviews", "/delivery-information"].map((p) => s(p, 0.5, "monthly")),
    ...["/privacy-policy", "/terms", "/refund-policy"].map((p) => s(p, 0.2, "monthly")),
  ];
}
