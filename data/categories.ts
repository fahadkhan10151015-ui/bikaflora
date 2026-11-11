// ============================================================
//  CATEGORIES — "slug" becomes the URL: /category/<slug>
// ============================================================
import { unsplash } from "@/lib/images";

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

export const categories: Category[] = [
  {
    slug: "rose-bouquets",
    name: "Rose Bouquets",
    short: "Timeless red & pink roses",
    image: unsplash("1730749387748-79e6d50a269c", 800),
    seoTitle: "Rose Bouquet Delivery KL & Selangor | Red & Pink Roses",
    seoDescription: "Order rose bouquets in Kuala Lumpur and Selangor. Red, pink and mixed roses with same-day express or scheduled delivery. Order easily on WhatsApp.",
    intro: "Roses are still Malaysia's most-requested flower for birthdays, anniversaries and surprises. Every rose bouquet is hand-tied and delivered across KL and Selangor.",
    content: [
      { heading: "What each rose colour means", body: "Red says love and passion, pink says gratitude and admiration, and white suits new beginnings. Mix colours to combine meanings — red with pink for a partner you also want to thank." },
      { heading: "How many roses should I send?", body: "9 or 12 stems is a popular anniversary choice, 24 makes a bold statement, and 99 roses is the classic grand proposal in Malaysia. Tell us your budget on WhatsApp and we'll suggest the right size." },
    ],
  },
  {
    slug: "tulip-bouquets",
    name: "Tulip Bouquets",
    short: "Fresh, modern & elegant",
    image: unsplash("1775301331506-f7b0d0b3ac44", 800),
    seoTitle: "Tulip Bouquet Delivery Kuala Lumpur & Selangor | BikaFlora",
    seoDescription: "Pink, white and rainbow tulip bouquets delivered in KL and Selangor with same-day express or scheduled delivery.",
    intro: "Tulips stand for perfect love and fresh starts. Our tulip bouquets bring a clean, modern look to any celebration.",
    content: [
      { heading: "Tulip colour meanings", body: "Red tulips mean deep love, pink means care and happiness, and white means new beginnings. A mixed bouquet is a safe choice for any occasion." },
    ],
  },
  {
    slug: "sunflower-bouquets",
    name: "Sunflower Bouquets",
    short: "Sunshine for any day",
    image: unsplash("1629386255808-c3ceb405173c", 800),
    seoTitle: "Sunflower Bouquet Delivery KL & Selangor | Convocation Flowers",
    seoDescription: "Bright sunflower bouquets for convocations, birthdays and congratulations. Delivered across Kuala Lumpur & Selangor.",
    intro: "Sunflowers stand for warmth, loyalty and success — no wonder they're Malaysia's favourite convocation flower.",
    content: [
      { heading: "Why sunflowers for convocation?", body: "Their bright yellow colour looks amazing in photos and their meaning — success and positivity — fits graduation day perfectly." },
    ],
  },
  {
    slug: "flower-boxes",
    name: "Flower Boxes",
    short: "Luxury, vase-free gifts",
    image: unsplash("1560583035-79c3e11ae176", 800),
    seoTitle: "Flower Box Delivery Malaysia | Luxury Rose Boxes KL",
    seoDescription: "Luxury flower boxes and arrangements delivered in KL & Selangor. No vase needed — perfect for offices, hotels and homes.",
    intro: "Flower boxes arrive ready to display — no vase needed. A premium gift for offices, hotel rooms and special celebrations.",
    content: [
      { heading: "Care tips", body: "Add a little water to the floral foam every two days and keep the box away from direct sunlight and air-conditioner vents." },
    ],
  },
  {
    slug: "everlasting-bouquets",
    name: "Everlasting Bouquets",
    short: "Soap & handmade — never wilt",
    image: "/images/products/bouquet-b.webp",
    tone: "cream",
    seoTitle: "Soap Flower & Handmade Bouquets Malaysia | Long-Lasting Gifts",
    seoDescription: "Soap rose and handmade tulip bouquets that stay beautiful for months. Delivered across Kuala Lumpur and Selangor.",
    intro: "Soap roses and handmade tulips look real, never wilt and stay beautiful for months — the perfect keepsake.",
    content: [
      { heading: "Why choose everlasting flowers?", body: "No water, no wilting and no pollen, so they suit people with allergies and hospital visits. Keep them dry and away from direct sun." },
    ],
  },
  {
    slug: "birthday-flowers",
    name: "Birthday Flowers",
    short: "Make their day special",
    image: unsplash("1572454591674-2739f30d8c40", 800),
    seoTitle: "Birthday Flower Delivery KL & Selangor | Same-Day Express",
    seoDescription: "Send birthday flowers in Kuala Lumpur and Selangor with same-day express delivery. Order in minutes on WhatsApp.",
    intro: "Surprise someone on their birthday with a bouquet delivered to their home, office or campus.",
    content: [
      { heading: "Choosing birthday flowers", body: "Bright pinks and mixed colours feel cheerful, while pastels suit mothers, friends and colleagues. Not sure? Tell us who it's for and we'll recommend one." },
    ],
  },
  {
    slug: "anniversary-flowers",
    name: "Love & Anniversary",
    short: "Romantic bouquets",
    image: unsplash("1780498802979-3d75e2b87ff2", 800),
    seoTitle: "Anniversary Flowers Delivery KL | Romantic Bouquets | BikaFlora",
    seoDescription: "Romantic anniversary and Valentine's bouquets delivered across KL and Selangor — roses, peonies and flower boxes.",
    intro: "Celebrate your love with romantic roses, peonies and flower boxes — perfect for anniversaries, Valentine's Day and 520.",
    content: [
      { heading: "Plan ahead for Valentine's Day", body: "Orders for 14 February and 20 May fill up fast. Message us on WhatsApp a few days early to reserve your bouquet." },
    ],
  },
  {
    slug: "graduation-flowers",
    name: "Convocation Flowers",
    short: "For UM, UiTM, UKM & more",
    image: unsplash("1601884928885-92a922f7962f", 800),
    seoTitle: "Convocation Flowers Malaysia | Graduation Bouquet KL Selangor",
    seoDescription: "Convocation bouquets for graduates at UM, UiTM, UKM, UPM, Taylor's, Sunway and more. Campus delivery in KL and Selangor.",
    intro: "Congratulate your graduate with a bouquet delivered to campus. Sunflowers and everlasting bouquets are the top convocation picks.",
    content: [
      { heading: "Campus delivery", body: "We deliver to major Klang Valley campuses including UM, UKM, UPM, UiTM Shah Alam, Taylor's, Sunway and MMU Cyberjaya. Share the hall and time on WhatsApp." },
    ],
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
