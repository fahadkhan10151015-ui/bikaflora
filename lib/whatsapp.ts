import { site, absoluteUrl, formatPrice } from "./site";

/** Opens a WhatsApp chat with a message already typed in. */
export const waLink = (text: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export type WaProduct = { name: string; sku: string; slug: string; price: number; size?: string };
export type WaCustomer = { name?: string; email?: string };

export type MessageOption = { id: string; title: string; hint: string; text: string };

const join = (lines: (string | false | undefined)[]) => lines.filter((l) => l !== false && l !== undefined).join("\n");
const signOff = (c?: WaCustomer) => (c?.name ? `\n\nThank you,\n${c.name}${c.email ? ` (${c.email})` : ""}` : "\n\nThank you!");

/** The messages a customer can pick from on a product page. Product details always come first. */
export function productMessages(p: WaProduct, delivery: string, c?: WaCustomer): MessageOption[] {
  const header = join([
    `*${p.name}*`,
    `Code: ${p.sku}`,
    p.size && `Size: ${p.size}`,
    `Price: ${formatPrice(p.price)}`,
    absoluteUrl(`/product/${p.slug}`),
  ]);

  return [
    {
      id: "order",
      title: "Order this bouquet",
      hint: "Place an order for this item",
      text: `Hi ${site.name}, I would like to order:\n\n${header}\nDelivery: ${delivery}\n\nPlease confirm availability and the total price.${signOff(c)}`,
    },
    {
      id: "info",
      title: "Ask about this bouquet",
      hint: "Questions about flowers, size or colours",
      text: `Hi ${site.name}, I have a question about this bouquet:\n\n${header}\n\nCould you share more details?${signOff(c)}`,
    },
    {
      id: "custom",
      title: "Request a custom version",
      hint: "Different colours, more stems or a budget",
      text: `Hi ${site.name}, I like this bouquet and would like a custom version:\n\n${header}\n\nCan you make it in different colours or a different size?${signOff(c)}`,
    },
    {
      id: "delivery",
      title: "Check delivery to my area",
      hint: "Ask about delivery time and fee",
      text: `Hi ${site.name}, can you deliver this bouquet to my area?\n\n${header}\nDelivery: ${delivery}\n\nMy area is: `,
    },
  ];
}

/** The messages a customer can pick from anywhere else on the site. */
export function generalMessages(c?: WaCustomer): MessageOption[] {
  return [
    {
      id: "order",
      title: "Place an order",
      hint: "Get help choosing and ordering a bouquet",
      text: `Hi ${site.name}, I would like to order a bouquet. Can you help me choose?${signOff(c)}`,
    },
    {
      id: "info",
      title: "Ask a question",
      hint: "Prices, flowers, payment and more",
      text: `Hi ${site.name}, I have a question about your flowers.${signOff(c)}`,
    },
    {
      id: "custom",
      title: "Custom bouquet",
      hint: "Your colours, flowers and budget",
      text: `Hi ${site.name}, I would like a custom bouquet. My budget and preferred colours are: `,
    },
    {
      id: "delivery",
      title: "Check delivery area",
      hint: "Same-day or scheduled delivery",
      text: `Hi ${site.name}, do you deliver to my area? My area is: `,
    },
  ];
}
