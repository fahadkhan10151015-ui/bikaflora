import PageShell from "@/components/ui/PageShell";
import Faq from "@/components/sections/Faq";
import WaCta from "@/components/sections/WaCta";
import { faqs } from "@/data/faqs";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "FAQ – Ordering, Delivery & Payment", description: "Answers about ordering flowers on WhatsApp, same-day delivery in KL & Selangor, delivery options, payment and bouquet care.", path: "/faq" });

export default function FaqPage() {
  return (<><PageShell title="Frequently asked questions" path="/faq" intro="Everything you need to know about ordering from BikaFlora."><Faq items={faqs} /></PageShell><WaCta title="Still have a question?" /></>);
}
