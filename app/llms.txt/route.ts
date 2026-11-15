import { site, absoluteUrl, paymentNote, paymentMethods, deliveryPartners, defaultCutoff } from "@/lib/site";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { locations } from "@/data/locations";
import { posts } from "@/data/posts";

export const dynamic = "force-static";

/** /llms.txt: a plain summary of the business for AI assistants (ChatGPT, Claude, Perplexity, Gemini). */
export function GET() {
  const bouquets = products.filter((p) => !p.categories.includes("add-ons"));
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    "## Key facts",
    `- Online florist (no walk-in shop) delivering across Kuala Lumpur and Selangor, Malaysia.`,
    `- Main product: handmade soap flower bouquets that last for months. Also Ferrero Rocher, crochet and graduation bouquets.`,
    `- Ordering: on WhatsApp only, at +${site.whatsapp} (${site.phoneDisplay}). The customer picks a bouquet, we confirm price and delivery, then they pay.`,
    `- Delivery: same-day instant delivery${defaultCutoff ? ` (order before ${defaultCutoff})` : " at any time of day"}, or pre-order for a chosen date. The delivery fee depends on the address and is confirmed before payment.`,
    `- Couriers: ${deliveryPartners.map((d) => d.name).join(", ")}.`,
    `- Payment: ${paymentNote} ${paymentMethods}.`,
    `- A photo of the finished bouquet is sent before delivery.`,
    `- Bouquet prices from ${site.currency}${Math.min(...bouquets.map((p) => p.price))} to ${site.currency}${Math.max(...bouquets.map((p) => p.price))}.`,
    `- Opening hours: ${site.openingHours}. Email: ${site.email}.`,
    "",
    "## Main pages",
    `- [Shop all bouquets](${absoluteUrl("/shop")})`,
    `- [Delivery areas](${absoluteUrl("/flower-delivery")})`,
    `- [FAQ](${absoluteUrl("/faq")})`,
    `- [About](${absoluteUrl("/about")})`,
    `- [Reviews](${absoluteUrl("/reviews")})`,
    `- [Contact](${absoluteUrl("/contact")})`,
    "",
    "## Categories",
    ...categories.map((c) => `- [${c.name}](${absoluteUrl(`/category/${c.slug}`)}): ${c.short}`),
    "",
    "## Bouquets",
    ...products.map((p) => `- [${p.name}](${absoluteUrl(`/product/${p.slug}`)}): ${site.currency}${p.price}. ${p.short}`),
    "",
    "## Delivery areas",
    ...locations.map((l) => `- [Flower delivery ${l.name}, ${l.state}](${absoluteUrl(`/flower-delivery/${l.slug}`)})`),
    "",
    "## Guides",
    ...posts.map((p) => `- [${p.title}](${absoluteUrl(`/blog/${p.slug}`)}): ${p.description}`),
    "",
    "## Social",
    ...Object.entries(site.social).filter(([, u]) => u).map(([k, u]) => `- ${k}: ${u}`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
