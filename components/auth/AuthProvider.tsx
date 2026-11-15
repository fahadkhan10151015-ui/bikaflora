"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { loadSupabase } from "@/lib/supabase-config";

type Ctx = { user: User | null; loading: boolean; signOut: () => Promise<void> };
const AuthCtx = createContext<Ctx>({ user: null, loading: true, signOut: async () => {} });

const AUTH_PAGES = /^\/(admin|account|login|signup|reset-password|forgot-password|favourites)/;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const [started, setStarted] = useState(false);

  // Load the login library only when it's needed: a saved login in this browser, or a login/account page.
  // Visitors who aren't signed in never download it, which keeps every page light.
  useEffect(() => {
    if (started) return;
    let saved = false;
    try { saved = Object.keys(localStorage).some((k) => k.startsWith("sb-") && k.endsWith("-auth-token")); } catch {}
    if (saved || AUTH_PAGES.test(pathname)) setStarted(true);
    else setLoading(false);
  }, [pathname, started]);

  useEffect(() => {
    if (!started) return;
    let off = false;
    let unsub: (() => void) | undefined;
    (async () => {
      const sb = await loadSupabase();
      if (off) return;
      if (!sb) { setLoading(false); return; }
      sb.auth.getSession().then(({ data }) => { setUser(data.session?.user ?? null); setLoading(false); });
      const { data: sub } = sb.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
      unsub = () => sub.subscription.unsubscribe();
    })();
    return () => { off = true; unsub?.(); };
  }, [started]);

  const signOut = async () => { await (await loadSupabase())?.auth.signOut(); setUser(null); };
  return <AuthCtx.Provider value={{ user, loading, signOut }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
export const displayName = (u: User | null) => (u?.user_metadata?.full_name as string) || u?.email?.split("@")[0] || "";
