// After `next build`: put the CSS needed for the first screen inside each pre-built HTML page,
// and load the full stylesheet without blocking (fixes "render-blocking CSS" in PageSpeed).
import fs from "node:fs/promises";
import path from "node:path";
import Beasties from "beasties";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const APP = path.join(ROOT, ".next/server/app");
const beasties = new Beasties({
  path: path.join(ROOT, ".next"), // "/_next/static/…" → ".next/static/…"
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

async function* walk(dir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith(".html") && !e.name.startsWith("_global-error") && !e.name.startsWith("_not-found")) yield p;
  }
}

// The @font-face rules are added by us (small), so text uses the right fonts from the first paint.
const fontFaceCache = new Map();
async function fontFaces(html) {
  const href = html.match(/<link rel="stylesheet" href="(\/_next\/static\/[^"]+\.css)"/)?.[1];
  if (!href) return "";
  if (!fontFaceCache.has(href)) {
    const css = await fs.readFile(path.join(ROOT, ".next", href.replace("/_next/", "")), "utf8");
    fontFaceCache.set(href, (css.match(/@font-face\{[^}]*\}/g) ?? []).join(""));
  }
  return fontFaceCache.get(href);
}

let done = 0, skipped = 0;
for await (const file of walk(APP)) {
  const html = await fs.readFile(file, "utf8");
  if (!html.includes('rel="stylesheet"') || html.includes("data-critical")) { skipped++; continue; }
  try {
    const faces = await fontFaces(html);
    const out = await beasties.process(html);
    // CSS lives in /_next/static/chunks/, so its "../media/x" links must become absolute once inside the page.
    const fixed = out.replace("<style>", `<style data-critical>${faces}`)
      .replace(/<style data-critical>[\s\S]*?<\/style>/, (css) => css.replace(/url\((["']?)\.\.\/media\//g, "url($1/_next/static/media/"));
    await fs.writeFile(file, fixed);
    done++;
  } catch (e) { skipped++; console.warn("[critical-css]", path.relative(APP, file), e.message); }
}
console.log(`[critical-css] ${done} pages with inlined first-screen CSS, ${skipped} skipped`);
if (!done) {
  // Debug: show where this build put its pre-rendered pages.
  const found = [];
  async function scan(dir, depth = 0) {
    if (depth > 6 || found.length > 40) return;
    let entries = [];
    try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { if (!/node_modules|cache|\.git$/.test(e.name)) await scan(p, depth + 1); }
      else if (/terms/.test(e.name)) found.push(path.relative(ROOT, p) + " " + (await fs.stat(p)).size);
    }
  }
  await scan(path.join(ROOT, ".next"));
  await scan(path.join(ROOT, ".vercel"));
  console.log("[critical-css] files named *terms*:\n" + found.join("\n"));
}
