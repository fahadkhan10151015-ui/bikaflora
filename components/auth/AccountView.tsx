"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Pencil, User, Mail, Phone, Lock, ArrowLeft } from "lucide-react";
import { useAuth, displayName } from "./AuthProvider";
import { getSupabase } from "@/lib/supabase";
import WhatsAppButton from "@/components/whatsapp/WhatsAppButton";
import { Alert } from "./AuthCard";
import PasswordInput from "./PasswordInput";

type Status = { kind: "success" | "error"; text: string } | null;

export default function AccountView() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);

  useEffect(() => { if (!loading && !user) router.replace("/login"); }, [loading, user, router]);
  if (loading || !user) return <div className="container-x py-24 text-center text-muted">Loading your account…</div>;

  const name = (user.user_metadata?.full_name as string) || "";
  const phone = (user.user_metadata?.phone as string) || "";

  return (
    <div className="container-x py-12 max-w-3xl">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <div className="eyebrow">My account</div>
          <h1 className="text-4xl md:text-5xl">Hello, {displayName(user)}</h1>
        </div>
        <button onClick={async () => { await signOut(); router.push("/"); }} className="btn btn-outline !py-2 !px-4 text-sm"><LogOut className="w-4 h-4" /> Log out</button>
      </div>

      {editing ? <EditProfile onDone={() => setEditing(false)} /> : (
        <div className="bg-white rounded-3xl border border-blush-2 p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl">Profile</h2>
            <button onClick={() => setEditing(true)} className="btn btn-primary !py-2 !px-5 text-sm"><Pencil className="w-4 h-4" /> Edit</button>
          </div>
          <dl className="divide-y divide-blush-2">
            {[
              { icon: User, label: "Name", value: name || "—" },
              { icon: Mail, label: "Email", value: user.email },
              { icon: Phone, label: "Phone", value: phone || "—" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 py-4">
                <span className="w-11 h-11 rounded-full bg-blush text-brand grid place-items-center shrink-0"><Icon className="w-5 h-5" /></span>
                <div className="min-w-0"><dt className="text-xs uppercase tracking-wider text-muted">{label}</dt><dd className="font-medium break-all">{value}</dd></div>
              </div>
            ))}
          </dl>
          <div className="mt-6 pt-6 border-t border-blush-2 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">Need help with an order?</p>
            <WhatsAppButton label="Chat on WhatsApp" className="btn btn-wa !py-2.5 !px-5 text-sm" iconClassName="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  );
}

/** Edit name & phone, change email (with code) and change password. */
function EditProfile({ onDone }: { onDone: () => void }) {
  const { user } = useAuth();
  const sb = getSupabase()!;
  const [name, setName] = useState((user?.user_metadata?.full_name as string) || "");
  const [phone, setPhone] = useState((user?.user_metadata?.phone as string) || "");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [status, setStatus] = useState<Status>(null);
  const [busy, setBusy] = useState("");

  const run = async (key: string, fn: () => Promise<string>) => {
    setBusy(key); setStatus(null);
    try { setStatus({ kind: "success", text: await fn() }); }
    catch (e) { setStatus({ kind: "error", text: e instanceof Error ? e.message : "Something went wrong." }); }
    finally { setBusy(""); }
  };

  const saveDetails = (e: React.FormEvent) => { e.preventDefault(); run("details", async () => {
    const { error } = await sb.auth.updateUser({ data: { full_name: name.trim(), phone: phone.trim() } });
    if (error) throw error;
    return "Your name and phone number were updated.";
  }); };

  const sendEmailCode = (e: React.FormEvent) => { e.preventDefault(); run("email", async () => {
    const { error } = await sb.auth.updateUser({ email: email.trim() });
    if (error) throw error;
    setCodeSent(true);
    return `We sent a 6-digit code to ${email.trim()}. Enter it below to confirm your new email.`;
  }); };

  const verifyEmailCode = (e: React.FormEvent) => { e.preventDefault(); run("email", async () => {
    const { error } = await sb.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: "email_change" });
    if (error) throw new Error("That code is invalid or has expired.");
    setCodeSent(false); setEmail(""); setCode("");
    return "Your email address was updated.";
  }); };

  const savePassword = (e: React.FormEvent) => { e.preventDefault(); run("password", async () => {
    if (pw.length < 8) throw new Error("Password must be at least 8 characters.");
    if (pw !== pw2) throw new Error("Passwords do not match.");
    const { error } = await sb.auth.updateUser({ password: pw });
    if (error) throw error;
    setPw(""); setPw2("");
    return "Your password was changed.";
  }); };

  const card = "bg-white rounded-3xl border border-blush-2 p-6 md:p-8 shadow-sm";
  return (
    <div className="space-y-6">
      <button onClick={onDone} className="inline-flex items-center gap-2 text-sm font-medium text-brand"><ArrowLeft className="w-4 h-4" /> Back to profile</button>
      {status && <Alert kind={status.kind}>{status.text}</Alert>}

      <form onSubmit={saveDetails} className={`${card} grid gap-4`}>
        <h2 className="text-2xl flex items-center gap-2"><User className="w-5 h-5 text-brand" /> Name & phone</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="label" htmlFor="name">Full name</label><input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><label className="label" htmlFor="phone">Phone</label><input id="phone" type="tel" className="input" placeholder="01x-xxx xxxx" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
        </div>
        <button disabled={busy === "details"} className="btn btn-primary justify-self-start">{busy === "details" ? "Saving…" : "Save changes"}</button>
      </form>

      <form onSubmit={codeSent ? verifyEmailCode : sendEmailCode} className={`${card} grid gap-4`}>
        <h2 className="text-2xl flex items-center gap-2"><Mail className="w-5 h-5 text-brand" /> Email address</h2>
        <p className="text-sm text-muted">Current: <span className="font-medium text-ink">{user?.email}</span></p>
        <div><label className="label" htmlFor="email">New email</label><input id="email" type="email" required disabled={codeSent} className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        {codeSent && (
          <div><label className="label" htmlFor="code">6-digit code</label>
            <input id="code" inputMode="numeric" maxLength={8} required className="input text-center text-2xl tracking-[0.5em] font-semibold" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} /></div>
        )}
        <button disabled={busy === "email"} className="btn btn-primary justify-self-start">
          {busy === "email" ? "Please wait…" : codeSent ? "Confirm new email" : "Send verification code"}
        </button>
      </form>

      <form onSubmit={savePassword} className={`${card} grid gap-4`}>
        <h2 className="text-2xl flex items-center gap-2"><Lock className="w-5 h-5 text-brand" /> Password</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="label" htmlFor="pw">New password</label><PasswordInput id="pw" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} /></div>
          <div><label className="label" htmlFor="pw2">Confirm password</label><PasswordInput id="pw2" autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} /></div>
        </div>
        <button disabled={busy === "password"} className="btn btn-primary justify-self-start">{busy === "password" ? "Saving…" : "Change password"}</button>
      </form>
    </div>
  );
}
