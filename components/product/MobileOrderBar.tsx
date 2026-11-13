"use client";
import type { Product } from "@/data/products";
import { deliveryMethods, formatPrice } from "@/lib/site";
import { productMessages } from "@/lib/whatsapp";
import { useWhatsAppChooser } from "@/components/whatsapp/WhatsAppChooser";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppIcon";
import { useVariant } from "./VariantProvider";

/** Sticky bottom bar on mobile product pages. */
export default function MobileOrderBar({ p }: { p: Product }) {
  const open = useWhatsAppChooser();
  const d = deliveryMethods[0];
  const { variant } = useVariant();
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-blush-2 px-4 py-3 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{p.name}{variant ? ` · ${variant.label}` : ""}</div>
        <div className="text-brand font-semibold">{formatPrice(p.price)}</div>
      </div>
      <button type="button" className="btn btn-wa !py-2.5"
        onClick={() => open({ title: p.name, subtitle: variant?.label, options: productMessages({ name: p.name, sku: p.sku, slug: p.slug, price: p.price, colour: variant?.label }, `${d.label} or Pre-order (please advise)`) })}>
        <WhatsAppIcon className="w-5 h-5" /> WhatsApp
      </button>
    </div>
  );
}
