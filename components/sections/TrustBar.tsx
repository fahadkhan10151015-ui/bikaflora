import { Zap, CalendarClock, Camera, MessageCircle } from "lucide-react";
import { site } from "@/lib/site";

const items = [
  { icon: Zap, title: "Same-day Express", text: `Order before ${site.sameDayCutoff}` },
  { icon: CalendarClock, title: "Scheduled Delivery", text: "Delivered in 1–2 days" },
  { icon: Camera, title: "Photo Before Delivery", text: "See your actual bouquet" },
  { icon: MessageCircle, title: "Order on WhatsApp", text: "Quick, personal replies" },
];

export default function TrustBar() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {items.map(({ icon: Icon, title, text }) => (
        <div key={title} className="glass flex flex-col sm:flex-row text-center sm:text-left items-center gap-2 sm:gap-3 rounded-2xl p-3 sm:p-4 border border-white shadow-lg shadow-brand/5">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand to-rose-950 grid place-items-center text-white shrink-0"><Icon className="w-5 h-5" /></div>
          <div><div className="font-semibold text-sm">{title}</div><div className="text-xs text-muted">{text}</div></div>
        </div>
      ))}
    </div>
  );
}
