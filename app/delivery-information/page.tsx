import PageShell from "@/components/ui/PageShell";
import { pageMeta } from "@/lib/seo";
import { site, paymentNote, paymentMethods } from "@/lib/site";

export const metadata = pageMeta({ title: "Delivery Information", description: "Instant flower delivery and pre-orders across Kuala Lumpur and Selangor by Grab Express, Lalamove and J&T Express. Cut-off times, fees, payment and tips.", path: "/delivery-information" });

export default function Page() {
  return (
    <PageShell title="Delivery Information" path="/delivery-information">
      <div className="max-w-3xl prose-bf bg-white rounded-3xl border border-blush-2/70 p-6 md:p-10">
        <h2 className="!mt-0">Where we deliver</h2>
        <p>We deliver to 32 areas across Kuala Lumpur and Selangor. See the full list on our <a className="text-brand underline" href="/flower-delivery">Delivery Areas</a> page.</p>
        <h2>Instant Delivery</h2>
        <p>Ready-made bouquets are delivered the same day, any time, by <strong>Grab Express</strong> or <strong>Lalamove</strong>. Orders after the cut-off go out the next day. During peak seasons (Valentine&apos;s Day, Mother&apos;s Day, convocation season) please order early.</p>
        <h2>Pre-order</h2>
        <p>Tell us what you want and the date you need it. We prepare your bouquet exactly to your requirement and deliver it on your date. Premium, crochet and custom designs are usually pre-order.</p>
        <h2>Customise with a photo</h2>
        <p>Send us a reference photo on WhatsApp and tell us &ldquo;I want this type&rdquo;. We confirm the design and price, then build it for you.</p>
        <h2>Delivery partners</h2>
        <p>Grab Express and Lalamove for same-day delivery across KL &amp; Selangor. J&amp;T Express for crochet bouquets and gifts sent further away.</p>
        <h2>Delivery fee</h2>
        <p>The delivery fee depends on the address and courier. We confirm the total on WhatsApp first.</p>
        <h2>Payment</h2>
        <p>{paymentNote} We accept {paymentMethods}.</p>
        <h2>Condos, offices and hospitals</h2>
        <p>Please include the block and unit number, company name or ward, and the recipient&apos;s phone number. Some hospitals do not allow fresh flowers in wards; our soap and crochet bouquets are a good alternative.</p>
        <h2>If the recipient is not available</h2>
        <p>We will call the recipient and you. If no one is available, we can leave the bouquet with the guardhouse, reception or a neighbour with your permission, or arrange a re-delivery (extra fee may apply).</p>
      </div>
    </PageShell>
  );
}
