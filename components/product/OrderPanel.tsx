"use client";
import { useState } from "react";
import { Zap, CalendarClock, Check, Plus } from "lucide-react";
import { useOrderList } from "@/components/order/OrderListProvider";
import Stars from "./Stars";
import { useVariant } from "./VariantProvider";
import type { Product } from "@/data/products";
import { deliveryMethods, formatPrice, paymentNote, type DeliveryMethodId } from "@/lib/site";
import { productMessages } from "@/lib/whatsapp";
import { useAuth, displayName } from "@/components/auth/AuthProvider";
import { useWhatsAppChooser } from "@/components/whatsapp/WhatsAppChooser";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppIcon";

const deliveryIcons = { instant: Zap, preorder: CalendarClock };

export default function OrderPanel({ p }: { p: Product }) {
  const { user } = useAuth();
  const openChooser = useWhatsAppChooser();
  const list = useOrderList();
  const { variant, setVariant } = useVariant();
  const methods = deliveryMethods.filter((d) => (d.id === "instant" ? p.instant : p.preorder));
  const [delivery, setDelivery] = useState<DeliveryMethodId>(methods[0]?.id ?? "preorder");

  const price = p.price;
  const method = deliveryMethods.find((d) => d.id === delivery)!;
  const colour = variant?.label;

  const openWhatsApp = () =>
    openChooser({
      title: p.name,
      subtitle: `${colour ? `${colour} · ` : ""}${formatPrice(price)} · ${method.label}`,
      options: productMessages(
        { name: p.name, sku: p.sku, slug: p.slug, price, colour },
        `${method.label} (${method.detail})`,
        user ? { name: displayName(user), email: user.email } : undefined,
      ),
    });

  return (
    <div className="space-y-6">
      <Stars slug={p.slug} className="!text-sm" />
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
        <span className="text-3xl font-semibold text-brand">{formatPrice(price)}</span>
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

      <div className="grid gap-3">
        <button type="button" onClick={openWhatsApp} className="btn btn-wa !py-4 text-base shadow-lg shadow-wa/25">
          <WhatsAppIcon className="w-6 h-6" /> Order on WhatsApp
        </button>
        <button type="button" onClick={() => { list.add({ slug: p.slug, size: colour, price }); list.open(); }} className="btn btn-outline !py-3.5">
          <Plus className="w-5 h-5" /> Add to order list
        </button>
        <p className="text-xs text-muted text-center">Ordering more than one bouquet? Add them to your order list and send everything in one WhatsApp message. {paymentNote}</p>
      </div>
    </div>
  );
}
