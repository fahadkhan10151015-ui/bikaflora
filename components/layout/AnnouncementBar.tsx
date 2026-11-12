import { Wallet, Phone, Zap, CalendarClock, Truck, MapPin } from "lucide-react";
import { site } from "@/lib/site";

const waLink = `https://wa.me/${site.whatsapp}`;

/** Thin scrolling bar above the menu: payment, number and the two ways to order. */
export default function AnnouncementBar() {
  const items = [
    { icon: Wallet, text: "Full payment in advance" },
    { icon: Phone, text: `WhatsApp ${site.phoneDisplay}`, href: waLink },
    { icon: Zap, text: `Instant Delivery: order before ${site.sameDayCutoff}` },
    { icon: CalendarClock, text: "Pre-order & custom bouquets: send us a photo" },
    { icon: Truck, text: "Grab Express · Lalamove · J&T Express" },
    { icon: MapPin, text: "Delivering across KL & Selangor" },
  ];
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map(({ icon: Icon, text, href }) => (
        <li key={text} className="flex items-center gap-2 px-6 sm:px-8 whitespace-nowrap">
          <Icon className="w-3.5 h-3.5 text-gold shrink-0" />
          {href ? <a href={href} target="_blank" rel="noopener" tabIndex={hidden ? -1 : undefined} className="font-semibold hover:text-gold">{text}</a> : <span>{text}</span>}
          <span className="ml-6 sm:ml-8 text-gold/60" aria-hidden>✦</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="bg-deep text-white text-xs sm:text-[13px] overflow-hidden marquee-wrap" role="region" aria-label="Store information">
      <div className="marquee flex w-max py-2">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
