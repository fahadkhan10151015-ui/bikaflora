"use client";
import { useId, useState } from "react";
import { waLink } from "@/lib/whatsapp";
import { trackWa } from "@/lib/wa-track";
import { site } from "@/lib/site";
import { loadSupabase } from "@/lib/supabase-config";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppIcon";

export default function ContactForm({ area }: { area?: string } = {}) {
  const id = useId();
  const [f, setF] = useState({ name: "", phone: "", topic: "Order enquiry", msg: "" });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi ${site.name}, my name is ${f.name}${f.phone ? ` (${f.phone})` : ""}.\n\nTopic: ${f.topic}${area ? `\nDelivery area: ${area}` : ""}\n\n${f.msg}`;
    window.open(waLink(text), "_blank");
    trackWa(text, "Contact form");
    // Also keep a copy for the admin panel (Messages). Never blocks the WhatsApp message.
    loadSupabase().then((sb) => sb?.from("contact_messages").insert({
      name: f.name.trim().slice(0, 80), phone: f.phone.trim().slice(0, 30) || null, topic: f.topic, area: area ?? null,
      message: f.msg.trim().slice(0, 2000), page: window.location.pathname.slice(0, 200),
    })).catch(() => {});
  };
  return (
    <form onSubmit={send} className="grid gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="label" htmlFor={id + "n"}>Your name</label><input id={id + "n"} required className="input" value={f.name} onChange={set("name")} /></div>
        <div><label className="label" htmlFor={id + "p"}>Phone</label><input id={id + "p"} className="input" value={f.phone} onChange={set("phone")} placeholder="01x-xxx xxxx" /></div>
      </div>
      <div><label className="label" htmlFor={id + "t"}>Topic</label>
        <select id={id + "t"} className="input" value={f.topic} onChange={set("topic")}>
          {["Order enquiry", "Custom bouquet", "Corporate / bulk order", "Delivery question", "Other"].map((x) => <option key={x}>{x}</option>)}
        </select></div>
      <div><label className="label" htmlFor={id + "m"}>Message</label><textarea id={id + "m"} required rows={5} className="input" value={f.msg} onChange={set("msg")} /></div>
      <button className="btn btn-wa !py-3.5"><WhatsAppIcon /> Send on WhatsApp</button>
    </form>
  );
}
