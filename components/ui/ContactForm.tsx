"use client";
import { useState } from "react";
import { waLink } from "@/lib/whatsapp";
import { site } from "@/lib/site";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppIcon";

export default function ContactForm() {
  const [f, setF] = useState({ name: "", phone: "", topic: "Order enquiry", msg: "" });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi ${site.name}, my name is ${f.name}${f.phone ? ` (${f.phone})` : ""}.\n\nTopic: ${f.topic}\n\n${f.msg}`;
    window.open(waLink(text), "_blank");
  };
  return (
    <form onSubmit={send} className="grid gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="label" htmlFor="n">Your name</label><input id="n" required className="input" value={f.name} onChange={set("name")} /></div>
        <div><label className="label" htmlFor="p">Phone</label><input id="p" className="input" value={f.phone} onChange={set("phone")} placeholder="01x-xxx xxxx" /></div>
      </div>
      <div><label className="label" htmlFor="t">Topic</label>
        <select id="t" className="input" value={f.topic} onChange={set("topic")}>
          {["Order enquiry", "Custom bouquet", "Corporate / bulk order", "Delivery question", "Other"].map((x) => <option key={x}>{x}</option>)}
        </select></div>
      <div><label className="label" htmlFor="m">Message</label><textarea id="m" required rows={5} className="input" value={f.msg} onChange={set("msg")} /></div>
      <button className="btn btn-wa !py-3.5"><WhatsAppIcon /> Send on WhatsApp</button>
    </form>
  );
}
