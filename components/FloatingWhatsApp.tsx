"use client";
import { usePathname } from "next/navigation";
import { pageMessage, waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

export default function FloatingWhatsApp() {
  const path = usePathname() || "/";
  if (path.startsWith("/product/")) return null; // product pages have their own buttons
  const href = () => waLink(pageMessage(typeof document !== "undefined" ? document.title : "BikaFlora", path));
  return (
    <a
      href={waLink(pageMessage("BikaFlora", path))}
      onClick={(e) => { e.currentTarget.href = href(); }}
      target="_blank" rel="noopener"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-wa text-white shadow-xl px-4 py-3 hover:scale-105 transition"
      aria-label="Chat with us on WhatsApp"
    >
      <WhatsAppIcon className="w-6 h-6" />
      <span className="hidden sm:inline font-semibold text-sm">Chat with us</span>
    </a>
  );
}
