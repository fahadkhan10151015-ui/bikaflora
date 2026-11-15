import { sitemapEntries } from "@/lib/sitemap-entries";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** sitemap.xml for Google, with a stylesheet so it also reads as a clean table in a browser. */
export function GET() {
  const now = new Date().toISOString();
  const urls = sitemapEntries().map((e) =>
    `  <url>\n    <loc>${esc(e.url)}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${e.changeFrequency}</changefreq>\n    <priority>${e.priority.toFixed(1)}</priority>\n  </url>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
