"use client";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

export type SeoInput = { keyword: string; title: string; description: string; slug: string; h1: string; html: string; alts?: string[]; minWords?: number };
type Check = { ok: 0 | 1 | 2; text: string; w: number }; // 2 = good, 1 = so-so, 0 = bad

const plain = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();
const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
const has = (hay: string, kw: string) => norm(hay).includes(norm(kw));

/** Rank Math-style checks for one page. Returns the checks and a 0–100 score. */
/** Keywords are stored comma separated; the first one is the main (focus) keyword. */
export const splitKeywords = (s: string) => s.split(",").map((k) => k.trim()).filter(Boolean);
const countIn = (text: string, kw: string) => { const k = norm(kw); if (!k) return 0; return (norm(text).match(new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g")) ?? []).length; };

/** Where each keyword is used (for the keyword table). */
export function keywordReport(i: SeoInput) {
  const text = plain(i.html);
  const heads = [...i.html.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)].map((m) => m[1]).join(" ");
  return splitKeywords(i.keyword).map((k, n) => ({ k, main: n === 0, title: has(i.title, k), desc: has(i.description, k), heading: has(heads, k) || has(i.h1, k), count: countIn(text, k) }));
}

export function seoChecks(i: SeoInput): { checks: Check[]; score: number } {
  const all = splitKeywords(i.keyword);
  const kw = all[0] ?? "";
  const text = plain(i.html);
  const words = text ? text.split(" ").length : 0;
  const minWords = i.minWords ?? 300;
  const tl = i.title.length, dl = i.description.length;
  const checks: Check[] = [];
  if (!kw) {
    checks.push({ ok: 0, w: 30, text: "Add a focus keyword to see how well this page is optimised." });
  } else {
    const first = norm(text).split(" ").slice(0, Math.max(30, Math.round(words * 0.1))).join(" ");
    const heads = [...i.html.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)].map((m) => m[1]).join(" ");
    const count = words ? (norm(text).match(new RegExp(`\\b${norm(kw).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g")) ?? []).length : 0;
    const density = words ? (count * norm(kw).split(" ").length * 100) / words : 0;
    checks.push(has(i.title, kw) ? { ok: norm(i.title).startsWith(norm(kw)) || norm(i.title).indexOf(norm(kw)) < 20 ? 2 : 1, w: 14, text: norm(i.title).indexOf(norm(kw)) < 20 ? "Focus keyword is at the start of the meta title." : "Focus keyword is in the meta title (better near the start)." } : { ok: 0, w: 14, text: "Add the focus keyword to the meta title." });
    checks.push(has(i.description, kw) ? { ok: 2, w: 10, text: "Focus keyword is in the meta description." } : { ok: 0, w: 10, text: "Add the focus keyword to the meta description." });
    checks.push(has(i.slug.replace(/-/g, " "), kw) ? { ok: 2, w: 8, text: "Focus keyword is in the web address." } : { ok: 1, w: 8, text: "Tip: use the focus keyword in the web address." });
    checks.push(has(i.h1, kw) ? { ok: 2, w: 8, text: "Focus keyword is in the main heading." } : { ok: 0, w: 8, text: "Add the focus keyword to the main heading / name." });
    checks.push(first.includes(norm(kw)) ? { ok: 2, w: 8, text: "Focus keyword appears at the start of the content." } : { ok: 1, w: 8, text: "Use the focus keyword in the first paragraph." });
    checks.push(heads && has(heads, kw) ? { ok: 2, w: 6, text: "Focus keyword is in a subheading (H2/H3)." } : { ok: 1, w: 6, text: "Use the focus keyword in at least one subheading." });
    checks.push(density >= 0.5 && density <= 2.5 ? { ok: 2, w: 8, text: `Keyword density is ${density.toFixed(1)}% (good).` } : density < 0.5 ? { ok: 1, w: 8, text: `Keyword density is ${density.toFixed(1)}%. Use the keyword a few more times.` } : { ok: 0, w: 8, text: `Keyword density is ${density.toFixed(1)}%. That is too much; use it less.` });
    if (i.alts && i.alts.length) checks.push(i.alts.some((a) => has(a, kw)) ? { ok: 2, w: 4, text: "An image alt text contains the focus keyword." } : { ok: 1, w: 4, text: "Add the focus keyword to one image alt text." });
  }
  // Extra keywords: each should appear in the content, and ideally in the title, description or a heading.
  const textAll = plain(i.html);
  const headsAll = [...i.html.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)].map((m) => m[1]).join(" ");
  for (const k of all.slice(1, 6)) {
    const c = countIn(textAll, k);
    checks.push(c > 0 ? { ok: 2, w: 4, text: `Extra keyword “${k}” is used ${c}× in the content.` } : { ok: 0, w: 4, text: `Use the extra keyword “${k}” in the content.` });
    const placed = has(i.title, k) || has(i.description, k) || has(headsAll, k) || has(i.h1, k);
    checks.push(placed ? { ok: 2, w: 2, text: `Extra keyword “${k}” is in the title, description or a heading.` } : { ok: 1, w: 2, text: `Tip: put “${k}” in a heading or the meta description.` });
  }
  checks.push(tl >= 30 && tl <= 60 ? { ok: 2, w: 8, text: `Meta title length is ${tl} characters (good).` } : { ok: tl ? 1 : 0, w: 8, text: tl ? `Meta title is ${tl} characters. Aim for 30 to 60.` : "Add a meta title." });
  checks.push(dl >= 120 && dl <= 160 ? { ok: 2, w: 8, text: `Meta description length is ${dl} characters (good).` } : { ok: dl ? 1 : 0, w: 8, text: dl ? `Meta description is ${dl} characters. Aim for 120 to 160.` : "Add a meta description." });
  checks.push(words >= minWords ? { ok: 2, w: 8, text: `Content is ${words} words (good).` } : { ok: words >= minWords / 2 ? 1 : 0, w: 8, text: `Content is ${words} words. Aim for at least ${minWords}.` });
  checks.push(/<a\s[^>]*href=["']\/[^"']*/i.test(i.html) ? { ok: 2, w: 6, text: "Has links to other pages on your site." } : { ok: 1, w: 6, text: "Add a link to another page on your site." });
  const total = checks.reduce((a, c) => a + c.w, 0);
  const got = checks.reduce((a, c) => a + (c.ok === 2 ? c.w : c.ok === 1 ? c.w / 2 : 0), 0);
  return { checks, score: Math.round((got / total) * 100) };
}

export const scoreTone = (s: number) => (s >= 80 ? { c: "#16a34a", bg: "bg-emerald-50 text-emerald-700", label: "Good" } : s >= 50 ? { c: "#d97706", bg: "bg-amber-50 text-amber-700", label: "OK" } : { c: "#dc2626", bg: "bg-red-50 text-red-700", label: "Needs work" });

/** Small coloured score pill for lists. */
export function ScorePill({ score }: { score: number }) {
  const t = scoreTone(score);
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${t.bg}`}>{score}/100</span>;
}

/** Score circle + checklist (shown in the editors). */
export default function SeoScore(props: SeoInput) {
  const { checks, score } = seoChecks(props);
  const rep = keywordReport(props);
  const t = scoreTone(score);
  const r = 26, c = 2 * Math.PI * r;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <svg width="64" height="64" viewBox="0 0 64 64" aria-label={`SEO score ${score} out of 100`}>
          <circle cx="32" cy="32" r={r} fill="none" stroke="#eee" strokeWidth="6" />
          <circle cx="32" cy="32" r={r} fill="none" stroke={t.c} strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * score) / 100} transform="rotate(-90 32 32)" />
          <text x="32" y="37" textAnchor="middle" fontSize="16" fontWeight="700" fill={t.c}>{score}</text>
        </svg>
        <div><div className="font-semibold">SEO score: <span style={{ color: t.c }}>{t.label}</span></div><div className="text-xs text-muted">Updates as you type. 80+ is great.</div></div>
      </div>
      {rep.length > 0 && (
        <div className="rounded-xl border border-blush-2/70 overflow-hidden">
          <table className="w-full text-[12px]">
            <thead className="bg-cream text-left"><tr><th className="px-2 py-1.5">Keyword</th><th className="px-1 py-1.5 text-center" title="Meta title">Title</th><th className="px-1 py-1.5 text-center" title="Meta description">Desc</th><th className="px-1 py-1.5 text-center" title="Heading">Head</th><th className="px-2 py-1.5 text-center" title="Times used in the content">Uses</th></tr></thead>
            <tbody>
              {rep.map((r) => (
                <tr key={r.k} className="border-t border-blush-2/60">
                  <td className="px-2 py-1.5"><span className="font-semibold text-ink">{r.k}</span>{r.main && <span className="ml-1 text-[9px] font-bold bg-brand text-white rounded-full px-1.5 py-px">MAIN</span>}</td>
                  {[r.title, r.desc, r.heading].map((v, i) => <td key={i} className="text-center">{v ? <span className="text-emerald-600">✓</span> : <span className="text-red-500">✗</span>}</td>)}
                  <td className={`text-center font-semibold ${r.count ? "text-emerald-700" : "text-red-600"}`}>{r.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ul className="space-y-1.5 text-[13px]">
        {[...checks].sort((a, b) => a.ok - b.ok).map((k, i) => (
          <li key={i} className="flex gap-2">
            {k.ok === 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-px" /> : k.ok === 1 ? <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-px" /> : <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-px" />}
            <span>{k.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
