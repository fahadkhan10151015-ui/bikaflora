import { ChevronDown } from "lucide-react";
import JsonLd from "./JsonLd";
import { faqSchema } from "@/lib/seo";

export default function Faq({ items, schema = true }: { items: { q: string; a: string }[]; schema?: boolean }) {
  return (
    <div className="max-w-3xl mx-auto divide-y divide-blush-2 bg-white rounded-3xl border border-blush-2/70 px-6">
      {schema && <JsonLd data={faqSchema(items)} />}
      {items.map((f) => (
        <details key={f.q} className="group py-5">
          <summary className="flex justify-between items-center cursor-pointer list-none font-medium">
            {f.q}<ChevronDown className="w-5 h-5 text-brand transition group-open:rotate-180 shrink-0 ml-4" />
          </summary>
          <p className="mt-3 text-muted leading-relaxed text-[15px]">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
