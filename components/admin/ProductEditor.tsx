"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, Save, Trash2, Loader2 } from "lucide-react";
import { products, type Product } from "@/data/products";
import { productSeo } from "@/data/product-seo";
import { allCategories } from "@/data/categories";
import { stock as liveStock } from "@/data/stock";
import { loadSupabase } from "@/lib/supabase-config";
import RichText from "./RichText";
import { Field, LinesEditor, FaqEditor, PhotosEditor, NumberField, BadgeField, type QA } from "./fields";
import { card, Note, Toggle } from "./ui";
import SeoScore from "./SeoScore";

type Form = {
  slug: string; name: string; nameZh: string; sku: string; badge: string; price: string; compareAt: string; stock: string; bestSeller: boolean;
  categories: string[]; instant: boolean; preorder: boolean; giftCard: boolean; protectionBag: boolean;
  short: string; description: string; design: string; durability: string; occasions: string; size: string; care: string[]; includes: string[]; tags: string;
  images: string[]; alts: Record<string, string>;
  seoTitle: string; seoDescription: string; keyword: string; seoShort: string; html: string; faqs: QA[];
};

const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
const nextSku = () => `BF-${String(Math.max(0, ...products.map((p) => Number(p.sku.replace(/\D/g, "")) || 0)) + 1).padStart(3, "0")}`;

function fromProduct(p?: Product): Form {
  const s = p ? productSeo[p.slug] : undefined;
  return {
    slug: p?.slug ?? "", name: p?.name ?? "", nameZh: p?.nameZh ?? "", sku: p?.sku ?? nextSku(), badge: p ? p.badge ?? "" : "auto",
    price: p ? String(p.price) : "", compareAt: p?.compareAt ? String(p.compareAt) : "", stock: p && liveStock[p.slug] !== undefined ? String(liveStock[p.slug]) : "",
    bestSeller: p?.categories.includes("best-seller") ?? false, categories: (p?.categories ?? []).filter((c) => c !== "best-seller"),
    instant: p?.instant ?? true, preorder: p?.preorder ?? true, giftCard: p?.giftCard !== false, protectionBag: p?.protectionBag !== false,
    short: p?.short ?? "", description: p?.description ?? "", design: p?.design ?? "", durability: p?.durability ?? "", occasions: p?.occasions ?? "", size: p?.size ?? "",
    care: p?.care ?? [], includes: p?.includes ?? [], tags: (p?.tags ?? []).join(", "),
    images: p?.images ?? [], alts: s?.alts ?? {},
    seoTitle: s?.title ?? "", seoDescription: s?.description ?? "", keyword: s?.keyword ?? "", seoShort: s?.short ?? "", html: s?.html ?? "", faqs: s?.faqs ?? [],
  };
}

/** Full product editor: texts, photos, order options, SEO and FAQs. `slug` empty = new product. */
export default function ProductEditor({ slug, onClose }: { slug: string; onClose: () => void }) {
  const isNew = !slug;
  const base = products.find((p) => p.slug === slug);
  const [f, setF] = useState<Form>(fromProduct(base));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const set = (patch: Partial<Form>) => setF((x) => ({ ...x, ...patch }));
  const [cats, setCats] = useState(allCategories.map((c) => ({ slug: c.slug, name: c.name })));
  // Include categories added in the admin but not published yet, and hide removed ones.
  useEffect(() => {
    (async () => {
      const sb = await loadSupabase();
      const { data } = await sb!.from("content").select("key,data,deleted").eq("kind", "collection");
      setCats((cur) => {
        let list = [...cur];
        for (const r of (data ?? []) as { key: string; data: { name?: string }; deleted: boolean }[]) {
          const s = r.key.slice(11);
          if (r.deleted) list = list.filter((c) => c.slug !== s);
          else if (r.data?.name) list = list.some((c) => c.slug === s) ? list.map((c) => (c.slug === s ? { ...c, name: r.data.name! } : c)) : [...list, { slug: s, name: r.data.name }];
        }
        return list;
      });
    })();
  }, []);

  // New product: next free code, counting products saved but not published yet.
  useEffect(() => {
    if (!isNew) return;
    (async () => {
      const sb = await loadSupabase();
      const { data } = await sb!.from("content").select("data").eq("kind", "product");
      const nums = [...products.map((p) => p.sku), ...((data ?? []) as { data: { sku?: string } }[]).map((r) => r.data?.sku ?? "")].map((s) => Number(s.replace(/\D/g, "")) || 0);
      set({ sku: `BF-${String(Math.max(0, ...nums) + 1).padStart(3, "0")}` });
    })();
  }, [isNew]);

  // Load edits that were saved but not published yet.
  useEffect(() => {
    if (isNew) return;
    (async () => {
      const sb = await loadSupabase();
      const [{ data: c }, { data: o }] = await Promise.all([
        sb!.from("content").select("data").eq("key", `product:${slug}`).maybeSingle(),
        sb!.from("product_overrides").select("*").eq("slug", slug).maybeSingle(),
      ]);
      setF((x) => {
        const d = (c?.data ?? {}) as Partial<Product> & { seo?: Record<string, unknown> };
        const s = (d.seo ?? {}) as Record<string, unknown>;
        return {
          ...x,
          ...(d.name !== undefined && { name: d.name }), ...(d.nameZh !== undefined && { nameZh: d.nameZh ?? "" }), 
          ...(d.badge !== undefined && { badge: d.badge ?? "" }), ...(d.short !== undefined && { short: d.short }), ...(d.description !== undefined && { description: d.description }),
          ...(d.design !== undefined && { design: d.design }), ...(d.durability !== undefined && { durability: d.durability }), ...(d.occasions !== undefined && { occasions: d.occasions }),
          ...(d.size !== undefined && { size: d.size ?? "" }), ...(d.care && { care: d.care }), ...(d.includes && { includes: d.includes }), ...(d.tags && { tags: d.tags.join(", ") }),
          ...(d.images && { images: d.images }), ...(d.categories && { categories: d.categories.filter((k) => k !== "best-seller") }),
          ...(d.instant !== undefined && { instant: d.instant }), ...(d.preorder !== undefined && { preorder: d.preorder }),
          ...(d.giftCard !== undefined && { giftCard: d.giftCard !== false }), ...(d.protectionBag !== undefined && { protectionBag: d.protectionBag !== false }),
          ...(typeof s.title === "string" && { seoTitle: s.title }), ...(typeof s.description === "string" && { seoDescription: s.description }),
          ...(typeof s.keyword === "string" && { keyword: s.keyword }), ...(typeof s.short === "string" && { seoShort: s.short }), ...(typeof s.html === "string" && { html: s.html }),
          ...(Array.isArray(s.faqs) && { faqs: s.faqs as QA[] }), ...(typeof s.alts === "object" && s.alts !== null ? { alts: s.alts as Record<string, string> } : {}),
          ...(o?.price != null && { price: String(o.price) }), ...(o?.compare_at != null && { compareAt: String(o.compare_at) }),
          ...(o?.stock != null && { stock: String(o.stock) }), ...(o?.best_seller != null && { bestSeller: o.best_seller }),
        };
      });
    })();
  }, [slug, isNew]);

  const save = async () => {
    const s = isNew ? slugify(f.slug || f.name) : slug;
    if (!f.name.trim()) return setMsg({ kind: "err", text: "Please add the product name." });
    if (!(Number(f.price) > 0)) return setMsg({ kind: "err", text: "Please add a price." });
    if (!f.images.length) return setMsg({ kind: "err", text: "Please upload at least one photo." });
    if (isNew && products.some((p) => p.slug === s)) return setMsg({ kind: "err", text: "A product with this web address already exists. Change the name or address." });
    setBusy(true); setMsg(null);
    const sb = await loadSupabase();
    const data = {
      name: f.name.trim(), nameZh: f.nameZh.trim() || null, sku: base?.sku ?? f.sku, badge: (f.badge === "auto" ? (f.bestSeller ? "Top Seller" : isNew ? "New" : !f.instant ? "Pre-order" : "") : f.badge.trim()) || null, price: Number(f.price),
      categories: [...(f.bestSeller ? ["best-seller"] : []), ...f.categories], instant: f.instant, preorder: f.preorder, giftCard: f.giftCard, protectionBag: f.protectionBag,
      short: f.short, description: f.description, design: f.design, durability: f.durability, occasions: f.occasions, size: f.size || null,
      care: f.care.filter(Boolean), includes: f.includes.filter(Boolean), tags: f.tags.split(",").map((x) => x.trim()).filter(Boolean), images: f.images,
      seo: {
        title: f.seoTitle.trim() || `${f.name.trim()} | Buy Online in Malaysia`.slice(0, 60),
        description: f.seoDescription.trim() || (f.seoShort || f.short).trim().slice(0, 155) || `Buy ${f.name.trim()} online from BikaFlora. Same-day delivery across KL & Selangor.`,
        keyword: f.keyword.trim() || f.name.trim().toLowerCase(), short: f.seoShort, html: f.html, faqs: f.faqs.filter((q) => q.q && q.a),
        alts: Object.fromEntries(f.images.map((src, i) => [src, f.alts[src]?.trim() || `${f.name.trim()}, handmade bouquet by BikaFlora${i ? ` (photo ${i + 1})` : ""}`])),
      },
    };
    const num = (v: string) => (v.trim() === "" ? null : Number(v));
    const [a, b] = await Promise.all([
      sb!.from("content").upsert({ key: `product:${s}`, kind: "product", data, deleted: false, updated_at: new Date().toISOString() }),
      sb!.from("product_overrides").upsert({ slug: s, price: Number(f.price), compare_at: num(f.compareAt), stock: num(f.stock), best_seller: f.bestSeller, updated_at: new Date().toISOString() }),
    ]);
    setBusy(false);
    const err = a.error || b.error;
    if (err) return setMsg({ kind: "err", text: `Not saved: ${err.message}` });
    setMsg({ kind: "ok", text: `${isNew ? "Product created" : "Saved"}. Press “Publish changes” to put it live.` });
    if (isNew) set({ slug: s });
  };

  const remove = async () => {
    if (!window.confirm(`Delete "${f.name}" from the website? It will disappear after you publish. You can ask to restore it later.`)) return;
    setBusy(true);
    const sb = await loadSupabase();
    const { error } = await sb!.from("content").upsert({ key: `product:${slug}`, kind: "product", data: {}, deleted: true, updated_at: new Date().toISOString() });
    setBusy(false);
    if (error) return setMsg({ kind: "err", text: error.message });
    setMsg({ kind: "ok", text: "Product deleted. Press “Publish changes” to remove it from the website." });
  };

  const box = `${card} p-5 space-y-3`;
  const sec = `${card} p-5 sm:p-6 space-y-4`;
  const Req = () => <span className="text-red-600" title="Required">*</span>;
  const autoTitle = f.seoTitle || `${f.name} | Buy Online in Malaysia`.slice(0, 60);
  const autoDesc = f.seoDescription || (f.seoShort || f.short).slice(0, 155);
  const webSlug = isNew ? f.slug || slugify(f.name) : slug;
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={onClose} className="inline-flex items-center gap-1 text-brand font-semibold"><ArrowLeft className="w-4 h-4" /> All products</button>
        <div className="flex gap-2">
          {!isNew && <button onClick={remove} disabled={busy} className="btn !py-2 text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /> Delete</button>}
          <button onClick={save} disabled={busy} className="btn btn-primary !py-2">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save</button>
        </div>
      </div>
      {msg && <Note kind={msg.kind}>{msg.text}</Note>}
      <p className="text-sm text-muted">Fields with <span className="text-red-600">*</span> are required. Everything else fills in automatically if you leave it empty.</p>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
        <div className="space-y-5">
          <div>
            <input className="input !text-2xl !py-4 font-serif" placeholder="Product name *" value={f.name} onChange={(e) => set({ name: e.target.value })} aria-label="Product name" />
            <div className="mt-2 text-sm text-muted flex flex-wrap items-center gap-1">
              Web address: <span className="text-ink">bikaflora.my/product/</span>
              {isNew ? <input className="border-b border-dashed border-brand/50 bg-transparent outline-none text-ink min-w-[12ch]" value={webSlug} onChange={(e) => set({ slug: slugify(e.target.value) })} aria-label="Web address" />
                : <span className="text-ink">{slug}</span>}
            </div>
          </div>

          <section className={sec}>
            <h3 className="text-xl font-semibold">Photos <Req /></h3>
            <PhotosEditor images={f.images} alts={f.alts} folder="products" name={f.name || "product"} onChange={(images, alts) => set({ images, alts })} />
            <p className="text-xs text-muted">Alt text describes each photo for Google and blind visitors. Leave it empty and it is written for you.</p>
          </section>

          <section className={sec}>
            <h3 className="text-xl font-semibold">Description</h3>
            <Field label="Short description (shown under the name)" value={f.seoShort || f.short} rows={2} onChange={(v) => set({ seoShort: v, short: v })} />
            <div><span className="label">Long description</span><RichText value={f.html} onChange={(v) => set({ html: v })} /></div>
          </section>

          <section className={sec}>
            <h3 className="text-xl font-semibold">Details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <LinesEditor label="What's included" items={f.includes} onChange={(v) => set({ includes: v })} />
              <LinesEditor label="Care tips" items={f.care} onChange={(v) => set({ care: v })} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Size" value={f.size} onChange={(v) => set({ size: v })} placeholder="e.g. 40 × 45 cm" />
              <Field label="Chinese name" value={f.nameZh} onChange={(v) => set({ nameZh: v })} />
            </div>
          </section>

          <section className={sec}>
            <h3 className="text-xl font-semibold">FAQs</h3>
            <FaqEditor items={f.faqs} onChange={(v) => set({ faqs: v })} />
          </section>
        </div>

        <aside className="space-y-4">
          <div className={box}>
            <h3 className="font-semibold">Price and stock</h3>
            <NumberField label="Price (RM)" required value={f.price} step={1} onChange={(v) => set({ price: v })} />
            <NumberField label="Before price (RM)" optional value={f.compareAt} step={1} placeholder="No sale" onChange={(v) => set({ compareAt: v })} hint="Shown crossed out. Leave empty for no sale." />
            <NumberField label="Stock" optional value={f.stock} step={1} placeholder="Made to order" onChange={(v) => set({ stock: v })} hint="Leave empty for “Made to order”." />
            <div><span className="label">Product code</span><div className="input bg-cream text-muted cursor-not-allowed" aria-readonly>{f.sku}</div><span className="mt-1 block text-xs text-muted">Made automatically and can't be changed.</span></div>
          </div>

          <div className={box}>
            <h3 className="font-semibold">Options</h3>
            {([["bestSeller", "Best seller"], ["instant", "Same-day delivery"], ["preorder", "Pre-order"], ["giftCard", "Gift card option"], ["protectionBag", "Protection bag option"]] as const).map(([k, label]) => (
              <div key={k} className="flex items-center justify-between"><span className="text-sm">{label}</span><Toggle on={f[k]} onChange={(v) => set({ [k]: v } as Partial<Form>)} label={label} /></div>
            ))}
            <div className="pt-1"><BadgeField value={f.badge} onChange={(v) => set({ badge: v })} /></div>
          </div>

          <div className={box}>
            <h3 className="font-semibold">Categories</h3>
            <div className="flex flex-wrap gap-1.5">
              {cats.filter((c) => c.slug !== "best-seller").map((c) => {
                const on = f.categories.includes(c.slug);
                return <button key={c.slug} type="button" onClick={() => set({ categories: on ? f.categories.filter((x) => x !== c.slug) : [...f.categories, c.slug] })}
                  className={`px-2.5 py-1 rounded-full text-xs border ${on ? "bg-brand text-white border-brand" : "bg-white border-blush-2 hover:bg-blush"}`}>{c.name}</button>;
              })}
            </div>
          </div>

          <div className={box}>
            <h3 className="font-semibold">SEO</h3>
            <label className="block"><span className="label">Focus keyword</span><input className="input" placeholder={f.name.toLowerCase() || "e.g. pink rose bouquet KL"} value={f.keyword} onChange={(e) => set({ keyword: e.target.value })} /></label>
            <label className="block"><span className="label">Meta title <span className={`font-normal ${autoTitle.length > 60 ? "text-red-600" : "text-muted"}`}>({autoTitle.length}/60)</span></span><input className="input" placeholder={autoTitle || "Made from the name"} value={f.seoTitle} onChange={(e) => set({ seoTitle: e.target.value })} /></label>
            <label className="block"><span className="label">Meta description <span className={`font-normal ${autoDesc.length > 160 ? "text-red-600" : "text-muted"}`}>({autoDesc.length}/160)</span></span><textarea className="input" rows={3} placeholder="Made from the short description" value={f.seoDescription} onChange={(e) => set({ seoDescription: e.target.value })} /></label>
            <div className="rounded-xl border border-gray-200 p-3 bg-white">
              <div className="text-[11px] text-gray-500">Google preview</div>
              <div className="text-[12px] text-gray-700 truncate">bikaflora.my › product › {webSlug || "…"}</div>
              <div className="text-[16px] leading-snug text-[#1a0dab] line-clamp-1">{autoTitle || "Product name"}</div>
              <div className="text-[12px] text-gray-600 line-clamp-2">{autoDesc || "Short description appears here."}</div>
            </div>
            <div className="pt-2 border-t border-blush-2/60">
              <SeoScore keyword={f.keyword} title={autoTitle} description={autoDesc} slug={webSlug} h1={f.name} html={`<p>${f.seoShort || f.short}</p>${f.html}`} alts={f.images.map((s) => f.alts[s] ?? "")} minWords={200} />
            </div>
          </div>
        </aside>
      </div>

      <div className="flex justify-end"><button onClick={save} disabled={busy} className="btn btn-primary">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save product</button></div>
    </div>
  );
}
