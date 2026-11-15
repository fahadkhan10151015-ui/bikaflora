"use client";
/** Small shared bits for the admin panel. */
export const card = "bg-white rounded-3xl border border-blush-2/70";
export const Note = ({ kind = "ok", children }: { kind?: "ok" | "err"; children: React.ReactNode }) => (
  <div className={`rounded-2xl px-4 py-3 text-sm ${kind === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{children}</div>
);
export const Toggle = ({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) => (
  <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
    className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition ${on ? "bg-emerald-500" : "bg-gray-300"}`}>
    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${on ? "left-[22px]" : "left-0.5"}`} />
  </button>
);
export const fmtDate = (s: string | null) => (s ? new Date(s).toLocaleString("en-MY", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "–");
