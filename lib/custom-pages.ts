import { content } from "@/lib/content";

/** Extra pages created in the admin panel (Pages → Add page). Live at bikaflora.my/<slug>. */
export type CustomPage = { slug: string; title: string; description: string; h1: string; intro?: string; html?: string; image?: string; imageAlt?: string; faqTitle?: string; faqs?: { q: string; a: string }[] };
export const customPages: CustomPage[] = Object.entries(content.page)
  .filter(([, d]) => !d.deleted && (d as { custom?: boolean }).custom)
  .map(([slug, d]) => ({ ...(d as unknown as CustomPage), slug }));
export const getCustomPage = (slug: string) => customPages.find((p) => p.slug === slug);
