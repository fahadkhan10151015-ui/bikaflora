import { Mail, Clock, MapPin } from "lucide-react";
import PageShell from "@/components/PageShell";
import ContactForm from "@/components/ContactForm";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { waLink } from "@/lib/whatsapp";

export const metadata = pageMeta({ title: "Contact Us – WhatsApp Our Florist", description: `Contact ${site.name} on WhatsApp ${site.phoneDisplay} or email ${site.email}. Florist serving Kuala Lumpur & Selangor.`, path: "/contact" });

export default function Contact() {
  return (
    <PageShell title="Contact us" path="/contact" intro="The fastest way to reach us is WhatsApp. We usually reply within minutes during opening hours.">
      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <a href={waLink(`Hi ${site.name}, I have a question.`)} target="_blank" rel="noopener" className="flex items-center gap-4 bg-wa text-white rounded-3xl p-6 hover:brightness-95">
            <WhatsAppIcon className="w-10 h-10" /><div><div className="text-sm opacity-90">WhatsApp</div><div className="text-xl font-semibold">{site.phoneDisplay}</div></div>
          </a>
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
