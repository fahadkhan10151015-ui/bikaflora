"use client";
import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Loader2, EyeOff, Eye } from "lucide-react";
import { products } from "@/data/products";
import { loadSupabase } from "@/lib/supabase-config";
import { useRatings } from "@/components/product/RatingsProvider";
import { card, Note } from "./ui";

type Review = { id: string; product_slug: string; name: string; rating: number; comment: string; hidden: boolean; created_at: string };
const nameOf = (slug: string) => products.find((p) => p.slug === slug)?.name ?? slug;
const Stars = ({ value, onChange }: { value: number; onChange: (n: number) => void }) => (
  <select className="input !py-2 !w-auto" value={value} onChange={(e) => onChange(Number(e.target.value))}>
    {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{"★".repeat(n)} {n}</option>)}
  </select>
);

/** Add, edit, hide and delete customer reviews. Changes show on the site straight away. */
export default function ReviewsTab() {
  const ratings = useRatings();
  const [list, setList] = useState<Review[] | null>(null);
  const [edit, setEdit] = useState<Record<string, Review>>({});
  const [filter, setFilter] = useState("");
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState("");
  const [nw, setNw] = useState({ product_slug: products[0].slug, name: "", rating: 5, comment: "" });

  const load = async () => {
    const sb = await loadSupabase();
    const { data, error } = (await sb?.from("reviews").select("id,product_slug,name,rating,comment,hidden,created_at").order("created_at", { ascending: false })) ?? { data: null, error: null };
    if (error) setMsg({ kind: "err", text: error.message });
    setList((data as Review[]) ?? []); setEdit({});
  };
  useEffect(() => { load(); }, []);

  const done = (text: string) => { setMsg({ kind: "ok", text }); ratings.reload(); load(); };
  const fail = (e: { message: string }) => setMsg({ kind: "err", text: `Not saved: ${e.message}` });

  const save = async (r: Review) => {
    setBusy(r.id);
    const sb = await loadSupabase();
    const { error } = (await sb?.from("reviews").update({ name: r.name.trim(), rating: r.rating, comment: r.comment.trim(), hidden: r.hidden }).eq("id", r.id)) ?? { error: null };
    setBusy("");
    if (error) fail(error); else done("Review updated. It is live now.");
  };
  const remove = async (r: Review) => {
    if (!window.confirm(`Delete ${r.name}'s review on ${nameOf(r.product_slug)}? This cannot be undone.`)) return;
    setBusy(r.id);
    const sb = await loadSupabase();
    const { error } = (await sb?.from("reviews").delete().eq("id", r.id)) ?? { error: null };
    setBusy("");
    if (error) fail(error); else done("Review deleted.");
  };
  const add = async () => {
    if (nw.name.trim().length < 2 || nw.comment.trim().length < 3) { setMsg({ kind: "err", text: "Please add the customer name and the review text." }); return; }
    setBusy("new");
    const sb = await loadSupabase();
    const { error } = (await sb?.from("reviews").insert({ product_slug: nw.product_slug, user_id: null, name: nw.name.trim(), rating: nw.rating, comment: nw.comment.trim() })) ?? { error: null };
    setBusy("");
    if (error) fail(error); else { setNw({ ...nw, name: "", comment: "", rating: 5 }); done("Review added. It is live now."); }
  };

  const shown = (list ?? []).filter((r) => !filter || r.product_slug === filter);
  return (
    <div className="space-y-5">
      {msg && <Note kind={msg.kind}>{msg.text}</Note>}

      <div className={`${card} p-5 sm:p-6`}>
        <h2 className="text-xl font-semibold flex items-center gap-2"><Plus className="w-5 h-5" /> Add a review</h2>
        <div className="mt-4 grid sm:grid-cols-[1fr_1fr_auto] gap-3">
          <select className="input" value={nw.product_slug} onChange={(e) => setNw({ ...nw, product_slug: e.target.value })}>
            {products.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
          </select>
          <input className="input" placeholder="Customer name, e.g. Aisyah K." maxLength={60} value={nw.name} onChange={(e) => setNw({ ...nw, name: e.target.value })} />
          <Stars value={nw.rating} onChange={(n) => setNw({ ...nw, rating: n })} />
        </div>
        <textarea className="input mt-3" rows={3} maxLength={1000} placeholder="What the customer wrote" value={nw.comment} onChange={(e) => setNw({ ...nw, comment: e.target.value })} />
        <button onClick={add} disabled={busy === "new"} className="btn btn-primary mt-3">{busy === "new" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add review</button>
      </div>

      <div className="flex flex-wrap items-center gap-3 justify-between">
        <h2 className="text-xl font-semibold">All reviews {list && <span className="text-muted text-base font-normal">({shown.length})</span>}</h2>
        <select className="input !w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All products</option>
          {products.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
        </select>
      </div>

      {!list ? <p className="text-muted"><Loader2 className="w-4 h-4 animate-spin inline" /> Loading…</p> : (
        <div className="space-y-3">
          {shown.map((orig) => {
            const r = edit[orig.id] ?? orig;
            const dirty = !!edit[orig.id] && JSON.stringify(edit[orig.id]) !== JSON.stringify(orig);
            const set = (patch: Partial<Review>) => setEdit((e) => ({ ...e, [orig.id]: { ...r, ...patch } }));
            return (
              <div key={orig.id} className={`${card} p-4 sm:p-5 ${r.hidden ? "opacity-60" : ""}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-semibold text-ink">{nameOf(r.product_slug)} {r.hidden && <span className="ml-2 text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-0.5">Hidden</span>}</div>
                </div>
                <div className="mt-3 grid sm:grid-cols-[1fr_auto] gap-3">
                  <input className="input !py-2" value={r.name} maxLength={60} onChange={(e) => set({ name: e.target.value })} />
                  <Stars value={r.rating} onChange={(n) => set({ rating: n })} />
                </div>
                <textarea className="input mt-3" rows={2} maxLength={1000} value={r.comment} onChange={(e) => set({ comment: e.target.value })} />
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => save(r)} disabled={!dirty || busy === orig.id} className="btn btn-primary !py-2 !px-4 text-sm disabled:opacity-40"><Save className="w-4 h-4" /> Save</button>
                  <button onClick={() => save({ ...r, hidden: !r.hidden })} disabled={busy === orig.id} className="btn btn-outline !py-2 !px-4 text-sm">{r.hidden ? <><Eye className="w-4 h-4" /> Show on site</> : <><EyeOff className="w-4 h-4" /> Hide</>}</button>
                  <button onClick={() => remove(orig)} disabled={busy === orig.id} className="btn !py-2 !px-4 text-sm text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /> Delete</button>
                </div>
              </div>
            );
          })}
          {shown.length === 0 && <p className="text-muted">No reviews yet.</p>}
        </div>
      )}
    </div>
  );
}
