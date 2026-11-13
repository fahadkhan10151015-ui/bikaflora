"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag, Zap, CalendarClock } from "lucide-react";
import { deliveryMethods, formatPrice, paymentNote, type DeliveryMethodId } from "@/lib/site";
import { multiOrderMessage, waLink } from "@/lib/whatsapp";
import { useAuth, displayName } from "@/components/auth/AuthProvider";
import Photo from "@/components/ui/Photo";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppIcon";
import { useOrderList } from "./OrderListProvider";

const icons = { instant: Zap, preorder: CalendarClock };

/** Slide-in list of everything the customer picked. One tap sends it all in one WhatsApp message. */
export default function OrderListDrawer() {
  const list = useOrderList();
  const { user } = useAuth();
  const [delivery, setDelivery] = useState<DeliveryMethodId>("instant");

  useEffect(() => {
    if (!list.isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && list.close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [list.isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!list.isOpen) return null;
  const method = deliveryMethods.find((d) => d.id === delivery)!;
  const message = multiOrderMessage(
    list.lines.map((l) => ({ name: l.product.name, sku: l.product.sku, slug: l.slug, price: l.price, qty: l.qty, size: l.size })),
    `${method.label} (${method.detail})`,
    user ? { name: displayName(user), email: user.email } : undefined,
  );

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Your order list">
      <button className="absolute inset-0 bg-ink/50 backdrop-blur-sm animate-fade" onClick={list.close} aria-label="Close" />
      <aside className="absolute right-0 top-0 h-full w-full sm:max-w-md bg-cream shadow-2xl flex flex-col animate-slide-in">
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-blush-2">
          <div>
            <h2 className="font-sans text-lg font-semibold flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-brand" /> Your order list</h2>
            <p className="text-xs text-muted">Pick several bouquets, send them in one WhatsApp message.</p>
          </div>
          <button onClick={list.close} className="p-2 rounded-full hover:bg-blush" aria-label="Close"><X className="w-5 h-5" /></button>
        </div>

        {list.lines.length === 0 ? (
          <div className="flex-1 grid place-items-center text-center p-8">
            <div>
              <ShoppingBag className="w-12 h-12 mx-auto text-blush-2" />
              <p className="mt-3 font-semibold">Your list is empty</p>
              <p className="text-sm text-muted mt-1">Tap the <b>+</b> on any bouquet to add it here.</p>
              <Link href="/shop" onClick={list.close} className="btn btn-primary mt-5">Browse bouquets</Link>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto p-4 space-y-3">
              {list.lines.map((l, i) => (
                <li key={`${l.slug}-${l.size}`} className="flex gap-3 bg-white rounded-2xl p-3 border border-blush-2/70">
                  <Link href={`/product/${l.slug}`} onClick={list.close} className="relative w-20 h-24 rounded-xl overflow-hidden shrink-0">
                    <Photo src={(l.product.variants?.find((v) => v.label === l.size)?.images ?? l.product.images)[0]} alt={l.product.name} sizes="80px" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium leading-snug line-clamp-2">{l.product.name}</div>
                    <div className="text-xs text-muted">{l.product.sku}{l.size ? ` · ${l.size}` : ""}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center border border-blush-2 rounded-full">
                        <button className="p-1.5" onClick={() => list.setQty(i, l.qty - 1)} aria-label="Less"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="w-6 text-center text-sm font-semibold">{l.qty}</span>
                        <button className="p-1.5" onClick={() => list.setQty(i, l.qty + 1)} aria-label="More"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                      <span className="font-semibold text-brand">{formatPrice(l.price * l.qty)}</span>
                    </div>
                  </div>
                  <button onClick={() => list.remove(i)} className="self-start p-1 text-muted hover:text-red-600" aria-label={`Remove ${l.product.name}`}><Trash2 className="w-4 h-4" /></button>
                </li>
              ))}
            </ul>

            <div className="bg-white border-t border-blush-2 p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {deliveryMethods.map((d) => {
                  const Icon = icons[d.id];
                  const active = d.id === delivery;
                  return (
                    <button key={d.id} type="button" onClick={() => setDelivery(d.id)} aria-pressed={active}
                      className={`text-left rounded-xl border-2 px-3 py-2 transition ${active ? "border-brand bg-blush/60" : "border-blush-2"}`}>
                      <span className="flex items-center gap-1.5 text-sm font-semibold"><Icon className="w-4 h-4 text-brand" /> {d.label}</span>
                      <span className="block text-[11px] text-muted">{d.detail}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Subtotal ({list.count} item{list.count > 1 ? "s" : ""})</span>
                <span className="text-xl font-semibold text-brand">{formatPrice(list.total)}</span>
              </div>
              <a href={waLink(message)} target="_blank" rel="noopener" className="btn btn-wa w-full !py-4 text-base shadow-lg shadow-wa/25">
                <WhatsAppIcon className="w-6 h-6" /> Send order on WhatsApp
              </a>
              <div className="flex justify-between text-xs text-muted">
                <span>We confirm the total with delivery. {paymentNote}</span>
                <button onClick={list.clear} className="underline shrink-0 ml-2">Clear list</button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
