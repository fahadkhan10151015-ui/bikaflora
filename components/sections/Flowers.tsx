/**
 * Hand-drawn SVG flowers for the hero animation.
 * Crisp at any size, light to load, and coloured with soft gradients.
 */
type FlowerProps = { className?: string; tint?: "pink" | "blush" | "peach" | "white" };

const palette = {
  pink: ["#ffe3ea", "#f29bb4", "#c94c74"],
  blush: ["#fff1f2", "#f7c3cf", "#e0879f"],
  peach: ["#fff3e8", "#f9c4a2", "#e48a5f"],
  white: ["#ffffff", "#f6eef0", "#d9c3c9"],
};

/** Layered garden rose seen from above. */
export function Rose({ className = "", tint = "pink" }: FlowerProps) {
  const [light, mid, deep] = palette[tint];
  const id = `rose-${tint}`;
  const petal = (r: number, rot: number, key: string) => (
    <path key={key} d={`M60 60 C ${60 - r * 0.9} ${60 - r * 0.25}, ${60 - r * 0.75} ${60 - r * 1.15}, 60 ${60 - r * 1.05} C ${60 + r * 0.75} ${60 - r * 1.15}, ${60 + r * 0.9} ${60 - r * 0.25}, 60 60Z`}
      transform={`rotate(${rot} 60 60)`} fill={`url(#${id})`} stroke={light} strokeOpacity=".7" strokeWidth=".8" />
  );
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={deep} />
          <stop offset="55%" stopColor={mid} />
          <stop offset="100%" stopColor={light} />
        </radialGradient>
      </defs>
      {[0, 72, 144, 216, 288].map((r) => petal(46, r, `o${r}`))}
      {[36, 108, 180, 252, 324].map((r) => petal(34, r, `m${r}`))}
      {[0, 90, 180, 270].map((r) => petal(22, r + 20, `i${r}`))}
      <path d="M60 50c7 0 11 5 9 11s-9 8-13 4-2-10 4-10c3 0 5 2 4 5" fill="none" stroke={deep} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Five-petal cherry blossom with gold stamens. */
export function Blossom({ className = "", tint = "blush" }: FlowerProps) {
  const [light, mid, deep] = palette[tint];
  const id = `blossom-${tint}`;
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={id} cx="50%" cy="85%" r="90%">
          <stop offset="0%" stopColor={deep} />
          <stop offset="40%" stopColor={mid} />
          <stop offset="100%" stopColor={light} />
        </radialGradient>
      </defs>
      {[0, 72, 144, 216, 288].map((r) => (
        <path key={r} d="M60 60 C 42 46, 40 20, 54 12 L60 20 L66 12 C 80 20, 78 46, 60 60Z" fill={`url(#${id})`} transform={`rotate(${r} 60 60)`} />
      ))}
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const x = 60 + Math.cos(a) * 11, y = 60 + Math.sin(a) * 11;
        return <g key={i}><line x1="60" y1="60" x2={x} y2={y} stroke="#d9a441" strokeWidth="1.2" /><circle cx={x} cy={y} r="1.8" fill="#f2c14e" /></g>;
      })}
      <circle cx="60" cy="60" r="4" fill="#e9b949" />
    </svg>
  );
}

/** Glossy leaf. */
export function Leaf({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="leaf-g" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#2f6b4f" />
          <stop offset="100%" stopColor="#9cc9a6" />
        </linearGradient>
      </defs>
      <path d="M18 104C22 52 58 18 106 14c-4 48-38 86-88 90z" fill="url(#leaf-g)" />
      <path d="M22 100C46 70 70 44 100 20" stroke="#e8f3ea" strokeOpacity=".6" strokeWidth="2" fill="none" />
    </svg>
  );
}

/** Four-point twinkle. */
export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 0c1 6 6 11 12 12-6 1-11 6-12 12-1-6-6-11-12-12 6-1 11-6 12-12z" fill="#f3dfae" />
    </svg>
  );
}
