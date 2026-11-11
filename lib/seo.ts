import type { Metadata } from "next";
import { site, absoluteUrl } from "./site";

export function pageMeta({ title, description, path, image }: { title: string; description: string; path: string; image?: string }): Metadata {
  const img = image || "/images/products/bouquet-b.webp";
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: { title, description, url: absoluteUrl(path), siteName: site.name, images: [{ url: absoluteUrl(img) }], locale: "en_MY", type: "website" },
    twitter: { card: "summary_large_image", title, description, images: [absoluteUrl(img)] },
  };
}

export const orgSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Florist",
  "@id": absoluteUrl("/#business"),
  name: site.name,
  url: site.url,
  image: absoluteUrl("/images/products/bouquet-b.webp"),
  telephone: `+${site.whatsapp}`,
  email: site.email,
  priceRange: "RM89 - RM399",
  address: { "@type": "PostalAddress", addressRegion: "Selangor", addressCountry: "MY" },
  areaServed: [{ "@type": "State", name: "Selangor" }, { "@type": "City", name: "Kuala Lumpur" }],
  openingHours: "Mo-Su 09:00-21:00",
  sameAs: Object.values(site.social),
});

export const breadcrumbSchema = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
});

export const faqSchema = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});
