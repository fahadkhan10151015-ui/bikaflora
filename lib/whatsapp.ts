import { site, absoluteUrl, formatPrice } from "./site";

export type WaProduct = {
  name: string;
  sku: string;
  slug: string;
  price: number;
  option?: string;
};

export type WaDetails = {
  area?: string;
  date?: string;
  cardMessage?: string;
  customerName?: string;
  customerEmail?: string;
};

export function waLink(text: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}

/** Order message — the product appears at the TOP so you instantly know what the customer wants. */
export function orderMessage(p: WaProduct, d: WaDetails = {}) {
  const lines = [
    `🌸 *NEW ORDER — ${site.name}*`,
    ``,
    `*Product:* ${p.name}`,
    `*Code:* ${p.sku}`,
    p.option ? `*Size:* ${p.option}` : null,
    `*Price:* ${formatPrice(p.price)}`,
    `*Link:* ${absoluteUrl(`/product/${p.slug}`)}`,
    ``,
    `*Delivery area:* ${d.area || "(please fill in)"}`,
    `*Delivery date:* ${d.date || "(please fill in)"}`,
    d.cardMessage ? `*Card message:* ${d.cardMessage}` : null,
    d.customerName ? `*My name:* ${d.customerName}` : null,
    d.customerEmail ? `*My email:* ${d.customerEmail}` : null,
    ``,
    `Hi ${site.name}, I would like to order this item. Please confirm availability and total with delivery. Thank you!`,
  ];
  return lines.filter((l) => l !== null).join("\n");
}

/** Question message — also starts with the product so you know what they are asking about. */
export function enquiryMessage(p: WaProduct, d: WaDetails = {}) {
  const lines = [
    `❓ *PRODUCT ENQUIRY — ${site.name}*`,
    ``,
    `*Product:* ${p.name} (${p.sku})`,
    `*Price:* ${formatPrice(p.price)}`,
    `*Link:* ${absoluteUrl(`/product/${p.slug}`)}`,
    d.customerName ? `*My name:* ${d.customerName}` : null,
    ``,
    `Hi ${site.name}, I have a question about this product: `,
  ];
  return lines.filter((l) => l !== null).join("\n");
}

/** General message from any page — includes the page the customer was looking at. */
export function pageMessage(pageTitle: string, path: string) {
  return [
    `💬 *ENQUIRY — ${site.name}*`,
    ``,
    `*Page:* ${pageTitle}`,
    `*Link:* ${absoluteUrl(path)}`,
    ``,
    `Hi ${site.name}, I need some help: `,
  ].join("\n");
}
