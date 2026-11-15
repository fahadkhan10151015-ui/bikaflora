"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Package, Star, Search, Users, Mail, Rocket, ShieldCheck, Loader2, FileText } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { loadSupabase } from "@/lib/supabase-config";
import ProductsTab from "./ProductsTab";
import PagesTab from "./PagesTab";
import ReviewsTab from "./ReviewsTab";
import SeoTab from "./SeoTab";
import CustomersTab from "./CustomersTab";
import MessagesTab from "./MessagesTab";

const tabs = [
  { id: "products", label: "Products", icon: Package },
  { id: "pages", label: "Pages & Blog", icon: FileText },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "seo", label: "SEO", icon: Search },
  { id: "customers", label: "Customers", icon: Users },
  { id: "messages", label: "Messages", icon: Mail },
] as const;
type TabId = (typeof tabs)[number]["id"];

/** Private admin panel. Only accounts listed in the Supabase `admins` table can use it. */
export default function AdminApp() {
  const { user, loading } = useAuth();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [tab, setTab] = useState<TabId>("products");
  const [pub, setPub] = useState<{ state: "idle" | "busy" | "ok" | "err"; msg?: string }>({ state: "idle" });

  useEffect(() => {
    if (loading) return;
    if (!user) { setAllowed(false); return; }
    (async () => {
      const sb = await loadSupabase();
      const { data } = (await sb?.rpc("is_admin")) ?? { data: false };
      setAllowed(Boolean(data));
    })();
  }, [user, loading]);

  const publish = async () => {
    setPub({ state: "busy" });
    const sb = await loadSupabase();
    const token = (await sb?.auth.getSession())?.data.session?.access_token;
    const r = await fetch("/api/admin/publish", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    const j = await r.json().catch(() => ({}));
    setPub(r.ok ? { state: "ok", msg: "Publishing started. Your changes will be live in about 2 to 3 minutes." } : { state: "err", msg: j.error || "Could not publish." });
  };

  if (loading || allowed === null)
    return <div className="container-x py-24 text-center text-muted"><Loader2 className="w-6 h-6 animate-spin inline" /> Checking access…</div>;

  if (!allowed)
    return (
      <div className="container-x py-24 max-w-md text-center">
        <ShieldCheck className="w-10 h-10 mx-auto text-brand" />
        <h1 className="mt-4 text-3xl font-semibold">Admin only</h1>
        <p className="mt-2 text-muted">{user ? "This account does not have admin access." : "Please log in with your admin account."}</p>
        {!user && <Link href="/login?next=/admin" className="btn btn-primary mt-6">Log in</Link>}
      </div>
    );

  return (
    <div className="container-x py-8 md:py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="eyebrow">BikaFlora</div>
          <h1 className="text-3xl md:text-4xl font-semibold">Admin panel</h1>
        </div>
        <div className="text-right">
          <button onClick={publish} disabled={pub.state === "busy"} className="btn btn-primary disabled:opacity-60">
            {pub.state === "busy" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />} Publish changes
          </button>
          <p className="mt-1 text-xs text-muted max-w-xs">Product and SEO edits go live after you publish. Reviews and messages update instantly.</p>
        </div>
      </div>
      {pub.msg && <div className={`mt-4 rounded-2xl px-4 py-3 text-sm ${pub.state === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{pub.msg}</div>}

      <ol className="mt-5 grid sm:grid-cols-3 gap-2 text-sm">
        <li className="rounded-2xl bg-white border border-blush-2/70 px-4 py-3"><b className="text-brand">1. Edit</b> · open a product, page or post and change what you need.</li>
        <li className="rounded-2xl bg-white border border-blush-2/70 px-4 py-3"><b className="text-brand">2. Save</b> · press Save on that item. Nothing is live yet.</li>
        <li className="rounded-2xl bg-white border border-blush-2/70 px-4 py-3"><b className="text-brand">3. Publish</b> · press “Publish changes” once. Live in 2–3 minutes.</li>
      </ol>

      <nav className="mt-6 flex flex-wrap gap-2 border-b border-blush-2 pb-3">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${tab === id ? "bg-brand text-white" : "bg-white border border-blush-2 hover:bg-blush"}`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </nav>

      <div className="mt-6">
        {tab === "products" && <ProductsTab />}
        {tab === "pages" && <PagesTab />}
        {tab === "reviews" && <ReviewsTab />}
        {tab === "seo" && <SeoTab />}
        {tab === "customers" && <CustomersTab />}
        {tab === "messages" && <MessagesTab />}
      </div>
    </div>
  );
}
