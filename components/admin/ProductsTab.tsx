"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Save, Loader2, Plus, Pencil } from "lucide-react";
import ProductEditor from "./ProductEditor";
import { productSeo } from "@/data/product-seo";
import { seoChecks, ScorePill } from "./SeoScore";
import { products } from "@/data/products";
import { sold as liveSold } from "@/data/sold";
import { loadSupabase } from "@/lib/supabase-config";
import { card, Note, Toggle } from "./ui";

type Row = { price: string; compareAt: string; sold: string; bestSeller: boolean };
type Saved = { slug: string; price: number | null; compare_at: number | null; sold: number | null; best_seller: boolean | null };

/** Edit price, sale ("before") price, number sold and best seller for every product. */
export default function ProductsTab({ startNew = false }: { startNew?: boolean } = {}) {
  const base = useMemo(() => Object.fromEntries(products.map((p) => [p.slug, {
    price: String(p.price), compareAt: p.compareAt ? String(p.compareAt) : "", sold: liveSold[p.slug] !== undefined ? String(liveSold[p.slug]) : "", bestSeller: p.categories.includes("best-seller"),
  }])) as Record<string, Row>, []);
  const [rows, setRows] = useState<Record<string, Row>>(base);
  const [start, setStart] = useState<Record<string, Row>>(base);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [editing, setEditing] = useState<string | null>(startNew ? "" : null);

  // Show edits saved but not yet published.
  useEffect(() => {
    (async () => {
      const sb = await loadSupabase();
      const { data } = (await sb?.from("product_overrides").select("*")) ?? { data: null };
      if (!data) return;
      const next = { ...base };
      for (const o of data as Saved[]) {
        if (!next[o.slug]) continue;
        next[o.slug] = {
          price: o.price != null ? String(o.price) : next[o.slug].price,
          compareAt: o.compare_at != null ? String(o.compare_at) : next[o.slug].compareAt,
          sold: o.sold != null ? String(o.sold) : next[o.slug].sold,
          bestSeller: o.best_seller ?? next[o.slug].bestSeller,
        };
      }
      setRows(next); setStart(next);
    })();
  }, [base]);

  const changed = Object.keys(rows).filter((k) => JSON.stringify(rows[k]) !== JSON.stringify(start[k]));
  const set = (slug: string, patch: Partial<Row>) => setRows((r) => ({ ...r, [slug]: { ...r[slug], ...patch } }));
  const num = (s: string) => (s.trim() === "" ? null : Number(s));

  const save = async () => {
    const bad = changed.find((k) => [rows[k].price, rows[k].compareAt, rows[k].sold].some((v) => v.trim() !== "" && !(Number(v) >= 0)));
    if (bad) { setMsg({ kind: "err", text: "Please use numbers only (0 or more)." }); return; }
    if (changed.some((k) => !(Number(rows[k].price) > 0))) { setMsg({ kind: "err", text: "Every product needs a price." }); return; }
    setBusy(true); setMsg(null);
    const sb = await loadSupabase();
    const payload = changed.map((slug) => ({ slug, price: num(rows[slug].price), compare_at: num(rows[slug].compareAt), sold: num(rows[slug].sold), best_seller: rows[slug].bestSeller, updated_at: new Date().toISOString() }));
    const { error } = (await sb?.from("product_overrides").upsert(payload)) ?? { error: { message: "No connection" } };
    setBusy(false);
    if (error) { setMsg({ kind: "err", text: `Not saved: ${error.message}` }); return; }
    setStart(rows);
    setMsg({ kind: "ok", text: `Saved ${payload.length} product${payload.length > 1 ? "s" : ""}. Press “Publish changes” to put them live.` });
  };

  const list = products.filter((p) => (p.name + p.sku).toLowerCase().includes(q.toLowerCase()));
  if (editing !== null) return <ProductEditor slug={editing} onClose={() => setEditing(null)} />;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <input className="input max-w-xs" placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="flex gap-2">
        <button onClick={() => setEditing("")} className="btn btn-outline"><Plus className="w-4 h-4" /> Add product</button>
        <button onClick={save} disabled={!changed.length || busy} className="btn btn-primary disabled:opacity-50">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save {changed.length ? `(${changed.length})` : ""}
        </button>
        </div>
      </div>
      {msg && <Note kind={msg.kind}>{msg.text}</Note>}
      <p className="text-sm text-muted">“Before price” shows crossed out (leave empty for no sale). “Sold” shows as “58 sold” on the product; leave it empty to hide it.</p>
      <div className={`${card} overflow-x-auto`}>
        <table className="w-full text-sm min-w-[920px]">
          <thead className="bg-blush/60 text-left">
            <tr><th className="p-3">Product</th><th className="p-3 w-28">Price (RM)</th><th className="p-3 w-28">Before price</th><th className="p-3 w-24">Sold</th><th className="p-3 w-28">Best seller</th><th className="p-3 w-24">SEO</th><th className="p-3 w-20"></th></tr>
          </thead>
          <tbody>
            {list.map((p) => {
              const r = rows[p.slug]; const dirty = changed.includes(p.slug);
              return (
                <tr key={p.slug} className={`border-t border-blush-2/60 ${dirty ? "bg-amber-50/60" : ""}`}>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <Image src={p.images[0]} alt="" width={44} height={44} className="w-11 h-11 rounded-xl object-cover" />
                      <div><div className="font-semibold text-ink">{p.name}</div><div className="text-xs text-muted">{p.sku}</div></div>
                    </div>
                  </td>
                  <td className="p-3"><input type="number" min={0} className="input !py-2" value={r.price} onChange={(e) => set(p.slug, { price: e.target.value })} /></td>
                  <td className="p-3"><input type="number" min={0} className="input !py-2" value={r.compareAt} placeholder="–" onChange={(e) => set(p.slug, { compareAt: e.target.value })} /></td>
                  <td className="p-3"><input type="number" min={0} className="input !py-2" value={r.sold} placeholder="–" onChange={(e) => set(p.slug, { sold: e.target.value })} /></td>
                  <td className="p-3"><Toggle on={r.bestSeller} onChange={(v) => set(p.slug, { bestSeller: v })} label={`Best seller: ${p.name}`} /></td>
                  <td className="p-3">{(() => { const s = productSeo[p.slug]; return <ScorePill score={seoChecks({ keyword: s?.keyword ?? "", title: s?.title ?? p.name, description: s?.description ?? "", slug: p.slug, h1: p.name, html: `<p>${s?.short ?? p.short}</p>${s?.html ?? ""}`, alts: Object.values(s?.alts ?? {}), minWords: 200, faqs: s?.faqs }).score} />; })()}</td>
                  <td className="p-3"><button onClick={() => setEditing(p.slug)} className="inline-flex items-center gap-1 text-brand font-semibold text-sm"><Pencil className="w-4 h-4" /> Edit</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
