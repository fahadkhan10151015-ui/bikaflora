// ============================================================
//  PRODUCTS — sample products. Replace with your real ones.
//  images: your own photo ("/images/products/x.jpg") or unsplash("<photo id>")
//  categories: must match slugs in data/categories.ts
// ============================================================
import { unsplash } from "@/lib/images";

export type Product = {
  slug: string;
  sku: string;
  name: string;
  price: number;
  compareAt?: number;
  options?: { label: string; price: number }[];
  categories: string[];
  images: string[];
  /** Optional soft backdrop behind transparent (cut-out) photos: blush | cream | sage | lavender | peach | white */
  tones?: string[];
  badge?: string;
  short: string;
  description: string;
  includes: string[];
  featured?: boolean;
};

const own = (file: string) => `/images/products/${file}`;

export const products: Product[] = [
  {
    slug: "classic-red-rose-bouquet",
    sku: "BF-001",
    name: "Classic Red Rose Bouquet",
    price: 169,
    compareAt: 199,
    options: [
      { label: "9 roses", price: 169 },
      { label: "12 roses", price: 209 },
      { label: "24 roses", price: 359 },
    ],
    categories: ["rose-bouquets", "anniversary-flowers"],
    images: [unsplash("1561729098-cbab0f7a9f7c"), unsplash("1730749387748-79e6d50a269c"), unsplash("1620346328449-f8fb90a40ad5")],
    badge: "Best Seller",
    short: "Velvet red roses hand-tied with greenery — the timeless way to say I love you.",
    description:
      "Our most-loved bouquet. Long-stem red roses are hand-tied with fresh greenery and wrapped in premium paper with a satin ribbon. Perfect for anniversaries, Valentine's Day, proposals and every moment that deserves a classic.",
    includes: ["Premium red roses", "Seasonal greenery", "Premium wrapping & ribbon", "Message card"],
    featured: true,
  },
  {
    slug: "blush-pink-rose-bouquet",
    sku: "BF-002",
    name: "Blush Pink Rose Bouquet",
    price: 149,
    options: [
      { label: "10 roses", price: 149 },
      { label: "20 roses", price: 249 },
    ],
    categories: ["rose-bouquets", "birthday-flowers"],
    images: [unsplash("1680563094046-5d846e2c59d1"), unsplash("1562158756-c9667871dba2")],
    badge: "New",
    short: "Soft pink roses in blush wrapping — sweet, gentle and full of charm.",
    description:
      "Pink roses stand for admiration and gratitude. This bouquet pairs blush pink roses with matching wrap for a soft, romantic look that suits birthdays, mothers, best friends and thank-you moments.",
    includes: ["Pink roses", "Blush wrapping", "Satin ribbon", "Message card"],
    featured: true,
  },
  {
    slug: "rosie-blush-soap-rose-bouquet",
    sku: "BF-003",
    name: "Rosie Blush Soap Rose Bouquet",
    price: 129,
    categories: ["everlasting-bouquets", "anniversary-flowers"],
    images: [own("bouquet-a.webp"), own("bouquet-a.webp")],
    tones: ["blush", "cream"],
    badge: "Long-lasting",
    short: "Red and pink soap roses with purple baby's breath that stay beautiful for months.",
    description:
      "Soap roses look like real roses, carry a light fragrance and never wilt. Rosie Blush mixes red and pink soap roses with dried purple baby's breath, wrapped in white with a burgundy ribbon — a keepsake for anniversaries and apologies.",
    includes: ["Red & pink soap roses", "Dried baby's breath", "Bunny-tail accent", "Message card"],
    featured: true,
  },
  {
    slug: "tulip-dream-everlasting-bouquet",
    sku: "BF-004",
    name: "Tulip Dream Everlasting Bouquet",
    price: 149,
    categories: ["everlasting-bouquets", "tulip-bouquets", "graduation-flowers"],
    images: [own("bouquet-b.webp"), own("bouquet-b.webp")],
    tones: ["cream", "sage"],
    badge: "Handmade",
    short: "Handmade coral tulips with golden dried leaves — a gift that lasts forever.",
    description:
      "Handmade tulips framed with golden ruscus and dried fillers, finished with a champagne satin bow. They never wilt, so they look perfect in convocation photos and stay on the shelf for years.",
    includes: ["Handmade tulips", "Golden dried leaves", "Dried fillers", "Satin ribbon"],
  },
  {
    slug: "pastel-tulip-bouquet",
    sku: "BF-005",
    name: "Pastel Tulip Bouquet",
    price: 189,
    categories: ["tulip-bouquets", "birthday-flowers"],
    images: [unsplash("1775301331506-f7b0d0b3ac44"), unsplash("1561181286-d3fee7d55364")],
    short: "Pink and white tulips in a fresh, airy arrangement.",
    description:
      "Tulips mean perfect love and happy beginnings. This pastel bouquet mixes pink and white tulips for a clean, modern look that brightens any room.",
    includes: ["Pink & white tulips", "Greenery", "Premium wrapping", "Message card"],
    featured: true,
  },
  {
    slug: "sunshine-sunflower-bouquet",
    sku: "BF-006",
    name: "Sunshine Sunflower Bouquet",
    price: 119,
    options: [
      { label: "3 sunflowers", price: 119 },
      { label: "6 sunflowers", price: 179 },
    ],
    categories: ["sunflower-bouquets", "graduation-flowers", "birthday-flowers"],
    images: [unsplash("1601884928885-92a922f7962f"), unsplash("1629386255808-c3ceb405173c"), unsplash("1543409777-30250849aa3e")],
    badge: "Convocation Pick",
    short: "Bright sunflowers that bring instant happiness — a convocation favourite.",
    description:
      "Sunflowers stand for loyalty, warmth and success, which makes them the most popular convocation flower in Malaysia. Wrapped in kraft paper with soft fillers.",
    includes: ["Fresh sunflowers", "Fillers & greenery", "Kraft wrapping", "Message card"],
    featured: true,
  },
  {
    slug: "pink-rose-flower-box",
    sku: "BF-007",
    name: "Pink Rose Flower Box",
    price: 219,
    categories: ["flower-boxes", "anniversary-flowers"],
    images: [unsplash("1560583035-79c3e11ae176"), unsplash("1581264692636-3cf6f29655c2")],
    badge: "Premium",
    short: "Pink roses arranged in a keepsake box — no vase needed.",
    description:
      "A luxurious box arrangement of pink roses, ready to display. Flower boxes are perfect for office desks, hotel rooms and anyone who doesn't have a vase at home.",
    includes: ["Pink roses", "Keepsake box", "Floral foam (water-ready)", "Message card"],
    featured: true,
  },
  {
    slug: "pink-lily-bouquet",
    sku: "BF-008",
    name: "Pink Lily Bouquet",
    price: 179,
    categories: ["flower-boxes", "birthday-flowers"],
    images: [unsplash("1712260710751-71335d444503"), unsplash("1685307298280-a6655309a0bf"), unsplash("1712260777360-ce2533cf0a25")],
    short: "Fragrant pink lilies that open beautifully over several days.",
    description:
      "Lilies stand for devotion and good wishes. Pink lilies open over several days and fill the room with fragrance — great for birthdays, new homes and get-well wishes.",
    includes: ["Pink lilies", "Greenery", "Premium wrapping", "Message card"],
  },
  {
    slug: "purple-hydrangea-bouquet",
    sku: "BF-009",
    name: "Purple Hydrangea Bouquet",
    price: 199,
    categories: ["flower-boxes", "anniversary-flowers"],
    images: [unsplash("1641366638032-557d4a999d80"), unsplash("1652346064068-1ae0d97502c3")],
    short: "Lush purple hydrangeas for a full, elegant statement.",
    description:
      "Big, cloud-like hydrangea heads make this bouquet look generous and elegant. A beautiful choice for anniversaries, mothers and congratulations.",
    includes: ["Purple hydrangeas", "Greenery", "Premium wrapping", "Message card"],
  },
  {
    slug: "garden-mix-bouquet",
    sku: "BF-010",
    name: "Garden Mix Bouquet",
    price: 159,
    categories: ["birthday-flowers"],
    images: [unsplash("1572454591674-2739f30d8c40"), unsplash("1589100534833-475e31a17b4e")],
    short: "A cheerful mix of seasonal blooms in pink, beige and red.",
    description:
      "Our florists pick the freshest seasonal flowers of the day for this colourful garden-style bouquet. Every bouquet is a little different and always joyful.",
    includes: ["Seasonal mixed flowers", "Greenery", "Premium wrapping", "Message card"],
  },
  {
    slug: "rose-and-babys-breath-bouquet",
    sku: "BF-011",
    name: "Rose & Baby's Breath Bouquet",
    price: 139,
    categories: ["rose-bouquets", "graduation-flowers"],
    images: [unsplash("1620752379460-d4adfe02a5ce"), unsplash("1613052271194-5427710fb39d")],
    short: "Pink roses surrounded by clouds of white baby's breath.",
    description:
      "A sweet and classic pairing: soft pink roses framed with airy baby's breath. Lovely for graduations, birthdays and first dates.",
    includes: ["Pink roses", "Baby's breath", "Premium wrapping", "Message card"],
  },
  {
    slug: "peony-romance-bouquet",
    sku: "BF-012",
    name: "Peony Romance Bouquet",
    price: 289,
    categories: ["anniversary-flowers", "flower-boxes"],
    images: [unsplash("1780498802979-3d75e2b87ff2"), unsplash("1780498803120-aac176cf365e"), unsplash("1560256608-43f0b6f7588e")],
    badge: "Luxury",
    short: "Lush pink peonies — the most romantic flower of all.",
    description:
      "Peonies symbolise romance, prosperity and a happy marriage. Full, ruffled pink peonies make this our most luxurious bouquet. Availability depends on season — message us to confirm.",
    includes: ["Pink peonies", "Greenery", "Luxury wrapping", "Message card"],
    featured: true,
  },
  {
    slug: "blue-and-white-bouquet",
    sku: "BF-013",
    name: "Blue & White Bouquet",
    price: 169,
    categories: ["graduation-flowers"],
    images: [unsplash("1638098917136-d8681d39fbc3"), unsplash("1610841802859-94794ea50e1b")],
    short: "Calm blue and white blooms — elegant for convocations and congratulations.",
    description:
      "Blue stands for trust and calm, white for new beginnings. This fresh bouquet is a stylish choice for graduates, new jobs and congratulations.",
    includes: ["Blue & white flowers", "Greenery", "Premium wrapping", "Message card"],
  },
  {
    slug: "lavender-dream-bouquet",
    sku: "BF-014",
    name: "Lavender Dream Bouquet",
    price: 159,
    categories: ["birthday-flowers", "anniversary-flowers"],
    images: [unsplash("1602136303098-f5aa2b9c9df9"), unsplash("1624466548064-b98215a03cf3")],
    short: "White and purple flowers in a dreamy, soft arrangement.",
    description:
      "Soft purples and whites create a calm, dreamy bouquet. A thoughtful gift for birthdays, colleagues and anyone who loves gentle colours.",
    includes: ["White & purple flowers", "Greenery", "Premium wrapping", "Message card"],
  },
  {
    slug: "rainbow-tulip-bouquet",
    sku: "BF-015",
    name: "Rainbow Tulip Bouquet",
    price: 209,
    categories: ["tulip-bouquets", "birthday-flowers"],
    images: [unsplash("1619962992057-be492a5816f6"), unsplash("1491994336086-44f5d76dd8f2")],
    short: "Pink, white and red tulips together — bright and full of life.",
    description:
      "A colourful mix of tulips that instantly lifts the mood. Ideal for birthdays, get-well wishes and \"just because\" surprises.",
    includes: ["Mixed tulips", "Greenery", "Premium wrapping", "Message card"],
  },
  {
    slug: "sweetheart-pink-bouquet",
    sku: "BF-016",
    name: "Sweetheart Pink Bouquet",
    price: 129,
    categories: ["birthday-flowers", "rose-bouquets"],
    images: [unsplash("1623406795110-99f1c4325084"), unsplash("1587317997383-2e6c1b24040f")],
    short: "Pink and white blooms in a sweet, budget-friendly bouquet.",
    description:
      "Pretty, fresh and affordable. The Sweetheart bouquet mixes pink and white flowers for a lovely surprise without breaking the bank.",
    includes: ["Pink & white flowers", "Greenery", "Wrapping & ribbon", "Message card"],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const productsInCategory = (slug: string) => products.filter((p) => p.categories.includes(slug));
export const featuredProducts = () => products.filter((p) => p.featured);
export const relatedProducts = (p: Product, n = 4) =>
  products
    .filter((x) => x.slug !== p.slug)
    .map((x) => ({ x, score: x.categories.filter((c) => p.categories.includes(c)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((r) => r.x);
