"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, Save, Trash2, Loader2 } from "lucide-react";
import { products, type Product } from "@/data/products";
import { productSeo } from "@/data/product-seo";
import { allCategories } from "@/data/categories";
import { stock as liveStock } from "@/data/stock";
import { loadSupabase } from "@/lib/supabase-config";
import RichText from "./RichText";
import { Field, LinesEditor, FaqEditor, PhotosEditor, type QA } from "./fields";
import { card, Note, Toggle } from "./ui";

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
    slug: p?.slug ?? "", name: p?.name ?? "", nameZh: p?.nameZh ?? "", sku: p?.sku ?? nextSku(), badge: p?.badge ?? "",
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
          ...(d.name !== undefined && { name: d.name }), ...(d.nameZh !== undefined && { nameZh: d.nameZh ?? "" }), ...(d.sku !== undefined && { sku: d.sku }),
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
      name: f.name.trim(), nameZh: f.nameZh.trim() || null, sku: f.sku.trim(), badge: f.badge.trim() || null, price: Number(f.price),
      categories: [...(f.bestSeller ? ["best-seller"] : []), ...f.categories], instant: f.instant, preorder: f.preorder, giftCard: f.giftCard, protectionBag: f.protectionBag,
      short: f.short, description: f.description, design: f.design, durability: f.durability, occasions: f.occasions, size: f.size || null,
      care: f.care.filter(Boolean), includes: f.includes.filter(Boolean), tags: f.tags.split(",").map((x) => x.trim()).filter(Boolean), images: f.images,
      seo: { title: f.seoTitle, description: f.seoDescription, keyword: f.keyword, short: f.seoShort, html: f.html, faqs: f.faqs.filter((q) => q.q && q.a), alts: f.alts },
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

  const sec = `${card} p-5 sm:p-6 space-y-4`;
  const h = "text-xl font-semibold";
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={onClose} className="inline-flex items-center gap-1 text-brand font-semibold"><ArrowLeft className="w-4 h-4" /> All products</button>
        <div className="flex gap-2">
          {!isNew && <button onClick={remove} disabled={busy} className="btn !py-2 text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /> Delete</button>}
          <button onClick={save} disabled={busy} className="btn btn-primary !py-2">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save</button>
        </div>
      </div>
      <h2 className="text-2xl font-semibold">{isNew ? "New product" : f.name}</h2>
      {msg && <Note kind={msg.kind}>{msg.text}</Note>}

      <section className={sec}>
        <h3 className={h}>Basics</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Product name" value={f.name} onChange={(v) => set({ name: v })} />
          <Field label="Chinese name (optional)" value={f.nameZh} onChange={(v) => set({ nameZh: v })} />
          {isNew && <Field label="Web address" value={f.slug || slugify(f.name)} onChange={(v) => set({ slug: slugify(v) })} hint={`bikaflora.my/product/${f.slug || slugify(f.name) || "…"}`} />}
          <Field label="Product code (SKU)" value={f.sku} onChange={(v) => set({ sku: v })} />
          <Field label="Badge (optional)" value={f.badge} onChange={(v) => set({ badge: v })} placeholder="e.g. Top Seller" />
          <Field label="Price (RM)" value={f.price} onChange={(v) => set({ price: v })} />
          <Field label="Before price (RM, optional)" value={f.compareAt} onChange={(v) => set({ compareAt: v })} hint="Shown crossed out for a sale." />
          <Field label="Stock" value={f.stock} onChange={(v) => set({ stock: v })} hint="Leave empty for “Made to order”." />
        </div>
        <div>
          <span className="label">Categories</span>
          <div className="flex flex-wrap gap-2">
            {allCategories.filter((c) => c.slug !== "best-seller").map((c) => {
              const on = f.categories.includes(c.slug);
              return <button key={c.slug} type="button" onClick={() => set({ categories: on ? f.categories.filter((x) => x !== c.slug) : [...f.categories, c.slug] })}
                className={`px-3 py-1.5 rounded-full text-sm border ${on ? "bg-brand text-white border-brand" : "bg-white border-blush-2 hover:bg-blush"}`}>{c.name}</button>;
            })}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {([["bestSeller", "Best seller"], ["instant", "Instant (same-day) delivery"], ["preorder", "Pre-order"], ["giftCard", "Gift card option"], ["protectionBag", "Protection bag option"]] as const).map(([k, label]) => (
            <div key={k} className="flex items-center justify-between rounded-2xl bg-cream px-4 py-3"><span className="text-sm font-semibold">{label}</span><Toggle on={f[k]} onChange={(v) => set({ [k]: v } as Partial<Form>)} label={label} /></div>
          ))}
        </div>
      </section>

      <section className={sec}>
        <h3 className={h}>Photos</h3>
        <PhotosEditor images={f.images} alts={f.alts} folder="products" name={f.name || "product"} onChange={(images, alts) => set({ images, alts })} />
      </section>

      <section className={sec}>
        <h3 className={h}>Short description and details</h3>
        <Field label="Short description (under the name)" value={f.seoShort || f.short} rows={2} onChange={(v) => set({ seoShort: v, short: v })} />
        <div className="grid sm:grid-cols-2 gap-4">
          <LinesEditor label="What's included" items={f.includes} onChange={(v) => set({ includes: v })} />
          <LinesEditor label="Care tips" items={f.care} onChange={(v) => set({ care: v })} />
        </div>
        <Field label="Size (optional)" value={f.size} onChange={(v) => set({ size: v })} placeholder="e.g. 40 × 45 cm" />
        <Field label="Search words (comma separated)" value={f.tags} onChange={(v) => set({ tags: v })} hint="Helps the site search and the chat assistant." />
      </section>

      <section className={sec}>
        <h3 className={h}>Long description</h3>
        <RichText value={f.html} onChange={(v) => set({ html: v })} />
        <p className="text-xs text-muted">Use “Heading” for H2 and “Sub-heading” for H3.</p>
      </section>

      <section className={sec}>
        <h3 className={h}>SEO</h3>
        <Field label="Meta title" value={f.seoTitle} max={60} onChange={(v) => set({ seoTitle: v })} />
        <Field label="Meta description" value={f.seoDescription} max={160} rows={2} onChange={(v) => set({ seoDescription: v })} />
        <Field label="Focus keyword" value={f.keyword} onChange={(v) => set({ keyword: v })} />
      </section>

      <section className={sec}>
        <h3 className={h}>FAQs</h3>
        <FaqEditor items={f.faqs} onChange={(v) => set({ faqs: v })} />
      </section>

      <div className="flex justify-end"><button onClick={save} disabled={busy} className="btn btn-primary">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save product</button></div>
    </div>
  );
}
