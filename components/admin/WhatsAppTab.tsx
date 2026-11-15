"use client";
import { useEffect, useMemo, useState } from "react";
import { Loader2, MousePointerClick, ShoppingBag, CalendarDays, Globe2, Smartphone, Monitor, Tablet, RefreshCw } from "lucide-react";
import { loadSupabase } from "@/lib/supabase-config";
import { products } from "@/data/products";
import { card, Note, fmtDate } from "./ui";

type Click = { id: number; created_at: string; page: string; kind: string; button: string | null; product: string | null; device: string | null; source: string | null };

const RANGES = [{ d: 1, l: "Today" }, { d: 7, l: "7 days" }, { d: 30, l: "30 days" }, { d: 90, l: "90 days" }];
const MYT = 8 * 3600e3;
const dayKey = (iso: string) => new Date(new Date(iso).getTime() + MYT).toISOString().slice(0, 10);
const productName = (slug: string) => products.find((p) => p.slug === slug)?.name ?? slug;
const pageName = (p: string) => (p === "/" ? "Homepage" : p);

function count<T>(rows: T[], key: (r: T) => string | null | undefined) {
  const m = new Map<string, number>();
  for (const r of rows) { const k = key(r); if (k) m.set(k, (m.get(k) ?? 0) + 1); }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function TopList({ title, rows, total, label = (k: string) => k, empty = "No clicks yet." }: { title: string; rows: [string, number][]; total: number; label?: (k: string) => string; empty?: string }) {
  return (
    <div className={`${card} p-5`}>
      <h3 className="font-semibold text-ink">{title}</h3>
      {rows.length === 0 ? <p className="mt-3 text-sm text-muted">{empty}</p> : (
        <ul className="mt-3 space-y-2.5">
          {rows.slice(0, 8).map(([k, n]) => (
            <li key={k} className="text-sm">
              <div className="flex justify-between gap-3"><span className="truncate text-ink" title={k}>{label(k)}</span><span className="font-semibold text-ink shrink-0">{n} <span className="text-muted font-normal">· {Math.round((n / total) * 100)}%</span></span></div>
              <div className="mt-1 h-1.5 rounded-full bg-[#f1ece4]"><div className="h-full rounded-full bg-wa" style={{ width: `${(n / rows[0][1]) * 100}%` }} /></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** WhatsApp click tracking: how many people tapped a WhatsApp button, from where and for what. */
export default function WhatsAppTab() {
  const [days, setDays] = useState(30);
  const [rows, setRows] = useState<Click[] | null>(null);
  const [err, setErr] = useState("");

  const load = async () => {
    setRows(null); setErr("");
    const sb = await loadSupabase();
    const todayStart = new Date(new Date(Date.now() + MYT).toISOString().slice(0, 10) + "T00:00:00+08:00");
    const since = new Date(todayStart.getTime() - (days - 1) * 86400e3).toISOString();
    const { data, error } = (await sb?.from("wa_clicks").select("*").gte("created_at", since).order("created_at", { ascending: false }).limit(10000)) ?? { data: null, error: null };
    if (error) setErr(error.message);
    setRows((data as Click[]) ?? []);
  };
  useEffect(() => { load(); }, [days]); // eslint-disable-line react-hooks/exhaustive-deps

  const s = useMemo(() => {
    if (!rows) return null;
    const total = rows.length;
    const orders = rows.filter((r) => /order/i.test(r.kind)).length;
    const perDay = new Map<string, number>();
    for (let i = days - 1; i >= 0; i--) perDay.set(dayKey(new Date(Date.now() - i * 86400e3).toISOString()), 0);
    for (const r of rows) { const k = dayKey(r.created_at); if (perDay.has(k)) perDay.set(k, perDay.get(k)! + 1); }
    const sources = count(rows, (r) => r.source || "Direct");
    return { total, orders, perDay: [...perDay.entries()], sources, pages: count(rows, (r) => r.page), products: count(rows, (r) => r.product), kinds: count(rows, (r) => r.kind), buttons: count(rows, (r) => r.button), devices: count(rows, (r) => r.device) };
  }, [rows, days]);

  const devIcon = (d: string) => (d === "mobile" ? Smartphone : d === "tablet" ? Tablet : Monitor);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {RANGES.map((r) => <button key={r.d} onClick={() => setDays(r.d)} className={`btn !py-2 !px-4 text-sm ${days === r.d ? "btn-primary" : "btn-outline"}`}>{r.l}</button>)}
        <button onClick={load} className="btn btn-outline !py-2 !px-4 text-sm ml-auto"><RefreshCw className="w-4 h-4" /> Refresh</button>
      </div>
      {err && <Note kind="err">{err}</Note>}
      {!s ? <p className="text-muted"><Loader2 className="w-4 h-4 animate-spin inline" /> Loading…</p> : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { l: "WhatsApp clicks", v: s.total, I: MousePointerClick, t: "from-emerald-500 to-emerald-600" },
              { l: "Order clicks", v: s.orders, I: ShoppingBag, t: "from-brand to-deep" },
              { l: "Average per day", v: (s.total / days).toFixed(1), I: CalendarDays, t: "from-amber-500 to-amber-600" },
              { l: "Top source", v: s.sources[0]?.[0] ?? "–", I: Globe2, t: "from-sky-500 to-sky-600" },
            ].map(({ l, v, I, t }) => (
              <div key={l} className={`${card} p-4`}>
                <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t} text-white grid place-items-center`}><I className="w-5 h-5" /></span>
                <div className="mt-3 text-2xl font-semibold text-ink truncate">{v}</div>
                <div className="text-sm text-muted">{l}</div>
              </div>
            ))}
          </div>

          {days > 1 && (
            <div className={`${card} p-5`}>
              <h3 className="font-semibold text-ink">Clicks per day</h3>
              <div className="mt-4 flex items-end gap-[3px] h-40">
                {s.perDay.map(([d, n]) => {
                  const max = Math.max(1, ...s.perDay.map((x) => x[1]));
                  return (
                    <div key={d} className="group relative flex-1 h-full flex items-end" title={`${d}: ${n} clicks`}>
                      <div className="w-full rounded-t bg-wa/80 group-hover:bg-wa transition" style={{ height: `${Math.max(n ? 4 : 1, (n / max) * 100)}%` }} />
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted"><span>{s.perDay[0]?.[0]}</span><span>Today</span></div>
            </div>
          )}

          {s.total === 0 ? (
            <div className={`${card} p-6 text-center text-muted`}>No WhatsApp clicks in this period yet. Every tap on a WhatsApp button on your website is counted here automatically.</div>
          ) : (
            <>
              <div className="grid lg:grid-cols-2 gap-4">
                <TopList title="Pages people clicked from" rows={s.pages} total={s.total} label={pageName} />
                <TopList title="Products people asked about" rows={s.products} total={s.total} label={productName} empty="No product clicks yet." />
                <TopList title="What they wanted" rows={s.kinds} total={s.total} />
                <TopList title="Which button" rows={s.buttons} total={s.total} />
                <TopList title="Where visitors came from" rows={s.sources} total={s.total} />
                <div className={`${card} p-5`}>
                  <h3 className="font-semibold text-ink">Device</h3>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {["mobile", "tablet", "desktop"].map((d) => {
                      const n = s.devices.find((x) => x[0] === d)?.[1] ?? 0; const I = devIcon(d);
                      return <div key={d} className="rounded-2xl bg-cream p-3 text-center"><I className="w-5 h-5 mx-auto text-brand" /><div className="mt-1 text-xl font-semibold text-ink">{Math.round((n / s.total) * 100)}%</div><div className="text-xs text-muted capitalize">{d} · {n}</div></div>;
                    })}
                  </div>
                </div>
              </div>
              <div className={`${card} p-5 overflow-x-auto`}>
                <h3 className="font-semibold text-ink">Latest clicks</h3>
                <table className="mt-3 w-full text-sm">
                  <thead><tr className="text-left text-muted"><th className="py-2 pr-3 font-medium">Time</th><th className="py-2 pr-3 font-medium">Type</th><th className="py-2 pr-3 font-medium">Page / product</th><th className="py-2 pr-3 font-medium">Source</th><th className="py-2 font-medium">Device</th></tr></thead>
                  <tbody>
                    {rows!.slice(0, 25).map((r) => (
                      <tr key={r.id} className="border-t border-[#f1ece4]">
                        <td className="py-2 pr-3 whitespace-nowrap text-muted">{fmtDate(r.created_at)}</td>
                        <td className="py-2 pr-3"><span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap">{r.kind}</span></td>
                        <td className="py-2 pr-3 text-ink">{r.product ? productName(r.product) : pageName(r.page)}</td>
                        <td className="py-2 pr-3">{r.source || "Direct"}</td>
                        <td className="py-2 capitalize">{r.device}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          <p className="text-xs text-muted">Counts taps on WhatsApp buttons on your website. It does not see the chat itself, and it stores no names or phone numbers. Your own clicks inside the admin panel are not counted.</p>
        </>
      )}
    </div>
  );
}
