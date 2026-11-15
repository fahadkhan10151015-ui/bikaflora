import { ChevronDown } from "lucide-react";
import JsonLd from "@/components/ui/JsonLd";
import { faqSchema } from "@/lib/seo";

export default function Faq({ items, schema = true, large = false, className = "" }: { items: { q: string; a: string }[]; schema?: boolean; large?: boolean; className?: string }) {
  return (
    <div className={`max-w-3xl mx-auto divide-y divide-blush-2 bg-white rounded-3xl border border-blush-2/70 ${large ? "px-6 sm:px-8" : "px-6"} ${className}`}>
      {schema && <JsonLd data={faqSchema(items)} />}
      {items.map((f) => (
        <details key={f.q} className="group py-5">
          <summary className={`flex justify-between items-center cursor-pointer list-none font-medium ${large ? "text-[17px] md:text-lg text-ink" : ""}`}>
            {f.q}<ChevronDown className="w-5 h-5 text-brand transition group-open:rotate-180 shrink-0 ml-4" />
          </summary>
          <p className={`mt-3 text-muted leading-relaxed ${large ? "text-base md:text-[17px]" : "text-[15px]"}`}>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
