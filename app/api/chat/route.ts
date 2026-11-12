import { generateText } from "ai";
import { botReply } from "@/lib/bot";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { locations } from "@/data/locations";
import { faqs } from "@/data/faqs";
import { site, deliveryMethods, deliveryPartners, paymentNote, paymentMethods, formatPrice } from "@/lib/site";

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
- How to order: tap "Order now" on any bouquet (opens WhatsApp with the details), or tap "+" to add several bouquets to the order list and send them in one WhatsApp message. Payment is made in advance, after the florist confirms the total on WhatsApp.
- If you are not sure, or the question is about an existing order, payment, refunds or a custom design, ask them to WhatsApp us at ${site.phoneDisplay}.
- Do not discuss topics unrelated to flowers, gifts and this shop; politely steer back.

Delivery options:
${deliveryMethods.map((d) => `- ${d.label}: ${d.detail}`).join("\n")}
Instant delivery cutoff: ${site.sameDayCutoff}. Opening hours: ${site.openingHours}.
Delivery partners: ${deliveryPartners.map((d) => `${d.name} (${d.use})`).join(", ")}.
Payment: ${paymentNote} Methods: ${paymentMethods}.
Custom orders: customers can send a photo on WhatsApp ("I want this type") and we make it as a pre-order.
Delivery areas: ${locations.map((l) => l.name).join(", ")}.

Categories: ${categories.map((c) => `${c.name} (/category/${c.slug})`).join(", ")}.

Catalog:
${catalog}

FAQ:
${faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n")}`;

type Msg = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  let body: { messages?: Msg[]; page?: string };
  try { body = await req.json(); } catch { return Response.json({ error: "Bad request" }, { status: 400 }); }

  const messages = (body.messages || [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) }));
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return Response.json({ error: "No question" }, { status: 400 });
  }

  // Without AI Gateway credits (or if it is down), answer with the built-in assistant straight away.
  if (process.env.CHAT_AI !== "on") {
    return Response.json({ reply: botReply(messages, typeof body.page === "string" ? body.page : undefined), fallback: true });
  }
  try {
    const pageNote = body.page?.startsWith("/product/") ? `\nThe customer is currently viewing: ${body.page}` : "";
    const { text } = await generateText({ model: MODEL, instructions: instructions + pageNote, messages, maxOutputTokens: 450 });
    return Response.json({ reply: text });
  } catch (e) {
    console.error("chat error", e);
    return Response.json({ reply: botReply(messages, typeof body.page === "string" ? body.page : undefined), fallback: true });
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
