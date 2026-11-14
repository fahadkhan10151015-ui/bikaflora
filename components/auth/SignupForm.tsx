"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { Alert } from "./AuthCard";
import PasswordInput from "./PasswordInput";

export default function SignupForm() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "verify">("form");
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    if (f.password.length < 8) return setErr("Password must be at least 8 characters.");
    if (f.password !== f.confirm) return setErr("Passwords do not match.");
    const sb = getSupabase(); if (!sb) return setErr("Sign up is not configured yet.");
    setBusy(true);
    const { data, error } = await sb.auth.signUp({
      email: f.email.trim(), password: f.password,
      options: { data: { full_name: f.name.trim(), phone: f.phone.trim() }, emailRedirectTo: `${window.location.origin}/account` },
    });
    setBusy(false);
    if (error) return setErr(error.message);
    if (data.session) return router.push("/account");
    if (data.user && data.user.identities?.length === 0) return setErr("An account with this email already exists. Please log in.");
    setStep("verify");
    setMsg(`We sent a 6-digit verification code to ${f.email}. Enter it below to activate your account. (Check your spam folder too.)`);
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    const sb = getSupabase(); if (!sb) return;
    setBusy(true);
    const { error } = await sb.auth.verifyOtp({ email: f.email.trim(), token: code.trim(), type: "email" });
    setBusy(false);
    if (error) return setErr("That code is invalid or has expired. Please try again or resend the code.");
    router.push("/account");
  };

  const resend = async () => {
    setErr(""); const sb = getSupabase(); if (!sb) return;
    const { error } = await sb.auth.resend({ type: "signup", email: f.email.trim() });
    if (error) setErr(error.message); else setMsg("We sent a new code. Please check your inbox and spam folder.");
  };

  if (step === "verify") return (
    <form onSubmit={verify} className="grid gap-4">
      {msg && <Alert kind="success">{msg}</Alert>}
      {err && <Alert kind="error">{err}</Alert>}
      <div><label className="label" htmlFor="code">Verification code</label>
        <input id="code" inputMode="numeric" autoComplete="one-time-code" maxLength={8} required className="input text-center text-2xl tracking-[0.5em] font-semibold" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} /></div>
      <button disabled={busy} className="btn btn-primary !py-3.5 disabled:opacity-60">{busy ? "Verifying…" : "Verify & continue"}</button>
      <button type="button" onClick={resend} className="text-sm text-brand font-semibold">Resend code</button>
    </form>
  );

  return (
    <form onSubmit={submit} className="grid gap-4">
      {err && <Alert kind="error">{err}</Alert>}
      <div><label className="label" htmlFor="name">Full name</label><input id="name" required autoComplete="name" className="input" value={f.name} onChange={set("name")} /></div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" required autoComplete="email" className="input" value={f.email} onChange={set("email")} /></div>
        <div><label className="label" htmlFor="phone">Phone <span className="font-normal text-muted">(optional)</span></label><input id="phone" type="tel" autoComplete="tel" className="input" placeholder="01x-xxx xxxx" value={f.phone} onChange={set("phone")} /></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="label" htmlFor="pw">Password</label><PasswordInput id="pw" required minLength={8} autoComplete="new-password" value={f.password} onChange={set("password")} /></div>
        <div><label className="label" htmlFor="pw2">Confirm password</label><PasswordInput id="pw2" required autoComplete="new-password" value={f.confirm} onChange={set("confirm")} /></div>
      </div>
      <button disabled={busy} className="btn btn-primary !py-3.5 disabled:opacity-60">{busy ? "Creating account…" : "Create account"}</button>
      <p className="text-xs text-center text-muted">By signing up you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.</p>
      <p className="text-sm text-center text-muted">Already have an account? <Link rel="nofollow" href="/login" className="text-brand font-semibold">Log in</Link></p>
    </form>
  );
}
