"use client";
import { useState } from "react";
import { Zap, CalendarClock, Check, Plus } from "lucide-react";
import { useOrderList } from "@/components/order/OrderListProvider";
import Stars from "./Stars";
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
  const [opt, setOpt] = useState(0);
  const preorderOnly = p.categories.includes("pre-order") && !p.categories.includes("best-seller");
  const [delivery, setDelivery] = useState<DeliveryMethodId>(preorderOnly ? "preorder" : "instant");

  const option = p.options?.[opt];
  const price = option?.price ?? p.price;
  const method = deliveryMethods.find((d) => d.id === delivery)!;

  const openWhatsApp = () =>
    openChooser({
      title: p.name,
      subtitle: `${option ? `${option.label} · ` : ""}${formatPrice(price)} · ${method.label}`,
      options: productMessages(
        { name: p.name, sku: p.sku, slug: p.slug, price, size: option?.label },
        `${method.label} (${method.detail})`,
        user ? { name: displayName(user), email: user.email } : undefined,
      ),
    });

  return (
    <div className="space-y-6">
      <Stars rating={p.rating} reviews={p.reviews} className="!text-sm" />
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-semibold text-brand">{formatPrice(price)}</span>
        {p.compareAt && opt === 0 && <span className="text-muted line-through">{formatPrice(p.compareAt)}</span>}
      </div>

      {p.options && (
        <fieldset>
          <legend className="label">Choose size</legend>
          <div className="flex flex-wrap gap-2">
            {p.options.map((o, i) => (
              <button key={o.label} type="button" onClick={() => setOpt(i)} aria-pressed={i === opt}
                className={`px-4 py-2 rounded-full border text-sm transition ${i === opt ? "bg-brand text-white border-brand" : "bg-white border-blush-2 hover:border-brand"}`}>
                {o.label} · {formatPrice(o.price)}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset>
        <legend className="label">How would you like it?</legend>
        <div className="grid sm:grid-cols-2 gap-3">
          {deliveryMethods.filter((d) => !(preorderOnly && d.id === "instant")).map((d) => {
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
        <button type="button" onClick={() => { list.add({ slug: p.slug, size: option?.label, price }); list.open(); }} className="btn btn-outline !py-3.5">
          <Plus className="w-5 h-5" /> Add to order list
        </button>
        <p className="text-xs text-muted text-center">Ordering more than one item? Add them to your order list and send everything in one WhatsApp message. {paymentNote}</p>
      </div>
    </div>
  );
}
