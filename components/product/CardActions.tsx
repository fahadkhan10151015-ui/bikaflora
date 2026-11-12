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
    <div className="mt-2 sm:mt-3 flex gap-1.5 sm:gap-2">
      <a href={orderNow} target="_blank" rel="noopener"
        className="flex-1 min-w-0 inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-full bg-wa text-white text-xs sm:text-sm font-semibold py-2 sm:py-2.5 whitespace-nowrap hover:brightness-95 transition">
        <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> Order now
      </a>
      <button type="button" onClick={() => { list.add({ slug: p.slug, size: option?.label, price }); list.open(); }}
        title={added ? "Added to your order list — tap to add one more" : "Add to order list"}
        aria-label={added ? `Add one more ${p.name} to your order list` : `Add ${p.name} to your order list`}
        className={`w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full grid place-items-center border transition ${added ? "bg-brand text-white border-brand" : "border-brand/30 text-brand hover:bg-blush"}`}>
        {added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </button>
    </div>
  );
}
