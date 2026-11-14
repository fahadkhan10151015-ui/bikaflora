"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { loadSupabase } from "@/lib/supabase-config";

type Ctx = { user: User | null; loading: boolean; signOut: () => Promise<void> };
const AuthCtx = createContext<Ctx>({ user: null, loading: true, signOut: async () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  const signOut = async () => { await (await loadSupabase())?.auth.signOut(); setUser(null); };
  return <AuthCtx.Provider value={{ user, loading, signOut }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
export const displayName = (u: User | null) => (u?.user_metadata?.full_name as string) || u?.email?.split("@")[0] || "";
