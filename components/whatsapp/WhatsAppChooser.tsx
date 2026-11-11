"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { X, ShoppingBag, HelpCircle, Palette, Truck, ChevronRight } from "lucide-react";
import { waLink, type MessageOption } from "@/lib/whatsapp";
import { site } from "@/lib/site";
import { WhatsAppIcon } from "./WhatsAppIcon";

type Chooser = { title: string; subtitle?: string; options: MessageOption[] };
const Ctx = createContext<(c: Chooser) => void>(() => {});

/** Call `useWhatsAppChooser()(...)` anywhere to show the message picker. */
export const useWhatsAppChooser = () => useContext(Ctx);

const icons: Record<string, typeof ShoppingBag> = { order: ShoppingBag, info: HelpCircle, custom: Palette, delivery: Truck };

export function WhatsAppChooserProvider({ children }: { children: React.ReactNode }) {
  const [chooser, setChooser] = useState<Chooser | null>(null);
  const close = useCallback(() => setChooser(null), []);

  useEffect(() => {
    if (!chooser) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [chooser, close]);

  return (
    <Ctx.Provider value={setChooser}>
      {children}
      {chooser && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-label="Choose a WhatsApp message">
          <button className="absolute inset-0 bg-ink/50 backdrop-blur-sm animate-fade" onClick={close} aria-label="Close" />
          <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl animate-rise overflow-hidden">
            <div className="bg-wa text-white px-6 py-5 flex items-start gap-3">
              <WhatsAppIcon className="w-8 h-8 shrink-0" />
              <div className="flex-1">
                <h2 className="font-sans text-lg font-semibold">{chooser.title}</h2>
                <p className="text-sm text-white/85">{chooser.subtitle || `Chat with ${site.name} — pick a message to start`}</p>
              </div>
              <button onClick={close} className="p-1 rounded-full hover:bg-white/15" aria-label="Close"><X className="w-5 h-5" /></button>
            </div>
            <ul className="p-3">
              {chooser.options.map((o) => {
                const Icon = icons[o.id] || HelpCircle;
                return (
                  <li key={o.id}>
                    <a href={waLink(o.text)} target="_blank" rel="noopener" onClick={close}
                      className="flex items-center gap-4 p-3 rounded-2xl hover:bg-blush transition group">
                      <span className="w-11 h-11 rounded-xl bg-blush text-brand grid place-items-center group-hover:bg-white"><Icon className="w-5 h-5" /></span>
                      <span className="flex-1">
                        <span className="block font-semibold">{o.title}</span>
                        <span className="block text-sm text-muted">{o.hint}</span>
                      </span>
                      <ChevronRight className="w-5 h-5 text-muted" />
                    </a>
                  </li>
                );
              })}
            </ul>
            <p className="px-6 pb-5 text-xs text-muted">The message opens in WhatsApp. You can edit it before sending.</p>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
