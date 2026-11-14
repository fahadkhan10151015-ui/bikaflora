"use client";
import { useState } from "react";
import { useEffect } from "react";
import { Zap, CalendarClock, Check, Plus, Palette, Mail, ShoppingBag } from "lucide-react";
import { useOrderList } from "@/components/order/OrderListProvider";
import Stars from "./Stars";
import { useVariant } from "./VariantProvider";
import { isAddOn, type Product } from "@/data/products";
import { deliveryMethods, formatPrice, paymentNote, type DeliveryMethodId } from "@/lib/site";
import { productMessages } from "@/lib/whatsapp";
import { useAuth, displayName } from "@/components/auth/AuthProvider";
import { useWhatsAppChooser } from "@/components/whatsapp/WhatsAppChooser";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppIcon";

const deliveryIcons = { instant: Zap, preorder: CalendarClock };

/** Extras offered with every bouquet. */
const cardOptions = [
  { id: "handwritten", label: "Handwritten card", note: "We write your message" },
  { id: "blank", label: "Blank card", note: "Write it yourself" },
  { id: "none", label: "No card", note: "" },
] as const;
const BAG_PRICE = 6;
type CardId = (typeof cardOptions)[number]["id"];

function Choice({ on, onClick, title, note, warn }: { on: boolean; onClick: () => void; title: string; note?: string; warn?: boolean }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on}
      className={`relative text-left rounded-2xl border-2 px-3.5 py-3 transition ${on ? "border-brand bg-blush/60" : "border-blush-2 bg-white hover:border-brand/50"}`}>
      <span className={`block text-sm font-semibold ${warn ? "text-ink" : ""}`}>{title}</span>
      {note && <span className={`block text-xs mt-0.5 ${warn ? "text-red-700" : "text-muted"}`}>{note}</span>}
      {on && <Check className="absolute top-2.5 right-2.5 w-4 h-4 text-brand" />}
    </button>
  );
}

export default function OrderPanel({ p }: { p: Product }) {
  const { user } = useAuth();
  const openChooser = useWhatsAppChooser();
  const list = useOrderList();
  const { variant, setVariant, paper, setPaper } = useVariant();
  // A custom wrapping colour is made to order, so it is pre-order only.
  const methods = deliveryMethods.filter((d) => (d.id === "instant" ? p.instant && !paper : p.preorder));
  const [delivery, setDelivery] = useState<DeliveryMethodId>(methods[0]?.id ?? "preorder");
  useEffect(() => { if (paper) setDelivery("preorder"); }, [paper]);

  const extrasOn = !isAddOn(p);
  const [card, setCard] = useState<CardId>("handwritten");
  const [cardMsg, setCardMsg] = useState("");
  const [bag, setBag] = useState(false);
  const price = p.price + (extrasOn && bag ? BAG_PRICE : 0);
  const cardLabel = cardOptions.find((c) => c.id === card)!.label;
  const extras = extrasOn
    ? [
        `Card: ${cardLabel}${card === "handwritten" && cardMsg.trim() ? ` – "${cardMsg.trim()}"` : ""}`,
        bag ? `Protection bag: Yes (+${formatPrice(BAG_PRICE)})` : "Protection bag: No",
      ]
    : [];
  const method = deliveryMethods.find((d) => d.id === delivery)!;
  const colour = variant?.label;

  const openWhatsApp = () =>
    openChooser({
      title: p.name,
      subtitle: `${colour ? `${colour} · ` : ""}${paper ? `${paper.label} paper · ` : ""}${formatPrice(price)} · ${method.label}`,
      options: productMessages(
        { name: p.name, sku: p.sku, slug: p.slug, price, colour, paper: paper?.label, extras },
        `${method.label} (${method.detail})`,
        user ? { name: displayName(user), email: user.email } : undefined,
      ),
    });

  return (
    <div className="space-y-6">
      <Stars slug={p.slug} className="!text-sm" />
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
        <span className="text-3xl font-semibold text-brand">{formatPrice(p.price)}</span>
        {p.compareAt && (
          <>
            <span className="text-muted line-through">{formatPrice(p.compareAt)}</span>
            <span className="self-center bg-petal/60 text-deep text-xs font-bold px-2.5 py-1 rounded-full">
              Save {formatPrice(p.compareAt - p.price)} ({Math.round((1 - p.price / p.compareAt) * 100)}% off)
            </span>
          </>
        )}
      </div>

      {p.variants && (
        <fieldset>
          <legend className="label">Colour: <span className="font-normal text-muted">{colour}</span></legend>
          <div className="flex flex-wrap gap-2">
            {p.variants.map((v) => {
              const on = v.id === variant?.id;
              return (
                <button key={v.id} type="button" onClick={() => setVariant(v.id)} aria-pressed={on}
                  className={`flex items-center gap-2 pl-2 pr-4 py-2 rounded-full border-2 text-sm font-medium transition ${on ? "border-brand bg-blush/60" : "border-blush-2 bg-white hover:border-brand/50"}`}>
                  <span className="w-6 h-6 rounded-full ring-2 ring-white shadow" style={{ background: v.swatch }} />
                  {v.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {p.paperColours && (
        <fieldset>
          <legend className="label flex items-center gap-1.5"><Palette className="w-4 h-4 text-gold" /> Wrapping paper colour <span className="font-normal text-muted text-xs">(other colours are pre-order)</span></legend>
          <div className="flex flex-wrap gap-3">
            {p.paperColours.map((c) => {
              const on = c.image ? paper?.id === c.id : !paper;
              const name = c.image ? c.label : "Original";
              return (
                <button key={c.id} type="button" onClick={() => setPaper(c.image ? c.id : undefined)} aria-pressed={on} title={c.label}
                  className="group flex flex-col items-center gap-1.5 w-[60px]">
                  <span className={`relative w-12 h-12 rounded-full transition ring-offset-2 ring-offset-cream ${on ? "ring-2 ring-brand scale-105" : "ring-1 ring-black/10 group-hover:scale-105"}`} style={{ background: c.swatch }}>
                    {on && <Check className={`absolute inset-0 m-auto w-5 h-5 ${["#26262c", "#1d1d22", "#2a56b8"].includes(c.swatch) ? "text-white" : "text-ink"}`} />}
                  </span>
                  <span className={`text-xs ${on ? "font-semibold text-ink" : "text-muted"}`}>{name}</span>
                </button>
              );
            })}
          </div>
          {paper && (
            <p className="mt-3 text-xs rounded-xl bg-blush/60 px-3 py-2 gallery-in" key={paper.id}>
              <b>{paper.label}</b> wrapping is shown in the photo above. Custom colours are made to order, so this will be a <b>Pre-order</b>.
            </p>
          )}
        </fieldset>
      )}

      <fieldset>
        <legend className="label">How would you like it?</legend>
        <div className="grid sm:grid-cols-2 gap-3">
          {methods.map((d) => {
            const Icon = deliveryIcons[d.id];
            const active = d.id === delivery;
            return (
              <button key={d.id} type="button" onClick={() => setDelivery(d.id)} aria-pressed={active}
                className={`relative text-left rounded-2xl border-2 p-4 transition ${active ? "border-brand bg-blush/60" : "border-blush-2 bg-white hover:border-brand/50"}`}>
                <Icon className={`w-5 h-5 mb-2 ${active ? "text-brand" : "text-muted"}`} />
                <span className="block font-semibold">{d.label}</span>
                <span className="block text-xs text-muted mt-0.5">{d.detail}</span>
                {active && <Check className="absolute top-3 right-3 w-5 h-5 text-brand" />}
              </button>
            );
          })}
        </div>
      </fieldset>

      {extrasOn && (
        <>
          <fieldset>
            <legend className="label"><span className="inline-flex items-center gap-1.5"><Mail className="w-4 h-4 text-gold" /> Gift card</span></legend>
            <div className="grid grid-cols-3 gap-2">
              {cardOptions.map((c) => <Choice key={c.id} on={card === c.id} onClick={() => setCard(c.id)} title={c.label} note={c.note} />)}
            </div>
            {card === "handwritten" && (
              <textarea value={cardMsg} onChange={(e) => setCardMsg(e.target.value)} maxLength={200} rows={2} className="input mt-2.5 text-sm"
                placeholder="Your card message, e.g. Happy birthday sayang! Love, Adam" aria-label="Card message" />
            )}
          </fieldset>
          <fieldset>
            <legend className="label"><span className="inline-flex items-center gap-1.5"><ShoppingBag className="w-4 h-4 text-gold" /> Bouquet protection bag</span></legend>
            <div className="grid grid-cols-2 gap-2">
              <Choice on={bag} onClick={() => setBag(true)} title={`Add bag (+${formatPrice(BAG_PRICE)})`} note="Clear bag with handles, keeps it safe" />
              <Choice on={!bag} onClick={() => setBag(false)} title="No bag" note="Risky: bouquet may get damaged" warn />
            </div>
          </fieldset>
        </>
      )}

      {price !== p.price && (
        <div className="flex items-center justify-between rounded-2xl bg-white border border-blush-2 px-4 py-3">
          <span className="text-sm text-muted">Total with bag</span>
          <span className="text-xl font-semibold text-brand">{formatPrice(price)}</span>
        </div>
      )}

      <div className="grid gap-3">
        <button type="button" onClick={openWhatsApp} className="btn btn-wa !py-4 text-base shadow-lg shadow-wa/25">
          <WhatsAppIcon className="w-6 h-6" /> Order on WhatsApp
        </button>
        <button type="button" onClick={() => { list.add({ slug: p.slug, size: [colour, paper && `${paper.label} paper (pre-order)`, ...extras].filter(Boolean).join(", ") || undefined, price }); list.open(); }} className="btn btn-outline !py-3.5">
          <Plus className="w-5 h-5" /> Add to order list
        </button>
        <p className="text-xs text-muted text-center">Ordering more than one bouquet? Add them to your order list and send everything in one WhatsApp message. {paymentNote}</p>
      </div>
    </div>
  );
}
