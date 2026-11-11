// ============================================================
//  BikaFlora — main business settings
//  Change your phone, email, cut-off time etc. here only.
// ============================================================

export const site = {
  name: "BikaFlora",
  legalName: "BikaFlora Florist",
  tagline: "Fresh Flower Delivery in Kuala Lumpur & Selangor",
  description:
    "BikaFlora is an online florist delivering fresh hand bouquets, rose bouquets, flower boxes, convocation flowers and grand opening flower stands across Kuala Lumpur and Selangor. Order easily on WhatsApp with same-day delivery.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://bikaflora-one.vercel.app").replace(/\/$/, ""),

  // WhatsApp number in international format, digits only (no +, no spaces)
  whatsapp: "923350947538",
  phoneDisplay: "+92 335 094 7538",
  email: "fahadkhan10151015@gmail.com",

  currency: "RM",
  sameDayCutoff: "2:00 PM",
  openingHours: "Daily, 9:00 AM – 9:00 PM",
  addressRegion: "Kuala Lumpur & Selangor, Malaysia",

  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    tiktok: "https://tiktok.com/",
  },

  // Hero video: put your file in /public/video/ and set e.g. "/video/hero.mp4". Leave "" for the animated slideshow.
  heroVideo: "",

  // Set to false once you replace data/reviews.ts with your REAL customer reviews.
  reviewsAreSamples: true,
};

export const absoluteUrl = (path = "/") => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;

export const formatPrice = (n: number) => `${site.currency} ${n.toLocaleString("en-MY")}`;
