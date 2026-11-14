"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { site } from "@/lib/site";

type Msg = { role: "user" | "assistant"; content: string };

const starters = ["Birthday flowers under RM150?", "Can you deliver today to Shah Alam?", "Best convocation bouquet?", "How do I order?"];

/** Turns the bot's light markdown ([text](/url), **bold**, new lines) into safe React elements. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, li) => (
        <p key={li} className={line.trim() ? "" : "h-2"}>
          {line.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g).map((part, i) => {
            const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
            if (link) {
              const href = link[2];
              return href.startsWith("/")
                ? <Link key={i} href={href} className="font-semibold text-brand underline underline-offset-2">{link[1]}</Link>
                : <a key={i} href={href} target="_blank" rel="noopener nofollow" className="font-semibold text-brand underline">{link[1]}</a>;
            }
            const bold = part.match(/^\*\*([^*]+)\*\*$/);
            if (bold) return <strong key={i}>{bold[1]}</strong>;
            return <span key={i}>{part}</span>;
          })}
        </p>
      ))}
    </>
  );
}

export default function ChatBot() {
  const path = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  // Scroll only the chat's own message list (never the page), and only while the chat is open.
  useEffect(() => {
    if (!open) return;
    const box = end.current?.parentElement;
    if (box) box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
  }, [msgs, busy, open]);

  async function ask(q: string) {
    const question = q.trim().slice(0, 500);
    if (!question || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: question }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next, page: path }) });
      const data = await res.json();
      setMsgs([...next, { role: "assistant", content: data.reply || `Sorry, please WhatsApp us at ${site.phoneDisplay}.` }]);
    } catch {
      setMsgs([...next, { role: "assistant", content: `I couldn't connect. Please WhatsApp us at ${site.phoneDisplay}.` }]);
    } finally {
      setBusy(false);
    }
  }

  // Product pages have a sticky order bar at the bottom on mobile, so lift the button there.
  const lift = path.startsWith("/product/") ? "hidden lg:flex bottom-5" : "flex bottom-4 sm:bottom-5";

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} aria-label="Ask our florist (AI chat)"
          className={`fixed left-4 sm:left-5 ${lift} z-50 items-center gap-2 rounded-full bg-gradient-to-br from-brand to-deep text-white shadow-xl shadow-black/25 p-3.5 sm:px-4 sm:py-3 font-semibold text-sm ring-1 ring-gold/40 hover:scale-105 transition`}>
          <Sparkles className="w-6 h-6 text-gold" /><span className="hidden sm:inline">Ask our florist</span>
        </button>
      )}
      {open && (
        <div className="fixed z-[55] inset-x-0 bottom-0 sm:inset-x-auto sm:left-5 sm:bottom-5 sm:w-[380px] h-[75vh] sm:h-[560px] bg-cream sm:rounded-3xl rounded-t-3xl shadow-2xl border border-blush-2 flex flex-col overflow-hidden animate-rise"
          role="dialog" aria-label="AI florist assistant">
          <div className="bg-gradient-to-br from-brand to-deep text-white px-5 py-4 flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-white/10 ring-1 ring-gold/50 grid place-items-center"><Sparkles className="w-5 h-5 text-gold" /></span>
            <div className="flex-1">
              <div className="font-semibold">Bika · AI florist</div>
              <div className="text-xs text-white/70">Finds bouquets & answers delivery questions</div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-full hover:bg-white/15" aria-label="Close"><X className="w-5 h-5" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-[15px] leading-relaxed">
            <div className="bg-white rounded-2xl rounded-tl-md p-3 border border-blush-2/70 max-w-[88%]">
              Hi! I&apos;m Bika 🌷 Tell me the occasion, budget or area and I&apos;ll suggest bouquets.
            </div>
            {msgs.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {starters.map((s) => (
                  <button key={s} onClick={() => ask(s)} className="text-sm bg-white border border-brand/25 text-brand rounded-full px-3 py-1.5 hover:bg-blush">{s}</button>
                ))}
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user"
                ? "ml-auto max-w-[85%] bg-brand text-white rounded-2xl rounded-tr-md px-3 py-2"
                : "max-w-[88%] bg-white rounded-2xl rounded-tl-md p-3 border border-blush-2/70 space-y-0.5"}>
                {m.role === "user" ? m.content : <Rich text={m.content} />}
              </div>
            ))}
            {busy && <div className="flex items-center gap-2 text-muted text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Bika is typing…</div>}
            <div ref={end} />
          </div>

          <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="p-3 bg-white border-t border-blush-2 flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} maxLength={500} placeholder="Ask about flowers or delivery…"
              className="input !py-2.5 flex-1" aria-label="Your question" />
            <button disabled={busy || !input.trim()} className="w-11 h-11 rounded-full bg-brand text-white grid place-items-center disabled:opacity-40" aria-label="Send">
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="px-4 pb-2 bg-white text-[10px] text-muted text-center">AI answers can be wrong. Orders are always confirmed by our florist on WhatsApp.</p>
        </div>
      )}
    </>
  );
}
