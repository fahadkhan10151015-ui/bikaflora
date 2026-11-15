"use client";
import { useEffect, useState } from "react";
import { Loader2, Check, Trash2, Undo2 } from "lucide-react";
import { loadSupabase } from "@/lib/supabase-config";
import { waLinkTo } from "./wa";
import { card, Note, fmtDate } from "./ui";

type Msg = { id: string; created_at: string; name: string; phone: string | null; topic: string | null; area: string | null; message: string; page: string | null; done: boolean };

/** Messages sent through the contact forms (contact page and area pages). */
export default function MessagesTab() {
  const [list, setList] = useState<Msg[] | null>(null);
  const [err, setErr] = useState("");
  const [show, setShow] = useState<"open" | "all">("open");
  const load = async () => {
    const sb = await loadSupabase();
    const { data, error } = (await sb?.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(500)) ?? { data: null, error: null };
    if (error) setErr(error.message);
    setList((data as Msg[]) ?? []);
  };
  useEffect(() => { load(); }, []);
  const mark = async (m: Msg, done: boolean) => { const sb = await loadSupabase(); await sb?.from("contact_messages").update({ done }).eq("id", m.id); load(); };
  const remove = async (m: Msg) => {
    if (!window.confirm(`Delete the message from ${m.name}? This cannot be undone.`)) return;
    const sb = await loadSupabase(); await sb?.from("contact_messages").delete().eq("id", m.id); load();
  };
  if (!list) return <p className="text-muted"><Loader2 className="w-4 h-4 animate-spin inline" /> Loading…</p>;
  const shown = list.filter((m) => show === "all" || !m.done);
  return (
    <div className="space-y-4">
      {err && <Note kind="err">{err}</Note>}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setShow("open")} className={`btn !py-2 !px-4 text-sm ${show === "open" ? "btn-primary" : "btn-outline"}`}>New ({list.filter((m) => !m.done).length})</button>
        <button onClick={() => setShow("all")} className={`btn !py-2 !px-4 text-sm ${show === "all" ? "btn-primary" : "btn-outline"}`}>All ({list.length})</button>
      </div>
      {shown.length === 0 && <p className="text-muted">No messages here yet. Messages from the contact forms appear here.</p>}
      {shown.map((m) => (
        <div key={m.id} className={`${card} p-5 ${m.done ? "opacity-60" : ""}`}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="font-semibold text-ink">{m.name} {m.phone && <span className="font-normal text-muted">· {m.phone}</span>}</div>
              <div className="text-xs text-muted">{fmtDate(m.created_at)}{m.topic ? ` · ${m.topic}` : ""}{m.area ? ` · ${m.area}` : ""}{m.page ? ` · ${m.page}` : ""}</div>
            </div>
          </div>
          <p className="mt-3 whitespace-pre-line text-[15px]">{m.message}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {m.phone && <a href={waLinkTo(m.phone, `Hi ${m.name}, thank you for your message to BikaFlora!`)} target="_blank" rel="noopener" className="btn btn-wa !py-2 !px-4 text-sm">Reply on WhatsApp</a>}
            {m.done
              ? <button onClick={() => mark(m, false)} className="btn btn-outline !py-2 !px-4 text-sm"><Undo2 className="w-4 h-4" /> Mark as new</button>
              : <button onClick={() => mark(m, true)} className="btn btn-outline !py-2 !px-4 text-sm"><Check className="w-4 h-4" /> Mark as done</button>}
            <button onClick={() => remove(m)} className="btn !py-2 !px-4 text-sm text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /> Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
