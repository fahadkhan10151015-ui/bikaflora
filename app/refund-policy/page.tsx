import PageShell from "@/components/ui/PageShell";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({ title: "Refund & Replacement Policy", description: "BikaFlora refund and replacement policy for bouquets delivered in Kuala Lumpur and Selangor.", path: "/refund-policy" });

export default function Page() {
  return (
    <PageShell title="Refund & Replacement Policy" path="/refund-policy">
      <div className="max-w-3xl prose-bf bg-white rounded-3xl border border-blush-2/70 p-6 md:p-10">
        <p className="!mt-0">We want every customer to be happy with their bouquet. Please read our policy below.</p>
        <h2>Damaged or wrong items</h2>
        <p>If your bouquet arrives damaged or is different from what you ordered, contact us on WhatsApp within 24 hours with photos. We will offer a replacement or refund after review.</p>
        <h2>Cancellations</h2>
        <p>Orders can be cancelled for a full refund up to 24 hours before the delivery date. Custom bouquets that have already been prepared cannot be refunded.</p>
        <h2>Substitutions</h2>
        <p>Handmade items and wrapping may vary slightly. If a specific material is unavailable, we will replace it with one of equal or higher value and inform you first.</p>
        <h2>Wrong address or unavailable recipient</h2>
        <p>We are not able to refund orders where the address provided was incorrect or the recipient could not be reached after reasonable attempts.</p>
      </div>
    </PageShell>
  );
}
