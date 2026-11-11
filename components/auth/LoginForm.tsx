"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { Alert } from "./AuthCard";
import PasswordInput from "./PasswordInput";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    const sb = getSupabase(); if (!sb) return setErr("Login is not configured yet.");
    setBusy(true);
    const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) return setErr(error.message === "Invalid login credentials" ? "Wrong email or password." : error.message);
    router.push("/account");
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      {err && <Alert kind="error">{err}</Alert>}
      <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" required autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div>
        <div className="flex justify-between"><label className="label" htmlFor="pw">Password</label><Link href="/forgot-password" className="text-xs text-brand font-semibold">Forgot password?</Link></div>
        <PasswordInput id="pw" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button disabled={busy} className="btn btn-primary !py-3.5 disabled:opacity-60">{busy ? "Logging in…" : "Log in"}</button>
      <p className="text-sm text-center text-muted">New to BikaFlora? <Link href="/signup" className="text-brand font-semibold">Create an account</Link></p>
    </form>
  );
}
