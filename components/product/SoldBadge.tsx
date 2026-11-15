import { Flame } from "lucide-react";
import { sold } from "@/data/sold";

/** "58 sold" pill on product cards and product pages. Shows nothing when no number is set. */
export default function SoldBadge({ slug, size = "sm" }: { slug: string; size?: "sm" | "lg" }) {
  const n = sold[slug];
  if (!n) return null;
  const lg = size === "lg";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap bg-orange-50 text-orange-700 ring-1 ring-orange-100 ${lg ? "text-sm px-3 py-1" : "text-[11px] sm:text-xs px-2 py-0.5"}`}>
      <Flame className={lg ? "w-4 h-4" : "w-3 h-3"} />
      {n} sold
    </span>
  );
}
