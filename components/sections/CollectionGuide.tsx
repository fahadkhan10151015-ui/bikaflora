import { MessageCircle, BookOpen } from "lucide-react";
import { splitSections } from "@/lib/content";
import Faq from "@/components/sections/Faq";
import WhatsAppButton from "@/components/whatsapp/WhatsAppButton";

const plain = (t: string) => t.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ");
const anchor = (t: string) => t.toLowerCase().replace(/<[^>]+>/g, "").replace(/&amp;/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/**
 * Buying-guide layout for category and shop pages (different from the product page):
 * a sticky "On this page" list on the left, and each H2 section as its own numbered card.
 */
export default function CollectionGuide({ name, html, faqTitle, faqs }: { name: string; html: string; faqTitle?: string; faqs?: { q: string; a: string }[] }) {
  const firstH2 = html.search(/<h2[\s>]/i);
  const lead = firstH2 > 0 ? html.slice(0, firstH2).trim() : "";
  const sections = splitSections(html).map((s) => ({ ...s, id: anchor(s.title) }));
  return (
    <section className="mt-16 md:mt-24">
      <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
        <p className="eyebrow mb-2 inline-flex items-center gap-2"><BookOpen className="w-4 h-4" /> Buying guide</p>
        <h2 className="text-3xl md:text-4xl font-semibold text-ink">Choosing {name.toLowerCase().startsWith("shop") ? "your bouquet" : name}</h2>
      </div>

      <div className="grid lg:grid-cols-[260px_minmax(0,1fr)] gap-6 lg:gap-10 items-start">
        <nav aria-label="On this page" className="lg:sticky lg:top-32 rounded-3xl bg-deep text-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-petal">On this page</p>
          <ol className="mt-4 space-y-1">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="flex gap-3 rounded-xl px-2 py-2 text-[15px] leading-snug text-white/80 hover:bg-white/10 hover:text-white transition">
                  <span className="text-gold font-semibold tabular-nums">{String(i + 1).padStart(2, "0")}</span>{plain(s.title)}
                </a>
              </li>
            ))}
          </ol>
          <div className="mt-5 pt-5 border-t border-white/15">
            <p className="text-sm text-white/75">Not sure which one to pick? Our florist replies on WhatsApp.</p>
            <WhatsAppButton label="Ask our florist" className="mt-3 w-full btn btn-wa !py-2.5 text-sm" iconClassName="w-4 h-4" />
          </div>
        </nav>

        <div className="space-y-5 min-w-0">
          {lead && <div className="prose-location rounded-3xl bg-white border border-blush-2/70 px-6 py-6 sm:px-10" dangerouslySetInnerHTML={{ __html: lead }} />}
          {sections.map((s, i) => (
            <article key={s.id} id={s.id} className={`scroll-mt-32 rounded-3xl border px-6 py-7 sm:px-10 sm:py-9 ${i % 2 ? "bg-cream border-[#efe6d6]" : "bg-white border-blush-2/70"}`}>
              <div className="flex items-start gap-4">
                <span className="hidden sm:grid w-11 h-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand to-deep text-white font-semibold">{i + 1}</span>
                <h2 className="text-2xl md:text-[2rem] leading-tight font-semibold text-ink" dangerouslySetInnerHTML={{ __html: s.title }} />
              </div>
              <div className="prose-location prose-guide mt-4" dangerouslySetInnerHTML={{ __html: s.html }} />
            </article>
          ))}
        </div>
      </div>

      {faqs && faqs.length > 0 && (
        <div className="mt-16 md:mt-20 grid lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] gap-8 lg:gap-12 items-start">
          <div className="lg:sticky lg:top-32">
            <p className="eyebrow mb-2">Questions</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-ink leading-tight">{faqTitle || "Frequently asked questions"}</h2>
            <p className="mt-3 text-lg text-muted leading-relaxed">Quick answers before you order. Anything else, just message us.</p>
            <WhatsAppButton label="Chat on WhatsApp" className="mt-5 btn btn-wa" />
            <p className="mt-3 text-sm text-muted flex items-center gap-1.5"><MessageCircle className="w-4 h-4" /> Usually replies within minutes</p>
          </div>
          <Faq items={faqs} large className="!max-w-none !mx-0" />
        </div>
      )}
    </section>
  );
}
