// ============================================================
//  PRODUCTS — BikaFlora's real catalogue.
//
//  Photos live in /public/products/<slug>/ (01.webp, 02.webp …).
//  Photo order: put the most attractive photo first. Mix it: some products open with the
//  bouquet-only photo, others with the person holding it. Never drop photos, only reorder.
//  Details card (size/what's inside) goes last.
//  Products with colours keep each colour's photos in its own folder (…/pink/, …/red/).
//
//  To add a product: copy one block below, change the text, put the photos in a new
//  folder, and use a category slug from data/categories.ts.
// ============================================================

export type Variant = {
  id: string;
  label: string;
  /** Colour dot shown on the colour button */
  swatch: string;
  images: string[];
  design?: string;
  includes?: string[];
  size?: string;
};

/** Custom wrapping-paper colour (pre-order only). The image is a preview of the bouquet in that paper. */
export type PaperColour = { id: string; label: string; swatch: string; image?: string };

export type Product = {
  slug: string;
  sku: string;
  name: string;
  /** Optional Chinese name, shown under the title */
  nameZh?: string;
  price: number;
  /** Crossed-out "before" price */
  compareAt?: number;
  /** Size / price options (not used yet) */
  options?: { label: string; price: number }[];
  /** Colour versions: each has its own photos */
  variants?: Variant[];
  categories: string[];
  images: string[];
  tones?: string[];
  badge?: string;
  short: string;
  /** Intro paragraph */
  description: string;
  design: string;
  durability: string;
  occasions: string;
  care: string[];
  includes: string[];
  size?: string;
  /** Same-day instant delivery available */
  instant: boolean;
  /** Can be pre-ordered for a future date */
  preorder: boolean;
  /** Optional custom wrapping colours (pre-order only). First item = the original paper. */
  paperColours?: PaperColour[];
  /** Extra words that help search and the chat assistant */
  tags?: string[];
};

const pics = (folder: string, n: number) => Array.from({ length: n }, (_, i) => `/products/${folder}/${String(i + 1).padStart(2, "0")}.webp`);

export const products: Product[] = [
  {
    slug: "ferrero-rocher-pink-roses",
    sku: "BF-001",
    name: "Ferrero Rocher Pink Roses (Soap)",
    price: 145,
    compareAt: 170,
    categories: ["premium-bouquets", "chocolate-flower-bouquets"],
    images: pics("ferrero-rocher-pink-roses", 4),
    badge: "Sweet & Long-lasting",
    short: "10 pink soap roses and 7 Ferrero Rocher chocolates in soft peach wrapping.",
    description: "A luxurious bouquet featuring 10 premium pink soap roses, 7 Ferrero Rocher chocolates in protective cases, preserved baby's breath, elegant premium wrapping and a beautiful satin ribbon.",
    design: "10 premium pink soap roses, 7 Ferrero Rocher chocolates in protective cases, preserved baby's breath, elegant premium wrapping and a beautiful satin ribbon.",
    durability: "Long-lasting soap roses and preserved fillers make this a beautiful keepsake. Chocolates are individually protected to maintain freshness.",
    occasions: "Birthdays, anniversaries, Valentine's Day, Mother's Day, graduations, surprises and all special occasions.",
    care: ["Keep away from direct sunlight and excessive heat.", "Avoid contact with water and moisture.", "Gently remove dust when needed.", "Store chocolates in a cool, dry place.", "Handle carefully to maintain the bouquet's beauty."],
    includes: ["10 premium pink soap roses", "7 Ferrero Rocher chocolates (each in a protective case)", "Preserved baby's breath", "Premium peach wrapping", "Pink satin ribbon"],
    size: "35 cm wide × 45 cm long",
    instant: true,
    preorder: true,
    tags: ["chocolate", "ferrero", "soap rose", "pink", "romantic"],
  },
  {
    slug: "ferrero-rocher-red-roses",
    sku: "BF-002",
    name: "Ferrero Rocher Red Roses (Soap)",
    price: 145,
    compareAt: 170,
    categories: ["premium-bouquets", "chocolate-flower-bouquets"],
    images: pics("ferrero-rocher-red-roses", 4),
    badge: "Sweet & Romantic",
    short: "10 red soap roses and 7 Ferrero Rocher chocolates in luxurious black wrapping.",
    description: "An elegant arrangement featuring 10 premium red soap roses, 7 Ferrero Rocher chocolates in protective round covers, preserved pink baby's breath, luxurious black wrapping and a beautiful red satin ribbon.",
    design: "10 premium red soap roses, 7 Ferrero Rocher chocolates in protective round covers, preserved pink baby's breath, luxurious black wrapping and a red satin ribbon.",
    durability: "Long-lasting soap roses and preserved fillers make this a beautiful keepsake. Chocolates are individually protected for a delightful sweet surprise.",
    occasions: "Birthdays, anniversaries, Valentine's Day, Mother's Day, proposals and other special celebrations.",
    care: ["Keep away from water, direct sunlight and excessive heat.", "Store in a cool, dry place to keep the flowers beautiful and the chocolates in good condition."],
    includes: ["10 premium red soap roses", "7 Ferrero Rocher chocolates (each in a protective cover)", "Preserved pink baby's breath", "Black premium wrapping", "Red satin ribbon"],
    size: "35 cm wide × 45 cm long",
    instant: true,
    preorder: true,
    tags: ["chocolate", "ferrero", "soap rose", "red", "romantic", "valentine"],
  },
  {
    slug: "pink-soap-rose-heart-large",
    sku: "BF-003",
    name: "Pink Soap Rose Heart Large",
    nameZh: "深愛不渝",
    price: 140,
    compareAt: 165,
    categories: ["premium-bouquets", "best-seller"],
    images: pics("pink-soap-rose-heart-large", 5),
    badge: "Top Seller",
    short: "25 pink and ivory soap roses layered into a heart. Our top-selling bouquet.",
    description: "Our top-selling bouquet. A heart-shaped bouquet of 25 soap roses in 5 layers with preserved baby's breath, wrapped in layered pink paper: an everlasting keepsake that stays beautiful without wilting.",
    design: "Heart-shaped bouquet of 25 pink and ivory soap roses (5 layers) and preserved baby's breath in layered pink wrapping.",
    durability: "An everlasting keepsake that stays fresh and fragrant without wilting.",
    occasions: "Anniversaries, weddings, Valentine's Day, birthdays and Mother's Day.",
    care: ["Keep in a cool, dry place.", "Keep away from sunlight and water."],
    includes: ["25 pink & ivory soap roses in a heart shape", "Preserved baby's breath", "Layered pink wrapping", "Pink organza ribbon"],
    size: "40 cm wide × 45 cm long",
    instant: true,
    preorder: true,
    tags: ["heart", "romantic", "anniversary", "valentine", "soap rose", "pink", "top selling"],
  },
  {
    slug: "red-soap-rose-heart-large",
    sku: "BF-004",
    name: "Red Soap Rose Heart Large",
    price: 140,
    compareAt: 165,
    categories: ["premium-bouquets", "best-seller"],
    images: pics("red-soap-rose-heart-large", 4),
    badge: "Top Seller",
    short: "25 red soap roses layered into a heart with caspia. Our top-selling bouquet.",
    description: "Our top-selling bouquet in classic red. A heart-shaped bouquet of 25 red soap roses in 7 layers with preserved caspia, wrapped in layered blush paper and tied with a burgundy ribbon.",
    design: "Heart-shaped bouquet of 25 red soap roses (7 layers) and preserved caspia in layered blush wrapping.",
    durability: "An everlasting keepsake that stays fresh and fragrant without wilting.",
    occasions: "Anniversaries, weddings, Valentine's Day, birthdays and Mother's Day.",
    care: ["Keep in a cool, dry place.", "Keep away from sunlight and water."],
    includes: ["25 red soap roses in a heart shape", "Preserved caspia filler", "Layered blush-pink wrapping", "Burgundy satin ribbon"],
    size: "45 cm wide × 50 cm long",
    instant: true,
    preorder: true,
    tags: ["heart", "romantic", "anniversary", "valentine", "soap rose", "red", "top selling"],
  },
  {
    slug: "white-blue-soap-rose-heart",
    sku: "BF-005",
    name: "White & Blue Soap Rose Heart",
    price: 140,
    compareAt: 165,
    categories: ["premium-bouquets"],
    images: pics("white-blue-soap-rose-heart", 4),
    badge: "For Him & Her",
    short: "A heart of white soap roses framed by baby-blue roses, in light-blue wrapping.",
    description: "A beautiful combination of premium white and baby-blue soap roses, complemented by delicate caspia filler. Finished with multi-layered light-blue wrapping and a navy-blue satin ribbon for a sophisticated look. A lovely choice for both men and women.",
    design: "Premium white and baby-blue soap roses with caspia filler, multi-layered light-blue wrapping and a navy-blue satin ribbon.",
    durability: "Premium soap flowers keep their beautiful look for a long time. Unlike fresh flowers, they don't wilt or need water.",
    occasions: "Birthdays, anniversaries, graduations, Valentine's Day, Mother's Day, thank-you gifts and other special celebrations.",
    care: ["Keep away from direct sunlight and excessive heat.", "Avoid contact with water and moisture.", "Do not crush or press the flowers.", "Keep in a cool, dry place."],
    includes: ["White soap roses in a heart shape", "Baby-blue soap roses", "Caspia filler", "Multi-layer light-blue wrapping", "Navy-blue satin ribbon"],
    size: "35 cm wide × 45 cm long",
    instant: true,
    preorder: true,
    tags: ["blue", "white", "heart", "for him", "men"],
  },
  {
    slug: "blue-noir-for-him",
    sku: "BF-006",
    name: "Blue Noir For Him (Soap)",
    price: 150,
    compareAt: 175,
    categories: ["premium-bouquets"],
    images: pics("blue-noir-for-him", 6),
    badge: "For Him",
    short: "25 blue and black soap roses in sleek black wrapping. A bold gift for him.",
    description: "Bold, elegant and made for him. Twenty-five blue and black soap roses wrapped in premium black paper and tied with a white \"Love is eternal\" ribbon.",
    design: "25 stalks of blue and black soap roses wrapped in premium black paper with a white ribbon.",
    durability: "Long-lasting soap roses that won't wilt.",
    occasions: "Anniversaries, birthdays, Valentine's Day and romantic gifts.",
    care: ["Keep away from direct sunlight and water.", "Keep in a cool, dry place."],
    includes: ["25 blue & black soap roses", "Premium black wrapping", "White \"Love is eternal\" ribbon"],
    instant: true,
    preorder: true,
    tags: ["for him", "men", "boyfriend", "husband", "black", "blue"],
  },
  {
    slug: "graduation-signature",
    sku: "BF-007",
    name: "The Graduation Signature (Soap)",
    price: 150,
    compareAt: 175,
    categories: ["premium-bouquets"],
    images: pics("graduation-signature", 5),
    badge: "Graduation",
    short: "Sunflowers, blue & white roses and a graduation teddy bear. Made for convocation day.",
    description: "Celebrate a student's achievement and encourage their dreams with this sunflower and rose bouquet, complete with a cute graduation teddy bear. Perfect for graduations, exam success and new beginnings: a gift that says Congratulations, Believe in Yourself and Keep Shining!",
    design: "Sunflowers, blue and white soap roses, daisies, a graduation teddy bear and premium blue wrapping.",
    durability: "Long-lasting decorative flowers. Keep dry and away from direct sunlight.",
    occasions: "Graduation, convocation, congratulations, student motivation and best wishes.",
    care: ["Store in a cool, dry place.", "Keep away from direct sunlight.", "Gently remove dust when needed."],
    includes: ["3 sunflowers", "Blue & white soap roses", "Daisies & gerbera", "Graduation teddy bear (cap & gown)", "Wheat stalks & eucalyptus", "Royal-blue premium wrapping", "White organza ribbon"],
    size: "50 cm wide × 60 cm long",
    instant: true,
    preorder: true,
    tags: ["graduation", "convocation", "convo", "konvo", "student", "sunflower", "teddy"],
  },
  {
    slug: "ocean-whisper",
    sku: "BF-008",
    name: "Ocean Whisper (Soap)",
    nameZh: "真诚之美",
    price: 135,
    compareAt: 160,
    categories: ["premium-bouquets"],
    images: pics("ocean-whisper", 4),
    short: "White soap roses, orchid and daisies in elegant navy-blue wrapping.",
    description: "Fresh and calm like the ocean. White soap roses, a cymbidium orchid and daisies with soft blue accents, wrapped in textured navy-blue paper. A refined choice for graduations, thank-you gifts and anyone who loves blue.",
    design: "Premium soap roses, orchid, daisies and elegant navy-blue wrapping.",
    durability: "Long-lasting beauty with proper care.",
    occasions: "Birthdays, anniversaries, graduations and appreciation.",
    care: ["Keep dry.", "Keep away from sunlight and heat."],
    includes: ["White soap roses", "White cymbidium orchid", "Daisies", "Blue hydrangea accents", "Anthurium & eucalyptus greenery", "Navy-blue textured wrapping", "White organza ribbon"],
    size: "35 cm wide × 55 cm long",
    instant: true,
    preorder: true,
    tags: ["blue", "navy", "orchid", "for him", "graduation", "thank you"],
  },
  {
    slug: "bestie-blossoms",
    sku: "BF-009",
    name: "Bestie Blossoms (Soap)",
    nameZh: "永恆友誼",
    price: 130,
    compareAt: 150,
    categories: ["premium-bouquets"],
    images: pics("bestie-blossoms", 5),
    badge: "Best Friends",
    short: "Pink soap roses with white orchids and daisies. The perfect gift for your bestie.",
    description: "A sweet thank-you for the friend who is always there. Pink and coral soap roses with white orchids and daisies, golden leaves and soft fillers in elegant pink wrapping.",
    design: "Pink soap roses with white orchids, daisies and elegant premium wrapping.",
    durability: "Long-lasting decorative flowers.",
    occasions: "Best friends, birthdays and thank-you gifts.",
    care: ["Keep away from water, sunlight and humidity."],
    includes: ["Pink & coral soap roses", "White cymbidium orchids", "White daisies", "Golden leaves & caspia fillers", "Pink textured wrapping", "Organza ribbon"],
    size: "40 cm wide × 56 cm long",
    instant: true,
    preorder: true,
    tags: ["friend", "bestie", "thank you", "pink"],
  },
  {
    slug: "orchid-elegance",
    sku: "BF-010",
    name: "Orchid Elegance (Soap)",
    nameZh: "兰花雅韵",
    price: 120,
    compareAt: 140,
    categories: ["premium-bouquets"],
    images: pics("orchid-elegance", 4),
    short: "Ivory soap roses, white orchids and pink gerberas in soft lavender wrapping.",
    description: "Graceful and cheerful. Handmade ivory soap roses and white orchids meet bright pink gerbera daisies and preserved baby's breath, finished in lavender wrapping with a pink bow.",
    design: "Handmade soap roses, white orchids, pink gerberas and daisies, with preserved baby's breath and premium wrapping.",
    durability: "Long-lasting flowers.",
    occasions: "Birthdays, anniversaries, romantic gifts and special celebrations.",
    care: ["Keep away from water, direct sunlight and humidity."],
    includes: ["Ivory soap roses", "White cymbidium orchids", "Pink gerbera daisies", "White daisies", "Preserved baby's breath & eucalyptus", "Lavender textured wrapping", "Pink satin & organza bow"],
    size: "50 cm wide × 40 cm long",
    instant: true,
    preorder: true,
    tags: ["orchid", "gerbera", "pink", "lavender"],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const productsInCategory = (slug: string) => products.filter((p) => p.categories.includes(slug));
/** Best sellers first, then the rest. */
export const featuredProducts = () => [...products].sort((a, b) => Number(b.categories.includes("best-seller")) - Number(a.categories.includes("best-seller")));
export const isAddOn = (p: Product) => p.categories.includes("add-ons");
export const addOns = () => products.filter(isAddOn);
export const relatedProducts = (p: Product, n = 4) =>
  products
    .filter((x) => x.slug !== p.slug && !isAddOn(x))
    .map((x) => ({ x, score: x.categories.filter((c) => p.categories.includes(c)).length + (x.tags?.filter((t) => p.tags?.includes(t)).length ?? 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((r) => r.x);
/** Categories that currently have at least one product. */
export const hasProducts = (categorySlug: string) => products.some((p) => p.categories.includes(categorySlug));
