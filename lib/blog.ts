import type { Post } from "@/data/posts";

const strip = (s: string) => s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();

/** Minutes to read, at about 220 words a minute. */
export function readMinutes(p: Post) {
  const text = p.html ? strip(p.html) : `${p.description} ${p.sections.map((s) => `${s.heading} ${s.body}`).join(" ")}`;
  return Math.max(2, Math.round(text.split(" ").length / 220));
}

/** Questions and answers on the page (quick answers + FAQ section), for FAQPage schema. */
export function postFaqs(html?: string) {
  if (!html) return [];
  const out: { q: string; a: string }[] = [];
  const quick = html.match(/<div class="quick-answers">([\s\S]*?)<\/div>/)?.[1] ?? "";
  for (const m of quick.matchAll(/<p><strong>([\s\S]*?)<\/strong>([\s\S]*?)<\/p>/g)) out.push({ q: strip(m[1]), a: strip(m[2]) });
  const faq = html.split(/<h2[^>]*>\s*(?:FAQs?|Frequently asked questions)\s*<\/h2>/i)[1] ?? "";
  for (const m of faq.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g)) out.push({ q: strip(m[1]), a: strip(m[2]) });
  return out.filter((f) => f.q && f.a);
}

export const fmtDate = (d: string, style: "medium" | "long" = "medium") => new Date(d).toLocaleDateString("en-MY", { dateStyle: style });
