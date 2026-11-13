"use client";
import { Check, Sparkles, Hourglass, Gift, HeartHandshake, Ruler } from "lucide-react";
import type { Product } from "@/data/products";
import { useVariant } from "./VariantProvider";

/** "About this bouquet": design, durability, occasions, care, what's included and size (follow the chosen colour). */
export default function ProductDetails({ p, children }: { p: Product; children?: React.ReactNode }) {
  const { variant } = useVariant();
  const includes = variant?.includes ?? p.includes;
  const size = variant?.size ?? p.size;
  const blocks = [
    { icon: Sparkles, title: "Design", text: variant?.design ?? p.design },
    { icon: Hourglass, title: "Durability", text: p.durability },
    { icon: Gift, title: "Perfect for", text: p.occasions },
  ];
  return (
    <section className="mt-14 md:mt-16 grid lg:grid-cols-3 gap-6 lg:gap-10">
      <div className="lg:col-span-2">
        <h2 className="text-2xl md:text-3xl font-semibold">About this bouquet</h2>
        <p className="mt-3 text-muted leading-relaxed">{p.description}</p>
        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          {blocks.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-white rounded-2xl border border-blush-2/70 p-4">
              <Icon className="w-5 h-5 text-gold" />
              <h3 className="mt-2 font-sans font-semibold text-sm">{title}</h3>
              <p className="mt-1 text-sm text-muted leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-white rounded-2xl border border-blush-2/70 p-4">
          <h3 className="font-sans font-semibold text-sm flex items-center gap-2"><HeartHandshake className="w-5 h-5 text-gold" /> Care instructions</h3>
          <ul className="mt-2 grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-muted">
            {p.care.map((c) => <li key={c} className="flex gap-2"><span className="text-gold">•</span>{c}</li>)}
          </ul>
        </div>
        {children}
      </div>
      <aside className="bg-white rounded-3xl border border-blush-2/70 p-6 h-fit">
        <h3 className="font-sans font-semibold mb-3">What&apos;s included{variant ? ` (${variant.label})` : ""}</h3>
        <ul className="space-y-2 text-sm">{includes.map((x) => <li key={x} className="flex gap-2"><Check className="w-4 h-4 text-brand mt-0.5 shrink-0" /> {x}</li>)}</ul>
        {size && (
          <p className="mt-5 pt-4 border-t border-blush-2 text-sm flex items-center gap-2"><Ruler className="w-4 h-4 text-brand" /> <b>Size:</b> {size}</p>
        )}
      </aside>
    </section>
  );
}
