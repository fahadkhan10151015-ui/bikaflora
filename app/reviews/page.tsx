import PageShell from "@/components/ui/PageShell";
import Reviews from "@/components/sections/Reviews";
import WaCta from "@/components/sections/WaCta";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Customer Reviews – Florist KL & Selangor", description: "Read real customer reviews of BikaFlora soap flower bouquets, Ferrero bouquets and same-day delivery across Kuala Lumpur and Selangor.", path: "/reviews" });

export default function ReviewsPage() {
  return (<><PageShell title="Customer reviews" path="/reviews" intro="Reviews from customers who ordered BikaFlora bouquets, written here on our website or shared with us on other platforms. Each review is linked to the bouquet it is about."><div className="pt-6"><Reviews limit={50} /></div></PageShell><WaCta title="Ordered from us before?" text="We'd love to hear from you. Send us your feedback and a photo on WhatsApp." /></>);
}
