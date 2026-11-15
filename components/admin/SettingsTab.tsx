"use client";
import { useEffect, useMemo, useState } from "react";
import { Loader2, Save, Phone, Share2, Megaphone, Menu, PanelBottom, Clock, Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";
import { site, menuLinks, footerShopLinks, footerHelpLinks, footerAreaSlugs, menuAreaSlugs, announcement, defaultCutoff, type NavLink, type AnnouncementItem } from "@/lib/site";
import { allLocations } from "@/data/locations";
import { announcementIcons } from "@/components/layout/AnnouncementBar";
import { card, Note } from "./ui";
import { Field, IconBtn, move } from "./fields";
import LinkList from "./LinkList";
import { loadDoc, saveDoc } from "./doc";
import { sitePaths } from "./sitePaths";

type S = {
  whatsapp: string; phoneDisplay: string; email: string; openingHours: string;
  instagram: string; facebook: string; tiktok: string;
  menu: NavLink[]; menuAreas: string[]; footerShop: NavLink[]; footerHelp: NavLink[]; footerAreas: string[];
  announcement: AnnouncementItem[]; cutoff: string;
};

const defaults = (): S => ({
  whatsapp: site.whatsapp, phoneDisplay: site.phoneDisplay, email: site.email, openingHours: site.openingHours,
  instagram: site.social.instagram, facebook: site.social.facebook, tiktok: site.social.tiktok,
  menu: menuLinks, menuAreas: menuAreaSlugs, footerShop: footerShopLinks, footerHelp: footerHelpLinks, footerAreas: footerAreaSlugs,
  announcement, cutoff: defaultCutoff,
});

function Section({ icon: I, title, help, children }: { icon: typeof Phone; title: string; help?: string; children: React.ReactNode }) {
  return (
    <section className={`${card} p-5 sm:p-6`}>
      <div className="flex items-start gap-3">
        <span className="w-9 h-9 rounded-xl bg-blush text-brand grid place-items-center shrink-0"><I className="w-[18px] h-[18px]" /></span>
        <div><h3 className="font-semibold text-ink text-lg leading-tight">{title}</h3>{help && <p className="text-sm text-muted">{help}</p>}</div>
      </div>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

/** Pick areas by tapping them; the order you tap is the order shown. */
function AreaPicker({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const list = allLocations.filter((l) => !l.hidden);
  return (
    <div className="flex flex-wrap gap-2">
      {list.map((l) => {
        const i = value.indexOf(l.slug);
        return (
          <button key={l.slug} type="button" onClick={() => onChange(i >= 0 ? value.filter((s) => s !== l.slug) : [...value, l.slug])}
            className={`rounded-full px-3 py-1.5 text-sm border transition ${i >= 0 ? "bg-brand text-white border-brand" : "border-[#e6e1d8] text-ink hover:bg-blush"}`}>
            {i >= 0 && <b className="mr-1">{i + 1}.</b>}{l.name}
          </button>
        );
      })}
    </div>
  );
}

/** Admin → Site settings: contact details, social links, top bar, menu and footer. */
export default function SettingsTab() {
  const [s, setS] = useState<S | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const pages = useMemo(() => sitePaths(), []);
  const [loadErr, setLoadErr] = useState("");
  useEffect(() => { loadDoc<Partial<S>>("settings").then((d) => setS({ ...defaults(), ...(d ?? {}) })).catch((e) => { setLoadErr(String(e.message || e)); setS(defaults()); }); }, []);
  if (!s) return <p className="text-muted"><Loader2 className="w-4 h-4 animate-spin inline" /> Loading…</p>;
  const set = <K extends keyof S>(k: K, v: S[K]) => setS({ ...s, [k]: v });

  const save = async () => {
    const digits = s.whatsapp.replace(/\D/g, "");
    if (digits.length < 9) return setMsg({ kind: "err", text: "Please check the WhatsApp number. Use the country code and number, for example 60123456789." });
    for (const [k, v] of [["Instagram", s.instagram], ["Facebook", s.facebook], ["TikTok", s.tiktok]]) if (v && !/^https:\/\/[^/]+\/.+/.test(v)) return setMsg({ kind: "err", text: `${k} link should be your full profile link, like https://instagram.com/bikaflora` });
    setBusy(true); setMsg(null);
    const err = await saveDoc("settings", { ...s, whatsapp: digits });
    setBusy(false);
    setMsg(err ? { kind: "err", text: err } : { kind: "ok", text: "Saved. Press “Publish changes” at the top to put it live." });
  };
  const ann = s.announcement;
  const setAnn = (v: AnnouncementItem[]) => set("announcement", v);

  return (
    <div className="space-y-5">
      {loadErr && <Note kind="err">Could not load your saved settings ({loadErr}). Saving is turned off so nothing is overwritten. Please refresh the page.</Note>}
      <Section icon={Phone} title="Contact details" help="Shown in the footer, contact page, chat and Google business info.">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="WhatsApp number *" value={s.whatsapp} onChange={(v) => set("whatsapp", v)} hint="Country code + number, digits only. Example: 60123456789. Every WhatsApp button uses this." />
          <Field label="Phone number as shown" value={s.phoneDisplay} onChange={(v) => set("phoneDisplay", v)} hint="Example: +60 12-345 6789" />
          <Field label="Email" value={s.email} onChange={(v) => set("email", v)} />
          <Field label="Opening hours" value={s.openingHours} onChange={(v) => set("openingHours", v)} hint="Example: Daily, 9:00 AM – 9:00 PM" />
        </div>
      </Section>

      <Section icon={Clock} title="Same-day cut-off time" help="Used on every delivery area page unless an area has its own time (Admin → Delivery areas).">
        <Field label="Order before" value={s.cutoff} onChange={(v) => set("cutoff", v)} placeholder="Leave empty for no cut-off" hint="Example: 6:00 PM. Leave empty if you deliver same-day at any time." />
      </Section>

      <Section icon={Share2} title="Social media" help="Leave empty if you don't use it. Links show in the footer and tell Google these are your profiles.">
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Instagram" value={s.instagram} onChange={(v) => set("instagram", v)} placeholder="https://instagram.com/yourname" />
          <Field label="Facebook" value={s.facebook} onChange={(v) => set("facebook", v)} placeholder="https://facebook.com/yourpage" />
          <Field label="TikTok" value={s.tiktok} onChange={(v) => set("tiktok", v)} placeholder="https://tiktok.com/@yourname" />
        </div>
      </Section>

      <Section icon={Megaphone} title="Top announcement bar" help="The thin scrolling bar above the menu. Write {phone} to show your number. Link: a page like /shop, the word whatsapp, or leave empty.">
        <div className="space-y-2">
          {ann.map((a, i) => (
            <div key={i} className="grid grid-cols-[110px_1fr_160px_auto] max-sm:grid-cols-[1fr_auto] gap-2 items-center">
              <select className="input !py-2" value={a.icon} onChange={(e) => setAnn(ann.map((y, j) => (j === i ? { ...y, icon: e.target.value } : y)))}>
                {Object.keys(announcementIcons).map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
              <input className="input !py-2 max-sm:col-span-2 max-sm:order-first" placeholder="Text" value={a.text} onChange={(e) => setAnn(ann.map((y, j) => (j === i ? { ...y, text: e.target.value } : y)))} />
              <input className="input !py-2" placeholder="Link (optional)" list="ann-pages" value={a.href ?? ""} onChange={(e) => setAnn(ann.map((y, j) => (j === i ? { ...y, href: e.target.value } : y)))} />
              <div className="flex">
                <IconBtn title="Move up" onClick={() => setAnn(move(ann, i, -1))}><ArrowUp className="w-4 h-4" /></IconBtn>
                <IconBtn title="Move down" onClick={() => setAnn(move(ann, i, 1))}><ArrowDown className="w-4 h-4" /></IconBtn>
                <IconBtn title="Remove" danger onClick={() => setAnn(ann.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4" /></IconBtn>
              </div>
            </div>
          ))}
          <datalist id="ann-pages"><option value="whatsapp" />{pages.map((p) => <option key={p} value={p} />)}</datalist>
        </div>
        <button type="button" onClick={() => setAnn([...ann, { icon: "sparkles", text: "" }])} className="text-sm text-brand font-semibold inline-flex items-center gap-1"><Plus className="w-4 h-4" /> Add line</button>
      </Section>

      <Section icon={Menu} title="Main menu" help="Links in the top menu, after “Shop” and “Delivery Areas”.">
        <LinkList items={s.menu} onChange={(v) => set("menu", v)} pages={pages} addLabel="Add menu link" />
        <div>
          <span className="label">Areas in the “Delivery Areas” dropdown</span>
          <p className="text-xs text-muted mb-2">Tap to add or remove. The number shows the order.</p>
          <AreaPicker value={s.menuAreas} onChange={(v) => set("menuAreas", v)} />
        </div>
      </Section>

      <Section icon={PanelBottom} title="Footer" help="The link columns at the bottom of every page.">
        <div><span className="label">Shop Bouquets column</span><LinkList items={s.footerShop} onChange={(v) => set("footerShop", v)} pages={pages} addLabel="Add shop link" /></div>
        <div><span className="label">Help column</span><LinkList items={s.footerHelp} onChange={(v) => set("footerHelp", v)} pages={pages} addLabel="Add help link" /></div>
        <div><span className="label">Flower Delivery column</span><p className="text-xs text-muted mb-2">Tap to add or remove areas.</p><AreaPicker value={s.footerAreas} onChange={(v) => set("footerAreas", v)} /></div>
      </Section>

      <div className="sticky bottom-0 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-[#f6f5f2]/95 backdrop-blur border-t border-[#ebe7df] flex flex-wrap items-center gap-3">
        {msg && <div className="flex-1 min-w-[240px]"><Note kind={msg.kind}>{msg.text}</Note></div>}
        <button onClick={save} disabled={busy || !!loadErr} className="btn btn-primary ml-auto disabled:opacity-50">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save settings</button>
      </div>
    </div>
  );
}
