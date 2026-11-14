"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { Alert } from "./AuthCard";
import PasswordInput from "./PasswordInput";

/** Used when the customer clicks the reset LINK in the email instead of typing the code. */
export default function ResetForm() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState(""); const [pw2, setPw2] = useState("");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);

  useEffect(() => {
    const sb = getSupabase(); if (!sb) return;
    const { data } = sb.auth.onAuthStateChange((ev, session) => { if (session && (ev === "PASSWORD_RECOVERY" || ev === "SIGNED_IN" || ev === "INITIAL_SESSION")) setReady(true); });
    sb.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => data.subscription.unsubscribe();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    if (pw.length < 8) return setErr("Password must be at least 8 characters.");
    if (pw !== pw2) return setErr("Passwords do not match.");
    setBusy(true);
    const { error } = await getSupabase()!.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return setErr(error.message);
    router.push("/account?reset=1");
  };

  if (!ready) return <div className="text-sm text-muted">Checking your reset link… If nothing happens, <Link rel="nofollow" href="/forgot-password" className="text-brand underline">request a new code</Link>.</div>;
  return (
    <form onSubmit={save} className="grid gap-4">
      {err && <Alert kind="error">{err}</Alert>}
      <div><label className="label" htmlFor="pw">New password</label><PasswordInput id="pw" required minLength={8} value={pw} onChange={(e) => setPw(e.target.value)} /></div>
      <div><label className="label" htmlFor="pw2">Confirm new password</label><PasswordInput id="pw2" required value={pw2} onChange={(e) => setPw2(e.target.value)} /></div>
      <button disabled={busy} className="btn btn-primary !py-3.5">{busy ? "Saving…" : "Save new password"}</button>
    </form>
  );
}
