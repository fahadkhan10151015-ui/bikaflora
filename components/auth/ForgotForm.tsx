"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { Alert } from "./AuthCard";
import PasswordInput from "./PasswordInput";

export default function ForgotForm() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const sendCode = async (e?: React.FormEvent) => {
    e?.preventDefault(); setErr("");
    const sb = getSupabase(); if (!sb) return setErr("Password reset is not configured yet.");
    setBusy(true);
    const { error } = await sb.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
    setBusy(false);
    if (error) return setErr(error.message);
    setStep("code");
    setMsg(`If an account exists for ${email}, we sent a password reset email. Tap the link in it to set a new password. (Check your spam folder too.)`);
  };

  const reset = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    if (pw.length < 8) return setErr("Password must be at least 8 characters.");
    if (pw !== pw2) return setErr("Passwords do not match.");
    const sb = getSupabase(); if (!sb) return;
    setBusy(true);
    const { error } = await sb.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: "recovery" });
    if (error) { setBusy(false); return setErr("That code is invalid or has expired. Request a new code."); }
    const { error: e2 } = await sb.auth.updateUser({ password: pw });
    setBusy(false);
    if (e2) return setErr(e2.message);
    router.push("/account?reset=1");
  };

  if (step === "code") return (
    <form onSubmit={reset} className="grid gap-4">
      {msg && <Alert kind="success">{msg}</Alert>}
      {err && <Alert kind="error">{err}</Alert>}
      <p className="text-sm text-muted">Did your email include a 6-digit code instead? Enter it with your new password:</p>
      <div><label className="label" htmlFor="code">6-digit code from your email</label>
        <input id="code" inputMode="numeric" autoComplete="one-time-code" maxLength={8} required className="input text-center text-2xl tracking-[0.5em] font-semibold" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} /></div>
      <div><label className="label" htmlFor="pw">New password</label><PasswordInput id="pw" required minLength={8} autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} /></div>
      <div><label className="label" htmlFor="pw2">Confirm new password</label><PasswordInput id="pw2" required autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} /></div>
      <button disabled={busy} className="btn btn-primary !py-3.5 disabled:opacity-60">{busy ? "Saving…" : "Reset password"}</button>
      <button type="button" onClick={() => sendCode()} className="text-sm text-brand font-semibold">Resend email</button>
    </form>
  );

  return (
    <form onSubmit={sendCode} className="grid gap-4">
      {err && <Alert kind="error">{err}</Alert>}
      <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" required autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <button disabled={busy} className="btn btn-primary !py-3.5 disabled:opacity-60">{busy ? "Sending…" : "Send reset email"}</button>
      <p className="text-sm text-center text-muted">Remembered it? <Link href="/login" className="text-brand font-semibold">Back to login</Link></p>
    </form>
  );
}
