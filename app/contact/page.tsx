import { Mail, Clock, MapPin } from "lucide-react";
import PageShell from "@/components/ui/PageShell";
import ContactForm from "@/components/ui/ContactForm";
import WhatsAppButton from "@/components/whatsapp/WhatsAppButton";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({ title: "Contact Us – WhatsApp Our Florist", description: `Contact ${site.name} on WhatsApp ${site.phoneDisplay} or email ${site.email}. Florist serving Kuala Lumpur & Selangor.`, path: "/contact" });

export default function Contact() {
  return (
    <PageShell title="Contact us" path="/contact" intro="The fastest way to reach us is WhatsApp. We usually reply within minutes during opening hours.">
      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <WhatsAppButton label={`WhatsApp ${site.phoneDisplay}`} className="w-full flex items-center gap-4 bg-wa text-white rounded-3xl p-6 text-xl font-semibold hover:brightness-95" iconClassName="w-10 h-10" />
          {[{ i: Mail, t: "Email", v: site.email, h: `mailto:${site.email}` }, { i: Clock, t: "Opening hours", v: site.openingHours }, { i: MapPin, t: "Delivery coverage", v: site.addressRegion }].map(({ i: I, t, v, h }) => (
            <div key={t} className="flex items-center gap-4 bg-white rounded-3xl p-6 border border-blush-2/70">
              <div className="w-12 h-12 rounded-full bg-blush text-brand grid place-items-center"><I className="w-5 h-5" /></div>
              <div><div className="text-sm text-muted">{t}</div>{h ? <a href={h} className="font-semibold break-all">{v}</a> : <div className="font-semibold">{v}</div>}</div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 md:p-8 border border-blush-2/70">
          <h2 className="text-2xl font-semibold mb-1">Send us a message</h2>
          <p className="text-sm text-muted mb-6">Fill this in and tap send. It opens WhatsApp with your message ready.</p>
          <ContactForm />
        </div>
      </div>
    </PageShell>
  );
}
