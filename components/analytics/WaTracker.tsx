"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackWa, trackView, visitSource, skip } from "@/lib/wa-track";
import { initGa } from "@/lib/ga";

/** Counts page views and every click on a WhatsApp link on the site. */
export default function WaTracker() {
  const path = usePathname();
  useEffect(() => { if (path) trackView(path); }, [path]);
  useEffect(() => {
    try { initGa(skip()); } catch {}
    visitSource();
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || !/wa\.me\/|api\.whatsapp\.com|web\.whatsapp\.com/i.test(a.href)) return;
      let text = "";
      try { text = new URL(a.href).searchParams.get("text") ?? ""; } catch {}
      trackWa(text, a.dataset.wa || a.getAttribute("aria-label") || a.textContent || "");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
