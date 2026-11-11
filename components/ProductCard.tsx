import Link from "next/link";
import Photo from "./Photo";
import { Product } from "@/data/products";
import { formatPrice } from "@/lib/site";
import { waLink, orderMessage } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

export default function ProductCard({ p, priority = false }: { p: Product; priority?: boolean }) {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-blush-2/70 card-hover flex flex-col">
      <Link href={`/product/${p.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-blush">
        <Photo src={p.images[0]} tone={p.tones?.[0]} alt={`${p.name} – flower delivery KL & Selangor`} sizes="(max-width:768px) 50vw, 25vw"
          imgClassName="transition duration-500 group-hover:scale-105" priority={priority} />
        {p.images[1] && (
          <Photo src={p.images[1]} tone={p.tones?.[1]} alt="" sizes="(max-width:768px) 50vw, 25vw" className="opacity-0 group-hover:opacity-100 transition duration-500" />
        )}
        {p.badge && <span className="absolute top-3 left-3 bg-white/95 text-brand text-xs font-semibold px-3 py-1 rounded-full shadow-sm">{p.badge}</span>}
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/product/${p.slug}`} className="font-serif text-lg leading-snug hover:text-brand line-clamp-2">{p.name}</Link>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-semibold text-brand">{p.options ? "From " : ""}{formatPrice(p.price)}</span>
          {p.compareAt && <span className="text-xs text-muted line-through">{formatPrice(p.compareAt)}</span>}
        </div>
        <div className="mt-auto pt-3 grid grid-cols-2 gap-2">
          <Link href={`/product/${p.slug}`} className="btn btn-outline !px-2 !py-2 text-xs">View</Link>
          <a href={waLink(orderMessage({ name: p.name, sku: p.sku, slug: p.slug, price: p.price }))} target="_blank" rel="noopener" className="btn btn-wa !px-2 !py-2 text-xs">
            <WhatsAppIcon className="w-4 h-4" /> Order
          </a>
        </div>
      </div>
    </div>
  );
}
