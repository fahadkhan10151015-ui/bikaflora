export default function SectionTitle({ eyebrow, title, sub, center = true }: { eyebrow?: string; title: string; sub?: string; center?: boolean }) {
  return (
    <div className={`${center ? "text-center mx-auto" : ""} max-w-2xl mb-10`}>
      {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
      <h2 className="text-3xl md:text-4xl font-semibold text-ink">{title}</h2>
      {sub && <p className="mt-3 text-muted leading-relaxed">{sub}</p>}
    </div>
  );
}
