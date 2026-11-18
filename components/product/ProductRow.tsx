import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/data/products";
import ProductCard from "./ProductCard";

/** A titled section with up to `max` products and a "View all" link. 2 per row on phones and tablets, 4 on desktop. */
export default function ProductRow({ title, eyebrow, items, href, max = 4, priority = false }: { title: string; eyebrow?: string; href?: string; items: Product[]; total?: number; max?: number; priority?: boolean }) {
  if (items.length < 2) return null;
  const shown = items.slice(0, max);
  return (
    <section className="container-x mt-14 md:mt-20">
      <div className="flex items-end justify-between gap-4 mb-5 md:mb-7">
        <div>
          {eyebrow && <div className="eyebrow mb-1">{eyebrow}</div>}
          <h2 className="text-[22px] sm:text-3xl md:text-4xl font-semibold">{title}</h2>
        </div>
        {href && <Link href={href} className="shrink-0 inline-flex items-center gap-1 text-sm md:text-base font-semibold text-brand hover:underline underline-offset-4">View all <ArrowRight className="w-4 h-4" /></Link>}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
        {shown.map((p, i) => <ProductCard key={p.slug} p={p} priority={priority && i < 2} />)}
      </div>
    </section>
  );
}
