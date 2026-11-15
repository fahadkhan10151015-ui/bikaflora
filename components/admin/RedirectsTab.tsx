"use client";
import { useEffect, useMemo, useState } from "react";
import { Loader2, Save, Plus, Trash2, ArrowRight, ExternalLink, AlertTriangle } from "lucide-react";
import { card, Note } from "./ui";
import { IconBtn } from "./fields";
import { loadDoc, saveDoc } from "./doc";
import { sitePaths } from "./sitePaths";

type R = { from: string; to: string; type: "301" | "302" };

/** Turns a pasted full link into a path: https://bikaflora.my/old-page/ → /old-page */
const toPath = (v: string) => {
  let s = v.trim().replace(/^https?:\/\/(www\.)?bikaflora\.my/i, "");
  if (s && !s.startsWith("/") && !/^https?:/i.test(s)) s = "/" + s;
  return s.length > 1 ? s.replace(/\/$/, "") : s;
};
const OK_FROM = /^\/[A-Za-z0-9._~%/-]+$/;

/** Admin → Redirects: send an old or deleted page link to a new page (301 keeps Google ranking). */
export default function RedirectsTab() {
  const [list, setList] = useState<R[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const pages = useMemo(() => sitePaths(), []);
  const [loadErr, setLoadErr] = useState("");
  useEffect(() => { loadDoc<{ list?: R[] }>("redirects").then((d) => setList((d?.list ?? []).map((r) => ({ ...r, type: r.type === "302" ? "302" : "301" })))).catch((e) => { setLoadErr(String(e.message || e)); setList([]); }); }, []);
  if (!list) return <p className="text-muted"><Loader2 className="w-4 h-4 animate-spin inline" /> Loading…</p>;
  const upd = (i: number, p: Partial<R>) => setList(list.map((r, j) => (j === i ? { ...r, ...p } : r)));

  const problem = (r: R, i: number) => {
    if (!r.from && !r.to) return "";
    if (!OK_FROM.test(r.from) || r.from === "/") return "Old link should look like /old-page (letters, numbers and - only).";
    if (!r.to) return "Add the new link.";
    if (!r.to.startsWith("/") && !/^https:\/\//.test(r.to)) return "New link should start with / or https://";
    if (toPath(r.to) === r.from) return "Old and new links are the same.";
    if (list.findIndex((x) => x.from === r.from) !== i) return "This old link is already in the list.";
    if (list.some((x) => x.from === toPath(r.to) && x.to && toPath(x.to) === r.from)) return "These two redirects point at each other (loop).";
    return "";
  };
  const warn = (r: R) => (pages.includes(r.from) ? "This page exists now. The redirect will replace it." : r.to.startsWith("/") && r.to.length > 1 && !pages.includes(r.to.split("?")[0]) ? "The new link is not a known page. Please double-check it." : "");

  const save = async () => {
    const rows = list.filter((r) => r.from || r.to);
    const bad = rows.map((r) => problem(r, list.indexOf(r))).find(Boolean);
    if (bad) return setMsg({ kind: "err", text: `Please fix: ${bad}` });
    setBusy(true); setMsg(null);
    const err = await saveDoc("redirects", { list: rows });
    setBusy(false); setList(rows);
    setMsg(err ? { kind: "err", text: err } : { kind: "ok", text: "Saved. Press “Publish changes” at the top to put the redirects live." });
  };

  return (
    <div className="space-y-5">
      {loadErr && <Note kind="err">Could not load your saved settings ({loadErr}). Saving is turned off so nothing is overwritten. Please refresh the page.</Note>}
      <div className={`${card} p-5 sm:p-6`}>
        <h3 className="font-semibold text-ink text-lg">How it works</h3>
        <p className="mt-1 text-sm text-muted leading-relaxed">When you delete or rename a page, people and Google may still open the old link. A redirect sends them to the new page automatically. Use <b>301 (permanent)</b> almost always: it moves the old page&apos;s Google ranking to the new one. Use <b>302 (temporary)</b> only for short-term changes. You can paste a full link like https://bikaflora.my/old-page.</p>
      </div>

      <div className={`${card} overflow-hidden`}>
        <datalist id="redir-pages">{pages.map((p) => <option key={p} value={p} />)}</datalist>
        <div className="hidden md:grid grid-cols-[1fr_24px_1fr_130px_80px] gap-3 px-4 py-2 text-xs font-semibold text-muted bg-cream/60"><span>Old link</span><span /><span>New link</span><span>Type</span><span /></div>
        {list.length === 0 && <p className="p-5 text-sm text-muted">No redirects yet.</p>}
        {list.map((r, i) => {
          const p = problem(r, i), w = !p ? warn(r) : "";
          return (
            <div key={i} className="border-t border-[#f1ece4] px-4 py-3">
              <div className="grid md:grid-cols-[1fr_24px_1fr_130px_80px] gap-3 items-center">
                <input className="input !py-2" placeholder="/old-page" value={r.from} onChange={(e) => upd(i, { from: e.target.value })} onBlur={(e) => upd(i, { from: toPath(e.target.value) })} />
                <ArrowRight className="w-4 h-4 text-muted hidden md:block" />
                <input className="input !py-2" placeholder="/new-page" list="redir-pages" value={r.to} onChange={(e) => upd(i, { to: e.target.value })} onBlur={(e) => upd(i, { to: toPath(e.target.value) })} />
                <select className="input !py-2" value={r.type} onChange={(e) => upd(i, { type: e.target.value as R["type"] })}><option value="301">301 permanent</option><option value="302">302 temporary</option></select>
                <div className="flex justify-end">
                  {r.from && OK_FROM.test(r.from) && <a href={r.from} target="_blank" rel="noopener" title="Test the old link" className="p-2 rounded-lg hover:bg-blush text-muted"><ExternalLink className="w-4 h-4" /></a>}
                  <IconBtn title="Remove" danger onClick={() => setList(list.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4" /></IconBtn>
                </div>
              </div>
              {(p || w) && <p className={`mt-1.5 text-xs flex items-center gap-1.5 ${p ? "text-red-600" : "text-amber-700"}`}><AlertTriangle className="w-3.5 h-3.5" /> {p || w}</p>}
            </div>
          );
        })}
        <div className="border-t border-[#f1ece4] p-4"><button onClick={() => setList([...list, { from: "", to: "", type: "301" }])} className="text-sm text-brand font-semibold inline-flex items-center gap-1"><Plus className="w-4 h-4" /> Add redirect</button></div>
      </div>

      <div className="sticky bottom-0 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-[#f6f5f2]/95 backdrop-blur border-t border-[#ebe7df] flex flex-wrap items-center gap-3">
        {msg && <div className="flex-1 min-w-[240px]"><Note kind={msg.kind}>{msg.text}</Note></div>}
        <button onClick={save} disabled={busy || !!loadErr} className="btn btn-primary ml-auto disabled:opacity-50">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save redirects</button>
      </div>
    </div>
  );
}
