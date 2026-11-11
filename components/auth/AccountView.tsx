"use client";
import Link from "next/link";
import Photo from "@/components/ui/Photo";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Heart, User as UserIcon, Lock } from "lucide-react";
import { useAuth, displayName } from "@/components/auth/AuthProvider";
import { getSupabase } from "@/lib/supabase";
import { useFavourites } from "@/lib/favourites";
import { products } from "@/data/products";
import { formatPrice, site } from "@/lib/site";
import { waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppIcon";
import { Alert } from "./AuthCard";
import PasswordInput from "./PasswordInput";

export default function AccountView() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const { list } = useFavourites();
  const [name, setName] = useState(""); const [phone, setPhone] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState(params.get("reset") ? "Your password has been updated." : "");
  const [err, setErr] = useState("");

  useEffect(() => { if (!loading && !user) router.replace("/login"); }, [loading, user, router]);
  useEffect(() => { if (user) { setName((user.user_metadata?.full_name as string) || ""); setPhone((user.user_metadata?.phone as string) || ""); } }, [user]);

  if (loading || !user) return <div className="container-x py-24 text-center text-muted">Loading your account…</div>;
  const favs = products.filter((p) => list.includes(p.slug));

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(""); setMsg("");
    const { error } = await getSupabase()!.auth.updateUser({ data: { full_name: name, phone } });
    if (error) setErr(error.message); else setMsg("Profile saved.");
  };
  const changePw = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(""); setMsg("");
    if (pw.length < 8) return setErr("Password must be at least 8 characters.");
    const { error } = await getSupabase()!.auth.updateUser({ password: pw });
    if (error) setErr(error.message); else { setMsg("Password changed."); setPw(""); }
  };

  return (
    <div className="container-x py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="eyebrow">My account</div>
          <h1 className="text-3xl md:text-4xl font-semibold">Hi, {displayName(user)} 🌸</h1>
          <p className="text-muted text-sm mt-1">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <a href={waLink(`Hi ${site.name}, this is ${displayName(user)} (${user.email}). I need help with: `)} target="_blank" rel="noopener" className="btn btn-wa"><WhatsAppIcon className="w-4 h-4" /> Get help</a>
          <button onClick={async () => { await signOut(); router.push("/"); }} className="btn btn-outline"><LogOut className="w-4 h-4" /> Log out</button>
        </div>
      </div>
      <div className="mt-6 grid gap-2">{msg && <Alert kind="success">{msg}</Alert>}{err && <Alert kind="error">{err}</Alert>}</div>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-blush-2/70 p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2"><Heart className="w-5 h-5 text-brand" /> Saved bouquets</h2>
          {favs.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No saved bouquets yet. Tap “Save” on any product. <Link href="/shop" className="text-brand underline">Browse bouquets</Link></p>
          ) : (
            <ul className="mt-4 divide-y divide-blush-2">
              {favs.map((p) => (
                <li key={p.slug} className="py-3 flex items-center gap-4">
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden shrink-0"><Photo src={p.images[0]} tone={p.tones?.[0]} alt={p.name} sizes="64px" /></div>
                  <div className="flex-1"><Link href={`/product/${p.slug}`} className="font-medium hover:text-brand">{p.name}</Link><div className="text-sm text-brand">{formatPrice(p.price)}</div></div>
                  <Link href={`/product/${p.slug}`} className="btn btn-wa !py-2 !px-4 text-xs"><WhatsAppIcon className="w-4 h-4" /> Order</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="space-y-6">
          <form onSubmit={saveProfile} className="bg-white rounded-3xl border border-blush-2/70 p-6 grid gap-3">
            <h2 className="text-xl font-semibold flex items-center gap-2"><UserIcon className="w-5 h-5 text-brand" /> Profile</h2>
            <div><label className="label" htmlFor="n">Name</label><input id="n" className="input" value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><label className="label" htmlFor="ph">Phone</label><input id="ph" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
            <button className="btn btn-primary">Save profile</button>
          </form>
          <form onSubmit={changePw} className="bg-white rounded-3xl border border-blush-2/70 p-6 grid gap-3">
            <h2 className="text-xl font-semibold flex items-center gap-2"><Lock className="w-5 h-5 text-brand" /> Change password</h2>
            <PasswordInput placeholder="New password (min 8 characters)" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" />
            <button className="btn btn-outline">Update password</button>
          </form>
        </div>
      </div>
    </div>
  );
}
