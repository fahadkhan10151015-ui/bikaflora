"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, Save, Loader2, Trash2, CalendarClock, Upload, Plus, Pencil, X, Check } from "lucide-react";
import { allPosts as posts, blogCategories } from "@/data/posts";
import { loadSupabase } from "@/lib/supabase-config";
import RichText from "./RichText";
import { uploadPhoto, KeywordsField } from "./fields";
import { card, Note } from "./ui";
import SeoScore from "./SeoScore";

type P = { title: string; html: string; slug: string; date: string; author: string; category: string; image: string; imageAlt: string; keyword: string; seoTitle: string; description: string };

const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
const textOf = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const todayMY = () => new Date(Date.now() + 8 * 3600_000).toISOString().slice(0, 10);
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const Req = () => <span className="text-red-600" title="Required">*</span>;

/** WordPress-style blog editor. Only the title and content are required; everything else fills itself in. */
export default function PostEditor({ slug: startSlug, onClose }: { slug: string; onClose: () => void }) {
  const existing = posts.find((p) => p.slug === startSlug);
  const [saved, setSaved] = useState(Boolean(startSlug));
  const [slugTouched, setSlugTouched] = useState(Boolean(startSlug));
  const [p, setP] = useState<P>({
    title: existing?.title ?? "", html: existing ? existing.html ?? existing.sections.map((s) => `<h2>${esc(s.heading)}</h2><p>${esc(s.body)}</p>`).join("") : "",
    slug: startSlug, date: existing?.date ?? todayMY(), author: existing?.author ?? "BikaFlora", category: existing?.category ?? "",
    image: existing?.image ?? "", imageAlt: existing?.imageAlt ?? "", keyword: existing?.keyword ?? "", seoTitle: existing?.seoTitle ?? "", description: existing?.description ?? "",
  });
  const [cats, setCats] = useState<string[]>(blogCategories);
  const [catEdit, setCatEdit] = useState<{ i: number; v: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [up, setUp] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const set = (patch: Partial<P>) => setP((x) => ({ ...x, ...patch }));

  // Unpublished edits + latest category list.
  useEffect(() => {
    (async () => {
      const sb = await loadSupabase();
      const [{ data: c }, { data: k }] = await Promise.all([
        startSlug ? sb!.from("content").select("data,deleted").eq("key", `post:${startSlug}`).maybeSingle() : Promise.resolve({ data: null }),
        sb!.from("content").select("data").eq("key", "page:blog-categories").maybeSingle(),
      ]);
      if (c && !c.deleted) setP((x) => ({ ...x, ...(c.data as Partial<P>) }));
      if (Array.isArray(k?.data?.list)) setCats(k!.data.list);
    })();
  }, [startSlug]);

  // Web address follows the title until it is saved or edited by hand.
  const onTitle = (v: string) => set({ title: v, ...(!slugTouched && !saved ? { slug: slugify(v) } : {}) });

  const saveCats = async (list: string[]) => {
    setCats(list);
    const sb = await loadSupabase();
    await sb!.from("content").upsert({ key: "page:blog-categories", kind: "page", data: { list }, deleted: false, updated_at: new Date().toISOString() });
  };
  const addCat = () => { const v = window.prompt("New category name"); if (v?.trim() && !cats.includes(v.trim())) { saveCats([...cats, v.trim()]); set({ category: v.trim() }); } };

  const save = async () => {
    if (!p.title.trim()) return setMsg({ kind: "err", text: "Please add a title." });
    if (textOf(p.html).length < 20) return setMsg({ kind: "err", text: "Please write the post content." });
    const s = slugify(p.slug || p.title);
    if (!saved && posts.some((x) => x.slug === s)) return setMsg({ kind: "err", text: "A post with this web address already exists. Change the web address." });
    // Auto-fill anything left empty.
    const data = {
      ...p, slug: undefined, author: p.author.trim() || "BikaFlora",
      seoTitle: p.seoTitle.trim() || p.title.trim().slice(0, 60),
      description: p.description.trim() || textOf(p.html).slice(0, 155).replace(/\s\S*$/, "") + "…",
      imageAlt: p.imageAlt.trim() || p.title.trim(),
      image: p.image || "/images/site/cover.webp",
      date: p.date || todayMY(),
    };
    setBusy(true); setMsg(null);
    const sb = await loadSupabase();
    const { error } = await sb!.from("content").upsert({ key: `post:${s}`, kind: "post", data, deleted: false, updated_at: new Date().toISOString() });
    setBusy(false);
    if (error) return setMsg({ kind: "err", text: `Not saved: ${error.message}` });
    setP((x) => ({ ...x, ...data, slug: s })); setSaved(true);
    setMsg({ kind: "ok", text: data.date > todayMY()
      ? `Saved and scheduled for ${new Date(data.date).toLocaleDateString("en-MY", { dateStyle: "long" })}. Press “Publish changes” once now; it goes live by itself on that day.`
      : "Saved. Press “Publish changes” to put it live." });
  };
  const remove = async () => {
    if (!window.confirm(`Delete "${p.title}"? It disappears after you publish.`)) return;
    const sb = await loadSupabase();
    const { error } = await sb!.from("content").upsert({ key: `post:${p.slug}`, kind: "post", data: {}, deleted: true, updated_at: new Date().toISOString() });
    setMsg(error ? { kind: "err", text: error.message } : { kind: "ok", text: "Post deleted. Press “Publish changes” to remove it from the website." });
  };

  const scheduled = p.date > todayMY();
  const box = `${card} p-5 space-y-3`;
  const autoTitle = p.seoTitle || p.title.slice(0, 60);
  const autoDesc = p.description || textOf(p.html).slice(0, 155);
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={onClose} className="inline-flex items-center gap-1 text-brand font-semibold"><ArrowLeft className="w-4 h-4" /> All posts</button>
        <div className="flex gap-2">
          {saved && <button onClick={remove} className="btn !py-2 text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /> Delete</button>}
          <button onClick={save} disabled={busy} className="btn btn-primary !py-2">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {scheduled ? "Save & schedule" : "Save"}</button>
        </div>
      </div>
      {msg && <Note kind={msg.kind}>{msg.text}</Note>}
      <p className="text-sm text-muted">Fields with <span className="text-red-600">*</span> are required. Everything else fills in automatically if you leave it empty.</p>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
        <div className="space-y-4">
          <input className="input !text-2xl !py-4 font-serif" placeholder="Post title *" value={p.title} onChange={(e) => onTitle(e.target.value)} aria-label="Post title" />
          <div className="text-sm text-muted flex flex-wrap items-center gap-1">
            Web address: <span className="text-ink">bikaflora.my/blog/</span>
            <input className="border-b border-dashed border-brand/50 bg-transparent outline-none text-ink min-w-[12ch]" value={p.slug} disabled={saved}
              onChange={(e) => { setSlugTouched(true); set({ slug: slugify(e.target.value) }); }} aria-label="Web address" />
            {saved && <span className="text-xs">(fixed after saving)</span>}
          </div>
          <div><span className="label">Content <Req /></span><RichText value={p.html} onChange={(v) => set({ html: v })} /></div>
        </div>

        <aside className="space-y-4">
          <div className={box}>
            <h3 className="font-semibold flex items-center gap-2"><CalendarClock className="w-4 h-4 text-gold" /> Publish</h3>
            <label className="block"><span className="label">Date</span><input type="date" className="input" value={p.date} onChange={(e) => set({ date: e.target.value })} /></label>
            {scheduled && <p className="text-xs rounded-xl bg-amber-50 text-amber-800 px-3 py-2">Scheduled: this post will go live automatically on this date.</p>}
            <label className="block"><span className="label">Author</span><input className="input" value={p.author} onChange={(e) => set({ author: e.target.value })} /></label>
          </div>

          <div className={box}>
            <h3 className="font-semibold">Category</h3>
            <select className="input" value={p.category} onChange={(e) => set({ category: e.target.value })}>
              <option value="">No category</option>
              {cats.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="space-y-1">
              {cats.map((c, i) => (
                <div key={c} className="flex items-center gap-1 text-sm">
                  {catEdit?.i === i ? (<>
                    <input className="input !py-1 !text-sm" value={catEdit.v} onChange={(e) => setCatEdit({ i, v: e.target.value })} />
                    <button aria-label="Save category" onClick={() => { const v = catEdit.v.trim(); if (v) { saveCats(cats.map((x, j) => (j === i ? v : x))); if (p.category === c) set({ category: v }); } setCatEdit(null); }} className="p-1 text-emerald-600"><Check className="w-4 h-4" /></button>
                    <button aria-label="Cancel" onClick={() => setCatEdit(null)} className="p-1"><X className="w-4 h-4" /></button>
                  </>) : (<>
                    <span className="flex-1">{c}</span>
                    <button aria-label={`Rename ${c}`} onClick={() => setCatEdit({ i, v: c })} className="p-1 text-brand"><Pencil className="w-3.5 h-3.5" /></button>
                    <button aria-label={`Remove ${c}`} onClick={() => { if (window.confirm(`Remove the category "${c}"?`)) { saveCats(cats.filter((x) => x !== c)); if (p.category === c) set({ category: "" }); } }} className="p-1 text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                  </>)}
                </div>
              ))}
            </div>
            <button onClick={addCat} className="text-sm text-brand font-semibold inline-flex items-center gap-1"><Plus className="w-4 h-4" /> Add category</button>
          </div>

          <div className={box}>
            <h3 className="font-semibold">Featured image</h3>
            {p.image && <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-blush"><Image src={p.image} alt={p.imageAlt || p.title} fill sizes="300px" className="object-cover" /></div>}
            <label className="btn btn-outline !py-2 w-full cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; e.target.value = ""; if (!f) return; setUp(true); try { set({ image: await uploadPhoto(f, "blog", p.title || "blog") }); } catch (err) { setMsg({ kind: "err", text: err instanceof Error ? err.message : "Upload failed" }); } setUp(false); }} />
              {up ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} {p.image ? "Change image" : "Upload image"}
            </label>
            <label className="block"><span className="label">Image alt text</span><input className="input" placeholder={p.title || "Describe the image"} value={p.imageAlt} onChange={(e) => set({ imageAlt: e.target.value })} /></label>
          </div>

          <div className={box}>
            <h3 className="font-semibold">SEO</h3>
            <KeywordsField value={p.keyword} onChange={(v) => set({ keyword: v })} placeholder="e.g. convocation flowers KL" />
            <label className="block"><span className="label">Meta title <span className={`font-normal ${autoTitle.length > 60 ? "text-red-600" : "text-muted"}`}>({autoTitle.length}/60)</span></span><input className="input" placeholder={p.title || "Uses the post title"} value={p.seoTitle} onChange={(e) => set({ seoTitle: e.target.value })} /></label>
            <label className="block"><span className="label">Meta description <span className={`font-normal ${autoDesc.length > 160 ? "text-red-600" : "text-muted"}`}>({autoDesc.length}/160)</span></span><textarea className="input" rows={3} placeholder="Leave empty to use the start of the post" value={p.description} onChange={(e) => set({ description: e.target.value })} /></label>
            <div className="rounded-xl border border-gray-200 p-3 bg-white">
              <div className="text-[11px] text-gray-500">Google preview</div>
              <div className="text-[12px] text-gray-700 truncate">bikaflora.my › blog › {p.slug || "…"}</div>
              <div className="text-[16px] leading-snug text-[#1a0dab] line-clamp-1">{autoTitle || "Post title"}</div>
              <div className="text-[12px] text-gray-600 line-clamp-2">{autoDesc || "The start of your post appears here."}</div>
            </div>
            <div className="pt-2 border-t border-blush-2/60">
              <SeoScore keyword={p.keyword} title={autoTitle} description={autoDesc} slug={p.slug} h1={p.title} html={p.html} alts={[p.imageAlt || p.title]} minWords={600} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
