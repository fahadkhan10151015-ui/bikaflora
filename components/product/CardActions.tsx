"use client";
import { Check, Plus } from "lucide-react";
import type { Product } from "@/data/products";
import { waLink, productMessages } from "@/lib/whatsapp";
import { useAuth, displayName } from "@/components/auth/AuthProvider";
import { useOrderList } from "@/components/order/OrderListProvider";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppIcon";

/** Two buttons on every product card: order this one now, or add it to a multi-item order list. */
export default function CardActions({ p }: { p: Product }) {
  const { user } = useAuth();
  const list = useOrderList();
  const option = p.options?.[0];
  const price = option?.price ?? p.price;
  const added = list.has(p.slug);

  const orderNow = waLink(
    productMessages(
      { name: p.name, sku: p.sku, slug: p.slug, price, size: option?.label },
      "Please advise (Same-day Express or Scheduled)",
      user ? { name: displayName(user), email: user.email } : undefined,
    )[0].text,
  );

  return (
    <div className="mt-3 flex gap-2">
      <a href={orderNow} target="_blank" rel="noopener"
        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-wa text-white text-[13px] sm:text-sm font-semibold py-2.5 hover:brightness-95 transition">
        <WhatsAppIcon className="w-4 h-4" /> Order now
      </a>
      <button type="button" onClick={() => { list.add({ slug: p.slug, size: option?.label, price }); list.open(); }}
        title={added ? "Added to your order list — tap to add one more" : "Add to order list"}
        aria-label={added ? `Add one more ${p.name} to your order list` : `Add ${p.name} to your order list`}
        className={`w-10 h-10 shrink-0 rounded-full grid place-items-center border transition ${added ? "bg-brand text-white border-brand" : "border-brand/30 text-brand hover:bg-blush"}`}>
        {added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </button>
    </div>
  );
}
