"use client";
/** Google Analytics 4 (BikaFlora property). Loaded only after the page has finished loading, so it never slows the first view. */
export const GA_ID = "G-5LXJRY04K8";

type Gtag = (...args: unknown[]) => void;
declare global { interface Window { dataLayer?: unknown[]; gtag?: Gtag } }

let started = false;

/** Sets up gtag (events sent before the script arrives are queued) and loads the script when the browser is idle. */
export function initGa(skip: boolean) {
  if (started || typeof window === "undefined") return;
  started = true;
  if (skip) return; // admin pages, your own devices and bots are not counted
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer!.push(arguments); } as Gtag;
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);
  const load = () => {
    if (document.getElementById("ga-js")) return;
    const s = document.createElement("script");
    s.id = "ga-js"; s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);
  };
  const later = () => ("requestIdleCallback" in window ? (window as Window & { requestIdleCallback: (cb: () => void, o?: { timeout: number }) => void }).requestIdleCallback(load, { timeout: 3000 }) : setTimeout(load, 1500));
  if (document.readyState === "complete") later(); else window.addEventListener("load", later, { once: true });
  // A tap or scroll means the visitor is staying: load straight away so that visit is counted.
  const now = () => { load(); ["pointerdown", "keydown", "scroll"].forEach((e) => window.removeEventListener(e, now)); };
  ["pointerdown", "keydown", "scroll"].forEach((e) => window.addEventListener(e, now, { once: true, passive: true }));
}

export function gaEvent(name: string, params: Record<string, unknown> = {}) {
  try { window.gtag?.("event", name, params); } catch {}
}
