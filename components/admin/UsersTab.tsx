"use client";
import { useEffect, useState } from "react";
import { UserPlus, Loader2, Trash2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { loadSupabase } from "@/lib/supabase-config";
import { card, Note, fmtDate } from "./ui";

type Row = { user_id: string | null; email: string; name: string | null; role: Role; created_at: string; last_sign_in_at: string | null; pending: boolean };
type Role = "full" | "editor" | "viewer";
export const ROLES: { id: Role; label: string; text: string }[] = [
  { id: "full", label: "Full access", text: "Everything, including adding and removing users and seeing customers." },
  { id: "editor", label: "Editor", text: "Edit products, pages, blog, reviews and SEO, and publish. No users or customer list." },
  { id: "viewer", label: "View only", text: "Can look at everything in the admin panel but cannot change or publish anything." },
];
const roleLabel = (r: Role) => ROLES.find((x) => x.id === r)?.label ?? r;

/** Admin users: add (name, email, password), change permission, remove. Full admins only. */
export default function UsersTab() {
  const { user } = useAuth();
  const [list, setList] = useState<Row[] | null>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "", role: "editor" as Role });

  const load = async () => {
    const sb = await loadSupabase();
    const { data, error } = await sb!.rpc("admin_list_users");
    if (error) setMsg({ kind: "err", text: error.message });
    setList((data as Row[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = f.email.trim().toLowerCase();
    if (!f.name.trim()) return setMsg({ kind: "err", text: "Please add the person’s name." });
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setMsg({ kind: "err", text: "Please enter a valid email." });
    if (f.password.length < 8) return setMsg({ kind: "err", text: "Password must be at least 8 characters." });
    if (f.password !== f.confirm) return setMsg({ kind: "err", text: "The two passwords do not match." });
    setBusy(true); setMsg(null);
    const sb = await loadSupabase();
    // 1) Give the permission (works whether or not they already have an account).
    const { data: res, error } = await sb!.rpc("admin_add", { p_email: email, p_name: f.name.trim(), p_role: f.role });
    if (error) { setBusy(false); return setMsg({ kind: "err", text: error.message }); }
    let text = `${f.name} now has ${roleLabel(f.role)}.`;
    // 2) New person: create their login with the password you chose, already confirmed (no email code or link needed).
    if (res === "invited") {
      const { data: out, error: e2 } = await sb!.functions.invoke("admin-create-user", { body: { email, password: f.password, name: f.name.trim() } });
      const fail = e2 ? ((await (e2 as { context?: Response }).context?.json?.().catch(() => null))?.error ?? e2.message) : (out as { error?: string })?.error;
      if (fail) { setBusy(false); return setMsg({ kind: "err", text: `Permission saved, but the login could not be created: ${fail}` }); }
      text = `Account created for ${f.name}. They can log in right away at bikaflora.my/admin with this email and password. No confirmation email is needed.`;
    } else {
      text += " They already had an account, so they log in with their existing password (or use “Forgot password”).";
    }
    setBusy(false);
    setF({ name: "", email: "", password: "", confirm: "", role: "editor" });
    setMsg({ kind: "ok", text });
    load();
  };

  const setRole = async (r: Row, role: Role) => {
    const sb = await loadSupabase();
    const { error } = r.pending
      ? await sb!.rpc("admin_add", { p_email: r.email, p_name: r.name ?? "", p_role: role })
      : await sb!.rpc("admin_set_role", { p_user: r.user_id, p_role: role });
    setMsg(error ? { kind: "err", text: error.message } : { kind: "ok", text: `${r.name || r.email} now has ${roleLabel(role)}.` });
    load();
  };
  const remove = async (r: Row) => {
    if (!window.confirm(`Remove admin access for ${r.name || r.email}? Their customer account stays, but they can no longer open the admin panel.`)) return;
    const sb = await loadSupabase();
    const { error } = await sb!.rpc("admin_remove", { p_user: r.user_id, p_email: r.email });
    setMsg(error ? { kind: "err", text: error.message } : { kind: "ok", text: `${r.name || r.email} no longer has admin access.` });
    load();
  };

  return (
    <div className="space-y-6">
      {msg && <Note kind={msg.kind}>{msg.text}</Note>}

      <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-6 items-start">
        <div className={`${card} overflow-x-auto`}>
          {!list ? <p className="p-5 text-muted"><Loader2 className="w-4 h-4 animate-spin inline" /> Loading…</p> : (
            <table className="w-full text-sm min-w-[620px]">
              <thead className="bg-blush/60 text-left"><tr><th className="p-3">User</th><th className="p-3 w-44">Permission</th><th className="p-3">Last login</th><th className="p-3 w-16"></th></tr></thead>
              <tbody>
                {list.map((r) => {
                  const me = r.user_id === user?.id;
                  return (
                    <tr key={r.user_id ?? r.email} className="border-t border-blush-2/60">
                      <td className="p-3">
                        <div className="font-semibold text-ink flex items-center gap-2">{r.name || "–"} {me && <span className="text-[10px] font-bold bg-brand text-white rounded-full px-2 py-0.5">YOU</span>}{r.pending && <span className="text-[10px] font-bold bg-amber-100 text-amber-800 rounded-full px-2 py-0.5">WAITING FOR SIGN-UP</span>}</div>
                        <div className="text-xs text-muted break-all">{r.email}</div>
                      </td>
                      <td className="p-3">
                        <select className="input !py-1.5 !text-sm" value={r.role} disabled={me} onChange={(e) => setRole(r, e.target.value as Role)} aria-label={`Permission for ${r.email}`}>
                          {ROLES.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
                        </select>
                      </td>
                      <td className="p-3 text-muted">{r.pending ? "–" : fmtDate(r.last_sign_in_at)}</td>
                      <td className="p-3">{!me && <button onClick={() => remove(r)} className="p-2 rounded-lg text-red-600 hover:bg-red-50" aria-label={`Remove ${r.email}`}><Trash2 className="w-4 h-4" /></button>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <form onSubmit={add} className={`${card} p-5 space-y-3`}>
          <h3 className="font-semibold text-lg flex items-center gap-2"><UserPlus className="w-5 h-5 text-brand" /> Add a user</h3>
          <label className="block"><span className="label">Name <span className="text-red-600">*</span></span><input className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="off" /></label>
          <label className="block"><span className="label">Email <span className="text-red-600">*</span></span><input type="email" className="input" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="off" /></label>
          <label className="block"><span className="label">Password <span className="text-red-600">*</span></span>
            <div className="relative"><input type={show ? "text" : "password"} className="input pr-10" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} autoComplete="new-password" />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" aria-label={show ? "Hide password" : "Show password"}>{show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div>
            <span className="text-xs text-muted">At least 8 characters.</span></label>
          <label className="block"><span className="label">Confirm password <span className="text-red-600">*</span></span><input type={show ? "text" : "password"} className="input" value={f.confirm} onChange={(e) => setF({ ...f, confirm: e.target.value })} autoComplete="new-password" />
            {f.confirm && f.confirm !== f.password && <span className="text-xs text-red-600">Passwords do not match.</span>}</label>
          <div>
            <span className="label">Permission</span>
            <div className="space-y-2">
              {ROLES.map((x) => (
                <label key={x.id} className={`flex gap-3 rounded-2xl border p-3 cursor-pointer ${f.role === x.id ? "border-brand bg-blush/40" : "border-blush-2"}`}>
                  <input type="radio" name="role" className="mt-1" checked={f.role === x.id} onChange={() => setF({ ...f, role: x.id })} />
                  <span><b className="text-sm">{x.label}</b><br /><span className="text-xs text-muted">{x.text}</span></span>
                </label>
              ))}
            </div>
          </div>
          <button disabled={busy} className="btn btn-primary w-full">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />} Add user</button>
          <p className="text-xs text-muted flex gap-1.5"><ShieldCheck className="w-4 h-4 shrink-0 text-brand" /> Forgot password? They use “Forgot password” on the login page and get a reset email.</p>
        </form>
      </div>
    </div>
  );
}
