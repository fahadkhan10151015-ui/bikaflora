import { Award } from "lucide-react";
import { floristScore } from "@/data/florist-picks";

/** "Florist's pick 4.5/5": BikaFlora's own score, clearly labelled (not a customer rating). */
export default function FloristPick({ slug, size = "sm" }: { slug: string; size?: "sm" | "lg" }) {
  const s = floristScore[slug];
  if (s === undefined) return null;
  return size === "lg" ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/5 ring-1 ring-brand/15 text-brand text-sm font-medium px-3 py-1" title="Our florist's own score for this bouquet">
      <Award className="w-4 h-4 text-gold-deep" /> Florist&apos;s pick · {s}/5
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium text-brand" title="Our florist's own score for this bouquet">
      <Award className="w-3.5 h-3.5 text-gold-deep" /> Florist&apos;s pick {s}/5
    </span>
  );
}
