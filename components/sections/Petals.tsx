/** Soft rose petals that drift down a section (pure CSS). */
const petals = [
  { left: 6, size: 16, delay: 0, dur: 13 },
  { left: 18, size: 11, delay: 3.5, dur: 16 },
  { left: 31, size: 14, delay: 7, dur: 14 },
  { left: 47, size: 10, delay: 1.8, dur: 18 },
  { left: 62, size: 17, delay: 5.2, dur: 15 },
  { left: 76, size: 12, delay: 9, dur: 17 },
  { left: 90, size: 15, delay: 2.6, dur: 14 },
];

export default function Petals() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {petals.map((p) => (
        <span key={p.left} className="petal" style={{ left: `${p.left}%`, width: p.size, height: p.size * 1.25, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }} />
      ))}
    </div>
  );
}
