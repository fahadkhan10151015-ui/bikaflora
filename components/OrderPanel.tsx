"use client";
import { useMemo, useState } from "react";
import { Heart, HelpCircle } from "lucide-react";
import { Product } from "@/data/products";
import { locations } from "@/data/locations";
import { formatPrice } from "@/lib/site";
import { waLink, orderMessage, enquiryMessage } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { useAuth, displayName } from "./AuthProvider";
import { useFavourites } from "@/lib/favourites";

export default function OrderPanel({ p }: { p: Product }) {
  const { user } = useAuth();
  const { has, toggle } = useFavourites();
  const [opt, setOpt] = useState(0);
  const [area, setArea] = useState("");
  const [date, setDate] = useState("");
  const [card, setCard] = useState("");

  const price = p.options ? p.options[opt].price : p.price;
  const wp = { name: p.name, sku: p.sku, slug: p.slug, price, option: p.options?.[opt].label };
  const who = user ? { customerName: displayName(user), customerEmail: user.email } : {};
  const orderHref = useMemo(() => waLink(orderMessage(wp, { area, date, cardMessage: card, ...who })), [opt, area, date, card, user]); // eslint-disable-line
  const askHref = useMemo(() => waLink(enquiryMessage(wp, who)), [opt, user]); // eslint-disable-line
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-5">
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-semibold text-brand">{formatPrice(price)}</span>
        {p.compareAt && opt === 0 && <span className="text-muted line-through">{formatPrice(p.compareAt)}</span>}
      </div>

      {p.options && (
        <div>
          <span className="label">Choose size</span>
          <div className="flex flex-wrap gap-2">
            {p.options.map((o, i) => (
              <button key={o.label} onClick={() => setOpt(i)} className={`px-4 py-2 rounded-full border text-sm transition ${i === opt ? "bg-brand text-white border-brand" : "bg-white border-blush-2 hover:border-brand"}`}>
                {o.label} · {formatPrice(o.price)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="area">Delivery area</label>
          <select id="area" className="input" value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="">Select area</option>
            <optgroup label="Kuala Lumpur">{locations.filter((l) => l.state === "Kuala Lumpur").map((l) => <option key={l.slug} value={`${l.name}, KL`}>{l.name}</option>)}</optgroup>
            <optgroup label="Selangor">{locations.filter((l) => l.state === "Selangor").map((l) => <option key={l.slug} value={`${l.name}, Selangor`}>{l.name}</option>)}</optgroup>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="date">Delivery date</label>
          <input id="date" type="date" min={today} className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="card">Card message <span className="font-normal text-muted">(optional)</span></label>
        <textarea id="card" rows={2} maxLength={200} className="input" placeholder="e.g. Happy birthday sayang! ❤️" value={card} onChange={(e) => setCard(e.target.value)} />
      </div>

      <div className="grid gap-3">
        <a href={orderHref} target="_blank" rel="noopener" className="btn btn-wa !py-4 text-base">
          <WhatsAppIcon className="w-6 h-6" /> Order on WhatsApp
        </a>
        <div className="grid grid-cols-2 gap-3">
          <a href={askHref} target="_blank" rel="noopener" className="btn btn-outline !px-3 text-sm whitespace-nowrap"><HelpCircle className="w-4 h-4" /> Ask a question</a>
          <button onClick={() => toggle(p.slug)} className="btn btn-outline">
            <Heart className={`w-4 h-4 ${has(p.slug) ? "fill-brand" : ""}`} /> {has(p.slug) ? "Saved" : "Save"}
          </button>
        </div>
        <p className="text-xs text-muted text-center">Your selected bouquet, size and details are sent to us on WhatsApp. We confirm the total before you pay.</p>
      </div>
    </div>
  );
}
