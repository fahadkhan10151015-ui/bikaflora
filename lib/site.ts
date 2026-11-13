// ============================================================
//  BikaFlora — business settings (edit here only)
// ============================================================

export const site = {
  name: "BikaFlora",
  description:
    "BikaFlora is an online florist in Kuala Lumpur & Selangor. Long-lasting soap rose bouquets, Ferrero Rocher bouquets, heart bouquets and graduation bouquets with same-day delivery or pre-order. Order easily on WhatsApp.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://bikaflora.vercel.app").replace(/\/$/, ""),

  // WhatsApp number: country code + number, digits only (Malaysia example: 60123456789)
  whatsapp: "601161326484",
  phoneDisplay: "+60 11-6132 6484",
  email: "bikaflora01@gmail.com",

  currency: "RM",
  openingHours: "Daily, 9:00 AM – 9:00 PM",
  addressRegion: "Kuala Lumpur & Selangor, Malaysia",

  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    tiktok: "https://tiktok.com/",
  },
};

/** The two ways a customer can order. */
export const deliveryMethods = [
  { id: "instant", label: "Instant Delivery", detail: "Ready bouquets, delivered today at any time" },
  { id: "preorder", label: "Pre-order", detail: "Tell us what you want and the date, we prepare it for you" },
] as const;

/** Couriers we use. */
export const deliveryPartners = [
  { name: "Grab Express", use: "Instant same-day delivery in KL & Selangor" },
  { name: "Lalamove", use: "Instant same-day delivery in KL & Selangor" },
  { name: "J&T Express", use: "Crochet bouquets & gifts sent further away" },
];

/** Payment policy shown across the site. */
export const paymentNote = "Full payment in advance. We start preparing once payment is received.";
export const paymentMethods = "Online bank transfer (FPX / DuitNow) or e-wallet (Touch 'n Go)";

export type DeliveryMethodId = (typeof deliveryMethods)[number]["id"];

export const absoluteUrl = (path = "/") => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;

export const formatPrice = (n: number) => `${site.currency} ${n.toLocaleString("en-MY")}`;
