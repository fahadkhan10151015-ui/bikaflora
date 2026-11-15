"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, Save, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { allCategories } from "@/data/categories";
import { collectionSeo } from "@/data/collection-seo";
import { allLocations as locations } from "@/data/locations";
import { locationSeo } from "@/data/location-seo";
import { pageCopy } from "@/data/page-copy";
import { posts } from "@/data/posts";
import { products } from "@/data/products";
import { loadSupabase } from "@/lib/supabase-config";
import RichText from "./RichText";
import SeoScore, { seoChecks, ScorePill } from "./SeoScore";
import HeroEditor from "./HeroEditor";
import { customPages } from "@/lib/custom-pages";
import PostEditor from "./PostEditor";
import { Field, FaqEditor, SingleImage, uploadPhoto, KeywordsField, type QA } from "./fields";
import { card, Note } from "./ui";

type Kind = "collection" | "location" | "page" | "post";
type Item = { kind: Kind; slug: string; name: string; path: string };
type Doc = {
  title: string; description: string; keyword?: string; h1?: string; intro?: string; html?: string; faqTitle?: string; faqs?: QA[];
  featured?: string[]; groups?: { title: string; faqs: QA[] }[]; date?: string; image?: string; imageAlt?: string; name?: string; short?: string;
  formTitle?: string; formText?: string; custom?: boolean;
};

const RESERVED = ["home", "about", "faq", "terms", "privacy", "contact", "hero", "blog-categories", "shop", "blog", "product", "category", "flower-delivery", "admin", "account", "login", "signup", "reviews", "favourites", "api", "delivery-information", "refund-policy", "privacy-policy", "forgot-password", "reset-password"];

const pageNames = { hero: "Homepage hero slides", home: "Home", about: "About", contact: "Contact", faq: "FAQ", terms: "Terms & Conditions", privacy: "Privacy Policy" } as const;
const pagePaths = { hero: "/", home: "/", about: "/about", contact: "/contact", faq: "/faq", terms: "/terms", privacy: "/privacy-policy" } as const;
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function current(kind: Kind, slug: string): Doc {
  if (kind === "collection") {
    const s = collectionSeo[slug]; const c = allCategories.find((x) => x.slug === slug);
    const base = { name: c?.name ?? "", short: c?.short ?? "", image: c?.image ?? "", imageAlt: "" };
    return s ? { ...s, ...base } : { ...base, title: c?.seoTitle ?? "", description: c?.seoDescription ?? "", h1: c?.name ?? "", intro: c?.intro ? `<p>${esc(c.intro)}</p>` : "", html: "", faqTitle: "", faqs: [] };
  }
  if (kind === "location") { const s = locationSeo[slug]; return s ? { ...s } : { title: "", description: "", h1: "", intro: "", html: "", faqTitle: "", faqs: [], featured: [] }; }
  if (kind === "page") {
    if (slug === "contact") return { title: "Contact Us – WhatsApp Our Florist", description: "", h1: "Contact us", intro: "The fastest way to reach us is WhatsApp. We usually reply within minutes during opening hours.", formTitle: "Send us a message", formText: "Fill this in and tap send. It opens WhatsApp with your message ready." };
    const cp = customPages.find((x) => x.slug === slug);
    if (cp || !slug || !(slug in pageCopy)) return { custom: true, title: cp?.title ?? "", description: cp?.description ?? "", h1: cp?.h1 ?? "", intro: cp?.intro ?? "", html: cp?.html ?? "", faqTitle: cp?.faqTitle ?? "", faqs: cp?.faqs ?? [], image: cp?.image ?? "", imageAlt: cp?.imageAlt ?? "" };
    const s = pageCopy[slug as keyof typeof pageCopy]; return { ...s, html: s.html ?? "", faqs: s.faqs ?? [], faqTitle: s.faqTitle ?? "" };
  }
  const p = posts.find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.description, date: p.date, image: p.image, html: p.html ?? p.sections.map((s) => `<h2>${esc(s.heading)}</h2><p>${esc(s.body)}</p>`).join("") }
    : { title: "", description: "", date: new Date().toISOString().slice(0, 10), image: "/images/site/cover.webp", html: "" };
}

/** Edit category pages, delivery area pages, site pages and blog posts. */
export default function PagesTab({ kinds = ["collection", "location", "page", "post"], startNew = false }: { kinds?: Kind[]; startNew?: boolean } = {}) {
  const [group, setGroup] = useState<Kind>(kinds[0]);
  const [open, setOpen] = useState<Item | null>(startNew && kinds[0] === "post" ? { kind: "post", slug: "", name: "New blog post", path: "" } : null);
  const [q, setQ] = useState("");
  const [drafts, setDrafts] = useState<Item[]>([]);
  const [customDrafts, setCustomDrafts] = useState<Item[]>([]);
  // Posts saved in the admin but not live yet (new or scheduled).
  useEffect(() => {
    (async () => {
      const sb = await loadSupabase();
      const { data: pg } = await sb!.from("content").select("key,data,deleted").eq("kind", "page");
      const liveCustom = new Set(customPages.map((p) => p.slug));
      setCustomDrafts(((pg ?? []) as { key: string; data: { custom?: boolean; h1?: string; title?: string }; deleted: boolean }[])
        .filter((r) => r.data?.custom && !r.deleted && !liveCustom.has(r.key.slice(5)))
        .map((r) => ({ kind: "page" as const, slug: r.key.slice(5), name: `${r.data.h1 || r.data.title} · not published yet`, path: `/${r.key.slice(5)}` })));
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
    page: [
      ...(Object.keys(pageNames) as (keyof typeof pageNames)[]).map((k) => ({ kind: "page" as const, slug: k, name: pageNames[k], path: pagePaths[k] })),
      ...customPages.map((p) => ({ kind: "page" as const, slug: p.slug, name: p.h1 || p.title, path: `/${p.slug}` })),
      ...customDrafts,
    ],
    post: [...drafts, ...posts.map((p) => ({ kind: "post" as const, slug: p.slug, name: p.title, path: `/blog/${p.slug}` }))],
  };
  if (open?.kind === "post") return <PostEditor slug={open.slug} onClose={() => setOpen(null)} />;
  if (open?.kind === "page" && open.slug === "hero") return <HeroEditor onClose={() => setOpen(null)} />;
  if (open) return <PageEditor item={open} onClose={() => setOpen(null)} />;
  const list = items[group].filter((i) => i.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      {kinds.length > 1 && <div className="flex flex-wrap gap-2">
        {([["collection", "Categories"], ["location", "City pages"], ["page", "Site pages"], ["post", "Blog posts"]] as const).filter(([k]) => kinds.includes(k)).map(([k, l]) => (
          <button key={k} onClick={() => setGroup(k)} className={`btn !py-2 !px-4 text-sm ${group === k ? "btn-primary" : "btn-outline"}`}>{l} ({items[k].length})</button>
        ))}
      </div>}
      <div className="flex flex-wrap gap-3 justify-between">
        <input className="input max-w-xs" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
        {group === "post" && <button onClick={() => setOpen({ kind: "post", slug: "", name: "New blog post", path: "" })} className="btn btn-primary"><Plus className="w-4 h-4" /> New blog post</button>}
        {group === "page" && <button onClick={() => setOpen({ kind: "page", slug: "", name: "New page", path: "" })} className="btn btn-primary"><Plus className="w-4 h-4" /> Add page</button>}
        {group === "collection" && <button onClick={() => setOpen({ kind: "collection", slug: "", name: "New category", path: "" })} className="btn btn-primary"><Plus className="w-4 h-4" /> Add category</button>}
      </div>
      <div className={`${card} divide-y divide-blush-2/60`}>
        {list.map((i) => (
          <button key={i.slug} onClick={() => setOpen(i)} className="w-full text-left px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-blush/40">
            <span className="flex items-center gap-3">
              {i.kind === "collection" && (() => { const c = allCategories.find((x) => x.slug === i.slug); return c ? <img src={c.image} alt="" className="w-10 h-10 rounded-full object-cover" /> : null; })()}
              <span><span className="font-semibold text-ink">{i.name}</span><span className="block text-xs text-muted">{i.path}{i.kind === "collection" ? ` · ${products.filter((p) => p.categories.includes(i.slug)).length} products` : ""}</span></span>
            </span>
            <span className="flex items-center gap-3 shrink-0">
              {i.slug !== "hero" && i.kind !== "post" && (() => { const d = current(i.kind, i.slug); return <ScorePill score={seoChecks({ keyword: d.keyword ?? "", title: d.title, description: d.description, slug: i.path.replace(/^\//, ""), h1: d.h1 ?? d.name ?? "", html: `${d.intro ?? ""}${d.html ?? ""}`, faqs: [...(d.faqs ?? []), ...(d.groups ?? []).flatMap((g) => g.faqs)] }).score} />; })()}
              <Pencil className="w-4 h-4 text-brand" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function PageEditor({ item, onClose }: { item: Item; onClose: () => void }) {
  const isNewPost = !item.slug;
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
    const s = isNewPost ? (slug || d.name || d.h1 || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : item.slug;
    if (item.kind === "page" && d.custom) {
      if (!d.h1?.trim()) return setMsg({ kind: "err", text: "Please add the page heading." });
      if (isNewPost && (RESERVED.includes(s) || customPages.some((p) => p.slug === s))) return setMsg({ kind: "err", text: "This web address is already used. Please choose another." });
      d.title = d.title.trim() || `${d.h1} | BikaFlora`.slice(0, 60);
      d.description = d.description.trim() || (d.intro ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 155);
    }
    if (item.kind === "collection" && !d.name?.trim()) return setMsg({ kind: "err", text: "Please add the category name." });
    if (!s) return setMsg({ kind: "err", text: "Please add a web address." });
    if (isNewPost && allCategories.some((c) => c.slug === s)) return setMsg({ kind: "err", text: "A category with this web address already exists." });
    // Auto-fill SEO and headings when left empty.
    if (item.kind === "collection") {
      d.title = d.title.trim() || `Buy ${d.name} Online in KL | BikaFlora`.slice(0, 60);
      d.description = d.description.trim() || `Shop ${d.name} from BikaFlora. Handmade bouquets with same-day delivery across KL & Selangor.`;
      d.h1 = d.h1?.trim() || d.name;
      d.imageAlt = d.imageAlt?.trim() || `${d.name} by BikaFlora`;
    }
    if (!d.title.trim()) return setMsg({ kind: "err", text: "Please add a meta title." });
    setBusy(true); setMsg(null);
    const sb = await loadSupabase();
    const data = { ...d, faqs: d.faqs?.filter((x) => x.q && x.a), groups: d.groups?.map((g) => ({ ...g, faqs: g.faqs.filter((x) => x.q && x.a) })) };
    const { error } = await sb!.from("content").upsert({ key: `${item.kind}:${s}`, kind: item.kind, data, deleted: false, updated_at: new Date().toISOString() });
    setBusy(false);
    if (error) return setMsg({ kind: "err", text: `Not saved: ${error.message}` });
    if (isNewPost) setSlug(s);
    setMsg({ kind: "ok", text: "Saved. Press “Publish changes” to put it live." });
  };
  const removePage = async () => {
    if (!window.confirm(`Delete the page "${d.h1}"? It disappears after you publish.`)) return;
    const sb = await loadSupabase();
    const { error } = await sb!.from("content").upsert({ key: `page:${item.slug}`, kind: "page", data: { custom: true }, deleted: true, updated_at: new Date().toISOString() });
    setMsg(error ? { kind: "err", text: error.message } : { kind: "ok", text: "Page deleted. Press “Publish changes” to remove it from the website." });
  };
  const removeCategory = async () => {
    if (!window.confirm(`Remove the category "${d.name}"? Its page disappears after you publish. Products stay on the website.`)) return;
    const sb = await loadSupabase();
    const { error } = await sb!.from("content").upsert({ key: `collection:${item.slug}`, kind: "collection", data: {}, deleted: true, updated_at: new Date().toISOString() });
    setMsg(error ? { kind: "err", text: error.message } : { kind: "ok", text: "Category removed. Press “Publish changes” to update the website." });
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
          {item.kind === "page" && d.custom && !isNewPost && <button onClick={removePage} className="btn !py-2 text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /> Delete page</button>}
          {item.kind === "collection" && !isNewPost && <button onClick={removeCategory} className="btn !py-2 text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /> Remove category</button>}
          <button onClick={save} disabled={busy} className="btn btn-primary !py-2">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save</button>
        </div>
      </div>
      <div><h2 className="text-2xl font-semibold">{item.name}</h2>{item.path && <a href={item.path} target="_blank" rel="noopener" className="text-sm text-brand hover:underline">{item.path}</a>}</div>
      {msg && <Note kind={msg.kind}>{msg.text}</Note>}

      {item.kind === "collection" && (
        <section className={sec}>
          <h3 className="text-xl font-semibold">Category</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Category name *" value={d.name ?? ""} onChange={(v) => set({ name: v })} />
            {isNewPost
              ? <Field label="Web address" value={slug || (d.name ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")} onChange={(v) => setSlug(v.toLowerCase().replace(/[^a-z0-9]+/g, "-"))} hint={`bikaflora.my/category/${slug || (d.name ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "…"}`} />
              : <Field label="Short line (under the name in menus)" value={d.short ?? ""} onChange={(v) => set({ short: v })} />}
          </div>
          {isNewPost && <Field label="Short line (under the name in menus)" value={d.short ?? ""} onChange={(v) => set({ short: v })} />}
          <SingleImage label="Category image (round photo on the homepage)" src={d.image ?? ""} alt={d.imageAlt ?? ""} folder="categories" name={d.name || "category"} onChange={(image, imageAlt) => set({ image, imageAlt })} />
          <p className="text-xs text-muted">A new category shows on the website once at least one product is in it (tick it in the product editor).</p>
        </section>
      )}
      {item.kind === "page" && d.custom && (
        <section className={sec}>
          <h3 className="text-xl font-semibold">Page</h3>
          <Field label="Page heading *" value={d.h1 ?? ""} onChange={(v) => set({ h1: v })} />
          {isNewPost
            ? <Field label="Web address" value={slug || (d.h1 ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")} onChange={(v) => setSlug(v.toLowerCase().replace(/[^a-z0-9]+/g, "-"))} hint={`bikaflora.my/${slug || (d.h1 ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "…"}`} />
            : <p className="text-sm text-muted">Web address: bikaflora.my/{item.slug}</p>}
          <p className="text-xs text-muted">To show this page in the menu or footer, tell your developer, or add a link to it from another page’s content.</p>
        </section>
      )}
      {item.kind === "location" && (
        <section className={sec}>
          <h3 className="text-xl font-semibold">Top photo</h3>
          <SingleImage label="City photo behind the heading" src={d.image ?? ""} alt={d.imageAlt ?? ""} folder="cities" name={item.name} onChange={(image, imageAlt) => set({ image, imageAlt })} hint="Leave empty to keep the current photo. Best size: wide photo, 1600 px." />
        </section>
      )}
      {item.kind === "page" && item.slug !== "home" && item.slug !== "contact" && (
        <section className={sec}>
          <h3 className="text-xl font-semibold">Side photo</h3>
          <SingleImage label="Photo in the right-hand column" src={d.image ?? ""} alt={d.imageAlt ?? ""} folder="pages" name={item.name} onChange={(image, imageAlt) => set({ image, imageAlt })} hint="Leave empty to keep the current photo." />
        </section>
      )}

      <section className={sec}>
        <h3 className="text-xl font-semibold">SEO</h3>
        <Field label="Meta title" value={d.title} max={60} onChange={(v) => set({ title: v })} hint={item.kind === "collection" ? "Auto if empty." : undefined} />
        <Field label="Meta description" value={d.description} max={160} rows={2} onChange={(v) => set({ description: v })} />
        <KeywordsField value={d.keyword ?? ""} onChange={(v) => set({ keyword: v })} />
        <div className="pt-2 border-t border-blush-2/60"><SeoScore keyword={d.keyword ?? ""} title={d.title} description={d.description} slug={item.slug || slug} h1={d.h1 ?? d.name ?? ""} html={`${d.intro ?? ""}${d.html ?? ""}`} faqs={[...(d.faqs ?? []), ...(d.groups ?? []).flatMap((g) => g.faqs)]} /></div>
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
          {!d.custom && <Field label="Main heading (H1)" value={d.h1 ?? ""} onChange={(v) => set({ h1: v })} />}
          <div><span className="label">Intro</span><RichText small value={d.intro ?? ""} onChange={(v) => set({ intro: v })} /></div>
          {item.slug === "contact" && <>
            <Field label="Form heading" value={d.formTitle ?? ""} onChange={(v) => set({ formTitle: v })} />
            <Field label="Form note" value={d.formText ?? ""} rows={2} onChange={(v) => set({ formText: v })} />
          </>}
          {!isFaqPage && item.slug !== "contact" && <div><span className="label">Main content</span><RichText value={d.html ?? ""} onChange={(v) => set({ html: v })} />
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

      {item.kind !== "post" && item.slug !== "contact" && (
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
