import PageShell from "@/components/ui/PageShell";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({ title: "Terms & Conditions", description: "Terms and conditions for ordering flowers and gifts from BikaFlora in Kuala Lumpur and Selangor.", path: "/terms" });

export default function Page() {
  return (
    <PageShell title="Terms & Conditions" path="/terms">
      <div className="max-w-3xl prose-bf bg-white rounded-3xl border border-blush-2/70 p-6 md:p-10">
        <p className="!mt-0">By using this website or ordering from {site.name}, you agree to these terms.</p>
        <h2>Orders</h2>
        <p>Orders are confirmed only after we reply on WhatsApp with the final total and receive your payment.</p>
        <h2>Prices</h2>
        <p>Prices are in Malaysian Ringgit (RM) and may change without notice. Delivery fees are confirmed separately.</p>
        <h2>Product images</h2>
        <p>Images are for reference. Handmade products and wrapping may vary slightly in colour and shape.</p>
        <h2>Delivery</h2>
        <p>We try our best to deliver on time, but delays caused by traffic, weather or incorrect addresses are outside our control.</p>
        <h2>Contact</h2>
        <p>Questions? Email {site.email} or WhatsApp {site.phoneDisplay}.</p>
      </div>
    </PageShell>
  );
}
