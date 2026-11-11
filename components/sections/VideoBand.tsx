import { flowerVideo, siteImages } from "@/lib/images";
import WhatsAppButton from "@/components/whatsapp/WhatsAppButton";

/** Full-width flower video with a closing call-to-action, shown just above the footer. */
export default function VideoBand() {
  return (
    <section className="flush-bottom relative mt-24 h-[70vh] min-h-[420px] max-h-[720px] overflow-hidden text-white">
      <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline preload="none" poster={siteImages.cover} aria-hidden="true">
        <source src={flowerVideo} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-rose-950 via-rose-950/55 to-rose-950/20" />
      <div className="relative h-full container-x flex flex-col items-center justify-center text-center">
        <div className="eyebrow mb-3">Hand-tied in Kuala Lumpur</div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl max-w-3xl leading-tight">Every bouquet, made to make someone smile</h2>
        <p className="mt-4 max-w-xl text-white/80">Tell us the occasion and budget — we&apos;ll recommend the perfect flowers and deliver them today or on your chosen date.</p>
        <WhatsAppButton label="Chat with our florist" className="btn btn-wa mt-8 !px-8 !py-4 shadow-xl shadow-black/30" />
      </div>
    </section>
  );
}
