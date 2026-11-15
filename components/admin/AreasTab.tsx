"use client";
import { useEffect, useState } from "react";
import { Loader2, Save, Plus, ChevronDown, ChevronUp, ExternalLink, MapPin, EyeOff } from "lucide-react";
import { allLocations, type Location } from "@/data/locations";
import { card, Note, Toggle } from "./ui";
import { Field, LinesEditor } from "./fields";
import { loadDoc, saveDoc } from "./doc";

type Edit = Partial<Location>;
type Row = Location & { fee?: number; cutoff?: string };
type Redirect = { from: string; to: string; type?: string };

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Admin → Delivery areas: show or hide areas, delivery fee, cut-off time and add new areas. */
export default function AreasTab() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [wasHidden, setWasHidden] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [add, setAdd] = useState({ name: "", state: "Selangor" as Location["state"] });
  const [q, setQ] = useState("");

  const [loadErr, setLoadErr] = useState("");
  useEffect(() => {
    loadDoc<{ list?: Record<string, Edit> }>("areas").catch((e) => { setLoadErr(String(e.message || e)); return null; }).then((d) => {
      const list = d?.list ?? {};
      // Start from the live areas, then apply any saved edits not yet published.
      const base: Row[] = allLocations.map((l) => ({ ...l, ...list[l.slug] } as Row));
      for (const [slug, e] of Object.entries(list)) if (!base.some((b) => b.slug === slug) && e.name) base.push({ slug, name: e.name, state: e.state ?? "Selangor", nearby: e.nearby ?? [], landmarks: e.landmarks ?? [], blurb: e.blurb ?? "", ...e, added: true } as Row);
      setRows(base);
      setWasHidden(new Set(base.filter((r) => r.hidden).map((r) => r.slug)));
    });
  }, []);
  if (!rows) return <p className="text-muted"><Loader2 className="w-4 h-4 animate-spin inline" /> Loading…</p>;
  const upd = (slug: string, p: Edit) => setRows(rows.map((r) => (r.slug === slug ? { ...r, ...p } : r)));

  const addArea = () => {
    const name = add.name.trim(); const slug = slugify(name);
    if (!name) return setMsg({ kind: "err", text: "Please type the area name." });
    if (rows.some((r) => r.slug === slug)) return setMsg({ kind: "err", text: `${name} is already in the list.` });
    setRows([{ slug, name, state: add.state, nearby: [], landmarks: [], blurb: `We deliver handmade bouquets across ${name}, ${add.state}. Message us on WhatsApp with the address and we confirm the delivery fee before you pay.`, added: true }, ...rows]);
    setOpen(slug); setAdd({ ...add, name: "" }); setMsg(null);
  };

  const save = async () => {
    setBusy(true); setMsg(null);
    const list: Record<string, Edit> = {};
    for (const r of rows) {
      const { slug, ...rest } = r;
      list[slug] = { name: rest.name, state: rest.state, nearby: rest.nearby, landmarks: rest.landmarks, blurb: rest.blurb, fee: rest.fee === undefined || String(rest.fee) === "" ? undefined : Number(rest.fee), cutoff: rest.cutoff ?? "", hidden: !!rest.hidden };
    }
    let err = await saveDoc("areas", { list });
    // A hidden area's page goes away, so its old link is sent to the main delivery page (keeps Google happy).
    // When an area is shown again, that redirect is removed.
    const hiddenPaths = rows.filter((r) => r.hidden).map((r) => `/flower-delivery/${r.slug}`);
    const shownPaths = new Set(rows.filter((r) => !r.hidden).map((r) => `/flower-delivery/${r.slug}`));
    const newlyHidden = rows.filter((r) => r.hidden && !wasHidden.has(r.slug));
    if (!err) {
      const red = (await loadDoc<{ list?: Redirect[] }>("redirects").catch(() => null))?.list;
      if (!red) { setBusy(false); return setMsg({ kind: "err", text: "Areas saved, but the redirects could not be updated. Please try Save again." }); }
      const kept = red.filter((x) => !(shownPaths.has(x.from) && x.to === "/flower-delivery"));
      const extra = hiddenPaths.filter((from) => !kept.some((x) => x.from === from)).map((from) => ({ from, to: "/flower-delivery", type: "301" }));
      if (extra.length || kept.length !== red.length) err = await saveDoc("redirects", { list: [...kept, ...extra] });
      setWasHidden(new Set(rows.filter((r) => r.hidden).map((r) => r.slug)));
    }
    setBusy(false);
    setMsg(err ? { kind: "err", text: err } : { kind: "ok", text: `Saved.${newlyHidden.length ? " Hidden area links now go to the Delivery Areas page." : ""} Press “Publish changes” at the top to put it live.` });
  };

  const shown = rows.filter((r) => !q || r.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-5">
      {loadErr && <Note kind="err">Could not load your saved settings ({loadErr}). Saving is turned off so nothing is overwritten. Please refresh the page.</Note>}
      <div className={`${card} p-5 sm:p-6`}>
        <h3 className="font-semibold text-ink text-lg">Add a delivery area</h3>
        <p className="text-sm text-muted">Creates a new page at /flower-delivery/area-name. After publishing, write its full content in Pages → City pages.</p>
        <div className="mt-4 grid sm:grid-cols-[1fr_200px_auto] gap-3 items-end">
          <Field label="Area name" value={add.name} onChange={(v) => setAdd({ ...add, name: v })} placeholder="e.g. Setia Alam" />
          <label className="block"><span className="label">State</span>
            <select className="input" value={add.state} onChange={(e) => setAdd({ ...add, state: e.target.value as Location["state"] })}><option>Selangor</option><option>Kuala Lumpur</option></select>
          </label>
          <button onClick={addArea} className="btn btn-primary"><Plus className="w-4 h-4" /> Add area</button>
        </div>
      </div>

      <div className={`${card} overflow-hidden`}>
        <div className="p-4 flex flex-wrap items-center gap-3 border-b border-[#f1ece4]">
          <h3 className="font-semibold text-ink">All areas <span className="text-muted font-normal">({rows.filter((r) => !r.hidden).length} shown, {rows.filter((r) => r.hidden).length} hidden)</span></h3>
          <input className="input !py-2 !w-56 ml-auto" placeholder="Search areas…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="hidden md:grid grid-cols-[1fr_120px_130px_150px_70px_40px] gap-3 px-4 py-2 text-xs font-semibold text-muted bg-cream/60">
          <span>Area</span><span>State</span><span>Delivery from (RM)</span><span>Same-day cut-off</span><span>Shown</span><span />
        </div>
        {shown.map((r) => (
          <div key={r.slug} className={`border-t border-[#f1ece4] ${r.hidden ? "bg-gray-50" : ""}`}>
            <div className="grid md:grid-cols-[1fr_120px_130px_150px_70px_40px] grid-cols-2 gap-3 px-4 py-3 items-center">
              <div className="col-span-2 md:col-span-1 min-w-0">
                <div className={`font-semibold ${r.hidden ? "text-muted line-through" : "text-ink"}`}>{r.name} {r.added && <span className="ml-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[11px] font-semibold no-underline">New</span>}</div>
                <a href={`/flower-delivery/${r.slug}`} target="_blank" rel="noopener" className="text-xs text-muted hover:text-brand inline-flex items-center gap-1">/flower-delivery/{r.slug} <ExternalLink className="w-3 h-3" /></a>
              </div>
              <span className="text-sm text-muted">{r.state}</span>
              <input className="input !py-1.5" type="number" min={0} placeholder="Ask" value={r.fee ?? ""} onChange={(e) => upd(r.slug, { fee: e.target.value === "" ? undefined : Number(e.target.value) })} aria-label={`Delivery fee from for ${r.name}`} />
              <input className="input !py-1.5" placeholder="Default" value={r.cutoff ?? ""} onChange={(e) => upd(r.slug, { cutoff: e.target.value })} aria-label={`Cut-off time for ${r.name}`} />
              <Toggle on={!r.hidden} onChange={(v) => upd(r.slug, { hidden: !v })} label={`Show ${r.name}`} />
              <button onClick={() => setOpen(open === r.slug ? null : r.slug)} className="p-1.5 rounded-lg hover:bg-blush justify-self-end" aria-label="More details">{open === r.slug ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</button>
            </div>
            {open === r.slug && (
              <div className="px-4 pb-5 grid md:grid-cols-2 gap-4">
                <Field label="Area name" value={r.name} onChange={(v) => upd(r.slug, { name: v })} />
                <label className="block"><span className="label">State</span>
                  <select className="input" value={r.state} onChange={(e) => upd(r.slug, { state: e.target.value as Location["state"] })}><option>Selangor</option><option>Kuala Lumpur</option></select>
                </label>
                <div className="md:col-span-2"><Field label="Short description" rows={3} value={r.blurb} onChange={(v) => upd(r.slug, { blurb: v })} hint="Shown on the area page when it has no full content yet, and in the area lists." /></div>
                <LinesEditor label="Nearby areas (exact names)" items={r.nearby} onChange={(v) => upd(r.slug, { nearby: v })} />
                <LinesEditor label="Landmarks" items={r.landmarks} onChange={(v) => upd(r.slug, { landmarks: v })} />
                {r.hidden && <p className="md:col-span-2 text-sm text-amber-700 flex items-center gap-2"><EyeOff className="w-4 h-4" /> Hidden: this page is removed from the website, menus and sitemap. Its old link will go to the Delivery Areas page.</p>}
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-muted flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> “Delivery from” shows as a badge and in the FAQ on the area page. Leave empty to say the fee is confirmed on WhatsApp. Cut-off: leave empty to use the default in Site settings.</p>

      <div className="sticky bottom-0 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-[#f6f5f2]/95 backdrop-blur border-t border-[#ebe7df] flex flex-wrap items-center gap-3">
        {msg && <div className="flex-1 min-w-[240px]"><Note kind={msg.kind}>{msg.text}</Note></div>}
        <button onClick={save} disabled={busy || !!loadErr} className="btn btn-primary ml-auto disabled:opacity-50">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save areas</button>
      </div>
    </div>
  );
}
