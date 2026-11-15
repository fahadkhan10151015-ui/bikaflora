/** "2026-11-15" or a full timestamp → W3C date-time with +00:00. */
const fmt = (d: string) => (d.length <= 10 ? `${d}T00:00:00+08:00` : new Date(d).toISOString().replace(/\.\d{3}Z$/, "+00:00"));
import { absoluteUrl } from "@/lib/site";
import { sitemapGroups } from "@/lib/sitemap-entries";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const head = `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n`;
const xmlResponse = (xml: string) => new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });

/** /sitemap.xml: the sitemap index (list of sub-sitemaps). */
export function sitemapIndexResponse() {
  const items = sitemapGroups().map((g) => `  <sitemap>\n    <loc>${esc(absoluteUrl("/" + g.file))}</loc>\n    <lastmod>${fmt(g.entries.reduce((m, e) => (e.lastmod > m ? e.lastmod : m), ""))}</lastmod>\n  </sitemap>`).join("\n");
  return xmlResponse(`${head}<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`);
}

/** One sub-sitemap, e.g. /product-sitemap.xml. */
export function subSitemapResponse(file: string) {
  const g = sitemapGroups().find((x) => x.file === file);
  if (!g) return new Response("Not found", { status: 404 });
  const urls = g.entries.map((e) => `  <url>\n    <loc>${esc(e.url)}</loc>\n    <lastmod>${fmt(e.lastmod)}</lastmod>\n    <changefreq>${e.changeFrequency}</changefreq>\n    <priority>${e.priority.toFixed(1)}</priority>${(e.images ?? []).map((i) => `\n    <image:image>\n      <image:loc>${esc(i)}</image:loc>\n    </image:image>`).join("")}\n  </url>`).join("\n");
  return xmlResponse(`${head}<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>\n`);
}
