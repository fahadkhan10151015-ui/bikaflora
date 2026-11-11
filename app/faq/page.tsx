import PageShell from "@/components/PageShell";
import Faq from "@/components/Faq";
import WaCta from "@/components/WaCta";
import { faqs } from "@/data/faqs";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "FAQ – Ordering, Delivery & Payment", description: "Answers about ordering flowers on WhatsApp, same-day delivery in KL & Selangor, payment, card messages and bouquet care.", path: "/faq" });

export default function FaqPage() {
  return (<><PageShell title="Frequently asked questions" path="/faq" intro="Everything you need to know about ordering from BikaFlora."><Faq items={faqs} /></PageShell><WaCta title="Still have a question?" /></>);
}
