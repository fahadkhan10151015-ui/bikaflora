// Build step: download the admin panel's saved edits (product prices/stock/best seller, SEO meta/sitemap)
// from Supabase into data/overrides.json, so every page is built with them.
// If Supabase can't be reached, the last saved file is kept and the build continues.
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const OUT = path.join(ROOT, "data/overrides.json");

async function env() {
  const e = { ...process.env };
  if (!e.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      for (const line of (await fs.readFile(path.join(ROOT, ".env.local"), "utf8")).split("\n")) {
        const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
        if (m && !e[m[1]]) e[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    } catch {}
  }
  return e;
}

async function main() {
  const e = await env();
  const url = e.NEXT_PUBLIC_SUPABASE_URL, key = e.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return console.log("[overrides] Supabase not configured, skipped");
  const get = async (table) => {
    const r = await fetch(`${url}/rest/v1/${table}?select=*`, { headers: { apikey: key, Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(15000) });
    if (!r.ok) throw new Error(`${table}: ${r.status}`);
    return r.json();
  };
  const [prod, seo, content] = await Promise.all([get("product_overrides"), get("seo_overrides"), get("content")]);
  const out = { products: {}, seo: {} };
  for (const p of prod) out.products[p.slug] = {
    ...(p.price != null && { price: Number(p.price) }),
    ...(p.compare_at != null && { compareAt: Number(p.compare_at) }),
    ...(p.stock != null && { stock: p.stock }),
    ...(p.best_seller != null && { bestSeller: p.best_seller }),
  };
  for (const s of seo) out.seo[s.path] = {
    ...(s.title && { title: s.title }),
    ...(s.description && { description: s.description }),
    noindex: !!s.noindex,
    inSitemap: s.in_sitemap !== false,
  };
  await fs.writeFile(OUT, JSON.stringify(out, null, 2) + "\n");
  // Full content edits (products, categories, area pages, site pages, blog) from the admin panel.
  const c = { product: {}, collection: {}, location: {}, page: {}, post: {} };
  for (const row of content) {
    const slug = row.key.slice(row.kind.length + 1);
    if (!c[row.kind]) continue;
    c[row.kind][slug] = row.deleted ? { deleted: true } : row.data;
  }
  await fs.writeFile(path.join(ROOT, "data/content.json"), JSON.stringify(c) + "\n");
  // Real "last changed" date per page for the sitemaps (from the admin edits).
  const lm = {};
  const bump = (p, d) => { if (p && d && (!lm[p] || d > lm[p])) lm[p] = d; };
  const kindPath = { product: "/product/", collection: "/category/", location: "/flower-delivery/", post: "/blog/" };
  const pagePath = { home: "/", about: "/about", terms: "/terms", "privacy-policy": "/privacy-policy", faq: "/faq", contact: "/contact", hero: "/" };
  for (const row of content) {
    const slug = row.key.slice(row.kind.length + 1);
    bump(row.kind === "page" ? (pagePath[slug] ?? (row.data?.custom ? `/${slug}` : null)) : kindPath[row.kind] + slug, row.updated_at);
  }
  for (const p of prod) bump(`/product/${p.slug}`, p.updated_at);
  for (const s of seo) bump(s.path, s.updated_at);
  await fs.writeFile(path.join(ROOT, "data/lastmod.json"), JSON.stringify(lm) + "\n");
  // Visible customer reviews, so they are in the page HTML (Google and AI tools can read them).
  try {
    const r = await fetch(`${url}/rest/v1/reviews?select=id,product_slug,name,rating,comment,created_at&hidden=eq.false&order=created_at.desc&limit=2000`, { headers: { apikey: key, Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(15000) });
    if (r.ok) await fs.writeFile(path.join(ROOT, "data/reviews.json"), JSON.stringify(await r.json()) + "\n");
  } catch (e) { console.warn("[overrides] reviews kept previous file:", e.message); }
  console.log(`[overrides] ${prod.length} product edits, ${seo.length} SEO edits, ${content.length} content edits applied`);
}

main().catch((e) => console.warn("[overrides] kept previous file:", e.message));
