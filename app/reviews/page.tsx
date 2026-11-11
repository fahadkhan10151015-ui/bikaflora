import PageShell from "@/components/ui/PageShell";
import Reviews from "@/components/sections/Reviews";
import WaCta from "@/components/sections/WaCta";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Customer Reviews – Florist KL & Selangor", description: "Read what customers in Kuala Lumpur and Selangor say about BikaFlora bouquets and delivery.", path: "/reviews" });

export default function ReviewsPage() {
  return (<><PageShell title="Customer reviews" path="/reviews" intro="Kind words from customers across the Klang Valley."><div className="pt-6"><Reviews limit={50} /></div></PageShell><WaCta title="Ordered from us before?" text="We'd love to hear from you. Send us your feedback and a photo on WhatsApp." /></>);
}
