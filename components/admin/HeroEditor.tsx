"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, Save, Loader2, RotateCcw } from "lucide-react";
import { heroDefaults } from "@/components/sections/HeroSlider";
import { loadSupabase } from "@/lib/supabase-config";
import { Field, SingleImage } from "./fields";
import { card, Note } from "./ui";

type Slide = { eyebrow: string; title1: string; title2: string; text: string; image?: string; alt?: string };

/** Edit the homepage hero: the video slide text and each bouquet slide (text + photo). */
export default function HeroEditor({ onClose }: { onClose: () => void }) {
  const [video, setVideo] = useState<Slide>({ ...heroDefaults.video, title1: heroDefaults.video.title[0], title2: heroDefaults.video.title[1] });
  const [slides, setSlides] = useState<Slide[]>(heroDefaults.slides);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      const sb = await loadSupabase();
      const { data } = await sb!.from("content").select("data").eq("key", "page:hero").maybeSingle();
      const d = data?.data as { video?: Partial<Slide>; slides?: Partial<Slide>[] } | undefined;
      if (d?.video) setVideo((v) => ({ ...v, ...d.video }));
      if (d?.slides) setSlides((s) => s.map((x, i) => ({ ...x, ...(d.slides![i] ?? {}) })));
    })();
  }, []);

  const save = async () => {
    setBusy(true); setMsg(null);
    const sb = await loadSupabase();
    const { error } = await sb!.from("content").upsert({ key: "page:hero", kind: "page", data: { video, slides }, deleted: false, updated_at: new Date().toISOString() });
    setBusy(false);
    setMsg(error ? { kind: "err", text: `Not saved: ${error.message}` } : { kind: "ok", text: "Saved. Press “Publish changes” to put it live." });
  };
  const reset = async () => {
    if (!window.confirm("Go back to the original hero text and photos?")) return;
    const sb = await loadSupabase();
    await sb!.from("content").delete().eq("key", "page:hero");
    setVideo({ ...heroDefaults.video, title1: heroDefaults.video.title[0], title2: heroDefaults.video.title[1] });
    setSlides(heroDefaults.slides);
    setMsg({ kind: "ok", text: "Reset. Press “Publish changes” to put the original back." });
  };

  const slideFields = (s: Slide, onChange: (p: Partial<Slide>) => void) => (
    <div className="grid sm:grid-cols-2 gap-4">
      <Field label="Small line above the title" value={s.eyebrow} onChange={(v) => onChange({ eyebrow: v })} />
      <div />
      <Field label="Title (white)" value={s.title1} onChange={(v) => onChange({ title1: v })} />
      <Field label="Title (pink, second line)" value={s.title2} onChange={(v) => onChange({ title2: v })} />
      <div className="sm:col-span-2"><Field label="Text" rows={2} value={s.text} onChange={(v) => onChange({ text: v })} /></div>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={onClose} className="inline-flex items-center gap-1 text-brand font-semibold"><ArrowLeft className="w-4 h-4" /> Back</button>
        <div className="flex gap-2">
          <button onClick={reset} className="btn btn-outline !py-2"><RotateCcw className="w-4 h-4" /> Reset</button>
          <button onClick={save} disabled={busy} className="btn btn-primary !py-2">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save</button>
        </div>
      </div>
      <h2 className="text-2xl font-semibold">Homepage hero slides</h2>
      <p className="text-sm text-muted">The big banner at the top of the homepage. The first title is the page’s main heading (H1), so keep your main keyword in it.</p>
      {msg && <Note kind={msg.kind}>{msg.text}</Note>}

      <section className={`${card} p-5 sm:p-6 space-y-4`}>
        <h3 className="text-xl font-semibold">Slide 1 · Florist video</h3>
        {slideFields(video, (p) => setVideo((v) => ({ ...v, ...p })))}
      </section>
      {slides.map((s, i) => (
        <section key={i} className={`${card} p-5 sm:p-6 space-y-4`}>
          <h3 className="text-xl font-semibold">Slide {i + 2} · Bouquet</h3>
          {slideFields(s, (p) => setSlides((all) => all.map((x, j) => (j === i ? { ...x, ...p } : x))))}
          <SingleImage label="Bouquet photo" src={s.image ?? ""} alt={s.alt ?? ""} folder="hero" name={s.title1 || "hero"} hint="Best: a bouquet photo with a see-through (transparent) background, PNG or WebP."
            onChange={(image, alt) => setSlides((all) => all.map((x, j) => (j === i ? { ...x, image: image || heroDefaults.slides[i].image, alt } : x)))} />
        </section>
      ))}
      <div className="flex justify-end"><button onClick={save} disabled={busy} className="btn btn-primary">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save</button></div>
    </div>
  );
}
