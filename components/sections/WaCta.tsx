import WhatsAppButton from "@/components/whatsapp/WhatsAppButton";
import { siteImages } from "@/lib/images";

export default function WaCta({ title = "Not sure what to choose?", text = "Tell us the occasion and budget on WhatsApp. We'll recommend the perfect bouquet in minutes." }: { title?: string; text?: string }) {
  return (
    <section className="container-x my-20">
      <div className="relative overflow-hidden rounded-[2rem] text-white p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6"
        style={{ backgroundImage: `linear-gradient(100deg, rgba(74,15,36,.95), rgba(163,40,79,.75)), url(${siteImages.florist})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div>
          <h2 className="text-2xl md:text-4xl font-semibold">{title}</h2>
          <p className="mt-2 text-white/85 max-w-xl">{text}</p>
        </div>
        <WhatsAppButton className="btn btn-wa shrink-0 !px-7 !py-4 shadow-xl" />
      </div>
    </section>
  );
}
