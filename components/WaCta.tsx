import { site } from "@/lib/site";
import { waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

export default function WaCta({ title = "Not sure what to choose?", text = "Tell us the occasion and budget on WhatsApp. We will recommend the perfect bouquet in minutes.", message }: { title?: string; text?: string; message?: string }) {
  return (
    <section className="container-x my-16">
      <div className="rounded-[2rem] bg-gradient-to-br from-brand to-rose-950 text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>
          <p className="mt-2 text-white/80 max-w-xl">{text}</p>
        </div>
        <a href={waLink(message || `Hi ${site.name}, I need help choosing a bouquet.`)} target="_blank" rel="noopener" className="btn btn-wa shrink-0 !px-6 !py-3.5">
          <WhatsAppIcon /> Chat on WhatsApp
        </a>
      </div>
    </section>
  );
}
