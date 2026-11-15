"use client";
import { useEffect, useMemo, useState } from "react";
import { Save, RotateCcw, Loader2, ExternalLink } from "lucide-react";
import { allPagePaths } from "@/lib/sitemap-entries";
import { loadSupabase } from "@/lib/supabase-config";
import { card, Note, Toggle } from "./ui";

type Ov = { path: string; title: string | null; description: string | null; noindex: boolean; in_sitemap: boolean };
type Live = { title: string; description: string };

/** Yoast-style SEO editor: meta title and description per page, Google preview, noindex and sitemap switches. */
export default function SeoTab() {
  const pages = useMemo(() => allPagePaths(), []);
  const [ovs, setOvs] = useState<Record<string, Ov>>({});
  const [sel, setSel] = useState(pages[0].path);
  const [q, setQ] = useState("");
  const [live, setLive] = useState<Live | null>(null);
  const [form, setForm] = useState({ title: "", description: "", noindex: false, inSitemap: true });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const loadOvs = async () => {
    const sb = await loadSupabase();
    const { data } = (await sb?.from("seo_overrides").select("*")) ?? { data: null };
    setOvs(Object.fromEntries(((data as Ov[]) ?? []).map((o) => [o.path, o])));
  };
  useEffect(() => { loadOvs(); }, []);

  // Read the page's current (published) title and description.
  useEffect(() => {
    setLive(null); setMsg(null);
    fetch(sel).then((r) => r.text()).then((html) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      setLive({ title: doc.title, description: doc.querySelector('meta[name="description"]')?.getAttribute("content") ?? "" });
    }).catch(() => setLive({ title: "", description: "" }));
  }, [sel]);

  useEffect(() => {
    const o = ovs[sel];
    setForm({ title: o?.title ?? "", description: o?.description ?? "", noindex: o?.noindex ?? false, inSitemap: o?.in_sitemap ?? true });
  }, [sel, ovs]);

  const save = async () => {
    setBusy(true);
    const sb = await loadSupabase();
    const { error } = (await sb?.from("seo_overrides").upsert({ path: sel, title: form.title.trim() || null, description: form.description.trim() || null, noindex: form.noindex, in_sitemap: form.inSitemap, updated_at: new Date().toISOString() })) ?? { error: null };
    setBusy(false);
    if (error) setMsg({ kind: "err", text: `Not saved: ${error.message}` });
    else { setMsg({ kind: "ok", text: "Saved. Press “Publish changes” to put it live." }); loadOvs(); }
  };
  const reset = async () => {
    if (!window.confirm("Go back to the original title, description and settings for this page?")) return;
    setBusy(true);
    const sb = await loadSupabase();
    const { error } = (await sb?.from("seo_overrides").delete().eq("path", sel)) ?? { error: null };
    setBusy(false);
    if (error) setMsg({ kind: "err", text: error.message });
    else { setMsg({ kind: "ok", text: "Reset to the original. Press “Publish changes” to put it live." }); loadOvs(); }
  };

  const title = form.title || live?.title || "";
  const desc = form.description || live?.description || "";
  const tCol = title.length > 60 ? "text-red-600" : title.length >= 30 ? "text-emerald-600" : "text-amber-600";
  const dCol = desc.length > 160 ? "text-red-600" : desc.length >= 120 ? "text-emerald-600" : "text-amber-600";
  const list = pages.filter((p) => p.path.includes(q.toLowerCase()));

  return (
    <div className="grid lg:grid-cols-[320px_minmax(0,1fr)] gap-6 items-start">
      <div className={`${card} p-3`}>
        <input className="input !py-2" placeholder="Search pages…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="mt-2 max-h-[65vh] overflow-y-auto">
          {list.map((p, i) => (
            <div key={p.path}>
              {(i === 0 || list[i - 1].group !== p.group) && <div className="px-2 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted">{p.group}</div>}
              <button onClick={() => setSel(p.path)} className={`w-full text-left px-3 py-2 rounded-xl text-sm flex items-center justify-between gap-2 ${sel === p.path ? "bg-brand text-white" : "hover:bg-blush"}`}>
                <span className="truncate">{p.path}</span>
                {ovs[p.path] && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${sel === p.path ? "bg-white/20" : "bg-amber-100 text-amber-800"}`}>{ovs[p.path].noindex || !ovs[p.path].in_sitemap ? "OFF" : "EDITED"}</span>}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {msg && <Note kind={msg.kind}>{msg.text}</Note>}
        <div className={`${card} p-5 sm:p-6`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-semibold break-all">{sel}</h2>
            <a href={sel} target="_blank" rel="noopener" className="text-sm text-brand inline-flex items-center gap-1 hover:underline">Open page <ExternalLink className="w-3.5 h-3.5" /></a>
          </div>

          <div className="mt-5 rounded-2xl border border-gray-200 p-4 bg-white">
            <div className="text-xs text-gray-500">Google preview</div>
            <div className="mt-1 text-[13px] text-gray-700">bikaflora.my{sel === "/" ? "" : sel.replace(/\//g, " › ").replace(/^ › /, " › ")}</div>
            <div className="text-[19px] leading-snug text-[#1a0dab] line-clamp-1">{title || "…"}</div>
            <div className="text-[14px] text-gray-600 line-clamp-2">{desc || "…"}</div>
          </div>

          <label className="label mt-5" htmlFor="seo-t">Meta title <span className={`font-normal ${tCol}`}>({title.length}/60)</span></label>
          <input id="seo-t" className="input" maxLength={120} placeholder={live?.title || "Loading current title…"} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <p className="mt-1 text-xs text-muted">Leave empty to keep the current title shown in grey.</p>

          <label className="label mt-4" htmlFor="seo-d">Meta description <span className={`font-normal ${dCol}`}>({desc.length}/160)</span></label>
          <textarea id="seo-d" className="input" rows={3} maxLength={320} placeholder={live?.description || "Loading current description…"} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <p className="mt-1 text-xs text-muted">Best length: title 30 to 60 characters, description 120 to 160.</p>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between gap-4 rounded-2xl bg-cream px-4 py-3">
              <div><div className="font-semibold text-sm">Show in sitemap</div><div className="text-xs text-muted">Off = the page is left out of sitemap.xml.</div></div>
              <Toggle on={form.inSitemap} onChange={(v) => setForm({ ...form, inSitemap: v })} label="Show in sitemap" />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-2xl bg-cream px-4 py-3">
              <div><div className="font-semibold text-sm">Hide from Google (noindex)</div><div className="text-xs text-muted">On = Google will not show this page in search.</div></div>
              <Toggle on={form.noindex} onChange={(v) => setForm({ ...form, noindex: v })} label="Hide from Google" />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={save} disabled={busy} className="btn btn-primary">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save</button>
            {ovs[sel] && <button onClick={reset} disabled={busy} className="btn btn-outline"><RotateCcw className="w-4 h-4" /> Reset to original</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
