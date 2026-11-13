/**
 * Hand-drawn SVG flowers for the hero animation.
 * Crisp at any size, light to load, and coloured with soft gradients.
 */
type Tint = "pink" | "blush" | "peach" | "white" | "red" | "blue" | "black" | "ivory";
type FlowerProps = { className?: string; tint?: Tint };

const palette = {
  pink: ["#ffe3ea", "#f29bb4", "#c94c74"],
  blush: ["#fff1f2", "#f7c3cf", "#e0879f"],
  peach: ["#fff3e8", "#f9c4a2", "#e48a5f"],
  white: ["#ffffff", "#f6eef0", "#d9c3c9"],
  red: ["#ff8a8a", "#d61f2c", "#7d0a14"],
  blue: ["#e3f1ff", "#8cc3f0", "#3d7fc4"],
  black: ["#6b6b74", "#2b2b31", "#0d0d10"],
  ivory: ["#fffdf6", "#f5ecd9", "#d9c8a6"],
} as const;

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


/** Moth orchid (Phalaenopsis). */
export function Orchid({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="orchid-g" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#d24a9a" />
          <stop offset="45%" stopColor="#f4b6d8" />
          <stop offset="100%" stopColor="#fff4fa" />
        </radialGradient>
      </defs>
      {[0, 120, 240].map((r) => <ellipse key={r} cx="60" cy="28" rx="11" ry="26" fill="url(#orchid-g)" transform={`rotate(${r} 60 60)`} />)}
      {[60, 300].map((r) => <ellipse key={r} cx="60" cy="30" rx="22" ry="25" fill="url(#orchid-g)" transform={`rotate(${r} 60 60)`} />)}
      <path d="M60 64 C 48 70, 50 88, 60 92 C 70 88, 72 70, 60 64Z" fill="#a3175f" />
      <circle cx="60" cy="58" r="6" fill="#ffe08a" />
      <circle cx="60" cy="57" r="2.5" fill="#f2b84b" />
    </svg>
  );
}

/** White daisy with a golden centre (as in our graduation & orchid bouquets). */
export function Daisy({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      {Array.from({ length: 16 }, (_, i) => (
        <ellipse key={i} cx="60" cy="30" rx="7" ry="24" fill="#ffffff" stroke="#e7e2dc" strokeWidth="1" transform={`rotate(${i * 22.5} 60 60)`} />
      ))}
      <circle cx="60" cy="60" r="15" fill="#f4b221" />
      <circle cx="60" cy="60" r="15" fill="url(#daisy-dots)" opacity=".5" />
      <defs><radialGradient id="daisy-dots"><stop offset="0%" stopColor="#c97b06" /><stop offset="100%" stopColor="#ffd25e" /></radialGradient></defs>
    </svg>
  );
}

/** Sunflower (as in The Graduation Signature). */
export function Sunflower({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="sun-petal" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffd84a" /><stop offset="100%" stopColor="#f39a0b" /></linearGradient>
        <radialGradient id="sun-core"><stop offset="0%" stopColor="#3a1d08" /><stop offset="70%" stopColor="#5b2c0c" /><stop offset="100%" stopColor="#8a4a14" /></radialGradient>
      </defs>
      {Array.from({ length: 20 }, (_, i) => (
        <path key={i} d="M60 60 C 52 40, 54 18, 60 8 C 66 18, 68 40, 60 60Z" fill="url(#sun-petal)" transform={`rotate(${i * 18} 60 60)`} />
      ))}
      <circle cx="60" cy="60" r="20" fill="url(#sun-core)" />
      {Array.from({ length: 18 }, (_, i) => {
        const a = i * 2.4, r = 3 + i * 0.85;
        return <circle key={i} cx={60 + Math.cos(a) * r} cy={60 + Math.sin(a) * r} r="1.4" fill="#c98a2e" opacity=".7" />;
      })}
    </svg>
  );
}

/** Golden chocolate ball (like the Ferrero Rocher in our bouquets). */
export function GoldBall({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="gold-ball" cx="35%" cy="30%" r="75%"><stop offset="0%" stopColor="#fff6c8" /><stop offset="35%" stopColor="#f0c64a" /><stop offset="75%" stopColor="#b7861c" /><stop offset="100%" stopColor="#6e4c0c" /></radialGradient>
      </defs>
      <circle cx="60" cy="60" r="40" fill="url(#gold-ball)" />
      {[[42, 48], [62, 40], [74, 58], [56, 64], [44, 72], [70, 76]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} l8 -6 l6 8 l-8 6z`} fill="#fff3b0" opacity=".35" />
      ))}
      <ellipse cx="60" cy="60" rx="13" ry="10" fill="#f7f1e3" opacity=".9" />
      <ellipse cx="60" cy="60" rx="9" ry="6" fill="none" stroke="#b7861c" strokeWidth="1.5" />
    </svg>
  );
}

/** Sprig of caspia / baby's breath filler. */
export function Sprig({ className = "", color = "#c13584" }: { className?: string; color?: string }) {
  const dots = [[60, 20], [48, 30], [72, 28], [40, 44], [56, 40], [78, 44], [50, 56], [68, 56], [60, 68], [44, 66], [76, 66]];
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <path d="M60 112 L60 70 M60 70 L48 56 M60 70 L72 56 M60 80 L42 66 M60 80 L78 66" stroke="#5d7a4e" strokeWidth="2" fill="none" />
      {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5.5" fill={color} opacity={0.75 + (i % 3) * 0.08} />)}
    </svg>
  );
}
