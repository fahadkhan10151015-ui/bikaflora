"use client";
/** Logs page views and WhatsApp button clicks (no personal data) so the admin panel can show them. */

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

/** Admin devices are marked when the admin panel is opened, so your own visits and clicks are not counted. */
export const STAFF_KEY = "bf-staff";
export function isStaffDevice() { try { return localStorage.getItem(STAFF_KEY) === "1"; } catch { return false; } }
export function setStaffDevice(on: boolean) { try { if (on) localStorage.setItem(STAFF_KEY, "1"); else localStorage.removeItem(STAFF_KEY); } catch {} }

function skip() {
  return window.location.pathname.startsWith("/admin") || isStaffDevice() || navigator.webdriver || /bot|crawl|spider|slurp|lighthouse|headless/i.test(navigator.userAgent);
}

function send(table: string, body: Record<string, unknown>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return;
  fetch(`${url}/rest/v1/${table}`, {
    method: "POST", keepalive: true,
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(body),
  }).catch(() => {});
}

/** A random id kept on this browser, so we can count unique visitors without knowing who they are. */
function visitorId() {
  try {
    let v = localStorage.getItem("bf-vid");
    if (!v) { v = Math.random().toString(36).slice(2, 12) + Date.now().toString(36); localStorage.setItem("bf-vid", v); }
    return v.slice(0, 40);
  } catch { return "anon"; }
}

export function trackWa(text: string, button?: string) {
  try {
    if (skip()) return;
    const page = window.location.pathname;
    const product = (text.match(/\/product\/([a-z0-9-]+)/i)?.[1] ?? page.match(/^\/product\/([a-z0-9-]+)/)?.[1]) || null;
    send("wa_clicks", { page: page.slice(0, 300), kind: waKind(text), button: button?.trim().replace(/\s+/g, " ").slice(0, 80) || null, product, device: device(), source: visitSource() });
  } catch {}
}

export function trackView(path: string) {
  try {
    if (skip()) return;
    send("page_views", { path: path.slice(0, 300), visitor: visitorId(), source: visitSource(), device: device() });
  } catch {}
}
