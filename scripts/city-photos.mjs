// Build step: one real city photo per delivery-area page.
// For each area we try a few Wikipedia pages (the area, then a local landmark), take the page's
// lead photo from Wikimedia Commons, keep it only if it is a free licence (CC / public domain),
// landscape and not a map, logo or collage. Then we compress it to WebP under 100 KB with an SEO
// file name, and save the photographer credit. If anything fails, the page keeps its KL photo.
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const OUT_DIR = path.join(ROOT, "public/images/cities");
const DATA = path.join(ROOT, "data/city-photos.json");
const UA = "BikaFloraSiteBuild/1.0 (https://bikaflora.my; bikaflora01@gmail.com)";
const MAX = 100 * 1024 - 2048;

/** Area slug -> [area name, Wikipedia pages to try, in order]. */
const AREAS = {
  "kuala-lumpur": ["Kuala Lumpur", ["Kuala_Lumpur_Tower", "Petronas_Towers", "Merdeka_Square,_Kuala_Lumpur"]],
  "shah-alam": ["Shah Alam", ["Sultan_Salahuddin_Abdul_Aziz_Mosque", "Shah_Alam"]],
  "petaling-jaya": ["Petaling Jaya", ["Petaling_Jaya", "1_Utama"]],
  "subang-jaya": ["Subang Jaya", ["Subang_Jaya", "Subang_Parade"]],
  "klang": ["Klang", ["Klang_(city)", "Sultan_Abdul_Aziz_Royal_Gallery", "Istana_Alam_Shah"]],
  "kajang": ["Kajang", ["Kajang", "Kajang_railway_station"]],
  "cyberjaya": ["Cyberjaya", ["Cyberjaya", "Multimedia_University"]],
  "sepang": ["Sepang", ["Sepang", "Sepang_International_Circuit"]],
  "puchong": ["Puchong", ["Puchong", "IOI_Mall_Puchong"]],
  "rawang": ["Rawang", ["Rawang", "Rawang,_Selangor"]],
  "ampang": ["Ampang", ["Ampang_Jaya", "Ampang,_Selangor"]],
  "bangi": ["Bangi", ["Bandar_Baru_Bangi", "National_University_of_Malaysia"]],
  "semenyih": ["Semenyih", ["Semenyih", "Broga_Hill"]],
  "banting": ["Banting", ["Banting,_Selangor", "Jugra"]],
  "kuala-selangor": ["Kuala Selangor", ["Kuala_Selangor", "Kota_Melawati"]],
  "sungai-buloh": ["Sungai Buloh", ["Sungai_Buloh", "Sungai_Buloh_Hospital"]],
  "port-klang": ["Port Klang", ["Port_Klang", "Westports_Malaysia"]],
  "seri-kembangan": ["Seri Kembangan", ["Seri_Kembangan", "The_Mines_Resort_City"]],
  "kota-damansara": ["Kota Damansara", ["Kota_Damansara", "The_Curve_(shopping_mall)"]],
  "bandar-sunway": ["Bandar Sunway", ["Bandar_Sunway", "Sunway_Pyramid", "Sunway_Lagoon"]],
  "cheras": ["Cheras", ["Cheras,_Kuala_Lumpur", "Cheras_Leisure_Mall"]],
  "setapak": ["Setapak", ["Setapak", "Tunku_Abdul_Rahman_University_of_Management_and_Technology"]],
  "wangsa-maju": ["Wangsa Maju", ["Wangsa_Maju"]],
  "bukit-bintang": ["Bukit Bintang", ["Bukit_Bintang", "Pavilion_Kuala_Lumpur"]],
  "bangsar": ["Bangsar", ["Bangsar", "Bangsar_South"]],
  "mont-kiara": ["Mont Kiara", ["Mont_Kiara"]],
  "sri-petaling": ["Sri Petaling", ["Sri_Petaling", "Bukit_Jalil_National_Stadium"]],
  "sentul": ["Sentul", ["Sentul,_Kuala_Lumpur", "Sentul_Park"]],
  "kepong": ["Kepong", ["Kepong", "Forest_Research_Institute_Malaysia"]],
  "segambut": ["Segambut", ["Segambut"]],
  "titiwangsa": ["Titiwangsa", ["Lake_Titiwangsa", "Titiwangsa"]],
  "ampang-hilir": ["Ampang Hilir", ["Ampang_Hilir", "Taman_Tasik_Ampang_Hilir"]],
};

const BAD = /map|locator|location|\.svg|flag|seal|logo|coat|emblem|montage|collage|skyline_collage|sign|plan|diagram/i;
const FREE = /^(CC0|Public domain|PD|CC BY(-SA)? [\d.]+)/i;
const slugify = (s) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);
const strip = (s = "") => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

async function get(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA, "Api-User-Agent": UA }, signal: AbortSignal.timeout(20000) });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r;
}

const why = (page, msg) => { console.log(`[city-photos] skip ${page}: ${msg}`); return null; };

async function candidate(page) {
  const sum = await (await get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(page)}`)).json();
  const orig = sum.originalimage;
  if (!orig?.source) return why(page, 'no lead image');
  const file = decodeURIComponent(orig.source.split("/").pop());
  if (BAD.test(file) || orig.width < 1000 || orig.width < orig.height * 1.15) return why(page, `rejected ${file} ${orig.width}x${orig.height}`);
  // Licence + credit from Commons (files only on en.wikipedia are often non-free: skip them).
  const api = `https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent("File:" + file)}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1600`;
  const j = await (await get(api)).json();
  const p = Object.values(j.query?.pages ?? {})[0];
  const info = p?.imageinfo?.[0];
  if (!info || p.missing !== undefined) return why(page, `not on Commons: ${file}`);
  const m = info.extmetadata ?? {};
  const license = strip(m.LicenseShortName?.value);
  if (!FREE.test(license)) return why(page, `licence ${license}`);
  return {
    file,
    title: sum.title,
    url: info.thumburl || info.url,
    page: info.descriptionurl,
    artist: strip(m.Artist?.value).slice(0, 80) || "Unknown",
    license,
  };
}

async function compress(buf) {
  // Keep quality at 58+ by stepping the width down first; only then go lower on quality.
  const tries = [];
  for (const w of [1600, 1400, 1280, 1080, 960]) for (let q = 74; q >= 58; q -= 4) tries.push([w, q]);
  for (let q = 54; q >= 46; q -= 4) tries.push([960, q]);
  for (const [w, q] of tries) {
    const out = await sharp(buf).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: q, effort: 6 }).toBuffer({ resolveWithObject: true });
    if (out.data.length <= MAX) return { data: out.data, w: out.info.width, h: out.info.height };
  }
  return null;
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const result = {};
  const used = new Set();
  for (const [slug, [name, pages]] of Object.entries(AREAS)) {
    try {
      for (const page of pages) {
        const c = await candidate(page).catch((e) => why(page, e.message));
        if (!c || used.has(c.file)) continue;
        const img = await compress(Buffer.from(await (await get(c.url)).arrayBuffer()));
        if (!img) continue;
        const what = c.title.replace(/\s*\(.*?\)\s*/g, " ").trim();
        const fn = `flower-delivery-${slug}-${slugify(what) === slug ? "city" : slugify(what)}.webp`;
        await fs.writeFile(path.join(OUT_DIR, fn), img.data);
        used.add(c.file);
        result[slug] = {
          src: `/images/cities/${fn}`,
          alt: what.toLowerCase().includes(name.toLowerCase()) ? `${what}, where BikaFlora delivers flowers` : `${what} in ${name}, where BikaFlora delivers flowers`,
          w: img.w, h: img.h, kb: Math.round(img.data.length / 1024),
          credit: `${c.artist} / ${c.license}`, source: c.page, from: c.title,
        };
        break;
      }
    } catch (e) {
      console.warn(`[city-photos] ${slug}: ${e.message}`);
    }
  }
  const n = Object.keys(result).length;
  if (n > 0) {
    await fs.writeFile(DATA, JSON.stringify(result, null, 2) + "\n");
    await fs.writeFile(path.join(OUT_DIR, "credits.json"), JSON.stringify(result, null, 2));
  }
  console.log(`[city-photos] ${n}/${Object.keys(AREAS).length} city photos ready`);
}

main().catch((e) => console.warn("[city-photos] skipped:", e.message));
