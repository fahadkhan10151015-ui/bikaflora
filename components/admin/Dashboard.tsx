"use client";
import { useEffect, useState } from "react";
import { Package, Star, Mail, Users, FileText, Plus, PenSquare, ArrowRight, MessageCircle } from "lucide-react";
import { products } from "@/data/products";
import { posts } from "@/data/posts";
import { sold } from "@/data/sold";
import { loadSupabase } from "@/lib/supabase-config";
import { card } from "./ui";

/** Overview: key numbers and quick actions. */
export default function Dashboard({ go, full = true }: { go: (tab: string, action?: string) => void; full?: boolean }) {
  const [n, setN] = useState({ reviews: 0, avg: 0, newMsgs: 0, customers: 0, wa: 0 });
  useEffect(() => {
    (async () => {
      const sb = await loadSupabase();
      const since = new Date(Date.now() - 7 * 86400e3).toISOString();
      const [r, m, c, w] = await Promise.all([
        sb!.from("reviews").select("rating"),
        sb!.from("contact_messages").select("id", { count: "exact", head: true }).eq("done", false),
        sb!.rpc("admin_customers"),
        sb!.from("wa_clicks").select("id", { count: "exact", head: true }).gte("created_at", since),
      ]);
      const ratings = ((r.data ?? []) as { rating: number }[]).map((x) => Number(x.rating));
      setN({ reviews: ratings.length, avg: ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0, newMsgs: m.count ?? 0, customers: ((c.data ?? []) as unknown[]).length, wa: w.count ?? 0 });
    })();
  }, []);
  const top = [...products].filter((p) => sold[p.slug]).sort((a, b) => sold[b.slug] - sold[a.slug]).slice(0, 6);
  const stats = [
    { label: "Products", value: products.length, icon: Package, tab: "products", tone: "from-brand to-deep" },
    { label: "Reviews", value: `${n.reviews}${n.avg ? ` · ${n.avg.toFixed(1)}★` : ""}`, icon: Star, tab: "reviews", tone: "from-amber-500 to-amber-600" },
    { label: "WhatsApp · 7 days", value: n.wa, icon: MessageCircle, tab: "whatsapp", tone: "from-green-500 to-green-600" },
    { label: "New messages", value: n.newMsgs, icon: Mail, tab: "messages", tone: "from-emerald-500 to-emerald-600" },
    { label: "Customers", value: n.customers, icon: Users, tab: "customers", tone: "from-sky-500 to-sky-600" },
    { label: "Blog posts", value: posts.length, icon: FileText, tab: "blog", tone: "from-rose-400 to-rose-500" },
  ];
  return (
    <div className="space-y-6">
      <div className={`grid grid-cols-2 ${full ? "lg:grid-cols-6" : "lg:grid-cols-5"} gap-4`}>
        {stats.filter((s) => full || s.tab !== "customers").map(({ label, value, icon: Icon, tab, tone }) => (
          <button key={label} onClick={() => go(tab)} className={`${card} p-4 text-left hover:shadow-lg hover:-translate-y-0.5 transition`}>
            <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tone} text-white grid place-items-center`}><Icon className="w-5 h-5" /></span>
            <div className="mt-3 text-2xl font-semibold text-ink">{value}</div>
            <div className="text-sm text-muted">{label}</div>
          </button>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className={`${card} p-5`}>
          <h3 className="font-semibold text-lg">Quick actions</h3>
          <div className="mt-3 grid sm:grid-cols-2 gap-2">
            {[["Add a product", "products", "new", Plus], ["Write a blog post", "blog", "new", PenSquare], ["Add a review", "reviews", "", Star], ["Edit homepage text", "pages", "", FileText]].map(([l, tab, act, Icon]) => {
              const I = Icon as typeof Plus;
              return <button key={l as string} onClick={() => go(tab as string, act as string)} className="flex items-center gap-2 rounded-2xl bg-cream hover:bg-blush px-4 py-3 text-sm font-semibold text-ink"><I className="w-4 h-4 text-brand" />{l as string}<ArrowRight className="w-4 h-4 ml-auto text-muted" /></button>;
            })}
          </div>
        </div>
        <div className={`${card} p-5`}>
          <h3 className="font-semibold text-lg">Top sellers <span className="text-sm font-normal text-muted">(by number sold)</span></h3>
          {top.length ? (
            <ul className="mt-3 divide-y divide-blush-2/60">
              {top.map((p, i) => <li key={p.slug} className="py-2 flex justify-between text-sm"><span><b className="text-muted mr-2">{i + 1}</b>{p.name}</span><span className="font-semibold text-orange-700">{sold[p.slug]} sold</span></li>)}
            </ul>
          ) : <p className="mt-3 text-sm text-muted">No sold numbers yet. Add them in Products.</p>}
        </div>
      </div>
    </div>
  );
}
