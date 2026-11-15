import { socialLinks } from "@/lib/site";

const icons: Record<string, React.ReactNode> = {
  instagram: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>,
  facebook: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.9v3h2.6V21h3z" /></svg>,
  tiktok: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M16.6 3c.3 2.2 1.6 3.6 3.9 3.8v2.6c-1.4.1-2.6-.3-3.9-1.1v5.3c0 6.4-7 8.4-9.8 3.8-1.8-3-.7-8.2 5.1-8.4v2.8c-.4.1-.9.2-1.3.3-1.3.4-2 1.3-1.8 2.7.4 2.7 5.3 3.5 4.9-1.8V3h2.9z" /></svg>,
};
const names: Record<string, string> = { instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok" };

/** Round social buttons (footer) or a "Follow us" card (blog). */
export default function SocialLinks({ variant = "icons", className = "" }: { variant?: "icons" | "card" | "pills" | "list"; className?: string }) {
  const links = socialLinks();
  if (!links.length) return null;
  if (variant === "icons")
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        {links.map((l) => (
          <a key={l.name} href={l.url} target="_blank" rel="noopener" aria-label={`BikaFlora on ${names[l.name]}`} title={names[l.name]}
            className="w-10 h-10 rounded-full bg-white/10 border border-white/15 grid place-items-center hover:bg-white hover:text-brand transition">
            <span className="w-[18px] h-[18px]">{icons[l.name]}</span>
          </a>
        ))}
      </div>
    );
  if (variant === "pills")
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {links.map((l) => (
          <a key={l.name} href={l.url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full border border-blush-2 bg-white px-3.5 py-1.5 text-sm font-semibold text-ink hover:border-brand hover:text-brand transition">
            <span className="w-4 h-4 text-brand">{icons[l.name]}</span> {names[l.name]}
          </a>
        ))}
      </div>
    );
  if (variant === "list")
    return (
      <ul className={`grid gap-2 ${className}`}>
        {links.map((l) => (
          <li key={l.name}>
            <a href={l.url} target="_blank" rel="noopener" className="flex items-center gap-3 rounded-2xl border border-blush-2/70 bg-white px-4 py-3 hover:border-brand transition group">
              <span className="w-9 h-9 rounded-full bg-blush text-brand grid place-items-center shrink-0"><span className="w-[18px] h-[18px]">{icons[l.name]}</span></span>
              <span className="min-w-0"><span className="block font-semibold text-ink group-hover:text-brand">{names[l.name]}</span><span className="block text-xs text-muted">@bikaflora</span></span>
              <span className="ml-auto text-xs font-semibold text-brand">Follow</span>
            </a>
          </li>
        ))}
      </ul>
    );
  return (
    <div className={`rounded-3xl bg-gradient-to-br from-brand to-deep text-white p-6 sm:p-8 ${className}`}>
      <p className="eyebrow !text-petal">Follow BikaFlora</p>
      <h2 className="mt-1 text-2xl sm:text-3xl font-semibold">See our latest bouquets</h2>
      <p className="mt-2 text-white/80 leading-relaxed">Follow @bikaflora for new designs, gift ideas and photos of bouquets on their way to customers.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        {links.map((l) => (
          <a key={l.name} href={l.url} target="_blank" rel="noopener" className="inline-flex items-center gap-2.5 rounded-full bg-white text-brand px-5 py-2.5 font-semibold hover:bg-blush transition">
            <span className="w-5 h-5">{icons[l.name]}</span> {names[l.name]}
          </a>
        ))}
      </div>
    </div>
  );
}
