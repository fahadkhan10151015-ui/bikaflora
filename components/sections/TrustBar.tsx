import { Zap, CalendarClock, Camera, MessageCircle } from "lucide-react";
import { site } from "@/lib/site";

const items = [
  { icon: Zap, title: "Instant Delivery", text: "Delivered today, any time" },
  { icon: CalendarClock, title: "Pre-order & Custom", text: "Made to your idea and date" },
  { icon: Camera, title: "Photo Before Delivery", text: "See your actual bouquet" },
  { icon: MessageCircle, title: "Order on WhatsApp", text: "Quick, personal replies" },
];

export default function TrustBar() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
      {items.map(({ icon: Icon, title, text }) => (
        <div key={title} className="flex flex-col sm:flex-row text-center sm:text-left items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blush grid place-items-center text-brand shrink-0 ring-1 ring-gold/30"><Icon className="w-5 h-5" /></div>
          <div><div className="font-semibold text-sm">{title}</div><div className="text-xs text-muted">{text}</div></div>
        </div>
      ))}
    </div>
  );
}
