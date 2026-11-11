// ============================================================
//  BikaFlora — business settings (edit here only)
// ============================================================

export const site = {
  name: "BikaFlora",
  description:
    "BikaFlora is an online florist in Kuala Lumpur & Selangor. Rose bouquets, tulips, sunflowers, flower boxes and convocation flowers with same-day express or scheduled delivery. Order easily on WhatsApp.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://bikaflora-one.vercel.app").replace(/\/$/, ""),

  // WhatsApp number: country code + number, digits only (Malaysia example: 60123456789)
  whatsapp: "923350947538",
  phoneDisplay: "+92 335 094 7538",
  email: "fahadkhan10151015@gmail.com",

  currency: "RM",
  sameDayCutoff: "2:00 PM",
  openingHours: "Daily, 9:00 AM – 9:00 PM",
  addressRegion: "Kuala Lumpur & Selangor, Malaysia",

  // Hero background video (free Pexels clip). Replace with "/video/your-video.mp4" to use your own.
  heroVideo: "https://videos.pexels.com/video-files/3914572/3914572-hd_1920_1080_30fps.mp4",

  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    tiktok: "https://tiktok.com/",
  },

  // Set to false once data/reviews.ts holds your REAL customer reviews.
  reviewsAreSamples: true,
};

/** Delivery methods the customer can choose on a product page. */
export const deliveryMethods = [
  { id: "express", label: "Same-day Express", detail: `Order before ${site.sameDayCutoff}, delivered today` },
  { id: "scheduled", label: "Scheduled Delivery", detail: "Delivered in 1-2 days" },
] as const;

export type DeliveryMethodId = (typeof deliveryMethods)[number]["id"];

export const absoluteUrl = (path = "/") => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;

export const formatPrice = (n: number) => `${site.currency} ${n.toLocaleString("en-MY")}`;
