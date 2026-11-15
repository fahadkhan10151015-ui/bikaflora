import { overrides } from "@/lib/overrides";
import type { Metadata } from "next";
import { site, absoluteUrl, socialLinks } from "./site";
import { siteImages } from "./images";
import { products } from "@/data/products";

export function pageMeta({ title, description, path, image, absoluteTitle }: { title: string; description: string; path: string; image?: string; absoluteTitle?: boolean }): Metadata {
  // Meta title / description / noindex saved in the admin panel win over the defaults.
  const o = overrides.seo[path];
  if (o?.title) { title = o.title; absoluteTitle = true; }
  if (o?.description) description = o.description;
  // Google cuts titles at about 60 characters: drop the " | BikaFlora" ending when it would go over.
  if (!absoluteTitle && `${title} | ${site.name}`.length > 60) absoluteTitle = true;
  const img = image || siteImages.cover;
  const imgUrl = img.startsWith("http") ? img : absoluteUrl(img);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: { title, description, url: absoluteUrl(path), siteName: site.name, images: [{ url: imgUrl }], locale: "en_MY", type: "website" },
    twitter: { card: "summary_large_image", title, description, images: [imgUrl] },
    ...(o?.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** Lowest and highest bouquet price (add-ons left out), e.g. "RM65 - RM544". */
export const bouquetPriceRange = () => {
  const prices = products.filter((p) => !p.categories.includes("add-ons")).map((p) => p.price);
  return `RM${Math.min(...prices)} - RM${Math.max(...prices)}`;
};

export const orgSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Florist",
  "@id": absoluteUrl("/#business"),
  name: site.name,
  url: site.url,
  image: absoluteUrl(siteImages.cover),
  logo: absoluteUrl("/brand/bikaflora-icon-1024.png"),
  telephone: `+${site.whatsapp}`,
  email: site.email,
  priceRange: bouquetPriceRange(),
  address: { "@type": "PostalAddress", addressRegion: "Selangor", addressCountry: "MY" },
  areaServed: [{ "@type": "State", name: "Selangor" }, { "@type": "City", name: "Kuala Lumpur" }],
  openingHours: "Mo-Su 09:00-21:00",
  ...(socialLinks().length ? { sameAs: socialLinks().map((x) => x.url) } : {}),
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
