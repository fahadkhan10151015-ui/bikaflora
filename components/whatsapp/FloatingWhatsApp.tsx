"use client";
import { usePathname } from "next/navigation";
import WhatsAppButton from "./WhatsAppButton";

/** Floating chat button on every page except product pages (they have their own order bar). */
export default function FloatingWhatsApp() {
  const path = usePathname() || "/";
  if (path.startsWith("/product/")) return null;
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50">
      <WhatsAppButton
        label="Chat with us"
        className="flex items-center gap-2 rounded-full bg-wa text-white shadow-xl shadow-black/20 p-3.5 sm:px-4 sm:py-3 font-semibold text-sm hover:scale-105 transition [&>span]:hidden sm:[&>span]:inline"
        iconClassName="w-6 h-6"
      />
    </div>
  );
}
