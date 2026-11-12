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
  /** Average star rating (1-5) and number of reviews. SAMPLE values — replace with your real ratings. */
  rating?: number;
  reviews?: number;
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
    rating: 4.9,
    reviews: 128,
    name: "Classic Red Rose Bouquet",
    price: 169,
    compareAt: 199,
    options: [
      { label: "9 roses", price: 169 },
      { label: "12 roses", price: 209 },
      { label: "24 roses", price: 359 },
    ],
    categories: ["best-seller", "fresh-flowers", "premium-bouquets"],
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
    rating: 4.8,
    reviews: 86,
    name: "Blush Pink Rose Bouquet",
    price: 149,
    options: [
      { label: "10 roses", price: 149 },
      { label: "20 roses", price: 249 },
    ],
    categories: ["best-seller", "fresh-flowers"],
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
    rating: 4.9,
    reviews: 64,
    name: "Rosie Blush Soap Rose Bouquet",
    price: 129,
    categories: ["best-seller"],
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
    rating: 4.8,
    reviews: 41,
    name: "Tulip Dream Everlasting Bouquet",
    price: 149,
    categories: ["best-seller", "pre-order"],
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
    rating: 4.7,
    reviews: 52,
    name: "Pastel Tulip Bouquet",
    price: 189,
    categories: ["fresh-flowers", "premium-bouquets"],
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
    rating: 4.9,
    reviews: 97,
    name: "Sunshine Sunflower Bouquet",
    price: 119,
    options: [
      { label: "3 sunflowers", price: 119 },
      { label: "6 sunflowers", price: 179 },
    ],
    categories: ["best-seller", "fresh-flowers"],
    images: [unsplash("1601884928885-92a922f7962f"), unsplash("1629386255808-c3ceb405173c"), unsplash("1543409777-30250849aa3e")],
    badge: "Popular",
    short: "Bright sunflowers that bring instant happiness — a convocation favourite.",
    description:
      "Sunflowers stand for loyalty, warmth and success, which makes them the most popular convocation flower in Malaysia. Wrapped in kraft paper with soft fillers.",
    includes: ["Fresh sunflowers", "Fillers & greenery", "Kraft wrapping", "Message card"],
    featured: true,
  },
  {
    slug: "pink-rose-flower-box",
    sku: "BF-007",
    rating: 4.8,
    reviews: 73,
    name: "Pink Rose Flower Box",
    price: 219,
    categories: ["flower-gift-box", "best-seller", "premium-bouquets"],
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
    rating: 4.7,
    reviews: 38,
    name: "Pink Lily Bouquet",
    price: 179,
    categories: ["fresh-flowers"],
    images: [unsplash("1712260710751-71335d444503"), unsplash("1685307298280-a6655309a0bf"), unsplash("1712260777360-ce2533cf0a25")],
    short: "Fragrant pink lilies that open beautifully over several days.",
    description:
      "Lilies stand for devotion and good wishes. Pink lilies open over several days and fill the room with fragrance — great for birthdays, new homes and get-well wishes.",
    includes: ["Pink lilies", "Greenery", "Premium wrapping", "Message card"],
  },
  {
    slug: "purple-hydrangea-bouquet",
    sku: "BF-009",
    rating: 4.8,
    reviews: 29,
    name: "Purple Hydrangea Bouquet",
    price: 199,
    categories: ["fresh-flowers", "flower-gift-box"],
    images: [unsplash("1641366638032-557d4a999d80"), unsplash("1652346064068-1ae0d97502c3")],
    short: "Lush purple hydrangeas for a full, elegant statement.",
    description:
      "Big, cloud-like hydrangea heads make this bouquet look generous and elegant. A beautiful choice for anniversaries, mothers and congratulations.",
    includes: ["Purple hydrangeas", "Greenery", "Premium wrapping", "Message card"],
  },
  {
    slug: "garden-mix-bouquet",
    sku: "BF-010",
    rating: 4.6,
    reviews: 44,
    name: "Garden Mix Bouquet",
    price: 159,
    categories: ["fresh-flowers"],
    images: [unsplash("1572454591674-2739f30d8c40"), unsplash("1589100534833-475e31a17b4e")],
    short: "A cheerful mix of seasonal blooms in pink, beige and red.",
    description:
      "Our florists pick the freshest seasonal flowers of the day for this colourful garden-style bouquet. Every bouquet is a little different and always joyful.",
    includes: ["Seasonal mixed flowers", "Greenery", "Premium wrapping", "Message card"],
  },
  {
    slug: "rose-and-babys-breath-bouquet",
    sku: "BF-011",
    rating: 4.8,
    reviews: 57,
    name: "Rose & Baby's Breath Bouquet",
    price: 139,
    categories: ["fresh-flowers"],
    images: [unsplash("1620752379460-d4adfe02a5ce"), unsplash("1613052271194-5427710fb39d")],
    short: "Pink roses surrounded by clouds of white baby's breath.",
    description:
      "A sweet and classic pairing: soft pink roses framed with airy baby's breath. Lovely for graduations, birthdays and first dates.",
    includes: ["Pink roses", "Baby's breath", "Premium wrapping", "Message card"],
  },
  {
    slug: "peony-romance-bouquet",
    sku: "BF-012",
    rating: 5.0,
    reviews: 31,
    name: "Peony Romance Bouquet",
    price: 289,
    categories: ["premium-bouquets", "pre-order"],
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
    rating: 4.7,
    reviews: 26,
    name: "Blue & White Bouquet",
    price: 169,
    categories: ["fresh-flowers"],
    images: [unsplash("1638098917136-d8681d39fbc3"), unsplash("1610841802859-94794ea50e1b")],
    short: "Calm blue and white blooms — elegant for convocations and congratulations.",
    description:
      "Blue stands for trust and calm, white for new beginnings. This fresh bouquet is a stylish choice for graduates, new jobs and congratulations.",
    includes: ["Blue & white flowers", "Greenery", "Premium wrapping", "Message card"],
  },
  {
    slug: "lavender-dream-bouquet",
    sku: "BF-014",
    rating: 4.8,
    reviews: 33,
    name: "Lavender Dream Bouquet",
    price: 159,
    categories: ["fresh-flowers"],
    images: [unsplash("1602136303098-f5aa2b9c9df9"), unsplash("1624466548064-b98215a03cf3")],
    short: "White and purple flowers in a dreamy, soft arrangement.",
    description:
      "Soft purples and whites create a calm, dreamy bouquet. A thoughtful gift for birthdays, colleagues and anyone who loves gentle colours.",
    includes: ["White & purple flowers", "Greenery", "Premium wrapping", "Message card"],
  },
  {
    slug: "rainbow-tulip-bouquet",
    sku: "BF-015",
    rating: 4.7,
    reviews: 40,
    name: "Rainbow Tulip Bouquet",
    price: 209,
    categories: ["premium-bouquets", "pre-order"],
    images: [unsplash("1619962992057-be492a5816f6"), unsplash("1491994336086-44f5d76dd8f2")],
    short: "Pink, white and red tulips together — bright and full of life.",
    description:
      "A colourful mix of tulips that instantly lifts the mood. Ideal for birthdays, get-well wishes and \"just because\" surprises.",
    includes: ["Mixed tulips", "Greenery", "Premium wrapping", "Message card"],
  },
  {
    slug: "sweetheart-pink-bouquet",
    sku: "BF-016",
    rating: 4.6,
    reviews: 61,
    name: "Sweetheart Pink Bouquet",
    price: 129,
    categories: ["fresh-flowers", "best-seller"],
    images: [unsplash("1623406795110-99f1c4325084"), unsplash("1587317997383-2e6c1b24040f")],
    short: "Pink and white blooms in a sweet, budget-friendly bouquet.",
    description:
      "Pretty, fresh and affordable. The Sweetheart bouquet mixes pink and white flowers for a lovely surprise without breaking the bank.",
    includes: ["Pink & white flowers", "Greenery", "Wrapping & ribbon", "Message card"],
  },
  // ---------- Below RM100 & Mini Bouquet Series ----------
  {
    slug: "single-rose-bouquet",
    sku: "BF-017",
    rating: 4.8,
    reviews: 74,
    name: "Single Rose Bouquet",
    price: 39,
    categories: ["below-100", "mini-bouquets"],
    images: [unsplash("1620346328449-f8fb90a40ad5"), unsplash("1561729098-cbab0f7a9f7c")],
    badge: "Under RM50",
    short: "One perfect rose with baby's breath, wrapped and ready to gift.",
    description: "Simple and sweet. A single premium rose with baby's breath, wrapped in our signature paper. Perfect for classmates, colleagues and little surprises.",
    includes: ["1 premium rose", "Baby's breath", "Wrapping & ribbon", "Message card"],
  },
  {
    slug: "mini-rose-posy",
    sku: "BF-018",
    rating: 4.9,
    reviews: 58,
    name: "Mini Rose Posy",
    price: 59,
    options: [
      { label: "3 roses", price: 59 },
      { label: "5 roses", price: 79 },
    ],
    categories: ["mini-bouquets", "below-100", "fresh-flowers"],
    images: [unsplash("1629833790673-e9d1b342a816"), unsplash("1562158756-c9667871dba2")],
    badge: "Cute",
    short: "A small hand-tied posy of pink and white roses.",
    description: "Our mini posy is small in size but big on charm. Pink and white roses with soft fillers, wrapped in pastel paper.",
    includes: ["3 or 5 roses", "Seasonal fillers", "Pastel wrapping", "Message card"],
  },
  {
    slug: "mini-sunflower-bouquet",
    sku: "BF-019",
    rating: 4.8,
    reviews: 47,
    name: "Mini Sunflower Bouquet",
    price: 69,
    categories: ["mini-bouquets", "below-100", "fresh-flowers"],
    images: [unsplash("1543409777-30250849aa3e"), unsplash("1629386255808-c3ceb405173c")],
    short: "One bright sunflower with greenery, perfect for convocation day.",
    description: "A cheerful mini bouquet with one big sunflower and fresh greenery. The favourite pick for convocations and congratulations.",
    includes: ["1 sunflower", "Greenery & fillers", "Wrapping & ribbon", "Message card"],
  },
  {
    slug: "babys-breath-mini-bouquet",
    sku: "BF-020",
    rating: 4.7,
    reviews: 35,
    name: "Baby's Breath Mini Bouquet",
    price: 79,
    categories: ["mini-bouquets", "below-100", "fresh-flowers"],
    images: [unsplash("1613052271194-5427710fb39d"), unsplash("1620752379460-d4adfe02a5ce")],
    short: "A cloud of soft baby's breath in a dreamy mini bouquet.",
    description: "Light, airy and elegant. A full mini bouquet of baby's breath that suits every occasion and every colour of outfit.",
    includes: ["Baby's breath", "Wrapping & ribbon", "Message card"],
  },
  // ---------- Crochet Bouquet ----------
  {
    slug: "crochet-tulip-bouquet",
    sku: "BF-021",
    rating: 4.9,
    reviews: 52,
    name: "Crochet Tulip Bouquet",
    price: 89,
    options: [
      { label: "3 tulips", price: 89 },
      { label: "6 tulips", price: 149 },
    ],
    categories: ["crochet-bouquets", "below-100"],
    images: [unsplash("1595301490405-0ae747be39f6"), unsplash("1700170447159-9d2d0da133a5")],
    badge: "Handmade",
    short: "Hand-knitted crochet tulips that never wilt.",
    description: "Each tulip is crocheted by hand in soft yarn, so this bouquet stays beautiful forever. Choose your colours when you order.",
    includes: ["Handmade crochet tulips", "Crochet leaves", "Wrapping & ribbon", "Message card"],
  },
  {
    slug: "crochet-flower-garden-bouquet",
    sku: "BF-022",
    rating: 4.8,
    reviews: 29,
    name: "Crochet Flower Garden Bouquet",
    price: 139,
    categories: ["crochet-bouquets", "pre-order"],
    images: [unsplash("1700170447159-9d2d0da133a5"), unsplash("1595301490405-0ae747be39f6")],
    badge: "Made to order",
    short: "A colourful mix of crochet flowers, made in your favourite colours.",
    description: "A garden of handmade crochet flowers: daisies, tulips and roses. Made to order in the colours you choose. A forever keepsake.",
    includes: ["Mixed crochet flowers", "Your choice of colours", "Premium wrapping", "Message card"],
  },
  // ---------- Chocolate & Flower Bouquets ----------
  {
    slug: "ferrero-rose-bouquet",
    sku: "BF-023",
    rating: 4.9,
    reviews: 66,
    name: "Ferrero & Rose Bouquet",
    price: 189,
    options: [
      { label: "6 Ferrero + 6 roses", price: 189 },
      { label: "12 Ferrero + 12 roses", price: 299 },
    ],
    categories: ["chocolate-flower-bouquets", "best-seller"],
    images: [unsplash("1739538032906-aa14a22027a2"), unsplash("1561729098-cbab0f7a9f7c")],
    badge: "Sweet pick",
    short: "Fresh roses and Ferrero Rocher chocolates in one bouquet.",
    description: "The sweetest gift: fresh roses paired with golden Ferrero Rocher chocolates, wrapped together in a luxury bouquet.",
    includes: ["Fresh roses", "Ferrero Rocher chocolates", "Premium wrapping", "Message card"],
  },
  {
    slug: "chocolate-rose-gift-box",
    sku: "BF-024",
    rating: 4.8,
    reviews: 31,
    name: "Chocolate & Rose Gift Box",
    price: 239,
    categories: ["chocolate-flower-bouquets", "flower-gift-box"],
    images: [unsplash("1526081347589-7fa3cb41b4b2"), unsplash("1560583035-79c3e11ae176")],
    badge: "Gift set",
    short: "A flower box with roses and a box of assorted chocolates.",
    description: "Roses arranged in an elegant gift box together with assorted premium chocolates. Ready to give, no vase needed.",
    includes: ["Roses in a gift box", "Assorted chocolates", "Ribbon", "Message card"],
  },
  {
    slug: "chocolate-strawberry-heart-box",
    sku: "BF-025",
    rating: 4.7,
    reviews: 22,
    name: "Chocolate Strawberry Heart Box",
    price: 159,
    categories: ["chocolate-flower-bouquets", "pre-order"],
    images: [unsplash("1623284060556-37e5ff559dd3"), unsplash("1526081347589-7fa3cb41b4b2")],
    short: "Chocolate-dipped strawberries in a heart box with fresh blooms.",
    description: "Fresh strawberries dipped in chocolate, arranged in a heart-shaped box with small fresh flowers. Made fresh on the day, so please pre-order.",
    includes: ["Chocolate strawberries", "Heart box", "Fresh flower accents", "Message card"],
  },
  // ---------- Pre-Order ----------
  {
    slug: "custom-pre-order-bouquet",
    sku: "BF-026",
    rating: 5.0,
    reviews: 40,
    name: "Custom Pre-Order Bouquet",
    price: 150,
    options: [
      { label: "Budget RM150", price: 150 },
      { label: "Budget RM250", price: 250 },
      { label: "Budget RM400", price: 400 },
    ],
    categories: ["pre-order"],
    images: [unsplash("1642751652611-bb9a7cad58a3"), unsplash("1567696153798-9111f9cd3d0d")],
    badge: "Your design",
    short: "Send us a photo or your idea, we make it to your requirement.",
    description: "Have a design in mind? Send us a reference photo, your colours, flowers and budget on WhatsApp. We confirm the design and price, you pay in advance, and we prepare it for your date.",
    includes: ["Designed to your idea", "Flowers of your choice", "Premium wrapping", "Message card"],
  },
  {
    slug: "grand-99-roses-bouquet",
    sku: "BF-027",
    rating: 5.0,
    reviews: 18,
    name: "Grand 99 Roses Bouquet",
    price: 899,
    categories: ["pre-order", "premium-bouquets"],
    images: [unsplash("1730749387748-79e6d50a269c"), unsplash("1561729098-cbab0f7a9f7c")],
    badge: "Luxury",
    short: "99 red roses for proposals and once-in-a-lifetime moments.",
    description: "The ultimate romantic gesture. 99 premium red roses hand-tied in a grand bouquet. Please pre-order at least 3 days ahead.",
    includes: ["99 premium red roses", "Luxury wrapping", "Satin ribbon", "Message card"],
  },
  // ---------- Add On ----------
  {
    slug: "teddy-bear-add-on",
    sku: "AD-001",
    rating: 4.9,
    reviews: 83,
    name: "Teddy Bear",
    price: 35,
    options: [
      { label: "Small (20cm)", price: 35 },
      { label: "Medium (35cm)", price: 59 },
    ],
    categories: ["add-ons"],
    images: [unsplash("1588090644556-14707d0e886a"), unsplash("1696019526035-da9436da2372")],
    short: "A soft, cuddly teddy bear to go with your bouquet.",
    description: "Add a soft teddy bear to your flower order. Delivered together with your bouquet.",
    includes: ["Soft plush teddy bear"],
  },
  {
    slug: "balloon-add-on",
    sku: "AD-002",
    rating: 4.7,
    reviews: 45,
    name: "Balloon Set",
    price: 25,
    options: [
      { label: "3 balloons", price: 25 },
      { label: "5 balloons", price: 39 },
    ],
    categories: ["add-ons"],
    images: [unsplash("1528741319675-fab004a2248d")],
    short: "Helium balloons tied to your bouquet for an extra wow.",
    description: "Add helium balloons in colours that match your bouquet. Delivered together with your flowers.",
    includes: ["Helium balloons", "Ribbon"],
  },
  {
    slug: "chocolate-add-on",
    sku: "AD-003",
    rating: 4.8,
    reviews: 39,
    name: "Chocolate Box",
    price: 30,
    categories: ["add-ons"],
    images: [unsplash("1739701655012-aca85edfe002"), unsplash("1526081347589-7fa3cb41b4b2")],
    short: "A box of chocolates to make your gift sweeter.",
    description: "Add a box of chocolates to your bouquet order. Delivered together with your flowers.",
    includes: ["Box of chocolates"],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const productsInCategory = (slug: string) => products.filter((p) => p.categories.includes(slug));
export const featuredProducts = () => products.filter((p) => p.categories.includes("best-seller"));
export const isAddOn = (p: Product) => p.categories.includes("add-ons");
export const addOns = () => products.filter(isAddOn);
export const relatedProducts = (p: Product, n = 4) =>
  products
    .filter((x) => x.slug !== p.slug && !isAddOn(x))
    .map((x) => ({ x, score: x.categories.filter((c) => p.categories.includes(c)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((r) => r.x);
