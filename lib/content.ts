import raw from "@/data/content.json";

/** Content edited in the admin panel, pulled in at build time (see scripts/pull-overrides.mjs). */
type Doc = Record<string, unknown> & { deleted?: boolean };
export const content = raw as { product: Record<string, Doc>; collection: Record<string, Doc>; location: Record<string, Doc>; page: Record<string, Doc>; post: Record<string, Doc> };

/** Splits HTML into sections at each <h2> (used for the homepage cards). */
export function splitSections(html: string) {
  const out: { title: string; html: string }[] = [];
  const re = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  const marks = [...html.matchAll(re)];
  marks.forEach((m, i) => {
    const start = (m.index ?? 0) + m[0].length;
    const end = i + 1 < marks.length ? marks[i + 1].index ?? html.length : html.length;
    out.push({ title: m[1].replace(/<[^>]+>/g, "").trim(), html: html.slice(start, end).trim() });
  });
  return out;
}
