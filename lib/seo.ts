import type { Metadata } from "next";
import { site, absoluteUrl } from "./site";
import { siteImages } from "./images";

export function pageMeta({ title, description, path, image }: { title: string; description: string; path: string; image?: string }): Metadata {
  const img = image || siteImages.heroPoster;
  const imgUrl = img.startsWith("http") ? img : absoluteUrl(img);
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: { title, description, url: absoluteUrl(path), siteName: site.name, images: [{ url: imgUrl }], locale: "en_MY", type: "website" },
    twitter: { card: "summary_large_image", title, description, images: [imgUrl] },
  };
}

export const orgSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Florist",
  "@id": absoluteUrl("/#business"),
  name: site.name,
  url: site.url,
  image: siteImages.heroPoster,
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
