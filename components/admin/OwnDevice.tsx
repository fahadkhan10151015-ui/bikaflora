"use client";
import { useEffect, useState } from "react";
import { ShieldCheck, ShieldOff } from "lucide-react";
import { isStaffDevice, setStaffDevice } from "@/lib/wa-track";
import { Toggle } from "./ui";

/** Shows whether this phone/computer is left out of the stats, with a switch. */
export default function OwnDevice() {
  const [off, setOff] = useState<boolean | null>(null);
  useEffect(() => setOff(isStaffDevice()), []);
  if (off === null) return null;
  return (
    <div className={`rounded-2xl px-4 py-3 text-sm flex flex-wrap items-center gap-3 ${off ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>
      {off ? <ShieldCheck className="w-5 h-5 shrink-0" /> : <ShieldOff className="w-5 h-5 shrink-0" />}
      <span className="flex-1 min-w-[220px]">
        {off
          ? <><b>Your clicks are not counted on this device.</b> Everything you see here is from customers. Open the admin panel once on each phone or computer you use, and it is left out too.</>
          : <><b>This device is being counted.</b> Your own visits and WhatsApp taps on this device show up as customer clicks. Turn the switch on to leave them out.</>}
      </span>
      <span className="flex items-center gap-2 font-semibold whitespace-nowrap">Don&apos;t count me <Toggle on={off} onChange={(v) => { setStaffDevice(v); setOff(v); }} label="Don't count this device" /></span>
    </div>
  );
}
