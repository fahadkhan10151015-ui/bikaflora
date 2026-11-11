import PageShell from "@/components/PageShell";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({ title: "Delivery Information", description: "Same-day flower delivery across Kuala Lumpur and Selangor. Cut-off times, delivery slots, fees and tips for condos, offices and hospitals.", path: "/delivery-information" });

export default function Page() {
  return (
    <PageShell title="Delivery Information" path="/delivery-information">
      <div className="max-w-3xl prose-bf bg-white rounded-3xl border border-blush-2/70 p-6 md:p-10">
        <h2 className="!mt-0">Where we deliver</h2>
        <p>We deliver to 32 areas across Kuala Lumpur and Selangor. See the full list on our <a className="text-brand underline" href="/flower-delivery">Delivery Areas</a> page.</p>
        <h2>Same-day delivery</h2>
        <p>Orders confirmed and paid before {site.sameDayCutoff} can usually be delivered the same day. Orders after the cut-off are delivered the next day. During peak seasons (Valentine&apos;s Day, Mother&apos;s Day, convocation season) please order early.</p>
        <h2>Delivery fee</h2>
        <p>The delivery fee depends on the address and time slot. We confirm the total on WhatsApp before you pay.</p>
        <h2>Condos, offices and hospitals</h2>
        <p>Please include the block and unit number, company name or ward, and the recipient&apos;s phone number. Some hospitals do not allow fresh flowers in wards; our soap and crochet bouquets are a good alternative.</p>
        <h2>If the recipient is not available</h2>
        <p>We will call the recipient and you. If no one is available, we can leave the bouquet with the guardhouse, reception or a neighbour with your permission, or arrange a re-delivery (extra fee may apply).</p>
      </div>
    </PageShell>
  );
}
