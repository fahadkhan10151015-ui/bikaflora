// After `next build`: put the CSS needed for the first screen inside each pre-built HTML page,
// and load the full stylesheet without blocking (fixes "render-blocking CSS" in PageSpeed).
// Locally pages are in .next/server/app/*.html; on Vercel in .next/output/functions/*.prerender-fallback.html.
import fs from "node:fs/promises";
import path from "node:path";
import Beasties from "beasties";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const NEXT = path.join(ROOT, ".next");

async function* walk(dir, test) {
  let entries = [];
  try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== "cache") yield* walk(p, test); }
    else if (test(e.name)) yield p;
  }
}

// Every built CSS file by name, wherever this build put it.
const cssByName = new Map();
for await (const f of walk(NEXT, (n) => n.endsWith(".css"))) cssByName.set(path.basename(f), f);
const cssFile = (href) => cssByName.get(path.basename(href.split("?")[0]));

class SiteBeasties extends Beasties {
  async readFile(filename) {
    const found = cssFile(filename);
    return fs.readFile(found ?? filename, "utf8");
  }
}
const beasties = new SiteBeasties({
  path: NEXT,
  publicPath: "/_next/",
  preload: "media",               // <link media="print" onload="this.media='all'">, plus <noscript> fallback
  noscriptFallback: true,
  allowRules: [/html\.dark/, /\.dark\b/], // dark-mode rules stay, so dark-mode visitors get no light flash
  pruneSource: false,             // keep the full CSS file (client navigation and the rest of the page use it)
  inlineFonts: false,
  preloadFonts: false,
  compress: true,
  logLevel: "warn",
});

// The @font-face rules are added by us (small), so text uses the right fonts from the first paint.
const fontFaceCache = new Map();
async function fontFaces(html) {
  const href = html.match(/<link rel="stylesheet" href="([^"]+\.css)"/)?.[1];
  const file = href && cssFile(href);
  if (!file) return "";
  if (!fontFaceCache.has(file)) fontFaceCache.set(file, ((await fs.readFile(file, "utf8")).match(/@font-face\{[^}]*\}/g) ?? []).join(""));
  return fontFaceCache.get(file);
}

const isPage = (n) => (n.endsWith(".html") && !/^_(global-error|not-found)/.test(n)) || n.endsWith(".prerender-fallback.html");
let done = 0, skipped = 0;
const seen = new Set();
for (const dir of [path.join(NEXT, "server/app"), path.join(NEXT, "output/functions")]) {
  for await (const file of walk(dir, isPage)) {
    if (seen.has(file)) continue; seen.add(file);
    const html = await fs.readFile(file, "utf8");
    if (!html.includes('rel="stylesheet"') || html.includes("data-critical")) { skipped++; continue; }
    try {
      const faces = await fontFaces(html);
      const out = await beasties.process(html);
      // CSS lives in /_next/static/…/chunks/, so its "../media/x" links must become absolute once inside the page.
      const media = (html.match(/href="(\/_next\/static\/(?:immutable\/)?)chunks\/[^"]+\.css"/)?.[1] ?? "/_next/static/") + "media/";
      const fixed = out.replace("<style>", `<style data-critical>${faces}`)
        .replace(/<style data-critical>[\s\S]*?<\/style>/, (css) => css.replace(/url\((["']?)\.\.\/media\//g, `url($1${media}`));
      await fs.writeFile(file, fixed);
      done++;
    } catch (e) { skipped++; console.warn("[critical-css]", path.relative(NEXT, file), e.message); }
  }
}
console.log(`[critical-css] ${done} pages with inlined first-screen CSS, ${skipped} skipped (${cssByName.size} CSS files found)`);
