/** Small hand-drawn SVG flowers used for the animated hero. */
type Props = { kind: "rose" | "daisy" | "tulip" | "leaf"; color?: string; className?: string };

export default function Blossom({ kind, color = "#e57f9c", className = "" }: Props) {
  const id = `g-${kind}-${color.replace("#", "")}`;
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={id} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity=".85" />
          <stop offset="45%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity=".85" />
        </radialGradient>
      </defs>
      {kind === "rose" && (
        <g fill={`url(#${id})`} stroke="#fff" strokeOpacity=".35" strokeWidth="1.2">
          {[0, 72, 144, 216, 288].map((r) => <ellipse key={r} cx="50" cy="28" rx="20" ry="24" transform={`rotate(${r} 50 50)`} />)}
          {[36, 108, 180, 252, 324].map((r) => <ellipse key={r} cx="50" cy="36" rx="14" ry="16" transform={`rotate(${r} 50 50)`} />)}
          <circle cx="50" cy="50" r="10" />
          <path d="M44 50a6 6 0 1 1 12 0" fill="none" strokeOpacity=".7" />
        </g>
      )}
      {kind === "daisy" && (
        <g>
          {Array.from({ length: 8 }, (_, i) => (
            <ellipse key={i} cx="50" cy="24" rx="9" ry="22" fill={`url(#${id})`} transform={`rotate(${i * 45} 50 50)`} />
          ))}
          <circle cx="50" cy="50" r="11" fill="#f2c14e" />
          <circle cx="47" cy="47" r="4" fill="#fff" opacity=".5" />
        </g>
      )}
      {kind === "tulip" && (
        <g>
          <path d="M50 96V58" stroke="#5f8f64" strokeWidth="4" strokeLinecap="round" />
          <path d="M50 78c-14-2-22-12-24-22 10 2 20 8 24 22z" fill="#6f9f74" />
          <path d="M30 22c4 18 8 32 20 36 12-4 16-18 20-36-8 6-14 10-20 10S38 28 30 22z" fill={`url(#${id})`} />
          <path d="M50 58c-8-10-8-30 0-44 8 14 8 34 0 44z" fill={color} opacity=".85" />
        </g>
      )}
      {kind === "leaf" && (
        <path d="M14 86C18 40 48 14 88 12 84 52 58 82 14 86z" fill="#7aa57f" stroke="#fff" strokeOpacity=".4" strokeWidth="1.5" />
      )}
    </svg>
  );
}
