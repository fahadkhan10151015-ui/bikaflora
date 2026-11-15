// Stock shown on product cards and product pages. Edit the numbers here when stock changes.
// Products not listed (made-to-order designs) show "Made to order" instead of a number.
import { overrides } from "@/lib/overrides";

const base: Record<string, number> = {
  "pink-soap-rose-heart-large": 85,
  "red-soap-rose-heart-large": 78,
  "pink-white-rose-heart-large": 72,
  "ferrero-rocher-pink-roses": 88,
  "ferrero-rocher-red-roses": 81,
  "pink-charm": 90,
  "forever-yours": 67,
  "bouquet-protection-bag": 95,
  "white-blue-soap-rose-heart": 54,
  "blue-noir-for-him": 47,
  "graduation-signature": 62,
  "bestie-blossoms": 58,
  "pinky-promise": 51,
  "365-days-of-love": 64,
  "kitkat-pink-roses": 43,
  "graduates-sunshine": 69,
  "hearts-desire": 46,
  "pink-gift-box": 57,
  "red-rose-gift-box": 61,
  "heavenly-blue": 49,
  "ocean-whisper": 34,
  "orchid-elegance": 28,
  "dark-obsession": 37,
  "midnight-romance": 31,
  "everlasting-stem": 39,
  "pink-pearl-whisper": 26,
  "crochet-pink-paradise": 12,
  "chenille-stem-flowers": 15,
};

// Stock numbers saved in the admin panel win over the list above.
export const stock: Record<string, number> = { ...base };
for (const [slug, o] of Object.entries(overrides.products)) if (o.stock !== undefined) stock[slug] = o.stock;
