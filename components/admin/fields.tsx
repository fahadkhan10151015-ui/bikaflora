"use client";
import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, ArrowUp, ArrowDown, Upload, Loader2 } from "lucide-react";
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

const move = <T,>(a: T[], i: number, d: number) => { const b = [...a]; const j = i + d; if (j < 0 || j >= b.length) return b; [b[i], b[j]] = [b[j], b[i]]; return b; };
const IconBtn = ({ title, onClick, children, danger }: { title: string; onClick: () => void; children: React.ReactNode; danger?: boolean }) => (
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
              <input className="input !py-1.5 !text-xs" placeholder="Alt text (describe the photo)" value={alts[src] ?? ""} onChange={(e) => onChange(images, { ...alts, [src]: e.target.value })} />
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
