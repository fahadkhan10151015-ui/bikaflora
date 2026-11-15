import Link from "next/link";
import { Zap, Palette } from "lucide-react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/site";
import Photo from "@/components/ui/Photo";
import Stars from "./Stars";
import StockBadge from "./StockBadge";
import FloristPick from "./FloristPick";
import { floristScore } from "@/data/florist-picks";
import CardActions from "./CardActions";
import HeartButton from "@/components/favourites/HeartButton";

export default function ProductCard({ p, priority = false }: { p: Product; priority?: boolean }) {
  const second = p.images[1];
  return (
    <div className="group tilt bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-blush-2/70 flex flex-col h-full">
      <div className="relative">
        <Link href={`/product/${p.slug}`} className="relative block aspect-square overflow-hidden bg-blush">
          <Photo src={p.images[0]} alt={`${p.name} – soap flower bouquet delivery KL & Selangor`} w={320} h={320}
             imgClassName="transition duration-700 group-hover:scale-105" priority={priority} />
          {second && (
            <Photo src={second} alt="" w={320} h={320}
              className="hidden [@media(hover:hover)]:block opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          )}
          {p.badge && <span className="absolute top-2 left-2 sm:top-3 sm:left-3 glass text-brand text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">{p.badge}</span>}
          {p.compareAt && <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-petal text-deep text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">-{Math.round((1 - p.price / p.compareAt) * 100)}%</span>}
        </Link>
        <HeartButton slug={p.slug} name={p.name} className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 z-10" />
      </div>
      <div className="p-2.5 sm:p-4 flex flex-col flex-1">
        <Link href={`/product/${p.slug}`}>
          <h3 className="font-serif text-[15px] sm:text-lg leading-snug hover:text-brand line-clamp-2 min-h-[2.5em]">{p.name}</h3>
        </Link>
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          {floristScore[p.slug] !== undefined ? <FloristPick slug={p.slug} /> : <Stars slug={p.slug} />}
          <StockBadge slug={p.slug} />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs text-muted">
          {p.instant && <span className="inline-flex items-center gap-1 text-brand font-medium"><Zap className="w-3 h-3" /> Same-day delivery</span>}
          {p.paperColours && <span className="inline-flex items-center gap-1" title="Custom wrapping colours (pre-order)"><Palette className="w-3 h-3 text-gold" /><span className="hidden sm:inline">Custom paper</span></span>}
          {p.variants && (
            <span className="inline-flex items-center gap-1" title={p.variants.map((v) => v.label).join(" / ")}>
              {p.variants.map((v) => <span key={v.id} className="w-3 h-3 rounded-full ring-1 ring-black/10" style={{ background: v.swatch }} />)}
              <span className="hidden sm:inline">{p.variants.length} colours</span>
            </span>
          )}
        </div>
        <div className="mt-auto pt-1.5 sm:pt-2 flex flex-wrap items-baseline gap-x-1.5 sm:gap-x-2 text-sm sm:text-base">
          <span className="font-semibold text-brand">{formatPrice(p.price)}</span>
          {p.compareAt && <span className="text-xs text-muted line-through">{formatPrice(p.compareAt)}</span>}
        </div>
        <CardActions p={{ slug: p.slug, name: p.name, sku: p.sku, price: p.price, instant: p.instant, variants: p.variants?.map((v) => v.label) }} />
      </div>
    </div>
  );
}
