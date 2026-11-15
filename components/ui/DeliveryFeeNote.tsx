import { Truck } from "lucide-react";

/** One clear line wherever prices are shown: the delivery fee depends on the area and is confirmed on WhatsApp. */
export default function DeliveryFeeNote({ className = "", text }: { className?: string; text?: string }) {
  return (
    <p className={`flex items-start gap-2 text-sm text-muted ${className}`}>
      <Truck className="w-4 h-4 mt-0.5 shrink-0 text-brand" aria-hidden="true" />
      <span>{text ?? "Price is for the bouquet only. The delivery fee depends on your area, and we tell you the exact fee on WhatsApp before you pay."}</span>
    </p>
  );
}
