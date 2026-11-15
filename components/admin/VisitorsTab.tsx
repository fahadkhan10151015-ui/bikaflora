"use client";
import { useEffect, useState } from "react";
import { Loader2, Eye, Users, MessageCircle, Percent, RefreshCw, Smartphone, Tablet, Monitor } from "lucide-react";
import { loadSupabase } from "@/lib/supabase-config";
import OwnDevice from "./OwnDevice";
import { card, Note } from "./ui";
import { TopList } from "./WhatsAppTab";

type KN = { k: string; n: number; u?: number };
type Stats = { views: number; visitors: number; wa: number; per_day: { d: string; views: number; visitors: number }[]; wa_per_day: { d: string; n: number }[]; pages: KN[]; sources: KN[]; devices: KN[]; wa_pages: KN[] };

const RANGES = [{ d: 1, l: "Today" }, { d: 7, l: "7 days" }, { d: 30, l: "30 days" }, { d: 90, l: "90 days" }];
const MYT = 8 * 3600e3;
const pageName = (p: string) => (p === "/" ? "Homepage" : p);

/** Visitors to the website: page views, unique visitors, top pages and where people come from. */
export default function VisitorsTab() {
  const [days, setDays] = useState(30);
  const [s, setS] = useState<Stats | null>(null);
  const [err, setErr] = useState("");
  const load = async () => {
    setS(null); setErr("");
    const sb = await loadSupabase();
    const { data, error } = (await sb?.rpc("admin_traffic", { p_days: days })) ?? { data: null, error: null };
    if (error) setErr(error.message);
    setS((data as Stats) ?? { views: 0, visitors: 0, wa: 0, per_day: [], wa_per_day: [], pages: [], sources: [], devices: [], wa_pages: [] });
  };
  useEffect(() => { load(); }, [days]); // eslint-disable-line react-hooks/exhaustive-deps

  // Every day in the range, also days with no visits.
  const daysList = Array.from({ length: days }, (_, i) => new Date(Date.now() + MYT - (days - 1 - i) * 86400e3).toISOString().slice(0, 10));
  const rate = s && s.visitors ? (s.wa / s.visitors) * 100 : 0;
  const waByPage = new Map((s?.wa_pages ?? []).map((x) => [x.k, x.n]));

  return (
    <div className="space-y-5">
      <OwnDevice />
      <div className="flex flex-wrap items-center gap-2">
        {RANGES.map((r) => <button key={r.d} onClick={() => setDays(r.d)} className={`btn !py-2 !px-4 text-sm ${days === r.d ? "btn-primary" : "btn-outline"}`}>{r.l}</button>)}
        <button onClick={load} className="btn btn-outline !py-2 !px-4 text-sm ml-auto"><RefreshCw className="w-4 h-4" /> Refresh</button>
      </div>
      {err && <Note kind="err">{err}</Note>}
      {!s ? <p className="text-muted"><Loader2 className="w-4 h-4 animate-spin inline" /> Loading…</p> : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { l: "Visitors", v: s.visitors, I: Users, t: "from-sky-500 to-sky-600", h: "Different people (browsers)" },
              { l: "Page views", v: s.views, I: Eye, t: "from-brand to-deep", h: `${s.visitors ? (s.views / s.visitors).toFixed(1) : 0} pages per visitor` },
              { l: "WhatsApp clicks", v: s.wa, I: MessageCircle, t: "from-emerald-500 to-emerald-600", h: "Taps on any WhatsApp button" },
              { l: "Click rate", v: `${rate.toFixed(1)}%`, I: Percent, t: "from-amber-500 to-amber-600", h: "WhatsApp clicks per visitor" },
            ].map(({ l, v, I, t, h }) => (
              <div key={l} className={`${card} p-4`}>
                <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t} text-white grid place-items-center`}><I className="w-5 h-5" /></span>
                <div className="mt-3 text-2xl font-semibold text-ink">{v}</div>
                <div className="text-sm text-ink">{l}</div>
                <div className="text-xs text-muted">{h}</div>
              </div>
            ))}
          </div>

          {days > 1 && (() => {
            const map = new Map(s.per_day.map((x) => [String(x.d).slice(0, 10), x]));
            const wmap = new Map(s.wa_per_day.map((x) => [String(x.d).slice(0, 10), x.n]));
            const max = Math.max(1, ...s.per_day.map((x) => x.visitors));
            return (
              <div className={`${card} p-5`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-ink">Visitors per day</h3>
                  <div className="flex gap-4 text-xs text-muted"><span className="flex items-center gap-1.5"><i className="w-3 h-3 rounded bg-sky-500 inline-block" /> Visitors</span><span className="flex items-center gap-1.5"><i className="w-3 h-3 rounded bg-wa inline-block" /> WhatsApp clicks</span></div>
                </div>
                <div className="mt-4 flex items-end gap-[3px] h-44">
                  {daysList.map((d) => {
                    const v = map.get(d)?.visitors ?? 0, w = wmap.get(d) ?? 0;
                    return (
                      <div key={d} className="group relative flex-1 h-full flex items-end" title={`${d}: ${v} visitors, ${map.get(d)?.views ?? 0} page views, ${w} WhatsApp clicks`}>
                        <div className="relative w-full rounded-t bg-sky-500/70 group-hover:bg-sky-500 transition" style={{ height: `${Math.max(v ? 3 : 1, (v / max) * 100)}%` }}>
                          {w > 0 && <div className="absolute bottom-0 inset-x-0 rounded-t bg-wa" style={{ height: `${Math.min(100, (w / Math.max(1, v)) * 100)}%` }} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted"><span>{daysList[0]}</span><span>Today</span></div>
              </div>
            );
          })()}

          {s.views === 0 ? (
            <div className={`${card} p-6 text-center text-muted`}>No visits recorded in this period yet. Every page someone opens on your website is counted here automatically.</div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-4">
              <div className={`${card} p-5 lg:col-span-2 overflow-x-auto`}>
                <h3 className="font-semibold text-ink">Top pages</h3>
                <table className="mt-3 w-full text-sm">
                  <thead><tr className="text-left text-muted"><th className="py-2 pr-3 font-medium">Page</th><th className="py-2 pr-3 font-medium text-right">Views</th><th className="py-2 pr-3 font-medium text-right">Visitors</th><th className="py-2 font-medium text-right">WhatsApp clicks</th></tr></thead>
                  <tbody>
                    {s.pages.map((p) => (
                      <tr key={p.k} className="border-t border-[#f1ece4]">
                        <td className="py-2 pr-3"><a href={p.k} target="_blank" rel="noopener" className="text-ink hover:text-brand">{pageName(p.k)}</a></td>
                        <td className="py-2 pr-3 text-right font-semibold">{p.n}</td>
                        <td className="py-2 pr-3 text-right">{p.u}</td>
                        <td className="py-2 text-right text-emerald-700 font-semibold">{waByPage.get(p.k) ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <TopList title="Where visitors came from" rows={s.sources.map((x) => [x.k, x.n] as [string, number])} total={s.visitors} />
              <div className={`${card} p-5`}>
                <h3 className="font-semibold text-ink">Device</h3>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {["mobile", "tablet", "desktop"].map((d) => {
                    const n = s.devices.find((x) => x.k === d)?.n ?? 0; const I = d === "mobile" ? Smartphone : d === "tablet" ? Tablet : Monitor;
                    return <div key={d} className="rounded-2xl bg-cream p-3 text-center"><I className="w-5 h-5 mx-auto text-brand" /><div className="mt-1 text-xl font-semibold text-ink">{s.visitors ? Math.round((n / s.visitors) * 100) : 0}%</div><div className="text-xs text-muted capitalize">{d} · {n}</div></div>;
                  })}
                </div>
              </div>
            </div>
          )}
          <p className="text-xs text-muted">Visitors are counted per browser, with no names or personal data. Search engine bots and your own visits to the admin panel are not counted. Counting started on 15 November 2026.</p>
        </>
      )}
    </div>
  );
}
