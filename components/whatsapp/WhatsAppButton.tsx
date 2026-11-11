"use client";
import { generalMessages } from "@/lib/whatsapp";
import { useAuth, displayName } from "@/components/auth/AuthProvider";
import { useWhatsAppChooser } from "./WhatsAppChooser";
import { WhatsAppIcon } from "./WhatsAppIcon";

type Props = { label?: string; className?: string; iconClassName?: string };

/** Green button that opens the general WhatsApp message picker. */
export default function WhatsAppButton({ label = "Chat on WhatsApp", className = "btn btn-wa", iconClassName = "w-5 h-5" }: Props) {
  const open = useWhatsAppChooser();
  const { user } = useAuth();
  const customer = user ? { name: displayName(user), email: user.email } : undefined;
  return (
    <button type="button" className={className} onClick={() => open({ title: "How can we help?", options: generalMessages(customer) })}>
      <WhatsAppIcon className={iconClassName} />
      {label && <span>{label}</span>}
    </button>
  );
}
