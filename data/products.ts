// ============================================================
//  PRODUCTS — sample products. Replace with your real ones.
//  Put your photos in /public/images/products/ and update "images".
//  "categories" must match slugs in data/categories.ts
// ============================================================

export type Product = {
  slug: string;
  sku: string;
  name: string;
  price: number;
  compareAt?: number;
  options?: { label: string; price: number }[];
  categories: string[];
  images: string[];
  /** backdrop colour for each image: blush | cream | sage | lavender | peach | white */
  tones?: string[];
  badge?: string;
  short: string;
  description: string;
  includes: string[];
  featured?: boolean;
};

const P = (n: "a" | "b") => `/images/products/bouquet-${n}.webp`;

export const products: Product[] = [
  {
    slug: "rosie-blush-soap-rose-bouquet",
    sku: "BF-001",
    name: "Rosie Blush Soap Rose Bouquet",
    price: 129,
    compareAt: 159,
    options: [
      { label: "Regular (5 roses)", price: 129 },
      { label: "Large (9 roses)", price: 179 },
    ],
    categories: ["soap-flower-bouquets", "rose-bouquets", "anniversary-flowers"],
    images: [P("a"), P("a"), P("a")],
    tones: ["blush", "white", "cream"],
    badge: "Best Seller",
    short: "Red and pink soap roses with purple baby's breath in a soft white wrap.",
    description:
      "Rosie Blush mixes deep red and soft pink soap roses with dried purple baby's breath and a bunny-tail accent, wrapped in white with a burgundy ribbon. The roses are lightly scented and do not wilt, so the bouquet stays beautiful on a desk or shelf for months. A safe, romantic pick for anniversaries, birthdays and apologies.",
    includes: ["Red & pink soap roses", "Dried baby's breath", "Bunny tail accent", "Gift card with your message"],
    featured: true,
  },
  {
    slug: "tulip-dream-crochet-bouquet",
    sku: "BF-002",
    name: "Tulip Dream Crochet Bouquet",
    price: 149,
    options: [
      { label: "Regular (7 tulips)", price: 149 },
      { label: "Large (12 tulips)", price: 219 },
    ],
    categories: ["crochet-flower-bouquets", "tulip-bouquets", "graduation-flowers"],
    images: [P("b"), P("b"), P("b")],
    tones: ["cream", "white", "blush"],
    badge: "Handmade",
    short: "Hand-crocheted pink tulips with golden dried leaves and a satin bow.",
    description:
      "Tulip Dream features hand-crocheted coral-pink tulips framed with golden ruscus, dried flowers and white wrapping finished with a champagne satin bow. Each tulip is made by hand, so it will never wilt. Popular for convocation photos and as a forever keepsake.",
    includes: ["Handmade crochet tulips", "Golden dried leaves", "Dried filler flowers", "Satin ribbon", "Gift card"],
    featured: true,
  },
  {
    slug: "forever-love-red-rose-bouquet",
    sku: "BF-003",
    name: "Forever Love Red Rose Bouquet",
    price: 169,
    options: [
      { label: "9 roses", price: 169 },
      { label: "11 roses", price: 199 },
      { label: "21 roses", price: 329 },
    ],
    categories: ["rose-bouquets", "anniversary-flowers"],
    images: [P("a"), P("a")],
    tones: ["lavender", "blush"],
    short: "Classic red roses for your favourite person.",
    description:
      "A romantic bouquet led by velvet red roses with pink accents and baby's breath. Choose 9, 11 or 21 stems to match the moment, from a sweet anniversary to a big surprise.",
    includes: ["Red roses", "Pink accent roses", "Baby's breath", "Gift card"],
    featured: true,
  },
  {
    slug: "golden-meadow-dried-tulip-bouquet",
    sku: "BF-004",
    name: "Golden Meadow Dried Tulip Bouquet",
    price: 139,
    categories: ["dried-preserved-flowers", "tulip-bouquets", "birthday-flowers"],
    images: [P("b"), P("b")],
    tones: ["peach", "cream"],
    short: "Pink tulips with golden dried foliage on a warm peach backdrop.",
    description:
      "Golden Meadow pairs pink tulips with golden dried leaves and soft cream filler flowers for a warm, rustic look. Long-lasting and perfect for birthdays and housewarmings.",
    includes: ["Pink tulips", "Golden dried leaves", "Cream filler flowers", "Gift card"],
    featured: true,
  },
  {
    slug: "sweet-peach-birthday-bouquet",
    sku: "BF-005",
    name: "Sweet Peach Birthday Bouquet",
    price: 119,
    categories: ["birthday-flowers", "soap-flower-bouquets"],
    images: [P("a"), P("a")],
    tones: ["peach", "cream"],
    badge: "New",
    short: "A cheerful mix of roses and baby's breath for birthdays.",
    description:
      "Bright, cheerful and easy to love. Sweet Peach brings together red and pink roses with purple baby's breath. A perfect birthday surprise for friends, sisters and colleagues.",
    includes: ["Mixed roses", "Baby's breath", "Gift card"],
    featured: true,
  },
  {
    slug: "convocation-glory-tulip-bouquet",
    sku: "BF-006",
    name: "Convocation Glory Tulip Bouquet",
    price: 159,
    categories: ["graduation-flowers", "crochet-flower-bouquets"],
    images: [P("b"), P("b")],
    tones: ["lavender", "white"],
    short: "Graduation bouquet that still looks perfect after the ceremony.",
    description:
      "Made for convocation day. Handmade tulips with golden leaves stay fresh-looking through hours of photos under the sun. Add a mini graduation bear or a custom ribbon message on WhatsApp.",
    includes: ["Handmade tulips", "Golden dried leaves", "Ribbon", "Gift card"],
    featured: true,
  },
  {
    slug: "lavender-whisper-soap-bouquet",
    sku: "BF-007",
    name: "Lavender Whisper Soap Bouquet",
    price: 135,
    categories: ["soap-flower-bouquets", "anniversary-flowers"],
    images: [P("a"), P("a")],
    tones: ["lavender", "white"],
    short: "Soft lavender tones with pink and red roses.",
    description:
      "Lavender Whisper is a gentle, romantic bouquet with pink and red soap roses and lilac baby's breath. Lightly fragrant and long-lasting.",
    includes: ["Soap roses", "Lilac baby's breath", "Gift card"],
  },
  {
    slug: "sage-garden-tulip-bouquet",
    sku: "BF-008",
    name: "Sage Garden Tulip Bouquet",
    price: 145,
    categories: ["tulip-bouquets", "crochet-flower-bouquets", "birthday-flowers"],
    images: [P("b"), P("b")],
    tones: ["sage", "cream"],
    short: "Fresh, calm tones with coral tulips and dried leaves.",
    description:
      "Coral tulips and golden dried leaves set against soft sage tones. A calm and elegant gift for mothers, teachers and new homes.",
    includes: ["Handmade tulips", "Dried leaves", "Gift card"],
  },
  {
    slug: "classic-cream-rose-bouquet",
    sku: "BF-009",
    name: "Classic Cream Rose Bouquet",
    price: 125,
    categories: ["rose-bouquets", "soap-flower-bouquets"],
    images: [P("a"), P("a")],
    tones: ["cream", "peach"],
    short: "Elegant roses with a soft, neutral wrap.",
    description:
      "A timeless rose bouquet in a cream wrap. Suitable for any occasion: thank-you gifts, get well soon, or a simple \"thinking of you\".",
    includes: ["Roses", "Baby's breath", "Gift card"],
  },
  {
    slug: "pure-white-tulip-bouquet",
    sku: "BF-010",
    name: "Pure White Wrap Tulip Bouquet",
    price: 155,
    categories: ["tulip-bouquets", "graduation-flowers"],
    images: [P("b"), P("b")],
    tones: ["white", "sage"],
    short: "Minimalist white wrap that lets the tulips shine.",
    description:
      "Clean white wrapping, champagne ribbon and bold coral tulips. A modern, minimalist bouquet that photographs beautifully.",
    includes: ["Handmade tulips", "Dried fillers", "Champagne ribbon", "Gift card"],
  },
  {
    slug: "sage-romance-rose-bouquet",
    sku: "BF-011",
    name: "Sage Romance Rose Bouquet",
    price: 139,
    categories: ["rose-bouquets", "dried-preserved-flowers"],
    images: [P("a"), P("a")],
    tones: ["sage", "blush"],
    short: "Roses and dried baby's breath with a natural feel.",
    description:
      "Red and pink roses mixed with dried baby's breath for a natural, garden-style look. A lovely gift for someone who prefers soft, earthy colours.",
    includes: ["Roses", "Dried baby's breath", "Gift card"],
  },
  {
    slug: "blush-tulip-love-bouquet",
    sku: "BF-012",
    name: "Blush Tulip Love Bouquet",
    price: 149,
    categories: ["tulip-bouquets", "anniversary-flowers"],
    images: [P("b"), P("b")],
    tones: ["blush", "peach"],
    short: "Pink tulips in a blush setting, made for romance.",
    description:
      "Pink tulips stand for caring love. Blush Tulip Love is a sweet romantic gift that lasts, perfect for anniversaries and 520.",
    includes: ["Handmade tulips", "Dried fillers", "Gift card"],
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
