import { Truck, Camera, MessageCircle, Gift } from "lucide-react";
import { site } from "@/lib/site";
const items = [
  { icon: Truck, t: "Same-Day Delivery", d: `Order before ${site.sameDayCutoff}` },
  { icon: Camera, t: "Photo Before Delivery", d: "See your actual bouquet" },
  { icon: MessageCircle, t: "Order on WhatsApp", d: "Quick, personal replies" },
  { icon: Gift, t: "Free Gift Card", d: "Your message, hand-written" },
];
export default function TrustBar() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map(({ icon: I, t, d }) => (
        <div key={t} className="flex flex-col sm:flex-row text-center sm:text-left items-center gap-2 sm:gap-3 bg-white rounded-2xl p-3 sm:p-4 border border-blush-2/70">
          <div className="w-11 h-11 rounded-full bg-blush grid place-items-center text-brand shrink-0"><I className="w-5 h-5" /></div>
          <div><div className="font-semibold text-sm">{t}</div><div className="text-xs text-muted">{d}</div></div>
        </div>
      ))}
    </div>
  );
}
