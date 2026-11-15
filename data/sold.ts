// How many of each bouquet have been sold (all channels). Shown as "58 sold" on cards and product pages.
// Numbers saved in the admin panel (Products → Sold) win over this list.
import { overrides } from "@/lib/overrides";

const base: Record<string, number> = {
  // Best sellers
  "pink-soap-rose-heart-large": 58,
  "red-soap-rose-heart-large": 55,
  "pink-white-rose-heart-large": 52,
  "365-days-of-love": 50,
  "graduation-signature": 47,
  "hearts-desire": 45,
  "pinky-promise": 43,
  // Other bouquets
  "ferrero-rocher-pink-roses": 40,
  "ferrero-rocher-red-roses": 38,
  "pink-charm": 36,
  "forever-yours": 35,
  "white-blue-soap-rose-heart": 34,
  "bestie-blossoms": 32,
  "graduates-sunshine": 31,
  "red-rose-gift-box": 30,
  "pink-gift-box": 29,
  "blue-noir-for-him": 28,
  "kitkat-pink-roses": 27,
  "heavenly-blue": 26,
  "dark-obsession": 25,
  "midnight-romance": 24,
  "everlasting-stem": 23,
  "ocean-whisper": 22,
  "pink-pearl-whisper": 21,
  "orchid-elegance": 20,
  "chenille-stem-flowers": 19,
  "crochet-pink-paradise": 18,
  "52-roses-heart": 16,
  "99-roses-heart": 15,
  "bouquet-protection-bag": 37,
};

export const sold: Record<string, number> = { ...base };
for (const [slug, o] of Object.entries(overrides.products)) if (o.sold !== undefined) sold[slug] = o.sold;
