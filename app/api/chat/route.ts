import { generateText } from "ai";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { locations } from "@/data/locations";
import { faqs } from "@/data/faqs";
import { site, deliveryMethods, formatPrice } from "@/lib/site";

export const maxDuration = 30;

// Runs on Vercel AI Gateway (no API key needed on Vercel — it uses the project's OIDC token).
const MODEL = "anthropic/claude-haiku-5.5";

const catalog = products
  .map((p) =>
    `- ${p.name} (${p.sku}) | ${p.options ? p.options.map((o) => `${o.label} ${formatPrice(o.price)}`).join(", ") : formatPrice(p.price)} | ${p.categories.join(", ")} | link: /product/${p.slug} | ${p.short}`,
  )
  .join("\n");

const instructions = `You are "Bika", the friendly florist assistant on the ${site.name} website, a florist delivering in Kuala Lumpur and Selangor, Malaysia.

Your job: help customers choose flowers, answer questions about delivery and ordering, and guide them to order on WhatsApp.

Rules:
- Be warm, short and clear: 2-5 sentences, or a short list. Reply in the customer's language (English, Malay or Chinese).
- Only recommend products from the catalog below. Always link them in markdown like [Name](/product/slug). Never invent products, prices, discounts or promises.
- Prices are in Malaysian Ringgit (RM). Delivery fee depends on the area and is confirmed on WhatsApp.
- How to order: tap "Order now" on any bouquet (opens WhatsApp with the details), or tap "+" to add several bouquets to the order list and send them in one WhatsApp message. Payment happens only after the florist confirms the total on WhatsApp.
- If you are not sure, or the question is about an existing order, payment, refunds or a custom design, ask them to WhatsApp us at ${site.phoneDisplay}.
- Do not discuss topics unrelated to flowers, gifts and this shop; politely steer back.

Delivery options:
${deliveryMethods.map((d) => `- ${d.label}: ${d.detail}`).join("\n")}
Same-day cutoff: ${site.sameDayCutoff}. Opening hours: ${site.openingHours}.
Delivery areas: ${locations.map((l) => l.name).join(", ")}.

Categories: ${categories.map((c) => `${c.name} (/category/${c.slug})`).join(", ")}.

Catalog:
${catalog}

FAQ:
${faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n")}`;

type Msg = { role: "user" | "assistant"; content: string };

const keywords: Record<string, string[]> = {
  "birthday-flowers": ["birthday", "bday", "hari jadi", "生日"],
  "anniversary-flowers": ["anniversary", "love", "wife", "husband", "girlfriend", "valentine", "ulang tahun"],
  "graduation-flowers": ["convo", "convocation", "graduat", "konvo"],
  "rose-bouquets": ["rose", "mawar", "玫瑰"],
  "tulip-bouquets": ["tulip"],
  "sunflower-bouquets": ["sunflower", "matahari"],
  "flower-boxes": ["box", "kotak"],
  "everlasting-bouquets": ["everlasting", "soap", "last", "preserved", "get well", "hospital"],
};

/** Simple product finder used when the AI service is unavailable. */
function fallbackReply(q: string) {
  const text = q.toLowerCase();
  const budget = Number(text.match(/(?:rm|under|below|bawah)\s*(\d{2,4})/)?.[1] || text.match(/(\d{2,4})\s*(?:rm|ringgit)/)?.[1] || 0);
  const cats = Object.entries(keywords).filter(([, words]) => words.some((w) => text.includes(w))).map(([c]) => c);
  let list = products.filter((p) => !cats.length || p.categories.some((c) => cats.includes(c)));
  if (budget) list = list.filter((p) => p.price <= budget);
  list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);
  const area = locations.find((l) => text.includes(l.name.toLowerCase()));
  const lines: string[] = [];
  if (area) lines.push(`Yes, we deliver to **${area.name}**. ${deliveryMethods[0].label}: ${deliveryMethods[0].detail}.`);
  if (/order|how|beli|cara/.test(text) && !list.length) lines.push(`Tap **Order now** on any bouquet, or tap **+** to add several to your order list and send them in one WhatsApp message.`);
  if (list.length) {
    lines.push("Here are some bouquets you may like:");
    list.forEach((p) => lines.push(`- [${p.name}](/product/${p.slug}) - ${formatPrice(p.price)}`));
  }
  lines.push(`For anything else, WhatsApp our florist at ${site.phoneDisplay}.`);
  return lines.join("\n");
}

export async function POST(req: Request) {
  let body: { messages?: Msg[] };
  try { body = await req.json(); } catch { return Response.json({ error: "Bad request" }, { status: 400 }); }

  const messages = (body.messages || [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) }));
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return Response.json({ error: "No question" }, { status: 400 });
  }

  try {
    const { text } = await generateText({ model: MODEL, instructions, messages, maxOutputTokens: 450 });
    return Response.json({ reply: text });
  } catch (e) {
    console.error("chat error", e);
    return Response.json({ reply: fallbackReply(messages[messages.length - 1].content), fallback: true });
  }
}

/** Quick health check: GET /api/chat?ping=1 */
export async function GET(req: Request) {
  if (!new URL(req.url).searchParams.get("ping")) return Response.json({ ok: true });
  try {
    const { text } = await generateText({ model: MODEL, instructions, prompt: "Say hi in 5 words.", maxOutputTokens: 30 });
    return Response.json({ ok: true, text });
  } catch (e) {
    return Response.json({ ok: false, error: String(e).slice(0, 300) }, { status: 500 });
  }
}
