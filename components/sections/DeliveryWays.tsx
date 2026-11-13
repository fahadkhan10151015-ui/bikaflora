import Link from "next/link";
import { Zap, CalendarClock, ImagePlus, Wallet, Truck, ArrowRight } from "lucide-react";
import { site, deliveryPartners, paymentNote, paymentMethods } from "@/lib/site";
import { waLink, generalMessages } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppIcon";

/** Instant delivery, pre-order and custom orders + couriers + advance payment. */
export default function DeliveryWays() {
  const customText = generalMessages().find((m) => m.id === "custom")!.text;
  const ways = [
    {
      icon: Zap,
      title: "Instant Delivery",
      text: `Ready-made bouquets delivered today across KL & Selangor by Grab Express or Lalamove, any time of the day.`,
      cta: { label: "Shop ready bouquets", href: "/shop" },
      dark: true,
    },
    {
      icon: CalendarClock,
      title: "Pre-order",
      text: "Tell us what you want and the date you need it. We prepare it exactly to your requirement and deliver on the day.",
      cta: { label: "Pre-order on WhatsApp", href: "/contact" },
    },
    {
      icon: ImagePlus,
      title: "Customise",
      text: "Send us a photo and say “I want this type”. We build it for you in your colours, flowers and budget.",
      wa: true,
    },
  ];

  return (
    <section className="container-x mt-20 md:mt-24" aria-labelledby="how-we-deliver">
      <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
        <div className="eyebrow mb-2">Ways to order</div>
        <h2 id="how-we-deliver" className="text-3xl md:text-4xl font-semibold">Instant, pre-order or fully custom</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        {ways.map(({ icon: Icon, title, text, cta, dark, wa }) => (
          <div key={title} className={`rounded-[1.75rem] p-6 md:p-8 flex flex-col ${dark ? "bg-gradient-to-br from-brand to-deep text-white ring-1 ring-gold/30" : "bg-white border border-blush-2"}`}>
            <Icon className="w-9 h-9 text-gold" />
            <h3 className="mt-4 text-2xl font-semibold">{title}</h3>
            <p className={`mt-2 text-[15px] leading-relaxed flex-1 ${dark ? "text-white/80" : "text-muted"}`}>{text}</p>
            {cta && (
              <Link href={cta.href} className={`mt-5 inline-flex items-center gap-1.5 font-semibold ${dark ? "text-gold" : "text-brand"}`}>
                {cta.label} <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            {wa && (
              <a href={waLink(customText)} target="_blank" rel="noopener" className="btn btn-wa mt-5 self-start">
                <WhatsAppIcon className="w-5 h-5" /> Send us your photo
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-4 md:gap-6">
        <div className="rounded-3xl bg-white border border-blush-2 p-5 md:p-6 flex gap-4 items-start">
          <span className="w-11 h-11 shrink-0 rounded-2xl bg-blush text-brand grid place-items-center"><Truck className="w-5 h-5" /></span>
          <div>
            <h3 className="font-sans font-semibold">Our delivery partners</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {deliveryPartners.map((d) => (
                <span key={d.name} title={d.use} className="px-3 py-1.5 rounded-full bg-cream border border-blush-2 text-sm font-semibold text-brand">{d.name}</span>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">Grab Express &amp; Lalamove for same-day delivery in KL &amp; Selangor. J&amp;T Express for crochet bouquets and gifts sent further.</p>
          </div>
        </div>
        <div className="rounded-3xl bg-white border border-blush-2 p-5 md:p-6 flex gap-4 items-start">
          <span className="w-11 h-11 shrink-0 rounded-2xl bg-blush text-brand grid place-items-center"><Wallet className="w-5 h-5" /></span>
          <div>
            <h3 className="font-sans font-semibold">Payment in advance</h3>
            <p className="mt-1 text-sm text-muted">{paymentNote} {paymentMethods}. We confirm your order and total on WhatsApp first.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
