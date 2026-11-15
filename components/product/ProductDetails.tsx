"use client";
import { Check, Sparkles, Hourglass, Gift, HeartHandshake, Ruler, Package } from "lucide-react";
import type { Product } from "@/data/products";
import { useVariant } from "./VariantProvider";

/**
 * Product details below the order panel.
 * Left: the long description. Right (sticky): What's included + size, care, and delivery (children).
 */
export default function ProductDetails({ p, html, children }: { p: Product; html?: string; children?: React.ReactNode }) {
  const { variant } = useVariant();
  const includes = variant?.includes ?? p.includes;
  const size = variant?.size ?? p.size;
  const blocks = [
    { icon: Sparkles, title: "Design", text: variant?.design ?? p.design },
    { icon: Hourglass, title: "Durability", text: p.durability },
    { icon: Gift, title: "Perfect for", text: p.occasions },
  ];
  const card = "bg-white rounded-3xl border border-blush-2/70 p-6";
  const head = "font-sans font-semibold text-[15px] flex items-center gap-2 text-ink";
  return (
    <section className="mt-12 md:mt-16 grid lg:grid-cols-[minmax(0,1fr)_360px] gap-6 lg:gap-8 items-start">
      <div className="min-w-0">
        {html ? (
          <article className="prose-location prose-product-card bg-white rounded-3xl border border-blush-2/70 px-5 py-8 sm:px-10 sm:py-10" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <div className={card}>
            <h2 className="text-2xl md:text-3xl font-semibold">About this bouquet</h2>
            <p className="mt-3 text-muted leading-relaxed">{p.description}</p>
            <div className="mt-6 grid sm:grid-cols-3 gap-3">
              {blocks.map(({ icon: Icon, title, text }) => (
                <div key={title} className="bg-cream rounded-2xl p-4">
                  <Icon className="w-5 h-5 text-gold" />
                  <h3 className="mt-2 font-sans font-semibold text-sm">{title}</h3>
                  <p className="mt-1 text-sm text-muted leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <aside className="space-y-4 lg:sticky lg:top-32">
        <div className={card}>
          <h3 className={head}><Package className="w-5 h-5 text-gold" /> What&apos;s included{variant ? ` (${variant.label})` : ""}</h3>
          <ul className="mt-3 space-y-2 text-[15px] text-muted">
            {includes.map((x) => <li key={x} className="flex gap-2"><Check className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />{x}</li>)}
          </ul>
          {size && <p className="mt-4 pt-4 border-t border-blush-2/70 text-[15px] flex items-center gap-2"><Ruler className="w-4 h-4 text-gold" /><b className="text-ink">Size:</b> <span className="text-muted">{size}</span></p>}
        </div>
        <div className={card}>
          <h3 className={head}><HeartHandshake className="w-5 h-5 text-gold" /> Care tips</h3>
          <ul className="mt-3 space-y-1.5 text-[15px] text-muted">
            {p.care.map((c) => <li key={c} className="flex gap-2"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />{c}</li>)}
          </ul>
        </div>
        {children}
      </aside>
    </section>
  );
}
