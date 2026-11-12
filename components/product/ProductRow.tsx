import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/data/products";
import ProductCard from "./ProductCard";

/** A titled row of products. Swipes sideways on mobile, 4-column grid on desktop. */
export default function ProductRow({ title, eyebrow, href, items, priority = false }: { title: string; eyebrow?: string; href: string; items: Product[]; priority?: boolean }) {
  if (!items.length) return null;
  return (
    <section className="container-x mt-14 md:mt-20">
      <div className="flex items-end justify-between gap-4 mb-5 md:mb-7">
        <div>
          {eyebrow && <div className="eyebrow mb-1">{eyebrow}</div>}
          <h2 className="text-2xl md:text-4xl font-semibold">{title}</h2>
        </div>
        <Link href={href} className="shrink-0 flex items-center gap-1 text-brand font-semibold text-sm md:text-base hover:gap-2 transition-all">
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="-mx-4 px-4 md:mx-0 md:px-0 flex md:grid md:grid-cols-4 gap-3 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-2 md:pb-0 [scrollbar-width:none]">
        {items.slice(0, 4).map((p, i) => (
          <div key={p.slug} className="snap-start shrink-0 w-[62%] sm:w-[40%] md:w-auto">
            <ProductCard p={p} priority={priority && i < 2} />
          </div>
        ))}
      </div>
    </section>
  );
}
