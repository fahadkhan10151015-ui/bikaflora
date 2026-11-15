"use client";
/** Logs WhatsApp button clicks (no personal data) so the admin panel can show them. */

const KINDS: [RegExp, string][] = [
  [/order these items/i, "Order list"],
  [/would like to order|pre-order/i, "Order"],
  [/custom version|custom bouquet/i, "Custom bouquet"],
  [/deliver.*my area|my area is/i, "Delivery area"],
  [/question/i, "Question"],
  [/feedback/i, "Feedback"],
  [/my name is/i, "Contact form"],
];

export function waKind(text: string) {
  if (!text) return "Chat";
  for (const [re, k] of KINDS) if (re.test(text)) return k;
  return "Chat";
}

function device() {
  const w = window.innerWidth;
  return w < 768 ? "mobile" : w < 1100 ? "tablet" : "desktop";
}

/** Where the visitor came from at the start of this visit (Google, Instagram, Direct …). */
export function visitSource() {
  try {
    const saved = sessionStorage.getItem("bf-src");
    if (saved) return saved;
    const u = new URL(window.location.href);
    let src = u.searchParams.get("utm_source") || "";
    if (!src && document.referrer) {
      const host = new URL(document.referrer).hostname.replace(/^www\./, "");
      if (!host.endsWith("bikaflora.my")) src = host;
    }
    const map: [RegExp, string][] = [[/google/i, "Google"], [/bing/i, "Bing"], [/facebook|fb\./i, "Facebook"], [/instagram/i, "Instagram"], [/tiktok/i, "TikTok"], [/chatgpt|openai/i, "ChatGPT"], [/yahoo/i, "Yahoo"]];
    const nice = src ? (map.find(([re]) => re.test(src))?.[1] ?? src) : "Direct";
    sessionStorage.setItem("bf-src", nice.slice(0, 80));
    return nice;
  } catch { return "Direct"; }
}

export function trackWa(text: string, button?: string) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const page = window.location.pathname;
    if (!url || !key || page.startsWith("/admin")) return;
    const product = (text.match(/\/product\/([a-z0-9-]+)/i)?.[1] ?? page.match(/^\/product\/([a-z0-9-]+)/)?.[1]) || null;
    const body = { page: page.slice(0, 300), kind: waKind(text), button: button?.trim().replace(/\s+/g, " ").slice(0, 80) || null, product, device: device(), source: visitSource() };
    fetch(`${url}/rest/v1/wa_clicks`, {
      method: "POST", keepalive: true,
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(body),
    }).catch(() => {});
  } catch {}
}
