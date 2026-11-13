"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";

/** Round "back to top" button. Shows after scrolling down, sits just above the WhatsApp button. */
export default function BackToTop() {
  const path = usePathname() || "/";
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 600);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  // Product pages have a bottom order bar on mobile instead of the WhatsApp button.
  const pos = path.startsWith("/product/") ? "bottom-24 lg:bottom-6" : "bottom-[76px] sm:bottom-[84px]";
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed right-4 sm:right-5 ${pos} z-50 w-12 h-12 rounded-full bg-brand text-white grid place-items-center shadow-xl shadow-black/25 ring-2 ring-gold/60 hover:bg-brand-dark hover:-translate-y-0.5 transition-all duration-300 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
