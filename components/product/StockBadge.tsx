import { stock } from "@/data/stock";

/** Stock pill: "50 in stock" (green), or "Made to order" for pre-order designs. */
export default function StockBadge({ slug, size = "sm" }: { slug: string; size?: "sm" | "lg" }) {
  const n = stock[slug];
  const lg = size === "lg";
  const base = `inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap ${lg ? "text-sm px-3 py-1" : "text-[11px] sm:text-xs px-2 py-0.5"}`;
  if (n === undefined)
    return <span className={`${base} bg-gold/15 text-gold-deep`}><span className="w-1.5 h-1.5 rounded-full bg-gold" />Made to order</span>;
  return (
    <span className={`${base} bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100`}>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      {lg ? `In stock: ${n} available` : `${n} in stock`}
    </span>
  );
}
