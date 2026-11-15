"use client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { loadSupabase } from "@/lib/supabase-config";
import { card, Note, fmtDate } from "./ui";

type Customer = { id: string; email: string; full_name: string | null; phone: string | null; created_at: string; last_sign_in_at: string | null };

/** Customer accounts (people who signed up on the site). Read only. */
export default function CustomersTab() {
  const [list, setList] = useState<Customer[] | null>(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    (async () => {
      const sb = await loadSupabase();
      const { data, error } = (await sb?.rpc("admin_customers")) ?? { data: null, error: null };
      if (error) setErr(error.message);
      setList((data as Customer[]) ?? []);
    })();
  }, []);
  if (!list) return <p className="text-muted"><Loader2 className="w-4 h-4 animate-spin inline" /> Loading…</p>;
  return (
    <div className="space-y-4">
      {err && <Note kind="err">{err}</Note>}
      <p className="text-sm text-muted">{list.length} customer account{list.length === 1 ? "" : "s"}. Customers can also order on WhatsApp without an account.</p>
      <div className={`${card} overflow-x-auto`}>
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-blush/60 text-left"><tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Phone</th><th className="p-3">Joined</th><th className="p-3">Last login</th></tr></thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} className="border-t border-blush-2/60">
                <td className="p-3 font-medium text-ink">{c.full_name || "–"}</td>
                <td className="p-3"><a href={`mailto:${c.email}`} className="text-brand hover:underline break-all">{c.email}</a></td>
                <td className="p-3">{c.phone || "–"}</td>
                <td className="p-3 text-muted">{fmtDate(c.created_at)}</td>
                <td className="p-3 text-muted">{fmtDate(c.last_sign_in_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
