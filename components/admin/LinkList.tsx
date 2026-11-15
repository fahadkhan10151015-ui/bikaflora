"use client";
import { ArrowUp, ArrowDown, Trash2, Plus } from "lucide-react";
import { IconBtn, move } from "./fields";

export type Link = { label: string; href: string };

/** Editable list of links (text + web address), with a list of site pages to pick from. */
export default function LinkList({ items, onChange, pages, addLabel = "Add link" }: { items: Link[]; onChange: (v: Link[]) => void; pages: string[]; addLabel?: string }) {
  const id = `pages-${addLabel.replace(/\W/g, "")}`;
  return (
    <div>
      <datalist id={id}>{pages.map((p) => <option key={p} value={p} />)}</datalist>
      <div className="space-y-2">
        {items.map((l, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
            <input className="input !py-2" placeholder="Text shown" value={l.label} onChange={(e) => onChange(items.map((y, j) => (j === i ? { ...y, label: e.target.value } : y)))} />
            <input className="input !py-2" placeholder="/page-address" list={id} value={l.href} onChange={(e) => onChange(items.map((y, j) => (j === i ? { ...y, href: e.target.value } : y)))} />
            <div className="flex">
              <IconBtn title="Move up" onClick={() => onChange(move(items, i, -1))}><ArrowUp className="w-4 h-4" /></IconBtn>
              <IconBtn title="Move down" onClick={() => onChange(move(items, i, 1))}><ArrowDown className="w-4 h-4" /></IconBtn>
              <IconBtn title="Remove" danger onClick={() => onChange(items.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4" /></IconBtn>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...items, { label: "", href: "" }])} className="mt-2 text-sm text-brand font-semibold inline-flex items-center gap-1"><Plus className="w-4 h-4" /> {addLabel}</button>
    </div>
  );
}
