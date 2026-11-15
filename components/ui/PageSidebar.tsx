import Link from "next/link";
import { Mail, Clock, Camera, Zap, Wallet, ArrowRight } from "lucide-react";
import Photo from "@/components/ui/Photo";
import WhatsAppButton from "@/components/whatsapp/WhatsAppButton";
import { site } from "@/lib/site";
import { siteImages } from "@/lib/images";

const links: [string, string][] = [
  ["/about", "About BikaFlora"],
  ["/faq", "FAQ"],
  ["/delivery-information", "Delivery Information"],
  ["/refund-policy", "Refund Policy"],
  ["/terms", "Terms & Conditions"],
  ["/privacy-policy", "Privacy Policy"],
];

/** Right-hand column for About, Terms, Privacy and FAQ: photo, help card, trust points and page links. */
export default function PageSidebar({ path, image = "florist", src, alt }: { path: string; image?: "florist" | "holdingBouquet"; src?: string; alt?: string }) {
  const img = src ? { src, alt: alt || "BikaFlora handmade bouquets" } : image === "florist"
    ? { src: siteImages.florist, alt: "BikaFlora florist wrapping a handmade bouquet in KL" }
    : { src: siteImages.holdingBouquet, alt: "Handmade bouquet ready for same-day delivery in KL" };
  return (
    <aside className="space-y-5 lg:sticky lg:top-32">
      <div className="relative aspect-[4/3] lg:aspect-[4/5] rounded-[1.75rem] overflow-hidden">
        <Photo src={img.src} alt={img.alt} w={400} sizes="(min-width:1024px) 340px, 100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/30 to-transparent" />
        <div className="absolute bottom-0 p-6 text-white">
          <div className="eyebrow !text-gold mb-1">Handmade in KL</div>
          <p className="font-serif text-2xl leading-snug">Bouquets made by hand, delivered the same day.</p>
        </div>
      </div>

      <div className="rounded-[1.75rem] bg-gradient-to-br from-brand to-deep text-white p-6">
        <h2 className="text-xl font-semibold">Need help?</h2>
        <p className="mt-1 text-white/80 text-[15px] leading-relaxed">Chat with our florist on WhatsApp. We reply daily.</p>
        <WhatsAppButton label="Chat on WhatsApp" className="btn btn-wa w-full mt-4 !py-3" />
        <ul className="mt-4 space-y-2 text-sm text-white/80">
          <li className="flex gap-2"><Mail className="w-4 h-4 mt-0.5 shrink-0" /><a href={`mailto:${site.email}`} className="hover:text-white break-all">{site.email}</a></li>
          <li className="flex gap-2"><Clock className="w-4 h-4 mt-0.5 shrink-0" />{site.openingHours}</li>
        </ul>
      </div>

      <div className="rounded-[1.75rem] bg-white border border-blush-2/70 p-6">
        <ul className="space-y-3 text-[15px]">
          <li className="flex gap-3"><span className="w-9 h-9 rounded-xl bg-blush text-brand grid place-items-center shrink-0"><Zap className="w-4 h-4" /></span><span><b className="text-ink">Same-day delivery</b><br /><span className="text-muted text-sm">Across KL &amp; Selangor, no cut-off</span></span></li>
          <li className="flex gap-3"><span className="w-9 h-9 rounded-xl bg-blush text-brand grid place-items-center shrink-0"><Camera className="w-4 h-4" /></span><span><b className="text-ink">Photo first</b><br /><span className="text-muted text-sm">See your bouquet before it goes out</span></span></li>
          <li className="flex gap-3"><span className="w-9 h-9 rounded-xl bg-blush text-brand grid place-items-center shrink-0"><Wallet className="w-4 h-4" /></span><span><b className="text-ink">Easy payment</b><br /><span className="text-muted text-sm">Bank transfer, DuitNow QR or Touch &apos;n Go</span></span></li>
        </ul>
      </div>

      <nav aria-label="Helpful pages" className="rounded-[1.75rem] bg-cream border border-blush-2/70 p-6">
        <h2 className="text-lg font-semibold mb-2">Helpful pages</h2>
        <ul className="divide-y divide-blush-2/70">
          {links.filter(([h]) => h !== path).map(([h, l]) => (
            <li key={h}><Link href={h} className="flex items-center justify-between py-2.5 text-[15px] hover:text-brand">{l}<ArrowRight className="w-4 h-4 text-brand" /></Link></li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
