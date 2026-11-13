import { Check, Sparkles } from "lucide-react";
import { flowerVideo, flowerVideoMobile } from "@/lib/images";
import WhatsAppButton from "@/components/whatsapp/WhatsAppButton";
import Link from "next/link";
import LazyVideo from "@/components/ui/LazyVideo";

const points = ["Soap flowers that last for months", "Hand-tied by our florists in Kuala Lumpur", "Photo sent to you before delivery"];

/** Video on the left, story on the right. */
export default function VideoBand() {
  return (
    <section className="container-x mt-28">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="relative">
          <div className="relative aspect-video rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl shadow-deep/25 ring-1 ring-gold/30 bg-deep">
            <LazyVideo src={flowerVideo} mobileSrc={flowerVideoMobile} className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -right-2 md:-right-6 glass rounded-2xl px-5 py-4 shadow-xl border border-white flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-brand text-white grid place-items-center"><Sparkles className="w-5 h-5" /></span>
            <div><div className="font-serif text-xl leading-none">Hand-tied</div><div className="text-xs text-muted">with love, every day</div></div>
          </div>
        </div>

        <div>
          <div className="eyebrow mb-3">Crafted by hand</div>
          <h2 className="text-4xl md:text-5xl leading-tight">Every bouquet is made to make someone smile</h2>
          <p className="mt-4 text-muted leading-relaxed">
            From choosing every bloom to the final ribbon, our florists put care into every detail. Tell us the occasion and budget — we&apos;ll recommend the perfect flowers and deliver them today or on your chosen date.
          </p>
          <ul className="mt-6 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-blush text-brand grid place-items-center"><Check className="w-4 h-4" /></span>{p}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <WhatsAppButton label="Chat with our florist" className="btn btn-wa !px-7 !py-3.5 shadow-lg shadow-wa/25" />
            <Link href="/shop" className="btn btn-outline !px-7 !py-3.5">Browse bouquets</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
