"use client";
import { useState } from "react";
import Image from "next/image";
import { Plus, Minus, Trash2, ArrowUp, ArrowDown, Upload, Loader2, ImageIcon } from "lucide-react";
import { loadSupabase } from "@/lib/supabase-config";

export type QA = { q: string; a: string };

/** Text input with a label and optional character counter. */
export function Field({ label, value, onChange, max, rows, hint, placeholder }: { label: string; value: string; onChange: (v: string) => void; max?: number; rows?: number; hint?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="label">{label}{max ? <span className={`font-normal ${value.length > max ? "text-red-600" : "text-muted"}`}> ({value.length}/{max})</span> : null}</span>
      {rows ? <textarea className="input" rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        : <input className="input" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export const move = <T,>(a: T[], i: number, d: number) => { const b = [...a]; const j = i + d; if (j < 0 || j >= b.length) return b; [b[i], b[j]] = [b[j], b[i]]; return b; };
export const IconBtn = ({ title, onClick, children, danger }: { title: string; onClick: () => void; children: React.ReactNode; danger?: boolean }) => (
  <button type="button" title={title} aria-label={title} onClick={onClick} className={`w-8 h-8 grid place-items-center rounded-lg ${danger ? "text-red-600 hover:bg-red-50" : "hover:bg-blush"}`}>{children}</button>
);

/** List of short lines (e.g. "What's included", care tips). */
export function LinesEditor({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  return (
    <div>
      <span className="label">{label}</span>
      <div className="space-y-2">
        {items.map((x, i) => (
          <div key={i} className="flex gap-1 items-center">
            <input className="input !py-2" value={x} onChange={(e) => onChange(items.map((y, j) => (j === i ? e.target.value : y)))} />
            <IconBtn title="Move up" onClick={() => onChange(move(items, i, -1))}><ArrowUp className="w-4 h-4" /></IconBtn>
            <IconBtn title="Move down" onClick={() => onChange(move(items, i, 1))}><ArrowDown className="w-4 h-4" /></IconBtn>
            <IconBtn title="Remove" danger onClick={() => onChange(items.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4" /></IconBtn>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...items, ""])} className="mt-2 text-sm text-brand font-semibold inline-flex items-center gap-1"><Plus className="w-4 h-4" /> Add line</button>
    </div>
  );
}

/** FAQ list: question + answer pairs. */
export function FaqEditor({ items, onChange }: { items: QA[]; onChange: (v: QA[]) => void }) {
  return (
    <div className="space-y-3">
      {items.map((f, i) => (
        <div key={i} className="rounded-2xl border border-blush-2/70 p-3 bg-cream/40">
          <div className="flex gap-1 items-center">
            <input className="input !py-2 font-semibold" placeholder="Question" value={f.q} onChange={(e) => onChange(items.map((y, j) => (j === i ? { ...y, q: e.target.value } : y)))} />
            <IconBtn title="Move up" onClick={() => onChange(move(items, i, -1))}><ArrowUp className="w-4 h-4" /></IconBtn>
            <IconBtn title="Move down" onClick={() => onChange(move(items, i, 1))}><ArrowDown className="w-4 h-4" /></IconBtn>
            <IconBtn title="Remove question" danger onClick={() => onChange(items.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4" /></IconBtn>
          </div>
          <textarea className="input mt-2" rows={2} placeholder="Answer" value={f.a} onChange={(e) => onChange(items.map((y, j) => (j === i ? { ...y, a: e.target.value } : y)))} />
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, { q: "", a: "" }])} className="text-sm text-brand font-semibold inline-flex items-center gap-1"><Plus className="w-4 h-4" /> Add question</button>
    </div>
  );
}

/** Shrinks a photo in the browser (max 1600 px, WebP) so uploads stay small and sharp. */
async function compress(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
  for (const q of [0.86, 0.8, 0.74, 0.68]) {
    const b = await new Promise<Blob | null>((r) => c.toBlob(r, "image/webp", q));
    if (b && (b.size < 250_000 || q === 0.68)) return b;
  }
  return file;
}

/** Uploads a photo to the site's photo storage and returns its public address. */
export async function uploadPhoto(file: File, folder: string, name: string) {
  const sb = await loadSupabase();
  if (!sb) throw new Error("No connection");
  const blob = await compress(file);
  const safe = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "photo";
  const path = `${folder}/${safe}-${Date.now().toString(36)}.webp`;
  const { error } = await sb.storage.from("site-media").upload(path, blob, { contentType: "image/webp", upsert: false });
  if (error) throw error;
  return sb.storage.from("site-media").getPublicUrl(path).data.publicUrl;
}

/** Photo list: upload, reorder (first = main photo), remove, alt text for each. */
export function PhotosEditor({ images, alts, onChange, folder, name }: { images: string[]; alts: Record<string, string>; onChange: (images: string[], alts: Record<string, string>) => void; folder: string; name: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const add = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true); setErr("");
    try {
      const urls: string[] = [];
      for (const f of Array.from(files)) urls.push(await uploadPhoto(f, folder, name));
      onChange([...images, ...urls], alts);
    } catch (e) { setErr(e instanceof Error ? e.message : "Upload failed"); }
    setBusy(false);
  };
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((src, i) => (
          <div key={src} className="rounded-2xl border border-blush-2/70 overflow-hidden bg-white">
            <div className="relative aspect-square bg-blush">
              <Image src={src} alt={alts[src] ?? ""} fill sizes="200px" className="object-cover" />
              {i === 0 && <span className="absolute top-2 left-2 text-[10px] font-bold bg-brand text-white rounded-full px-2 py-0.5">MAIN</span>}
            </div>
            <div className="p-2">
              <label className="block"><span className="text-[11px] font-semibold text-ink">Alt text</span>
                <input className="input !py-1.5 !text-xs mt-0.5" placeholder="Auto if empty" value={alts[src] ?? ""} onChange={(e) => onChange(images, { ...alts, [src]: e.target.value })} /></label>
              <div className="mt-1 flex justify-between">
                <span className="flex">
                  <IconBtn title="Move left" onClick={() => onChange(move(images, i, -1), alts)}><ArrowUp className="w-4 h-4 -rotate-90" /></IconBtn>
                  <IconBtn title="Move right" onClick={() => onChange(move(images, i, 1), alts)}><ArrowDown className="w-4 h-4 -rotate-90" /></IconBtn>
                </span>
                <IconBtn title="Remove photo" danger onClick={() => onChange(images.filter((_, j) => j !== i), alts)}><Trash2 className="w-4 h-4" /></IconBtn>
              </div>
            </div>
          </div>
        ))}
        <label className="aspect-square rounded-2xl border-2 border-dashed border-blush-2 grid place-items-center text-center cursor-pointer hover:bg-blush/40 text-sm text-muted">
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { add(e.target.files); e.target.value = ""; }} />
          <span>{busy ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : <Upload className="w-6 h-6 mx-auto" />}<span className="block mt-1">{busy ? "Uploading…" : "Upload photos"}</span></span>
        </label>
      </div>
      {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
      <p className="mt-2 text-xs text-muted">The first photo is the main photo. Photos are compressed automatically.</p>
    </div>
  );
}

/** Number box with − / + buttons (price, stock…). Empty is allowed when `optional`. */
export function NumberField({ label, value, onChange, step = 1, min = 0, required, optional, placeholder, hint }: { label: string; value: string; onChange: (v: string) => void; step?: number; min?: number; required?: boolean; optional?: boolean; placeholder?: string; hint?: string }) {
  const n = Number(value);
  const bump = (d: number) => { const base = value.trim() === "" || isNaN(n) ? 0 : n; onChange(String(Math.max(min, Math.round((base + d) * 100) / 100))); };
  return (
    <div>
      <span className="label">{label} {required && <span className="text-red-600">*</span>}</span>
      <div className="flex items-stretch rounded-[.8rem] border border-[#e6e1d8] bg-white overflow-hidden focus-within:border-brand">
        <button type="button" aria-label={`Less ${label}`} onClick={() => bump(-step)} className="px-3 text-muted hover:bg-blush"><Minus className="w-4 h-4" /></button>
        <input type="number" inputMode="decimal" min={min} step={step} className="w-full min-w-0 text-center py-2.5 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
        {optional && value !== "" && <button type="button" aria-label="Clear" onClick={() => onChange("")} className="px-2 text-xs text-muted hover:text-red-600">✕</button>}
        <button type="button" aria-label={`More ${label}`} onClick={() => bump(step)} className="px-3 text-muted hover:bg-blush"><Plus className="w-4 h-4" /></button>
      </div>
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </div>
  );
}

/** One image with upload/replace/remove and alt text (category image, page photo, city photo…). */
export function SingleImage({ label, src, alt, onChange, folder, name, hint }: { label: string; src: string; alt: string; onChange: (src: string, alt: string) => void; folder: string; name: string; hint?: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex gap-3 items-start">
        <div className="relative w-28 h-28 shrink-0 rounded-2xl overflow-hidden bg-blush grid place-items-center">
          {src ? <Image src={src} alt={alt} fill sizes="112px" className="object-cover" /> : <ImageIcon className="w-7 h-7 text-brand/40" />}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <label className="btn btn-outline !py-1.5 !px-3 text-sm cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; e.target.value = ""; if (!f) return; setBusy(true); setErr(""); try { onChange(await uploadPhoto(f, folder, name), alt); } catch (x) { setErr(x instanceof Error ? x.message : "Upload failed"); } setBusy(false); }} />
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} {src ? "Replace" : "Upload"}
            </label>
            {src && <button type="button" onClick={() => onChange("", alt)} className="btn !py-1.5 !px-3 text-sm text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /> Remove</button>}
          </div>
          <label className="block"><span className="text-xs font-semibold">Alt text</span><input className="input !py-1.5 !text-sm mt-0.5" placeholder="Auto if empty" value={alt} onChange={(e) => onChange(src, e.target.value)} /></label>
          {(hint || err) && <span className={`block text-xs ${err ? "text-red-600" : "text-muted"}`}>{err || hint}</span>}
        </div>
      </div>
    </div>
  );
}

export const BADGES = ["Top Seller", "Best Seller", "New", "Limited", "Handmade", "For Him", "For Her", "Graduation", "Pre-order", "Sweet & Romantic"];
/** Badge picker: Auto (we choose), none, a ready-made badge, or your own words. */
export function BadgeField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const mode = value === "auto" ? "auto" : value === "" ? "none" : BADGES.includes(value) ? value : "custom";
  return (
    <div>
      <span className="label">Badge <span className="font-normal text-muted">(small label on the photo)</span></span>
      <select className="input" value={mode} onChange={(e) => onChange(e.target.value === "auto" ? "auto" : e.target.value === "none" ? "" : e.target.value === "custom" ? "My badge" : e.target.value)}>
        <option value="auto">Auto (we choose for you)</option>
        <option value="none">No badge</option>
        {BADGES.map((b) => <option key={b} value={b}>{b}</option>)}
        <option value="custom">Write my own…</option>
      </select>
      {mode === "custom" && <input className="input mt-2" maxLength={22} value={value} onChange={(e) => onChange(e.target.value)} />}
      {mode === "auto" && <span className="mt-1 block text-xs text-muted">Best seller → “Top Seller”, new product → “New”, pre-order only → “Pre-order”.</span>}
    </div>
  );
}

/** Keyword chips: type and press Enter (or comma). The first keyword is the main one. Stored comma separated. */
export function KeywordsField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [draft, setDraft] = useState("");
  const list = value.split(",").map((k) => k.trim()).filter(Boolean);
  const save = (l: string[]) => onChange(l.join(", "));
  const add = () => { const k = draft.replace(/,/g, " ").trim(); if (k && !list.some((x) => x.toLowerCase() === k.toLowerCase())) save([...list, k]); setDraft(""); };
  return (
    <div>
      <span className="label">Keywords <span className="font-normal text-muted">(first = main keyword)</span></span>
      <div className="flex flex-wrap gap-1.5 rounded-[.8rem] border border-[#e6e1d8] bg-white p-2 focus-within:border-brand">
        {list.map((k, i) => (
          <span key={k} className={`inline-flex items-center gap-1 rounded-full pl-2.5 pr-1 py-1 text-xs font-semibold ${i === 0 ? "bg-brand text-white" : "bg-blush text-brand"}`}>
            {i === 0 && <span className="text-[9px] opacity-80">MAIN</span>}{k}
            {i > 0 && <button type="button" title="Make main keyword" onClick={() => save([k, ...list.filter((x) => x !== k)])} className="px-1 opacity-60 hover:opacity-100">★</button>}
            <button type="button" aria-label={`Remove ${k}`} onClick={() => save(list.filter((x) => x !== k))} className="px-1 opacity-70 hover:opacity-100">✕</button>
          </span>
        ))}
        <input className="flex-1 min-w-[10ch] outline-none text-sm px-1 py-1" placeholder={list.length ? "Add another…" : placeholder ?? "Type a keyword, press Enter"} value={draft}
          onChange={(e) => setDraft(e.target.value)} onBlur={add}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } else if (e.key === "Backspace" && !draft && list.length) save(list.slice(0, -1)); }} />
      </div>
      <span className="mt-1 block text-xs text-muted">Press Enter after each keyword. Tap ★ to make one the main keyword.</span>
    </div>
  );
}
