import Link from "next/link";
export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="BikaFlora home">
      <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
        <g fill={light ? "#fbe9ee" : "#a3284f"}>
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx="20" cy="11" rx="6" ry="9" transform={`rotate(${r} 20 20)`} opacity=".9" />
          ))}
        </g>
        <circle cx="20" cy="20" r="4.5" fill="#c8a24a" />
      </svg>
      <span className={`font-serif text-2xl font-semibold tracking-tight ${light ? "text-white" : "text-ink"}`}>
        Bika<span className={light ? "text-blush-2" : "text-brand"}>Flora</span>
      </span>
    </Link>
  );
}
