import { overrides } from "@/lib/overrides";
import { content } from "@/lib/content";
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
  /** Show the gift card choice when ordering (default yes) */
  giftCard?: boolean;
  /** Show the protection bag choice when ordering (default yes) */
  protectionBag?: boolean;
};

const pics = (folder: string, n: number) => Array.from({ length: n }, (_, i) => `/products/${folder}/${String(i + 1).padStart(2, "0")}.webp`);

export const products: Product[] = [
  {
    slug: "ferrero-rocher-pink-roses",
    sku: "BF-001",
    name: "Ferrero Rocher Pink Roses (Soap)",
    price: 145,
    compareAt: 170,
    categories: ["premium-bouquets", "chocolate-flower-bouquets", "anniversary-valentine-bouquets", "graduation-bouquets", "flowers-for-her"],
    images: ["/products/ferrero-rocher-pink-roses/ferrero-rocher-pink-rose-bouquet-kl.webp", "/products/ferrero-rocher-pink-roses/pink-soap-roses-ferrero-bouquet-table.webp", "/products/ferrero-rocher-pink-roses/ferrero-pink-roses-top-view.webp", "/products/ferrero-rocher-pink-roses/ferrero-pink-roses-size-35x45cm.webp"],
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
    categories: ["premium-bouquets", "chocolate-flower-bouquets", "birthday-flowers", "anniversary-valentine-bouquets"],
    images: ["/products/ferrero-rocher-red-roses/ferrero-rocher-red-rose-bouquet-kl.webp", "/products/ferrero-rocher-red-roses/woman-holding-red-roses-ferrero-bouquet.webp", "/products/ferrero-rocher-red-roses/ferrero-red-roses-top-view.webp", "/products/ferrero-rocher-red-roses/ferrero-red-roses-size-35x45cm.webp"],
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
    categories: ["premium-bouquets", "best-seller", "anniversary-valentine-bouquets", "flowers-for-her"],
    images: ["/products/pink-soap-rose-heart-large/pink-soap-rose-heart-bouquet-kl.webp", "/products/pink-soap-rose-heart-large/pink-rose-heart-bouquet-side-view.webp", "/products/pink-soap-rose-heart-large/pink-rose-heart-size-40x45cm.webp", "/products/pink-soap-rose-heart-large/pink-heart-bouquet-on-table.webp", "/products/pink-soap-rose-heart-large/pink-rose-heart-close-up-details.webp"],
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
    categories: ["premium-bouquets", "best-seller", "anniversary-valentine-bouquets"],
    images: ["/products/red-soap-rose-heart-large/red-soap-rose-heart-bouquet-kl.webp", "/products/red-soap-rose-heart-large/woman-holding-red-rose-heart-45x50cm.webp", "/products/red-soap-rose-heart-large/red-rose-heart-top-view.webp", "/products/red-soap-rose-heart-large/red-rose-heart-product-details.webp"],
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
    categories: ["premium-bouquets", "birthday-flowers", "graduation-bouquets", "flowers-for-him"],
    images: ["/products/white-blue-soap-rose-heart/blue-and-white-rose-heart-bouquet-kl.webp", "/products/white-blue-soap-rose-heart/white-blue-rose-heart-on-table.webp", "/products/white-blue-soap-rose-heart/white-blue-rose-heart-top-view.webp", "/products/white-blue-soap-rose-heart/white-blue-rose-heart-size-35x45cm.webp"],
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
    categories: ["premium-bouquets", "flowers-for-him"],
    images: ["/products/blue-noir-for-him/blue-and-black-rose-bouquet-for-him.webp", "/products/blue-noir-for-him/blue-noir-bouquet-front-view.webp", "/products/blue-noir-for-him/blue-noir-roses-top-view.webp", "/products/blue-noir-for-him/blue-noir-bouquet-wooden-table.webp", "/products/blue-noir-for-him/blue-noir-bouquet-detail-collage.webp", "/products/blue-noir-for-him/blue-noir-bouquet-studio.webp"],
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
    categories: ["best-seller", "premium-bouquets", "graduation-bouquets"],
    images: ["/products/graduation-signature/sunflower-graduation-bouquet-kl.webp", "/products/graduation-signature/graduation-signature-bouquet-table.webp", "/products/graduation-signature/graduation-bouquet-sunflowers-teddy-front.webp", "/products/graduation-signature/graduation-bouquet-detail-collage.webp", "/products/graduation-signature/graduation-bouquet-size-50x60cm.webp"],
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
    categories: ["premium-bouquets", "graduation-bouquets", "flowers-for-him"],
    images: ["/products/ocean-whisper/white-rose-and-orchid-bouquet-kl.webp", "/products/ocean-whisper/ocean-whisper-bouquet-size-35x55cm.webp", "/products/ocean-whisper/ocean-whisper-navy-bouquet-front.webp", "/products/ocean-whisper/ocean-whisper-product-details.webp"],
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
    categories: ["premium-bouquets", "birthday-flowers"],
    images: ["/products/bestie-blossoms/best-friend-bouquet-malaysia.webp", "/products/bestie-blossoms/bestie-blossoms-bouquet-table.webp", "/products/bestie-blossoms/bestie-blossoms-roses-orchids-close-up.webp", "/products/bestie-blossoms/bestie-blossoms-detail-collage.webp", "/products/bestie-blossoms/bestie-blossoms-size-40x56cm.webp"],
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
    categories: ["premium-bouquets", "birthday-flowers", "flowers-for-her"],
    images: ["/products/orchid-elegance/orchid-and-gerbera-bouquet-kl.webp", "/products/orchid-elegance/orchid-elegance-close-up.webp", "/products/orchid-elegance/orchid-elegance-detail-collage.webp", "/products/orchid-elegance/orchid-elegance-size-50x40cm.webp"],
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
  // ---------- Imported from the Grab store (website price = Grab price − 6%) ----------
  {
    slug: "pink-white-rose-heart-large",
    sku: "BF-011",
    name: "Pink & White Roses Heart Large",
    price: 159,
    compareAt: 185,
    categories: ["premium-bouquets", "best-seller", "anniversary-valentine-bouquets", "flowers-for-her"],
    images: ["/products/pink-white-rose-heart-large/pink-and-white-rose-heart-bouquet-top.webp", "/products/pink-white-rose-heart-large/woman-holding-pink-white-rose-heart.webp", "/products/pink-white-rose-heart-large/pink-white-heart-bouquet-organza-bow.webp", "/products/pink-white-rose-heart-large/pink-white-rose-heart-size-40x45cm.webp"],
    badge: "Top Seller",
    short: "25 pink and white soap roses shaped into a heart, framed with magenta baby's breath.",
    description: "One of our top-selling bouquets. Twenty-five pink and white soap roses are set into a full heart, framed with magenta baby's breath and wrapped in soft layered pink paper. It looks fresh for months and never wilts.",
    design: "Heart-shaped bouquet of 25 pink and white soap roses and preserved baby's breath in layered pink wrapping with an organza ribbon.",
    durability: "An everlasting keepsake that stays fresh and fragrant without wilting.",
    occasions: "Anniversaries, weddings, Valentine's Day, birthdays and Mother's Day.",
    care: ["Keep in a cool, dry place.", "Keep away from sunlight and water."],
    includes: ["25 pink & white soap roses in a heart shape", "Preserved magenta baby's breath", "Layered pink wrapping", "Pink organza ribbon"],
    size: "40 cm wide × 45 cm long",
    instant: true,
    preorder: true,
    tags: ["heart", "romantic", "anniversary", "valentine", "soap rose", "pink", "white", "top selling"],
  },
  {
    slug: "dark-obsession",
    sku: "BF-012",
    name: "Dark Obsession (Soap)",
    nameZh: "深情迷戀",
    price: 102,
    compareAt: 115,
    categories: ["premium-bouquets", "flowers-for-him"],
    images: ["/products/dark-obsession/black-soap-rose-bouquet-dark-obsession.webp", "/products/dark-obsession/woman-holding-black-rose-bouquet.webp", "/products/dark-obsession/black-roses-caspia-top-view.webp", "/products/dark-obsession/dark-obsession-detail-collage.webp"],
    badge: "Bold & Mysterious",
    short: "10 black soap roses with preserved caspia in grey and black mesh wrapping.",
    description: "For a love that runs deep. Ten black soap roses with sprigs of preserved caspia, wrapped in soft grey paper and black mesh. It stands for mystery, intense passion and devotion, and it is a striking gift that no one forgets.",
    design: "10 black soap roses paired with preserved caspia flowers, grey paper and black mesh wrapping, finished with a black ribbon.",
    durability: "Long-lasting decorative flowers that need no watering.",
    occasions: "Anniversaries, birthdays and romantic surprises.",
    care: ["Keep away from direct sunlight and moisture.", "Do not water.", "Gently remove dust when needed."],
    includes: ["10 black soap roses", "Preserved caspia", "Grey & black mesh premium wrapping", "Black ribbon"],
    instant: true,
    preorder: true,
    tags: ["black", "soap rose", "romantic", "for him", "unique"],
  },
  {
    slug: "pinky-promise",
    sku: "BF-013",
    name: "Pinky Promise (Soap)",
    nameZh: "友誼之約",
    price: 102,
    compareAt: 115,
    categories: ["best-seller", "birthday-flowers"],
    images: ["/products/pinky-promise/pinky-promise-pink-rose-daisy-bouquet.webp", "/products/pinky-promise/pink-roses-daisies-caspia-top-view.webp", "/products/pinky-promise/pinky-promise-bouquet-table.webp", "/products/pinky-promise/pinky-promise-size-30x45cm.webp"],
    badge: "Friendship Gift",
    short: "10 blush-pink soap roses with daisies and pink caspia in soft pink wrapping.",
    description: "A promise to always cherish each other. Ten blush-pink soap roses with white daisies, pink caspia and bunny-tail grass, wrapped in soft pink paper with a pink ribbon. A sweet gift for a best friend, a sister or anyone who has your back.",
    design: "10 blush-pink soap roses with white daisies, pink caspia and dried bunny tails in pink premium wrapping.",
    durability: "Soap flowers last much longer than fresh flowers with proper care.",
    occasions: "Best friends, birthdays, friendship gifts, appreciation and surprises.",
    care: ["Keep away from water, direct sunlight and humid places."],
    includes: ["10 premium pink soap roses", "White daisies", "Pink caspia filler", "Premium pink wrapping", "Pink ribbon"],
    size: "30 cm wide × 45 cm long",
    instant: true,
    preorder: true,
    tags: ["friendship", "bestie", "pink", "soap rose", "daisy"],
  },
  {
    slug: "365-days-of-love",
    sku: "BF-014",
    name: "365 Days of Love (Soap)",
    nameZh: "愛意與日俱增",
    price: 102,
    compareAt: 115,
    categories: ["best-seller", "anniversary-valentine-bouquets"],
    images: ["/products/365-days-of-love/12-red-roses-bouquet-top-view.webp", "/products/365-days-of-love/365-days-of-love-bouquet-table.webp", "/products/365-days-of-love/365-days-of-love-detail-collage.webp"],
    badge: "Classic Romance",
    short: "12 red soap roses (one for every month) in white paper and black mesh.",
    description: "Twelve roses for loving someone through all twelve months of the year. Vibrant red soap roses with fresh-looking greenery, wrapped in white paper and sheer black mesh, tied with a lettered ribbon. A classic romantic gift that stays beautiful all year.",
    design: "12 red soap roses with filler greenery in white paper and sheer black mesh, finished with an inscribed ribbon.",
    durability: "Long-lasting decorative flowers that need no watering.",
    occasions: "Anniversaries, proposals, Valentine's Day and romantic surprises.",
    care: ["Keep away from direct sunlight and moisture.", "Do not water."],
    includes: ["12 red soap roses", "Filler greenery", "White paper & black mesh wrapping", "Inscribed ribbon"],
    instant: true,
    preorder: true,
    tags: ["red", "romantic", "valentine", "anniversary", "soap rose", "12 roses"],
  },
  {
    slug: "kitkat-pink-roses",
    sku: "BF-015",
    name: "KitKat Pink Roses",
    price: 102,
    compareAt: 115,
    categories: ["chocolate-flower-bouquets", "birthday-flowers"],
    images: ["/products/kitkat-pink-roses/kitkat-flower-bouquet-pink-roses.webp", "/products/kitkat-pink-roses/kitkat-bouquet-close-up.webp", "/products/kitkat-pink-roses/kitkat-pink-roses-product-details.webp"],
    badge: "Sweet Treat",
    short: "Pink soap roses and KitKat chocolates in modern pink wrapping.",
    description: "Flowers and chocolate in one bouquet. Pink soap roses sit beneath a crown of KitKat bars, with purple baby's breath, caspia and bunny tails, all wrapped in modern pink paper with a ribbon. Fun for birthdays, a sweet way to say sorry, or a surprise on any day.",
    design: "Pink soap roses with KitKat chocolates, purple baby's breath, caspia and bunny-tail grass in pink premium wrapping.",
    durability: "The soap roses last for months. Chocolates are best enjoyed within a few weeks.",
    occasions: "Birthdays, anniversaries, celebrations, apologies and everyday surprises.",
    care: ["Keep away from direct sunlight and heat so the chocolate does not melt.", "Keep the flowers dry.", "Store in a cool place."],
    includes: ["Pink soap roses", "KitKat chocolates", "Purple baby's breath & caspia", "Premium pink wrapping", "Satin ribbon"],
    instant: true,
    preorder: true,
    tags: ["chocolate", "kitkat", "pink", "soap rose", "birthday", "sorry"],
  },
  {
    slug: "graduates-sunshine",
    sku: "BF-016",
    name: "Graduate's Sunshine",
    price: 93,
    compareAt: 105,
    categories: ["below-100", "graduation-bouquets"],
    images: ["/products/graduates-sunshine/graduation-teddy-bear-bouquet.webp", "/products/graduates-sunshine/graduates-sunshine-top-view.webp", "/products/graduates-sunshine/graduates-sunshine-detail-collage.webp"],
    badge: "Graduation",
    short: "3 sunflower soap flowers, blue hydrangea and a teddy in a graduation cap.",
    description: "Celebrate their big day. Three bright sunflower soap flowers, blue hydrangea and preserved caspia, with a little teddy bear in a graduation cap, wrapped in blue paper with a champagne ribbon. A cheerful keepsake they can keep long after the ceremony.",
    design: "3 sunflower soap flowers, preserved caspia and blue hydrangeas with a graduation teddy bear in blue wrapping.",
    durability: "Long-lasting keepsake that stays fresh indefinitely.",
    occasions: "Graduations and academic milestones.",
    care: ["Do not add water.", "Avoid direct sunlight."],
    includes: ["3 sunflower soap flowers", "Graduation teddy bear", "Blue hydrangeas", "Preserved caspia", "Blue wrapping & ribbon"],
    instant: true,
    preorder: true,
    tags: ["graduation", "sunflower", "teddy bear", "blue", "convocation"],
  },
  {
    slug: "hearts-desire",
    sku: "BF-017",
    name: "Heart's Desire",
    nameZh: "顺心如意",
    price: 93,
    compareAt: 105,
    categories: ["best-seller", "below-100", "anniversary-valentine-bouquets", "flowers-for-her"],
    images: ["/products/hearts-desire/hearts-desire-6-red-roses-bouquet.webp", "/products/hearts-desire/6-red-roses-pink-babys-breath-top.webp", "/products/hearts-desire/hearts-desire-detail-collage.webp", "/products/hearts-desire/hearts-desire-red-rose-close-ups.webp"],
    short: "6 red soap roses with pink baby's breath in cream wrapping and a burgundy bow.",
    description: "Inspired by the blessing Shùn Xīn Rú Yì: harmony, peace of mind and lasting devotion. Six red soap roses with pink baby's breath, wrapped in soft white and matte cream paper with a burgundy satin bow.",
    design: "6 red soap roses with pink baby's breath in white and cream wrapping, finished with a burgundy satin bow.",
    durability: "Everlasting roses that keep their colour and shape without wilting.",
    occasions: "Anniversaries, Valentine's Day, proposals, birthday blessings and saying sorry.",
    care: ["Keep in a cool, dry place.", "Keep away from water and direct sunlight."],
    includes: ["6 red soap roses", "Pink baby's breath", "White & cream wrapping", "Burgundy satin bow"],
    instant: true,
    preorder: true,
    tags: ["red", "romantic", "sorry", "soap rose", "blessing"],
  },
  {
    slug: "midnight-romance",
    sku: "BF-018",
    name: "Midnight Romance",
    price: 93,
    compareAt: 105,
    categories: ["below-100", "anniversary-valentine-bouquets", "flowers-for-him"],
    images: ["/products/midnight-romance/midnight-romance-18-white-roses.webp", "/products/midnight-romance/white-rose-bouquet-black-wrap-cafe.webp"],
    short: "18 white soap roses in black wrapping with \"Everyday I Love You\" lettering.",
    description: "Say it every day. Eighteen white soap roses sit in sleek black wrapping printed with \"Everyday I Love You\". The black and white look is clean and elegant, and the roses stay perfect long after the date night is over.",
    design: "18 white soap roses in black packaging with romantic lettering and a ribbon.",
    durability: "Long-lasting keepsake that stays fresh indefinitely.",
    occasions: "Anniversaries, birthdays and Valentine's Day.",
    care: ["Do not add water.", "Avoid direct sunlight."],
    includes: ["18 white soap roses", "Black lettered wrapping", "Ribbon"],
    instant: true,
    preorder: true,
    tags: ["white", "black", "romantic", "anniversary", "soap rose", "i love you"],
  },
  {
    slug: "everlasting-stem",
    sku: "BF-019",
    name: "Everlasting Stem",
    price: 93,
    compareAt: 105,
    categories: ["crochet-bouquets", "below-100", "flowers-for-her"],
    images: ["/products/everlasting-stem/red-carnation-pink-rose-bouquet.webp", "/products/everlasting-stem/everlasting-stem-bouquet-table.webp", "/products/everlasting-stem/everlasting-stem-carnations-close-up.webp"],
    short: "Red carnations and pink roses with magenta baby's breath in blush-pink wrapping.",
    description: "A warm mix of red carnations and pink roses with bright magenta baby's breath, bunny tails and greenery, wrapped in blush-pink paper with a satin ribbon. A lovely all-round gift, and a favourite for Mother's Day.",
    design: "Red carnation and pink rose flowers, preserved baby's breath and decorative greenery in blush-pink wrapping with a satin ribbon.",
    durability: "Long-lasting decorative flowers that keep their beauty with proper care.",
    occasions: "Birthdays, anniversaries, Valentine's Day, graduations, Mother's Day and surprises.",
    care: ["Keep away from water, direct sunlight and humidity.", "Store in a cool, dry place."],
    includes: ["Red carnations", "Pink roses", "Preserved baby's breath", "Decorative greenery", "Blush-pink wrapping & satin ribbon"],
    instant: true,
    preorder: true,
    tags: ["carnation", "mother's day", "pink", "red"],
  },
  {
    slug: "pink-pearl-whisper",
    sku: "BF-020",
    name: "Pink Pearl Whisper (Soap)",
    nameZh: "佳意真情",
    price: 84,
    compareAt: 95,
    categories: ["below-100", "graduation-bouquets", "flowers-for-her"],
    images: ["/products/pink-pearl-whisper/pink-pearl-whisper-thank-you-bouquet.webp", "/products/pink-pearl-whisper/pink-pearl-whisper-table.webp", "/products/pink-pearl-whisper/8-pink-white-roses-top-view.webp", "/products/pink-pearl-whisper/pink-pearl-whisper-detail-collage.webp"],
    short: "8 pink and white soap roses with fuchsia baby's breath in sky-blue wrapping.",
    description: "A gift of sincere thanks and encouragement, with lucky number 8 for prosperity. Eight pink and white soap roses with fuchsia baby's breath, wrapped in sky-blue paper and a shimmering organza bow. Warm, never too romantic.",
    design: "8 premium pink and white soap roses with fuchsia baby's breath, sky-blue wrapping and an organza bow.",
    durability: "High-quality soap flowers and preserved fillers that never wilt.",
    occasions: "Thank-you gifts, work milestones, graduations and friendships.",
    care: ["Keep dry and out of direct sunlight.", "Do not water."],
    includes: ["8 pink & white soap roses", "Fuchsia baby's breath", "Sky-blue wrapping", "Organza bow"],
    instant: true,
    preorder: true,
    tags: ["thank you", "friendship", "pink", "blue", "soap rose", "colleague"],
  },
  {
    slug: "heavenly-blue",
    sku: "BF-021",
    name: "Heavenly Blue (Soap)",
    price: 71,
    compareAt: 80,
    categories: ["below-100", "birthday-flowers", "graduation-bouquets", "flowers-for-him"],
    images: ["/products/heavenly-blue/heavenly-blue-rose-daisy-bouquet.webp", "/products/heavenly-blue/heavenly-blue-bouquet-table.webp", "/products/heavenly-blue/blue-white-roses-daisies-close-up.webp", "/products/heavenly-blue/heavenly-blue-size-30x45cm.webp"],
    short: "4 blue and 3 white soap roses with daisies in royal-blue wrapping.",
    description: "Calm and fresh like the sky. Four blue and three white soap roses with daisies and caspia, wrapped in royal-blue paper with a speckled sheet and a white satin ribbon.",
    design: "3 white soap roses, 4 blue soap roses and 3 daisies with caspia filler, blue premium wrapping and a white satin ribbon.",
    durability: "Long-lasting soap flowers that keep their beauty with proper care.",
    occasions: "Birthdays, anniversaries, graduations and celebrations.",
    care: ["Keep away from direct sunlight and moisture.", "Do not spray with water or perfume.", "Avoid crushing the petals.", "Display in a cool, dry place."],
    includes: ["3 white soap roses", "4 blue soap roses", "3 daisies", "Caspia filler", "Blue premium wrapping & white ribbon"],
    size: "30 cm wide × 45 cm long",
    instant: true,
    preorder: true,
    tags: ["blue", "white", "daisy", "soap rose", "for him", "graduation"],
  },
  {
    slug: "pink-charm",
    sku: "BF-022",
    name: "Pink Charm",
    price: 65,
    compareAt: 75,
    categories: ["below-100", "birthday-flowers"],
    images: ["/products/pink-charm/pink-charm-small-rose-bouquet.webp", "/products/pink-charm/woman-holding-pink-charm-bouquet.webp", "/products/pink-charm/pink-charm-front-view.webp", "/products/pink-charm/pink-charm-product-details.webp"],
    short: "3 white and 3 pink soap roses with daisies and caspia in white wrapping.",
    description: "Small and sweet. Three white and three pink soap roses with daisies and pink caspia, wrapped in clean white paper and tied with a pink satin ribbon. An easy, pretty gift for any occasion.",
    design: "3 white soap roses, 3 pink soap roses, daisies and caspia filler in white wrapping with a pink satin ribbon.",
    durability: "Long-lasting soap flowers that keep their beauty with proper care.",
    occasions: "Birthdays, anniversaries, graduations and surprises.",
    care: ["Keep away from direct sunlight and moisture.", "Do not spray with water or perfume.", "Avoid crushing the petals.", "Store in a cool, dry place."],
    includes: ["3 white soap roses", "3 pink soap roses", "Daisies", "Caspia filler", "White wrapping & pink ribbon"],
    instant: true,
    preorder: true,
    tags: ["pink", "white", "daisy", "soap rose", "small", "budget"],
  },
  {
    slug: "forever-yours",
    sku: "BF-023",
    name: "Forever Yours (Soap)",
    price: 65,
    compareAt: 75,
    categories: ["below-100", "anniversary-valentine-bouquets"],
    images: ["/products/forever-yours/forever-yours-red-white-rose-bouquet.webp", "/products/forever-yours/woman-holding-forever-yours-bouquet.webp", "/products/forever-yours/forever-yours-black-lace-wrapping.webp", "/products/forever-yours/forever-yours-detail-collage.webp"],
    short: "Red and white soap roses with baby's breath in elegant black wrapping.",
    description: "Classic red and white soap roses with bright baby's breath, wrapped in elegant black lace paper with a white ribbon. Romantic, bold and great value.",
    design: "Red and white soap roses with baby's breath in black wrapping.",
    durability: "Long-lasting beauty, perfect as a keepsake.",
    occasions: "Birthdays, anniversaries and romantic gifts.",
    care: ["Keep dry and away from direct sunlight."],
    includes: ["Red & white soap roses", "Baby's breath", "Black lace wrapping", "White ribbon"],
    instant: true,
    preorder: true,
    tags: ["red", "white", "black", "romantic", "soap rose", "budget"],
  },
  {
    slug: "red-rose-gift-box",
    sku: "BF-024",
    name: "Red Rose Gift Box with Light",
    price: 65,
    compareAt: 75,
    categories: ["flower-gift-box", "below-100", "birthday-flowers", "anniversary-valentine-bouquets"],
    images: ["/products/red-rose-gift-box/red-rose-led-gift-box.webp", "/products/red-rose-gift-box/red-rose-gift-box-lights-on.webp", "/products/red-rose-gift-box/red-rose-gift-box-close-up.webp", "/products/red-rose-gift-box/red-rose-gift-box-size-15x30cm.webp"],
    badge: "Glows",
    short: "3 red soap roses and 5 daisies in a clear box with built-in LED lights.",
    description: "A gift that glows. Three red soap roses and five soap daisies with caspia, set in a clear carry box with warm LED lights (3 light modes and an on/off button). Pretty on a desk or bedside table, day or night.",
    design: "3 red soap roses, 5 soap daisies and preserved caspia, wrapped with a red ribbon inside a clear protective box with LED lights.",
    durability: "Long-lasting soap flowers. The lights use a replaceable battery.",
    occasions: "Birthdays, anniversaries, Valentine's Day and Mother's Day.",
    care: ["Keep away from water and direct sunlight.", "Switch the lights off when not in use to save the battery."],
    includes: ["3 red soap roses", "5 soap daisies", "Preserved caspia", "Clear gift box with handle", "LED lights (3 modes, replaceable battery)"],
    size: "15 cm wide × 30 cm tall",
    instant: true,
    preorder: true,
    tags: ["gift box", "light", "led", "red", "soap rose", "small"],
  },
  {
    slug: "pink-gift-box",
    sku: "BF-025",
    name: "Pink Gift Box",
    price: 65,
    compareAt: 75,
    categories: ["flower-gift-box", "below-100", "flowers-for-her"],
    images: ["/products/pink-gift-box/pink-rose-gift-box.webp", "/products/pink-gift-box/woman-holding-pink-rose-gift-box.webp", "/products/pink-gift-box/pink-gift-box-size-15x30cm.webp"],
    short: "3 pink soap roses and 2 daisies in a clear carry box.",
    description: "Three pink soap roses with two soap daisies, baby's breath and bunny tails, wrapped in blue and pink and set in a clear carry box with a handle. Ready to give, easy to display.",
    design: "3 pink soap roses, 2 soap daisies and preserved baby's breath with a pink ribbon inside a clear protective box.",
    durability: "A long-lasting gift made to be treasured.",
    occasions: "Birthdays, anniversaries, Valentine's Day and Mother's Day.",
    care: ["Keep away from water and direct sunlight."],
    includes: ["3 pink soap roses", "2 soap daisies", "Preserved baby's breath", "Clear gift box with handle", "Pink ribbon"],
    size: "15 cm wide × 30 cm tall",
    instant: true,
    preorder: true,
    tags: ["gift box", "pink", "soap rose", "small"],
  },
  {
    slug: "crochet-pink-paradise",
    sku: "BF-026",
    name: "Crochet Pink Paradise",
    nameZh: "手工钩织",
    price: 136,
    compareAt: 155,
    categories: ["crochet-bouquets", "birthday-flowers", "flowers-for-her"],
    images: ["/products/crochet-pink-paradise/crochet-flower-bouquet-bunny-doll.webp", "/products/crochet-pink-paradise/crochet-pink-paradise-table.webp", "/products/crochet-pink-paradise/crochet-pink-paradise-detail-collage.webp", "/products/crochet-pink-paradise/crochet-pink-paradise-size-40x55cm.webp"],
    badge: "Handmade",
    short: "Hand-crocheted roses and daisies with a cute bunny doll in pink wrapping.",
    description: "Every flower is crocheted by hand. A large crochet rose and bright crochet daisies sit around a cute bunny doll, with dried bunny tails, premium pink wrapping and an organza ribbon. It never wilts and makes a sweet keepsake.",
    design: "Handmade crochet rose and daisies with a bunny plush, dried bunny tails, premium pink wrapping and an elegant ribbon.",
    durability: "Long-lasting flowers that stay beautiful without watering.",
    occasions: "Birthdays, anniversaries, Valentine's Day, friendship and surprises.",
    care: ["Keep away from water, direct sunlight and dust.", "Handle gently."],
    includes: ["Handmade crochet rose & daisies", "Bunny doll", "Dried bunny tails", "Premium pink wrapping", "Organza ribbon"],
    size: "40 cm wide × 55 cm long",
    instant: true,
    preorder: true,
    tags: ["crochet", "handmade", "bunny", "pink", "doll", "knitted"],
  },
  {
    slug: "chenille-stem-flowers",
    sku: "BF-027",
    name: "Chenille Stem Flowers",
    price: 93,
    compareAt: 105,
    categories: ["crochet-bouquets", "below-100", "birthday-flowers", "graduation-bouquets"],
    images: ["/products/chenille-stem-flowers/chenille-stem-flower-bouquet.webp", "/products/chenille-stem-flowers/orange-pipe-cleaner-bouquet-table.webp", "/products/chenille-stem-flowers/chenille-flowers-top-view.webp"],
    badge: "Handmade",
    short: "Handmade orange and white pipe-cleaner flowers in baby-blue wrapping.",
    description: "Handmade from soft chenille stems. Bright orange and white flowers with green foliage, wrapped in baby-blue paper and finished with a champagne-gold bow. Cheerful, unique and lasting.",
    design: "Orange and white handmade chenille flowers with green foliage in baby-blue wrapping and a champagne-gold satin bow.",
    durability: "Long-lasting decorative flowers that keep their beauty with proper care.",
    occasions: "Birthdays, anniversaries, graduations, thank-you gifts and surprises.",
    care: ["Keep away from water, direct sunlight and humidity.", "Gently remove dust when needed."],
    includes: ["Handmade chenille flowers", "Green foliage", "Baby-blue wrapping", "Champagne-gold bow"],
    instant: true,
    preorder: true,
    tags: ["handmade", "chenille", "pipe cleaner", "orange", "blue"],
  },
  {
    slug: "52-roses-heart",
    sku: "BF-028",
    name: "52 Roses Heart (Pre-order)",
    price: 375,
    compareAt: 430,
    categories: ["pre-order", "anniversary-valentine-bouquets"],
    images: ["/products/52-roses-heart/52-roses-heart-pink-orchids.webp", "/products/52-roses-heart/52-roses-heart-doll-toppers.webp"],
    badge: "Pre-order",
    short: "A grand heart of 52 soap roses. Choose your colours and design. 24–48 hours.",
    description: "A showstopper for the biggest moments. Fifty-two soap roses are set into a large standing heart, and you choose the colours and the details (orchids, a ribbon, a topper or small dolls). Made to order in 24–48 hours. After ordering, message us on WhatsApp to plan your design.",
    design: "Large heart arrangement of 52 soap roses. Colours, accents and topper can be chosen by you.",
    durability: "Soap roses last for months and never wilt.",
    occasions: "Proposals, anniversaries, weddings, Valentine's Day and big celebrations.",
    care: ["Keep in a cool, dry place.", "Keep away from water and direct sunlight."],
    includes: ["52 soap roses in a heart shape", "Your choice of colours and accents", "Ribbon finish"],
    instant: false,
    preorder: true,
    tags: ["heart", "52 roses", "proposal", "anniversary", "grand", "custom"],
  },
  {
    slug: "99-roses-heart",
    sku: "BF-029",
    name: "99 Roses Heart (Pre-order)",
    price: 544,
    compareAt: 625,
    categories: ["pre-order", "anniversary-valentine-bouquets"],
    images: ["/products/99-roses-heart/99-roses-heart-soap-roses.webp"],
    badge: "Pre-order",
    short: "Our grandest heart: 99 soap roses, made to your design. 24–48 hours.",
    description: "Ninety-nine roses mean forever. Our grandest piece is a full heart of 99 soap roses, made to your chosen colours and design. Made to order in at least 24–48 hours. After ordering, message us on WhatsApp so we can plan it together.",
    design: "Grand heart of 99 soap roses with accents and ribbon. Colours and details can be chosen by you.",
    durability: "Soap roses last for months and never wilt.",
    occasions: "Proposals, anniversaries, weddings and once-in-a-lifetime moments.",
    care: ["Keep in a cool, dry place.", "Keep away from water and direct sunlight."],
    includes: ["99 soap roses in a heart shape", "Your choice of colours and accents", "Ribbon finish"],
    instant: false,
    preorder: true,
    tags: ["heart", "99 roses", "proposal", "anniversary", "grand", "custom"],
  },
  // New on 19 Nov 2026 (from the GrabMart store). Photos live in the site photo storage.
  {"slug": "blue-serenity", "sku": "BF-031", "name": "Blue Serenity (Soap)", "nameZh": "願你屬於我", "price": 102, "compareAt": 115, "categories": ["best-seller", "birthday-flowers", "graduation-bouquets", "flowers-for-him"], "images": ["https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/blue-serenity/blue-serenity-soap-rose-bouquet-kl.webp", "https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/blue-serenity/baby-blue-soap-roses-navy-ribbon.webp", "https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/blue-serenity/blue-serenity-bouquet-details.webp"], "badge": "New Arrival", "short": "Baby-blue and dusty-blue soap roses with soft greenery, premium wrapping and a navy satin ribbon.", "description": "A calm, peaceful bouquet that says \"I'm here for you.\" Baby-blue and dusty-blue soap roses sit with delicate greenery, wrapped in premium paper and tied with a navy satin ribbon. Blue stands for loyalty and sincerity, so it suits a partner, a best friend or a proud graduate.", "design": "Baby-blue and dusty-blue soap roses with delicate greenery, premium wrapping and a navy satin ribbon.", "durability": "Soap flowers keep their colour and shape for months without water.", "occasions": "Birthdays, anniversaries, friendship, graduation and special surprises.", "care": ["Keep dry and away from direct sunlight.", "Do not add water."], "includes": ["Baby-blue soap roses", "Dusty-blue soap roses", "Delicate greenery", "Premium wrapping", "Navy satin ribbon"], "instant": true, "preorder": true, "tags": ["blue", "soap rose", "friendship", "graduation", "for him", "new"]},
  {"slug": "red-black-imperial", "sku": "BF-032", "name": "The Red & Black Imperial (Soap)", "price": 140, "compareAt": 165, "categories": ["best-seller", "premium-bouquets", "anniversary-valentine-bouquets", "birthday-flowers"], "images": ["https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/red-black-imperial/red-and-black-rose-bouquet-kl.webp", "https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/red-black-imperial/red-black-imperial-gold-heart-wrapping.webp", "https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/red-black-imperial/red-black-soap-roses-close-up.webp"], "badge": "New Arrival", "short": "Red and black soap roses in black paper with gold heart accents and an elegant ribbon. Bold and romantic.", "description": "A bold way to say \"I'm thinking of you.\" Premium red and black soap roses are hand-arranged in sophisticated black paper with delicate gold heart accents and an elegant ribbon. It suits a partner with a classy, dramatic style.", "design": "Premium red and black soap roses in black heart-patterned wrapping with gold heart accents and an elegant ribbon finish.", "durability": "Soap roses keep their deep colours for months without water.", "occasions": "Anniversaries, birthdays, Valentine's Day, romantic dates and special celebrations.", "care": ["Keep away from water, direct sunlight and humid places."], "includes": ["Red soap roses", "Black soap roses", "Black wrapping with gold heart accents", "Elegant ribbon", "Hand-arranged, ready to gift"], "instant": true, "preorder": true, "tags": ["red", "black", "romantic", "anniversary", "valentine", "luxury", "new"]},
  {"slug": "royal-pearl", "sku": "BF-033", "name": "The Royal Pearl (Soap)", "price": 102, "compareAt": 115, "categories": ["best-seller", "anniversary-valentine-bouquets", "birthday-flowers", "flowers-for-her"], "images": ["https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/royal-pearl/white-soap-rose-bouquet-royal-pearl.webp", "https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/royal-pearl/royal-pearl-love-is-eternal-ribbon.webp", "https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/royal-pearl/10-white-soap-roses-light-blue-wrap.webp", "https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/royal-pearl/royal-pearl-bouquet-details.webp"], "badge": "New Arrival", "short": "10 pure white soap roses with green fillers in light blue wrapping, tied with a gold-printed \"Love is Eternal\" ribbon.", "description": "Pure and timeless, like a string of pearls. Ten pure white soap roses with green accent fillers sit in an elegant light blue wrap, tied with a gold-printed \"Love is Eternal\" ribbon. A graceful pick for a birthday, an anniversary or even a proposal.", "design": "10 pure white soap roses with green accent fillers in light blue wrapping, tied with a gold-printed \"Love is Eternal\" ribbon.", "durability": "An everlasting soap flower keepsake that stays beautiful without wilting.", "occasions": "Birthdays, anniversaries, proposals and romantic surprises.", "care": ["Do not add water.", "Store in a cool, dry place away from direct sunlight."], "includes": ["10 pure white soap roses", "Green accent fillers", "Light blue wrapping", "Gold-printed \"Love is Eternal\" ribbon"], "instant": true, "preorder": true, "tags": ["white", "soap rose", "proposal", "anniversary", "elegant", "new"]},
  {"slug": "golden-dreams-graduation-bouquet", "sku": "BF-034", "name": "Golden Dreams Graduation Bouquet (Soap)", "price": 71, "compareAt": 80, "categories": ["graduation-bouquets", "below-100"], "images": ["https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/golden-dreams-graduation-bouquet/sunflower-graduation-bouquet-teddy-kl.webp", "https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/golden-dreams-graduation-bouquet/golden-dreams-sunflowers-soap-roses.webp", "https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/golden-dreams-graduation-bouquet/graduation-teddy-bear-bouquet.webp", "https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/golden-dreams-graduation-bouquet/golden-dreams-size-35x45cm.webp"], "badge": "New Arrival", "short": "3 soap sunflowers, 3 soap roses, caspia and a little graduation teddy in multi-layer wrapping. Big smiles under RM100.", "description": "Celebrate a new chapter with Golden Dreams. Three soap sunflowers and three soap roses sit with caspia fillers and an adorable graduation teddy bear, wrapped in premium multi-layer paper with a satin ribbon. Sunflowers mean happiness and positivity, the perfect send-off for a graduate.", "design": "3 premium soap sunflowers, 3 premium soap roses, decorative caspia fillers and 1 graduation teddy bear in premium multi-layer wrapping with a satin ribbon.", "durability": "Premium soap flowers keep their look for a long time, a lasting keepsake of a special milestone.", "occasions": "Graduation ceremonies, university and college graduates, congratulations and best wishes.", "care": ["Keep dry and away from direct sunlight."], "includes": ["3 premium soap sunflowers", "3 premium soap roses", "Decorative caspia fillers", "1 graduation teddy bear", "Premium multi-layer wrapping", "Elegant satin ribbon"], "size": "35 cm wide × 45 cm long", "instant": true, "preorder": true, "tags": ["graduation", "convocation", "sunflower", "teddy", "budget", "new"]},
  {"slug": "blue-dreams-graduation-bouquet", "sku": "BF-035", "name": "Blue Dreams Graduation Bouquet (Soap)", "price": 93, "compareAt": 105, "categories": ["graduation-bouquets", "below-100", "flowers-for-him"], "images": ["https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/blue-dreams-graduation-bouquet/blue-rose-sunflower-graduation-bouquet.webp", "https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/blue-dreams-graduation-bouquet/blue-dreams-graduation-teddy.webp", "https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/blue-dreams-graduation-bouquet/blue-dreams-sunflowers-daisies.webp", "https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/blue-dreams-graduation-bouquet/blue-dreams-size-30x50cm.webp"], "badge": "New Arrival", "short": "3 yellow soap sunflowers, 5 blue roses, 3 white daisies and a graduation teddy in blue and white wrapping.", "description": "Celebrate hard work and new beginnings with Blue Dreams. Three yellow soap sunflowers, five blue roses and three white daisies sit with caspia and a cute graduation teddy in a cap. Blue and white wrapping and a navy satin ribbon give it a smart, proud look.", "design": "3 yellow soap sunflowers, 5 blue soap roses, 3 white daisy soap flowers, caspia fillers and 1 graduation teddy bear in 2-colour blue and white wrapping with a navy satin ribbon.", "durability": "Long-lasting decorative soap flowers that keep their colour well beyond convo day.", "occasions": "Graduation, convocation, exam success and congratulations.", "care": ["Keep dry and away from direct sunlight."], "includes": ["3 yellow soap sunflowers", "5 blue soap roses", "3 white daisy soap flowers", "Caspia fillers", "1 graduation teddy bear with cap", "Blue and white wrapping", "Navy satin ribbon"], "size": "30 cm wide × 50 cm long", "instant": true, "preorder": true, "tags": ["graduation", "convocation", "blue", "sunflower", "teddy", "for him", "new"]},
  {"slug": "a-new-beginning-graduation-bouquet", "sku": "BF-036", "name": "A New Beginning Graduation Bouquet (Soap)", "price": 117, "compareAt": 135, "categories": ["graduation-bouquets", "premium-bouquets", "flowers-for-him"], "images": ["https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/a-new-beginning-graduation-bouquet/black-rose-sunflower-graduation-bouquet.webp", "https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/a-new-beginning-graduation-bouquet/a-new-beginning-graduation-teddy.webp", "https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/a-new-beginning-graduation-bouquet/black-roses-sunflowers-daisies.webp", "https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/a-new-beginning-graduation-bouquet/a-new-beginning-size-40x50cm.webp"], "badge": "New Arrival", "short": "3 soap sunflowers, 6 black roses, white daisies, pink caspia and a graduation teddy in black wrapping with a champagne ribbon.", "description": "Hard work deserves a bouquet with presence. A New Beginning pairs three soap sunflowers with six elegant black roses, three white daisies and pink caspia, plus an adorable graduation teddy. Premium black wrapping and a champagne satin ribbon make it our most stylish convo design.", "design": "3 premium soap sunflowers, 6 premium black soap roses, 3 white daisy soap flowers, pink caspia fillers and 1 graduation teddy bear in premium black wrapping with a champagne satin ribbon.", "durability": "Long-lasting decorative soap flowers made to keep their look as a graduation keepsake.", "occasions": "Graduation, convocation, new jobs and big achievements.", "care": ["Keep dry and away from direct sunlight."], "includes": ["3 premium soap sunflowers", "6 premium black soap roses", "3 white daisy soap flowers", "Pink caspia fillers", "1 graduation teddy bear with cap", "Premium black wrapping", "Champagne satin ribbon"], "size": "40 cm wide × 50 cm long", "instant": true, "preorder": true, "tags": ["graduation", "convocation", "black rose", "sunflower", "teddy", "premium", "new"]},
  {"slug": "blue-white-25-roses-premium", "sku": "BF-037", "name": "Blue & White 25 Roses Premium (Soap)", "price": 159, "compareAt": 185, "categories": ["premium-bouquets", "birthday-flowers", "graduation-bouquets", "flowers-for-him"], "images": ["https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/blue-white-25-roses-premium/25-blue-and-white-soap-roses-bouquet-kl.webp", "https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/blue-white-25-roses-premium/blue-white-roses-blue-babys-breath.webp", "https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/blue-white-25-roses-premium/25-roses-bouquet-layered-wrapping.webp"], "badge": "New Arrival", "short": "25 premium blue and white soap roses with blue preserved baby's breath in layered wrapping and a satin ribbon.", "description": "A big, generous bouquet for people who mean a lot to you. Twenty-five premium soap roses in blue and white sit with blue preserved baby's breath, wrapped in luxurious layered paper and tied with an elegant satin ribbon. It speaks of friendship, thanks and good wishes.", "design": "25 premium blue and white soap roses with blue preserved baby's breath, premium layered wrapping and an elegant satin ribbon.", "durability": "Premium soap roses keep their colour and shape for a long time, a keepsake of your wishes.", "occasions": "Friendship and appreciation, birthdays, graduation, thank-you gifts and good wishes.", "care": ["Keep in a cool, dry place away from direct sunlight and water.", "Handle gently to protect the flowers and wrapping."], "includes": ["25 premium soap roses in blue and white", "Blue preserved baby's breath", "Premium layered wrapping", "Elegant satin ribbon"], "instant": true, "preorder": true, "tags": ["blue", "white", "25 roses", "premium", "friendship", "thank you", "new"]},
  {"slug": "graduation-dream-premium", "sku": "BF-038", "name": "Graduation Dream Premium (Soap)", "price": 127, "compareAt": 145, "categories": ["graduation-bouquets", "premium-bouquets", "flowers-for-him"], "images": ["https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/graduation-dream-premium/premium-graduation-bouquet-teddy-kl.webp", "https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/graduation-dream-premium/blue-roses-sunflowers-graduation-bouquet.webp", "https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/graduation-dream-premium/graduation-dream-teddy-royal-blue-wrap.webp", "https://nmbyvevxdrlgxjepxtuh.supabase.co/storage/v1/object/public/site-media/products/graduation-dream-premium/graduation-dream-size-35x50cm.webp"], "badge": "New Arrival", "short": "Blue soap roses, yellow sunflowers, white daisies and a graduation teddy in royal-blue wrapping with a white satin ribbon.", "description": "Celebrate a big achievement with Graduation Dream. Elegant blue soap roses meet bright yellow sunflowers and white daisies, with an adorable graduation teddy bear in the middle. Premium royal-blue multi-layer wrapping and a white satin ribbon make it a proud convo-day gift.", "design": "Premium blue soap roses, bright yellow soap sunflowers, white daisies and a graduation teddy bear in royal-blue multi-layer wrapping with a white satin ribbon.", "durability": "Premium soap flowers keep their decorative look for a long time, a keepsake of the big day.", "occasions": "Graduation ceremonies, university graduation, congratulations, birthdays and special celebrations.", "care": ["Keep away from direct sunlight, water and humid places.", "Do not squeeze or press the flowers.", "Display in a cool, dry place."], "includes": ["Premium blue soap roses", "Bright yellow soap sunflowers", "White daisy soap flowers", "Graduation teddy bear", "Royal-blue multi-layer wrapping", "White satin ribbon"], "size": "35 cm wide × 50 cm long", "instant": true, "preorder": true, "tags": ["graduation", "convocation", "premium", "sunflower", "blue rose", "teddy", "new"]},
  {
    slug: "bouquet-protection-bag",
    sku: "BF-030",
    name: "Bouquet Protection Bag",
    price: 6,
    categories: ["add-ons"],
    images: ["/products/bouquet-protection-bag/bouquet-protection-bag-clear.webp"],
    short: "A thick clear carry bag with handles that keeps your bouquet safe.",
    description: "A thick, clear protective bag sized for your bouquet, with a flat bottom so it stands up and sturdy handles for carrying. Keeps your flowers safe and neat during delivery and on the way.",
    design: "Thick transparent bag with a flat base and handles.",
    durability: "Reusable.",
    occasions: "Add to any bouquet.",
    care: ["Wipe clean with a dry cloth."],
    includes: ["1 clear protection bag (sized to your bouquet)"],
    instant: true,
    preorder: true,
    tags: ["bag", "add on", "protection"],
  },
];

// Apply full product edits from the admin panel: edit, add or delete products.
const editable = ["name", "nameZh", "sku", "badge", "short", "description", "design", "durability", "occasions", "care", "includes", "size", "instant", "preorder", "categories", "images", "tags", "giftCard", "protectionBag"] as const;
for (const [slug, doc] of Object.entries(content.product)) {
  const i = products.findIndex((p) => p.slug === slug);
  if (doc.deleted) { if (i >= 0) products.splice(i, 1); continue; }
  const d = doc as Partial<Product>;
  if (i >= 0) {
    for (const k of editable) if (d[k] !== undefined && d[k] !== null) (products[i] as Record<string, unknown>)[k] = d[k];
  } else if (d.name && d.price !== undefined && Array.isArray(d.images) && d.images.length) {
    products.push({
      slug, sku: d.sku ?? "", name: d.name, price: Number(d.price), compareAt: d.compareAt, categories: d.categories ?? [], images: d.images,
      short: d.short ?? "", description: d.description ?? "", design: d.design ?? "", durability: d.durability ?? "", occasions: d.occasions ?? "",
      care: d.care ?? [], includes: d.includes ?? [], size: d.size, instant: d.instant ?? true, preorder: d.preorder ?? true, badge: d.badge,
      nameZh: d.nameZh, tags: d.tags, giftCard: d.giftCard, protectionBag: d.protectionBag,
    });
  }
}

// Apply edits saved in the admin panel (price, sale price, best seller on/off).
for (const p of products) {
  const o = overrides.products[p.slug];
  if (!o) continue;
  if (o.price !== undefined) p.price = o.price;
  if (o.compareAt !== undefined) p.compareAt = o.compareAt > p.price ? o.compareAt : undefined;
  if (o.bestSeller !== undefined) {
    const has = p.categories.includes("best-seller");
    if (o.bestSeller && !has) p.categories = ["best-seller", ...p.categories];
    if (!o.bestSeller && has) p.categories = p.categories.filter((c) => c !== "best-seller");
  }
}

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const productsInCategory = (slug: string) => products.filter((p) => p.categories.includes(slug));
/** Best sellers first, then the rest. */
export const featuredProducts = () => [...products].sort((a, b) => Number(b.categories.includes("best-seller")) - Number(a.categories.includes("best-seller")));
export const isAddOn = (p: Pick<Product, "categories">) => p.categories.includes("add-ons");

/** Only what a product card needs (sent to the browser on the Shop page instead of the full product). */
export type CardItem = Pick<Product, "slug" | "name" | "sku" | "price" | "compareAt" | "images" | "badge" | "instant" | "categories"> & {
  variants?: Pick<Variant, "id" | "label" | "swatch">[]; paperColours?: unknown[];
};
export const toCard = (p: Product): CardItem => ({
  slug: p.slug, name: p.name, sku: p.sku, price: p.price, compareAt: p.compareAt, images: p.images.slice(0, 2), badge: p.badge, instant: p.instant, categories: p.categories,
  ...(p.variants ? { variants: p.variants.map((v) => ({ id: v.id, label: v.label, swatch: v.swatch })) } : {}),
  ...(p.paperColours?.length ? { paperColours: [1] } : {}),
});
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
