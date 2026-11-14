import Link from "next/link";

/** BikaFlora emblem: a gold-ringed tulip bloom. */
export function LogoMark({ className = "w-11 h-11" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lm-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2b3b62" />
          <stop offset="100%" stopColor="#141c30" />
        </linearGradient>
        <linearGradient id="lm-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f1dca4" />
          <stop offset="50%" stopColor="#c9a45c" />
          <stop offset="100%" stopColor="#9c7a37" />
        </linearGradient>
        <linearGradient id="lm-petal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbd3dd" />
          <stop offset="100%" stopColor="#e27f9d" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#lm-bg)" />
      <circle cx="32" cy="32" r="27.5" fill="none" stroke="url(#lm-gold)" strokeWidth="1.4" />
      {/* stem & leaves */}
      <path d="M32 50V34" stroke="url(#lm-gold)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M32 46c-5-1-8-4-9-8 4 0 8 3 9 8z" fill="url(#lm-gold)" />
      <path d="M32 43c5-1 8-4 9-8-4 0-8 3-9 8z" fill="url(#lm-gold)" />
      {/* bloom */}
      <path d="M22 18c1 9 4 15 10 17 6-2 9-8 10-17-4 3-7 5-10 5s-6-2-10-5z" fill="url(#lm-petal)" />
      <path d="M32 35c-4-5-4-14 0-21 4 7 4 16 0 21z" fill="#f6b3c5" stroke="#fde7ee" strokeWidth=".6" />
    </svg>
  );
}

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 sm:gap-2.5 shrink min-w-0" aria-label="BikaFlora home">
      <LogoMark className="w-9 h-9 min-[400px]:w-10 min-[400px]:h-10 sm:w-11 sm:h-11 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className={`font-serif text-[1.4rem] min-[400px]:text-[1.6rem] sm:text-[1.75rem] font-semibold tracking-tight ${light ? "text-white" : "text-ink"}`}>
          Bika<span className="text-gold">Flora</span>
        </span>
        <span className={`mt-0.5 text-[0.5rem] min-[400px]:text-[0.55rem] tracking-[0.22em] min-[400px]:tracking-[0.32em] uppercase whitespace-nowrap ${light ? "text-white/60" : "text-muted"}`}>Florist · Malaysia</span>
      </span>
    </Link>
  );
}
