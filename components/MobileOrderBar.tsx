import { Product } from "@/data/products";
import { formatPrice } from "@/lib/site";
import { waLink, orderMessage } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";
export default function MobileOrderBar({ p }: { p: Product }) {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-blush-2 px-4 py-3 flex items-center gap-3">
      <div className="flex-1 min-w-0"><div className="text-sm font-medium truncate">{p.name}</div><div className="text-brand font-semibold">{formatPrice(p.price)}</div></div>
      <a href={waLink(orderMessage({ name: p.name, sku: p.sku, slug: p.slug, price: p.price }))} target="_blank" rel="noopener" className="btn btn-wa !py-2.5"><WhatsAppIcon className="w-5 h-5" /> Order</a>
    </div>
  );
}
