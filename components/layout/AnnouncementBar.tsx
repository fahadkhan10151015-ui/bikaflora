import { Wallet, Phone, Zap, CalendarClock, Truck, MapPin, Gift, Star, Heart, Clock, Sparkles, Tag } from "lucide-react";
import { site, announcement } from "@/lib/site";

/** Icons the admin panel can choose for each announcement line. */
export const announcementIcons = { wallet: Wallet, phone: Phone, zap: Zap, calendar: CalendarClock, truck: Truck, pin: MapPin, gift: Gift, star: Star, heart: Heart, clock: Clock, sparkles: Sparkles, tag: Tag };

/** Thin scrolling bar above the menu (text is edited in Admin → Site settings). */
export default function AnnouncementBar() {
  const items = announcement.map((a) => ({
    icon: announcementIcons[a.icon as keyof typeof announcementIcons] ?? Sparkles,
    text: a.text.replace("{phone}", site.phoneDisplay),
    href: a.href === "whatsapp" ? `https://wa.me/${site.whatsapp}` : a.href?.trim() || undefined,
  }));
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map(({ icon: Icon, text, href }, i) => (
        <li key={i} className="flex items-center gap-2 px-6 sm:px-8 whitespace-nowrap">
          <Icon className="w-3.5 h-3.5 text-gold shrink-0" />
          {href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener" tabIndex={hidden ? -1 : undefined} className="font-semibold hover:text-gold">{text}</a> : <span>{text}</span>}
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
