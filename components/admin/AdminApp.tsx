"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LayoutDashboard, Package, Star, Search, Users, Mail, Rocket, ShieldCheck, Loader2, FileText, PenSquare, Tags, ExternalLink, Menu, X, LogOut, UserCog, Eye, MessageCircle } from "lucide-react";
import UsersTab, { ROLES } from "./UsersTab";
import { useAuth, displayName } from "@/components/auth/AuthProvider";
import { loadSupabase } from "@/lib/supabase-config";
import Dashboard from "./Dashboard";
import ProductsTab from "./ProductsTab";
import PagesTab from "./PagesTab";
import ReviewsTab from "./ReviewsTab";
import SeoTab from "./SeoTab";
import CustomersTab from "./CustomersTab";
import MessagesTab from "./MessagesTab";
import WhatsAppTab from "./WhatsAppTab";

const nav = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, help: "Your shop at a glance." },
  { id: "products", label: "Products", icon: Package, help: "Edit prices, stock and product pages, or add a new product." },
  { id: "categories", label: "Categories", icon: Tags, help: "Add, rename or remove product categories and edit their pages." },
  { id: "blog", label: "Blog", icon: PenSquare, help: "Write, schedule and edit blog posts." },
  { id: "pages", label: "Pages", icon: FileText, help: "Edit the homepage, About, FAQ, Terms, Privacy and city pages." },
  { id: "whatsapp", label: "WhatsApp clicks", icon: MessageCircle, help: "How many people tapped WhatsApp, from which page and product." },
  { id: "reviews", label: "Reviews", icon: Star, help: "Add, edit, hide or delete reviews. Changes are live straight away." },
  { id: "seo", label: "SEO", icon: Search, help: "Meta title and description for any page, plus sitemap and Google settings." },
  { id: "customers", label: "Customers", icon: Users, help: "People with an account on your website." },
  { id: "messages", label: "Messages", icon: Mail, help: "Messages sent through the contact forms." },
  { id: "users", label: "Users", icon: UserCog, help: "Add admin users, change their permission or remove them." },
] as const;
/** Sections only full admins see. */
const FULL_ONLY = ["customers", "users"];
type TabId = (typeof nav)[number]["id"];

/** Private admin panel. Only accounts in the Supabase `admins` table can use it. */
export default function AdminApp() {
  const { user, loading, signOut } = useAuth();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [role, setRole] = useState<"full" | "editor" | "viewer" | null>(null);
  const [tab, setTab] = useState<TabId>("dashboard");
  const [action, setAction] = useState("");
  const [menu, setMenu] = useState(false);
  const [pub, setPub] = useState<{ state: "idle" | "busy" | "ok" | "err"; msg?: string }>({ state: "idle" });

  useEffect(() => {
    if (loading) return;
    if (!user) { setAllowed(false); return; }
    (async () => {
      const sb = await loadSupabase();
      const { data } = (await sb?.rpc("my_admin_role")) ?? { data: null };
      setRole((data as "full" | "editor" | "viewer" | null) ?? null);
      setAllowed(Boolean(data));
    })();
  }, [user, loading]);

  const go = (t: string, a = "") => { setTab(t as TabId); setAction(a); setMenu(false); window.scrollTo(0, 0); };

  const publish = async () => {
    setPub({ state: "busy" });
    const sb = await loadSupabase();
    const token = (await sb?.auth.getSession())?.data.session?.access_token;
    const r = await fetch("/api/admin/publish", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    const j = await r.json().catch(() => ({}));
    setPub(r.ok ? { state: "ok", msg: "Publishing started. Your changes will be live in about 2 to 3 minutes." } : { state: "err", msg: j.error || "Could not publish." });
    setTimeout(() => setPub((p) => (p.state === "ok" ? { state: "idle" } : p)), 12000);
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

  const cur = nav.find((n) => n.id === tab)!;
  return (
    // Full-screen app on top of the website (no shop header/footer).
    <div className="fixed inset-0 z-[200] flex bg-[#f6f5f2] text-ink">
      {/* Sidebar */}
      <aside className={`${menu ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static z-20 inset-y-0 left-0 w-64 shrink-0 bg-gradient-to-b from-[#1f2a44] to-[#141c30] text-white flex flex-col transition-transform`}>
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
          <div><div className="font-serif text-2xl">Bika<span className="text-gold">Flora</span></div><div className="text-[11px] tracking-[0.25em] text-white/50 uppercase">Admin</div></div>
          <button className="lg:hidden p-1" onClick={() => setMenu(false)} aria-label="Close menu"><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {nav.filter((n) => role === "full" || !FULL_ONLY.includes(n.id)).map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => go(id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[15px] transition ${tab === id ? "bg-white text-[#1f2a44] font-semibold shadow" : "text-white/75 hover:bg-white/10 hover:text-white"}`}>
              <Icon className="w-[18px] h-[18px]" /> {label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1 text-sm">
          <a href="/" target="_blank" rel="noopener" className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-white/75 hover:bg-white/10"><ExternalLink className="w-4 h-4" /> View website</a>
          <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-white/75 hover:bg-white/10"><LogOut className="w-4 h-4" /> Log out</button>
        </div>
      </aside>
      {menu && <div className="fixed inset-0 z-10 bg-black/40 lg:hidden" onClick={() => setMenu(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 shrink-0 bg-white border-b border-[#ebe7df] flex items-center gap-3 px-4 sm:px-6">
          <button className="lg:hidden p-1.5 rounded-lg hover:bg-blush" onClick={() => setMenu(true)} aria-label="Open menu"><Menu className="w-5 h-5" /></button>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-semibold leading-tight truncate">{cur.label}</h1>
            <p className="hidden sm:block text-xs text-muted truncate">{cur.help}</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden md:block text-sm text-muted">Hi, {displayName(user)} · <span className="font-semibold text-ink">{ROLES.find((r) => r.id === role)?.label}</span></span>
            {role !== "viewer" && <button onClick={publish} disabled={pub.state === "busy"} className="btn btn-primary !py-2 !px-4 text-sm disabled:opacity-60">
              {pub.state === "busy" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />} <span className="hidden sm:inline">Publish changes</span><span className="sm:hidden">Publish</span>
            </button>}
          </div>
        </header>
        {role === "viewer" && <div className="px-6 py-2.5 text-sm bg-sky-50 text-sky-800 flex items-center gap-2"><Eye className="w-4 h-4" /> You have view-only access. You can look around, but changes are not saved.</div>}
        {pub.msg && <div className={`px-6 py-2.5 text-sm ${pub.state === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{pub.msg}</div>}

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8">
            {tab === "dashboard" && (
              <>
                <ol className="mb-6 grid sm:grid-cols-3 gap-3 text-sm">
                  {[["1", "Edit", "Open a product, page or post and change what you need."], ["2", "Save", "Press Save on that item. Nothing is live yet."], ["3", "Publish", "Press “Publish changes” once. Live in 2–3 minutes."]].map(([n, t, d]) => (
                    <li key={n} className="flex gap-3 rounded-2xl bg-white border border-[#ebe7df] p-4"><span className="w-8 h-8 rounded-full bg-brand text-white grid place-items-center font-semibold shrink-0">{n}</span><span><b className="text-ink">{t}</b><br /><span className="text-muted">{d}</span></span></li>
                  ))}
                </ol>
                <Dashboard go={go} full={role === "full"} />
              </>
            )}
            {tab === "products" && <ProductsTab key={action} startNew={action === "new"} />}
            {tab === "categories" && <PagesTab kinds={["collection"]} />}
            {tab === "blog" && <PagesTab key={action} kinds={["post"]} startNew={action === "new"} />}
            {tab === "pages" && <PagesTab kinds={["page", "location"]} />}
            {tab === "whatsapp" && <WhatsAppTab />}
            {tab === "reviews" && <ReviewsTab />}
            {tab === "seo" && <SeoTab />}
            {tab === "customers" && role === "full" && <CustomersTab />}
            {tab === "messages" && <MessagesTab />}
            {tab === "users" && role === "full" && <UsersTab />}
          </div>
        </main>
      </div>
    </div>
  );
}
