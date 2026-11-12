import Link from "next/link";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/site";
import Photo from "@/components/ui/Photo";
import Stars from "./Stars";
import CardActions from "./CardActions";
import HeartButton from "@/components/favourites/HeartButton";

export default function ProductCard({ p, priority = false }: { p: Product; priority?: boolean }) {
  return (
    <div className="group tilt bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-blush-2/70 flex flex-col h-full">
      <Link href={`/product/${p.slug}`} className="relative block aspect-[4/5] overflow-hidden" aria-label={p.name}>
        <Photo src={p.images[0]} tone={p.tones?.[0]} alt={`${p.name} – flower delivery KL & Selangor`} sizes="(max-width:768px) 50vw, 25vw"
          imgClassName="transition duration-700 group-hover:scale-110" priority={priority} />
        {p.images[1] && p.images[1] !== p.images[0] && (
          <Photo src={p.images[1]} tone={p.tones?.[1]} alt="" sizes="(max-width:768px) 50vw, 25vw" className="opacity-0 group-hover:opacity-100 transition duration-700" />
        )}
        {p.badge && <span className="absolute top-2 left-2 sm:top-3 sm:left-3 glass text-brand text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">{p.badge}</span>}
        {p.compareAt && <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-petal text-deep text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">-{Math.round((1 - p.price / p.compareAt) * 100)}%</span>}
      </Link>
      <div className="relative">
        <HeartButton slug={p.slug} name={p.name} className="absolute -top-11 sm:-top-13 right-2 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 z-10" />
      </div>
      <div className="p-2.5 sm:p-4 flex flex-col flex-1">
        <Stars rating={p.rating} reviews={p.reviews} />
        <Link href={`/product/${p.slug}`} className="mt-1">
          <h3 className="font-serif text-[15px] sm:text-lg leading-snug hover:text-brand line-clamp-2">{p.name}</h3>
        </Link>
        <div className="mt-auto pt-1.5 sm:pt-2 flex flex-wrap items-baseline gap-x-1.5 sm:gap-x-2 text-sm sm:text-base">
          <span className="font-semibold text-brand">{p.options ? "From " : ""}{formatPrice(p.price)}</span>
          {p.compareAt && <span className="text-xs text-muted line-through">{formatPrice(p.compareAt)}</span>}
        </div>
        <CardActions p={p} />
      </div>
    </div>
  );
}
