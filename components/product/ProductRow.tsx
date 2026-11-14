import type { Product } from "@/data/products";
import ProductCard from "./ProductCard";

/** A titled section showing every product it is given. 2 per row on phones and tablets, 4 on desktop. */
export default function ProductRow({ title, eyebrow, items, priority = false }: { title: string; eyebrow?: string; href?: string; items: Product[]; priority?: boolean }) {
  if (items.length < 2) return null;
  return (
    <section className="container-x mt-14 md:mt-20">
      <div className="flex items-end justify-between gap-4 mb-5 md:mb-7">
        <div>
          {eyebrow && <div className="eyebrow mb-1">{eyebrow}</div>}
          <h2 className="text-[22px] sm:text-3xl md:text-4xl font-semibold">{title}</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
        {items.map((p, i) => <ProductCard key={p.slug} p={p} priority={priority && i < 2} />)}
      </div>
    </section>
  );
}
