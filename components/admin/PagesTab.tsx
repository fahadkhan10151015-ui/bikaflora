"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, Save, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { allCategories } from "@/data/categories";
import { collectionSeo } from "@/data/collection-seo";
import { locations } from "@/data/locations";
import { locationSeo } from "@/data/location-seo";
import { pageCopy } from "@/data/page-copy";
import { posts } from "@/data/posts";
import { products } from "@/data/products";
import { loadSupabase } from "@/lib/supabase-config";
import RichText from "./RichText";
import PostEditor from "./PostEditor";
import { Field, FaqEditor, uploadPhoto, type QA } from "./fields";
import { card, Note } from "./ui";

type Kind = "collection" | "location" | "page" | "post";
type Item = { kind: Kind; slug: string; name: string; path: string };
type Doc = {
  title: string; description: string; keyword?: string; h1?: string; intro?: string; html?: string; faqTitle?: string; faqs?: QA[];
  featured?: string[]; groups?: { title: string; faqs: QA[] }[]; date?: string; image?: string;
};

const pageNames = { home: "Home", about: "About", faq: "FAQ", terms: "Terms & Conditions", privacy: "Privacy Policy" } as const;
const pagePaths = { home: "/", about: "/about", faq: "/faq", terms: "/terms", privacy: "/privacy-policy" } as const;
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function current(kind: Kind, slug: string): Doc {
  if (kind === "collection") { const s = collectionSeo[slug]; const c = allCategories.find((x) => x.slug === slug); return s ? { ...s } : { title: c?.seoTitle ?? "", description: c?.seoDescription ?? "", h1: c?.name ?? "", intro: c?.intro ? `<p>${esc(c.intro)}</p>` : "", html: "", faqTitle: "", faqs: [] }; }
  if (kind === "location") { const s = locationSeo[slug]; return s ? { ...s } : { title: "", description: "", h1: "", intro: "", html: "", faqTitle: "", faqs: [], featured: [] }; }
  if (kind === "page") { const s = pageCopy[slug as keyof typeof pageCopy]; return { ...s, html: s.html ?? "", faqs: s.faqs ?? [], faqTitle: s.faqTitle ?? "" }; }
  const p = posts.find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.description, date: p.date, image: p.image, html: p.html ?? p.sections.map((s) => `<h2>${esc(s.heading)}</h2><p>${esc(s.body)}</p>`).join("") }
    : { title: "", description: "", date: new Date().toISOString().slice(0, 10), image: "/images/site/cover.webp", html: "" };
}

/** Edit category pages, delivery area pages, site pages and blog posts. */
export default function PagesTab() {
  const [group, setGroup] = useState<Kind>("collection");
  const [open, setOpen] = useState<Item | null>(null);
  const [q, setQ] = useState("");
  const [drafts, setDrafts] = useState<Item[]>([]);
  // Posts saved in the admin but not live yet (new or scheduled).
  useEffect(() => {
    (async () => {
      const sb = await loadSupabase();
      const { data } = await sb!.from("content").select("key,data,deleted").eq("kind", "post");
      const live = new Set(posts.map((p) => p.slug));
      setDrafts(((data ?? []) as { key: string; data: { title?: string; date?: string }; deleted: boolean }[])
        .filter((r) => !r.deleted && !live.has(r.key.slice(5)))
        .map((r) => ({ kind: "post" as const, slug: r.key.slice(5), name: `${r.data.title ?? r.key.slice(5)} · ${r.data.date && r.data.date > new Date(Date.now() + 8 * 3600_000).toISOString().slice(0, 10) ? `scheduled ${r.data.date}` : "not published yet"}`, path: `/blog/${r.key.slice(5)}` })));
    })();
  }, []);
  const items: Record<Kind, Item[]> = {
    collection: allCategories.map((c) => ({ kind: "collection" as const, slug: c.slug, name: c.name, path: `/category/${c.slug}` })),
    location: locations.map((l) => ({ kind: "location" as const, slug: l.slug, name: `Flower delivery ${l.name}`, path: `/flower-delivery/${l.slug}` })),
    page: (Object.keys(pageNames) as (keyof typeof pageNames)[]).map((k) => ({ kind: "page" as const, slug: k, name: pageNames[k], path: pagePaths[k] })),
    post: [...drafts, ...posts.map((p) => ({ kind: "post" as const, slug: p.slug, name: p.title, path: `/blog/${p.slug}` }))],
  };
  if (open?.kind === "post") return <PostEditor slug={open.slug} onClose={() => setOpen(null)} />;
  if (open) return <PageEditor item={open} onClose={() => setOpen(null)} />;
  const list = items[group].filter((i) => i.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {([["collection", "Category pages"], ["location", "Delivery area pages"], ["page", "Site pages"], ["post", "Blog posts"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setGroup(k)} className={`btn !py-2 !px-4 text-sm ${group === k ? "btn-primary" : "btn-outline"}`}>{l} ({items[k].length})</button>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 justify-between">
        <input className="input max-w-xs" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
        {group === "post" && <button onClick={() => setOpen({ kind: "post", slug: "", name: "New blog post", path: "" })} className="btn btn-outline"><Plus className="w-4 h-4" /> New blog post</button>}
      </div>
      <div className={`${card} divide-y divide-blush-2/60`}>
        {list.map((i) => (
          <button key={i.slug} onClick={() => setOpen(i)} className="w-full text-left px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-blush/40">
            <span><span className="font-semibold text-ink">{i.name}</span><span className="block text-xs text-muted">{i.path}</span></span>
            <Pencil className="w-4 h-4 text-brand shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}

function PageEditor({ item, onClose }: { item: Item; onClose: () => void }) {
  const isNewPost = item.kind === "post" && !item.slug;
  const [slug, setSlug] = useState(item.slug);
  const [d, setD] = useState<Doc>(current(item.kind, item.slug));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const set = (patch: Partial<Doc>) => setD((x) => ({ ...x, ...patch }));

  useEffect(() => {
    if (isNewPost) return;
    (async () => {
      const sb = await loadSupabase();
      const { data } = await sb!.from("content").select("data,deleted").eq("key", `${item.kind}:${item.slug}`).maybeSingle();
      if (data && !data.deleted) setD((x) => ({ ...x, ...(data.data as Doc) }));
    })();
  }, [item, isNewPost]);

  const save = async () => {
    const s = isNewPost ? slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : item.slug;
    if (!s) return setMsg({ kind: "err", text: "Please add a web address for the post." });
    if (!d.title.trim()) return setMsg({ kind: "err", text: "Please add a title." });
    if (isNewPost && posts.some((p) => p.slug === s)) return setMsg({ kind: "err", text: "A post with this web address already exists." });
    setBusy(true); setMsg(null);
    const sb = await loadSupabase();
    const data = { ...d, faqs: d.faqs?.filter((x) => x.q && x.a), groups: d.groups?.map((g) => ({ ...g, faqs: g.faqs.filter((x) => x.q && x.a) })) };
    const { error } = await sb!.from("content").upsert({ key: `${item.kind}:${s}`, kind: item.kind, data, deleted: false, updated_at: new Date().toISOString() });
    setBusy(false);
    if (error) return setMsg({ kind: "err", text: `Not saved: ${error.message}` });
    if (isNewPost) setSlug(s);
    setMsg({ kind: "ok", text: "Saved. Press “Publish changes” to put it live." });
  };
  const removePost = async () => {
    if (!window.confirm(`Delete the blog post "${d.title}"? It disappears after you publish.`)) return;
    const sb = await loadSupabase();
    const { error } = await sb!.from("content").upsert({ key: `post:${item.slug}`, kind: "post", data: {}, deleted: true, updated_at: new Date().toISOString() });
    setMsg(error ? { kind: "err", text: error.message } : { kind: "ok", text: "Post deleted. Press “Publish changes” to remove it from the website." });
  };

  const sec = `${card} p-5 sm:p-6 space-y-4`;
  const isFaqPage = item.kind === "page" && item.slug === "faq";
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={onClose} className="inline-flex items-center gap-1 text-brand font-semibold"><ArrowLeft className="w-4 h-4" /> Back</button>
        <div className="flex gap-2">
          {item.kind === "post" && !isNewPost && <button onClick={removePost} className="btn !py-2 text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /> Delete post</button>}
          <button onClick={save} disabled={busy} className="btn btn-primary !py-2">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save</button>
        </div>
      </div>
      <div><h2 className="text-2xl font-semibold">{item.name}</h2>{item.path && <a href={item.path} target="_blank" rel="noopener" className="text-sm text-brand hover:underline">{item.path}</a>}</div>
      {msg && <Note kind={msg.kind}>{msg.text}</Note>}

      <section className={sec}>
        <h3 className="text-xl font-semibold">SEO</h3>
        {isNewPost && <Field label="Web address" value={slug} onChange={setSlug} hint={`bikaflora.my/blog/${slug || "…"}`} />}
        <Field label={item.kind === "post" ? "Post title" : "Meta title"} value={d.title} max={item.kind === "post" ? undefined : 60} onChange={(v) => set({ title: v })} />
        <Field label="Meta description" value={d.description} max={160} rows={2} onChange={(v) => set({ description: v })} />
        {item.kind === "collection" && <Field label="Focus keyword" value={d.keyword ?? ""} onChange={(v) => set({ keyword: v })} />}
      </section>

      {item.kind === "post" ? (
        <section className={sec}>
          <h3 className="text-xl font-semibold">Post</h3>
          <div className="grid sm:grid-cols-2 gap-4 items-end">
            <Field label="Date" value={d.date ?? ""} onChange={(v) => set({ date: v })} hint="Format: 2026-11-15" />
            <label className="block"><span className="label">Cover photo</span>
              <input type="file" accept="image/*" className="input !py-2" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; try { set({ image: await uploadPhoto(f, "blog", d.title || "blog") }); } catch (err) { setMsg({ kind: "err", text: err instanceof Error ? err.message : "Upload failed" }); } }} />
              {d.image && <span className="mt-1 block text-xs text-muted break-all">{d.image}</span>}
            </label>
          </div>
          <RichText value={d.html ?? ""} onChange={(v) => set({ html: v })} />
        </section>
      ) : (
        <section className={sec}>
          <h3 className="text-xl font-semibold">Page content</h3>
          <Field label="Main heading (H1)" value={d.h1 ?? ""} onChange={(v) => set({ h1: v })} />
          <div><span className="label">Intro</span><RichText small value={d.intro ?? ""} onChange={(v) => set({ intro: v })} /></div>
          {!isFaqPage && <div><span className="label">Main content</span><RichText value={d.html ?? ""} onChange={(v) => set({ html: v })} />
            {item.slug === "home" && <p className="mt-1 text-xs text-muted">On the homepage, each “Heading” starts a new card.</p>}</div>}
          {item.kind === "location" && (
            <div>
              <span className="label">Featured bouquets ({(d.featured ?? []).length})</span>
              <div className="flex flex-wrap gap-2">
                {products.map((p) => { const on = (d.featured ?? []).includes(p.slug); return (
                  <button key={p.slug} type="button" onClick={() => set({ featured: on ? (d.featured ?? []).filter((x) => x !== p.slug) : [...(d.featured ?? []), p.slug] })}
                    className={`px-3 py-1.5 rounded-full text-sm border ${on ? "bg-brand text-white border-brand" : "bg-white border-blush-2 hover:bg-blush"}`}>{p.name}</button>
                ); })}
              </div>
            </div>
          )}
        </section>
      )}

      {item.kind !== "post" && (
        <section className={sec}>
          <h3 className="text-xl font-semibold">FAQs</h3>
          {isFaqPage ? (
            <div className="space-y-5">
              {(d.groups ?? []).map((g, gi) => (
                <div key={gi} className="rounded-2xl border border-blush-2/70 p-4">
                  <div className="flex gap-2">
                    <input className="input !py-2 font-semibold" value={g.title} onChange={(e) => set({ groups: d.groups!.map((x, j) => (j === gi ? { ...x, title: e.target.value } : x)) })} />
                    <button type="button" onClick={() => set({ groups: d.groups!.filter((_, j) => j !== gi) })} className="text-red-600 px-2" aria-label="Remove topic"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="mt-3"><FaqEditor items={g.faqs} onChange={(v) => set({ groups: d.groups!.map((x, j) => (j === gi ? { ...x, faqs: v } : x)) })} /></div>
                </div>
              ))}
              <button type="button" onClick={() => set({ groups: [...(d.groups ?? []), { title: "New topic", faqs: [] }] })} className="text-sm text-brand font-semibold inline-flex items-center gap-1"><Plus className="w-4 h-4" /> Add topic</button>
            </div>
          ) : (<>
            <Field label="FAQ heading" value={d.faqTitle ?? ""} onChange={(v) => set({ faqTitle: v })} />
            <FaqEditor items={d.faqs ?? []} onChange={(v) => set({ faqs: v })} />
          </>)}
        </section>
      )}

      <div className="flex justify-end"><button onClick={save} disabled={busy} className="btn btn-primary">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save</button></div>
    </div>
  );
}
