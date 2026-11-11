"use client";
import { usePathname } from "next/navigation";
import WhatsAppButton from "./WhatsAppButton";

/** Floating chat button on every page except product pages (they have their own order bar). */
export default function FloatingWhatsApp() {
  const path = usePathname() || "/";
  if (path.startsWith("/product/")) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <WhatsAppButton
        label="Chat with us"
        className="flex items-center gap-2 rounded-full bg-wa text-white shadow-xl shadow-wa/30 px-4 py-3 font-semibold text-sm hover:scale-105 transition"
        iconClassName="w-6 h-6"
      />
    </div>
  );
}
