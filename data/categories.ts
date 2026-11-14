// ============================================================
//  CATEGORIES — "slug" becomes the URL: /category/<slug>
//  The order here is the order on the website (menu, home slider).
// ============================================================
import { hasProducts } from "@/data/products";

export type Category = {
  slug: string;
  name: string;
  short: string;
  image: string;
  tone?: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  content: { heading: string; body: string }[];
};

/** Every category the shop can have. Only the ones with products are shown (see `categories` below). */
export const allCategories: Category[] = [
  {
    slug: "best-seller",
    name: "Best Seller",
    short: "Our most-loved bouquets",
    image: "/products/red-soap-rose-heart-large/01.webp",
    seoTitle: "Best Seller Bouquets KL & Selangor | BikaFlora",
    seoDescription: "Our most-ordered bouquets in Kuala Lumpur & Selangor, led by the Soap Rose Heart. Same-day instant delivery or pre-order on WhatsApp.",
    intro: "The bouquets our customers order again and again. A safe, beautiful choice for any occasion.",
    content: [{ heading: "Why customers love these", body: "Every best seller is hand-tied by our florists, photographed before delivery and sent with a free message card." }],
  },
  {
    slug: "fresh-flowers",
    name: "Fresh Flowers",
    short: "Fresh-cut blooms, hand-tied today",
    image: "/images/site/roses-colours.webp",
    seoTitle: "Fresh Flower Bouquet Delivery KL & Selangor | BikaFlora",
    seoDescription: "Fresh roses, lilies, tulips, sunflowers and hydrangeas hand-tied daily and delivered across Kuala Lumpur & Selangor. Instant delivery or pre-order.",
    intro: "Fresh-cut flowers sourced every morning and hand-tied to order: roses, lilies, tulips, sunflowers, hydrangeas and more.",
    content: [
      { heading: "How long do fresh flowers last?", body: "Most fresh bouquets last 5-7 days. Trim the stems at an angle and change the water every 2 days to keep them fresh longer." },
    ],
  },
  {
    slug: "premium-bouquets",
    name: "Premium Flower's Bouquet",
    short: "Long-lasting soap flower bouquets",
    image: "/products/white-blue-soap-rose-heart/01.webp",
    seoTitle: "Premium Soap Flower Bouquets KL & Selangor | BikaFlora",
    seoDescription: "Premium soap rose and orchid bouquets that last for months: heart bouquets, Ferrero Rocher bouquets, graduation and bouquets for him. Same-day delivery in Kuala Lumpur & Selangor.",
    intro: "Handmade premium bouquets with soap roses, orchids and elegant wrapping. They look real, smell lovely and never wilt.",
    content: [{ heading: "Why soap flower bouquets?", body: "Soap flowers keep their colour and shape for months without water. They are perfect keepsakes for anniversaries, birthdays, graduations and thank-you gifts." }],
  },
  {
    slug: "flower-gift-box",
    name: "Flower Gift Box",
    short: "Elegant, vase-free gifts",
    image: "/products/red-rose-gift-box/02.webp",
    seoTitle: "Flower Gift Box Delivery KL & Selangor | BikaFlora",
    seoDescription: "Luxury flower boxes and flower gift boxes with roses and chocolates. Arrives ready to display, no vase needed. Delivered in KL & Selangor.",
    intro: "Flowers arranged in a stylish box: no vase needed, easy to carry and beautiful on any table.",
    content: [{ heading: "Why choose a flower box?", body: "A flower box holds its shape, keeps the flowers hydrated and looks great on an office desk or at home." }],
  },
  {
    slug: "below-100",
    name: "Below RM100 Bouquet",
    short: "Beautiful gifts under RM100",
    image: "/products/pink-charm/01.webp",
    seoTitle: "Flower Bouquets Below RM100 KL & Selangor | BikaFlora",
    seoDescription: "Affordable flower bouquets under RM100 with delivery in Kuala Lumpur & Selangor. Mini bouquets, single roses and crochet flowers.",
    intro: "Lovely bouquets that don't break the bank. Perfect for small surprises, classmates and colleagues.",
    content: [{ heading: "Small budget, big smile", body: "Mini bouquets, single roses and crochet flowers all under RM100, wrapped with the same care as our premium range." }],
  },
  {
    slug: "crochet-bouquets",
    name: "Crochet Bouquet",
    short: "Handmade flowers that last forever",
    image: "/products/crochet-pink-paradise/02.webp",
    seoTitle: "Crochet Flower Bouquet Malaysia | Handmade Forever Flowers",
    seoDescription: "Handmade crochet flower bouquets that never wilt. Crochet tulips, sunflowers and roses. Delivered in KL & Selangor or shipped by J&T Express.",
    intro: "Every crochet flower is knitted by hand, so it never wilts. A keepsake gift that lasts forever.",
    content: [{ heading: "Made by hand, made to last", body: "Crochet bouquets take time to make, so many designs are made to order. Pre-order for colours or flowers of your choice." }],
  },
  {
    slug: "chocolate-flower-bouquets",
    name: "Chocolate & Flower Bouquets",
    short: "Flowers with sweet treats",
    image: "/products/ferrero-rocher-pink-roses/03.webp",
    seoTitle: "Chocolate & Flower Bouquet Delivery KL & Selangor | BikaFlora",
    seoDescription: "Ferrero Rocher soap rose bouquets in pink or red. A sweet, long-lasting gift delivered same-day in Kuala Lumpur & Selangor.",
    intro: "Flowers and chocolate together: the sweetest way to say I love you, thank you or congratulations.",
    content: [{ heading: "Sweet and beautiful", body: "Ferrero Rocher chocolates, each in a protective case, paired with long-lasting soap roses and wrapped as one gift." }],
  },
  {
    slug: "mini-bouquets",
    name: "Mini Bouquet Series",
    short: "Small, cute & affordable",
    image: "/images/site/bouquet-alt.webp",
    seoTitle: "Mini Flower Bouquet KL & Selangor | Cute Small Bouquets",
    seoDescription: "Cute mini bouquets for classmates, colleagues and small surprises. Mini roses, sunflowers and baby's breath. Delivered in KL & Selangor.",
    intro: "Small bouquets with big charm. Great for convocations, classmates and little everyday surprises.",
    content: [{ heading: "Ordering many?", body: "Add several mini bouquets to your order list and send them in one WhatsApp message. Ask us for a bulk price for events." }],
  },
  {
    slug: "pre-order",
    name: "Pre-Order",
    short: "Made to your idea and date",
    image: "/products/52-roses-heart/01.webp",
    seoTitle: "Pre-Order & Custom Flower Bouquets KL & Selangor | BikaFlora",
    seoDescription: "Pre-order a custom bouquet: send us a photo or idea, choose your date, and we prepare it for you. Delivered across Kuala Lumpur & Selangor.",
    intro: "Tell us what you want, or send us a photo, and the date you need it. We prepare it exactly to your requirement.",
    content: [
      { heading: "How pre-order works", body: "1. Send your idea, photo, colours and budget on WhatsApp. 2. We confirm the design and price. 3. Pay in advance. 4. We prepare it and deliver on your date." },
    ],
  },
  {
    slug: "add-ons",
    name: "Add On",
    short: "Protection bag & extras",
    image: "/products/bouquet-protection-bag/01.webp",
    seoTitle: "Gift Add-ons: Teddy Bear, Balloons, Chocolate | BikaFlora",
    seoDescription: "Make your bouquet extra special with a teddy bear, balloons or chocolates. Add them to your flower order in KL & Selangor.",
    intro: "Make your gift extra special. Tap + to add these to your order list together with your bouquet.",
    content: [{ heading: "How to add", body: "Add-ons are delivered together with a bouquet. Tap + on the add-on and on your bouquet, then send your order list on WhatsApp." }],
  },
];

/** Categories that currently have products. Empty ones are hidden until you add a product to them. */
export const categories = allCategories.filter((c) => hasProducts(c.slug));
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
