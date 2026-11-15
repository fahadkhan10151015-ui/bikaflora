/** WhatsApp link to a customer's number (Malaysian numbers like 012-345 6789 become 60123456789). */
export function waLinkTo(phone: string, text: string) {
  let n = phone.replace(/\D/g, "");
  if (n.startsWith("0")) n = "6" + n;
  return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
}
