import Link from "next/link";
import { Mail, Phone, Clock, MapPin, ArrowRight, Zap, Camera, Wallet } from "lucide-react";
import Logo from "@/components/layout/Logo";
import WhatsAppButton from "@/components/whatsapp/WhatsAppButton";
import { site, footerShopLinks, footerHelpLinks, footerAreaSlugs } from "@/lib/site";
import SocialLinks from "@/components/ui/SocialLinks";
import { locations } from "@/data/locations";

const shop = footerShopLinks.map((l) => [l.href, l.label] as [string, string]);
const help = footerHelpLinks.map((l) => [l.href, l.label] as [string, string]);
const areaSlugs = footerAreaSlugs;

export default function Footer() {
  const areas = areaSlugs.map((s) => locations.find((l) => l.slug === s)!).filter(Boolean);
  const col = "text-white font-semibold mb-4 font-sans text-[15px] tracking-wide";
  const link = "hover:text-white transition";
  return (
    <footer className="bg-deep text-white/75">
      {/* CTA strip */}
      <div className="border-b border-white/10">
        <div className="container-x py-8 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
          <div>
            <p className="font-serif text-2xl md:text-3xl text-white">Send flowers in KL today</p>
            <p className="mt-1 text-white/70">Same-day flower delivery across Kuala Lumpur and Selangor, any time of day.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="btn bg-white text-brand hover:bg-blush !px-6">Shop bouquets <ArrowRight className="w-4 h-4" /></Link>
            <WhatsAppButton label="Order on WhatsApp" className="btn btn-wa !px-6" />
          </div>
        </div>
      </div>

      <div className="container-x py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 text-[15px] leading-relaxed max-w-sm">
            {site.name} is an online florist in KL. We handmake soap flower bouquets that last for months, then deliver them the same day across Kuala Lumpur and Selangor.
          </p>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li className="flex gap-2.5"><Phone className="w-4 h-4 mt-0.5 text-gold" /><a href={`https://wa.me/${site.whatsapp}`} className={link}>{site.phoneDisplay} (WhatsApp)</a></li>
            <li className="flex gap-2.5"><Mail className="w-4 h-4 mt-0.5 text-gold" /><a href={`mailto:${site.email}`} className={`${link} break-all`}>{site.email}</a></li>
            <li className="flex gap-2.5"><Clock className="w-4 h-4 mt-0.5 text-gold" />{site.openingHours}</li>
          </ul>
          <SocialLinks className="mt-5" />
        </div>
        <div>
          <h3 className={col}>Shop Bouquets</h3>
          <ul className="space-y-2.5 text-sm">
            {shop.map(([h, l]) => <li key={h}><Link href={h} className={link}>{l}</Link></li>)}
            <li><Link href="/shop" className="text-petal hover:text-white">All bouquets →</Link></li>
          </ul>
        </div>
        <div>
          <h3 className={col}>Flower Delivery</h3>
          <ul className="space-y-2.5 text-sm">
            {areas.map((l) => <li key={l.slug}><Link href={`/flower-delivery/${l.slug}`} className={link}>Flower delivery {l.name}</Link></li>)}
            <li><Link href="/flower-delivery" className="text-petal hover:text-white">All delivery areas →</Link></li>
          </ul>
        </div>
        <div>
          <h3 className={col}>Help</h3>
          <ul className="space-y-2.5 text-sm">
            {help.map(([h, l]) => <li key={h}><Link href={h} className={link}>{l}</Link></li>)}
          </ul>
        </div>
      </div>

      <div className="container-x pb-10">
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          {[
            [Zap, "Same-day delivery, no cut-off"],
            [Camera, "Photo before delivery"],
            [Wallet, "Bank transfer · DuitNow QR · Touch 'n Go"],
          ].map(([Icon, t]) => {
            const I = Icon as typeof Zap;
            return <div key={t as string} className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"><I className="w-4 h-4 text-gold shrink-0" />{t as string}</div>;
          })}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x py-5 text-xs flex flex-col sm:flex-row gap-2 justify-between">
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>

          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Online florist delivering in Kuala Lumpur &amp; Selangor, Malaysia</span>
        </div>
      </div>
    </footer>
  );
}
