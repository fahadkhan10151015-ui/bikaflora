"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, User, ChevronDown, Truck } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { categories } from "@/data/categories";
import { useAuth, displayName } from "@/components/auth/AuthProvider";
import { site } from "@/lib/site";
import WhatsAppButton from "@/components/whatsapp/WhatsAppButton";

const nav = [
  { href: "/shop", label: "Shop All" },
  { href: "/flower-delivery", label: "Delivery Areas" },
  { href: "/reviews", label: "Reviews" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-40">
      <div className="bg-brand text-white text-xs sm:text-sm">
        <div className="container-x flex items-center justify-center gap-2 py-2 text-center">
          <Truck className="w-4 h-4 shrink-0" />
          <span className="sm:hidden">Same-day delivery · KL &amp; Selangor</span>
          <span className="hidden sm:inline">Same-day express in KL &amp; Selangor — order before {site.sameDayCutoff} · or schedule 1–2 days ahead</span>
        </div>
      </div>
      <div className="bg-white/90 backdrop-blur border-b border-blush-2">
        <div className="container-x flex items-center justify-between h-16 md:h-20">
          <Logo />
          <nav className="hidden lg:flex items-center gap-7 text-[15px] font-medium">
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-brand">Categories <ChevronDown className="w-4 h-4" /></button>
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition absolute left-0 top-full pt-3">
                <div className="bg-white rounded-2xl shadow-xl border border-blush-2 p-3 w-72 grid">
                  {categories.map((c) => (
                    <Link key={c.slug} href={`/category/${c.slug}`} className="px-3 py-2 rounded-lg hover:bg-blush">
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-muted">{c.short}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {nav.map((n) => <Link key={n.href} href={n.href} className="hover:text-brand">{n.label}</Link>)}
          </nav>
          <div className="flex items-center gap-2">
            <Link href={user ? "/account" : "/login"} className="hidden sm:flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-full hover:bg-blush">
              <User className="w-5 h-5" /> {user ? displayName(user) : "Login"}
            </Link>
            <WhatsAppButton label="WhatsApp" className="btn btn-wa !py-2 !px-4 text-sm [&>span]:hidden sm:[&>span]:inline" iconClassName="w-4 h-4" />
            <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {open && (
          <div className="lg:hidden border-t border-blush-2 bg-white max-h-[75vh] overflow-y-auto">
            <div className="container-x py-4 grid gap-1">
              {nav.map((n) => <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="py-2 font-medium">{n.label}</Link>)}
              <div className="pt-2 text-xs eyebrow">Categories</div>
              {categories.map((c) => <Link key={c.slug} href={`/category/${c.slug}`} onClick={() => setOpen(false)} className="py-1.5 text-muted">{c.name}</Link>)}
              <Link href={user ? "/account" : "/login"} onClick={() => setOpen(false)} className="btn btn-outline mt-3">
                <User className="w-4 h-4" /> {user ? "My Account" : "Login / Sign up"}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
