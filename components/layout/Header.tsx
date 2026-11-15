"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, User, ChevronDown, MapPin, ArrowRight } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { categories } from "@/data/categories";
import { getLocation } from "@/data/locations";
import { useAuth, displayName } from "@/components/auth/AuthProvider";
import WhatsAppButton from "@/components/whatsapp/WhatsAppButton";
import OrderListButton from "@/components/order/OrderListButton";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import FavouritesLink from "@/components/favourites/FavouritesLink";
import ThemeToggle from "@/components/ui/ThemeToggle";

/** Popular areas shown in the "Delivery Areas" dropdown (the full list is on /flower-delivery). */
const topAreas = ["kuala-lumpur", "shah-alam", "petaling-jaya", "subang-jaya", "cheras", "klang", "puchong", "cyberjaya", "bangsar", "mont-kiara"]
  .map((s) => getLocation(s)!).filter(Boolean);

const nav = [
  { href: "/shop", label: "Shop All" },
  { href: "/reviews", label: "Reviews" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-40">
      <AnnouncementBar />
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
            <div className="relative group">
              <Link href="/flower-delivery" className="flex items-center gap-1 hover:text-brand">Delivery Areas <ChevronDown className="w-4 h-4" /></Link>
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition absolute left-0 top-full pt-3">
                <div className="bg-white rounded-2xl shadow-xl border border-blush-2 p-3 w-[26rem]">
                  <div className="grid grid-cols-2 gap-0.5">
                    {topAreas.map((l) => (
                      <Link key={l.slug} href={`/flower-delivery/${l.slug}`} className="px-3 py-2 rounded-lg hover:bg-blush flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-brand shrink-0" /><span>{l.name}</span>
                      </Link>
                    ))}
                  </div>
                  <Link href="/flower-delivery" className="mt-2 flex items-center justify-center gap-1.5 rounded-xl bg-blush px-3 py-2.5 font-semibold text-brand hover:bg-blush-2">
                    View all 32 delivery areas <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
            {nav.map((n) => <Link key={n.href} href={n.href} className="hover:text-brand">{n.label}</Link>)}
          </nav>
          <div className="flex items-center gap-1 min-[400px]:gap-2 shrink-0">
            <Link rel="nofollow" href={user ? "/account" : "/login"} className="hidden sm:flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-full hover:bg-blush">
              <User className="w-5 h-5" /> {user ? displayName(user) : "Login"}
            </Link>
            <ThemeToggle />
            <FavouritesLink />
            <OrderListButton />
            <WhatsAppButton label="WhatsApp" className="btn btn-wa !py-2 !px-3 min-[400px]:!px-4 text-sm [&>span]:hidden sm:[&>span]:inline" iconClassName="w-4 h-4" />
            <button className="lg:hidden p-1.5 min-[400px]:p-2" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {open && (
          <div className="lg:hidden border-t border-blush-2 bg-white max-h-[75vh] overflow-y-auto">
            <div className="container-x py-4 grid gap-1">
              {nav.map((n) => <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="py-2 font-medium">{n.label}</Link>)}
              <details className="group py-1">
                <summary className="py-1 font-medium list-none flex items-center justify-between cursor-pointer">Delivery Areas <ChevronDown className="w-4 h-4 transition group-open:rotate-180" /></summary>
                <div className="grid grid-cols-2 gap-x-3 pt-1 pb-2">
                  {topAreas.map((l) => <Link key={l.slug} href={`/flower-delivery/${l.slug}`} onClick={() => setOpen(false)} className="py-1.5 text-muted">{l.name}</Link>)}
                </div>
                <Link href="/flower-delivery" onClick={() => setOpen(false)} className="inline-flex items-center gap-1 py-1 font-semibold text-brand">View all 32 areas <ArrowRight className="w-4 h-4" /></Link>
              </details>
              <div className="pt-2 text-xs eyebrow">Categories</div>
              {categories.map((c) => <Link key={c.slug} href={`/category/${c.slug}`} onClick={() => setOpen(false)} className="py-1.5 text-muted">{c.name}</Link>)}
              <Link rel="nofollow" href={user ? "/account" : "/login"} onClick={() => setOpen(false)} className="btn btn-outline mt-3">
                <User className="w-4 h-4" /> {user ? "My Account" : "Login / Sign up"}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
