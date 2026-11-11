// ============================================================
//  CATEGORIES — replace with your real categories later.
//  "slug" becomes the URL: /category/<slug>
// ============================================================

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
    image: "/images/products/bouquet-a.webp",
    tone: "blush",
    seoTitle: "Rose Bouquet Delivery KL & Selangor | Red & Pink Roses",
    seoDescription:
      "Order rose bouquets in Kuala Lumpur and Selangor. Red, pink and mixed rose hand bouquets with same-day delivery. Order easily on WhatsApp with BikaFlora.",
    intro:
      "Roses are still the most-requested flower in Malaysia for birthdays, anniversaries and \"just because\" surprises. Our rose bouquets are wrapped by hand and delivered across KL and Selangor.",
    content: [
      {
        heading: "What each rose colour means",
        body: "Red roses say love and passion, pink roses say gratitude and admiration, and white roses suit new beginnings and remembrance. Mixed bouquets let you combine meanings, for example red with pink for a partner you also want to thank.",
      },
      {
        heading: "How many roses should I send?",
        body: "A single rose is a sweet gesture, 9 or 11 stems is a popular anniversary choice, and 99 roses is the classic grand proposal in Malaysia. Tell us your budget on WhatsApp and we will suggest the best size.",
      },
    ],
  },
  {
    slug: "soap-flower-bouquets",
    name: "Soap Flower Bouquets",
    short: "Everlasting, fragrant & no wilting",
    image: "/images/products/bouquet-a.webp",
    tone: "cream",
    seoTitle: "Soap Flower Bouquet Malaysia | Long-Lasting Gift | BikaFlora",
    seoDescription:
      "Soap flower bouquets that stay beautiful for months. Lightly scented roses and baby's breath, delivered across Kuala Lumpur and Selangor. Order on WhatsApp.",
    intro:
      "Soap flowers look like real roses, carry a soft fragrance and do not wilt, so the gift stays on display for months. They are a favourite for anniversaries, teachers and office desks.",
    content: [
      {
        heading: "Why choose soap flowers?",
        body: "No water, no wilting and no pollen, which makes soap flowers good for people with allergies or busy schedules. They keep their shape and colour for a long time when kept away from humidity and direct sun.",
      },
      {
        heading: "Care tips",
        body: "Keep the bouquet in a dry, air-conditioned room if possible. Do not wet the petals. Dust gently with a soft brush.",
      },
    ],
  },
  {
    slug: "crochet-flower-bouquets",
    name: "Crochet & Handmade Bouquets",
    short: "Handcrafted tulips that last forever",
    image: "/images/products/bouquet-b.webp",
    tone: "cream",
    seoTitle: "Crochet Flower Bouquet Malaysia | Handmade Tulips | BikaFlora",
    seoDescription:
      "Handmade crochet and fabric flower bouquets in KL & Selangor. Tulips, roses and dried flower mixes that last forever. Custom colours available on WhatsApp.",
    intro:
      "Every crochet bloom is made stitch by stitch, so no two bouquets are exactly the same. A thoughtful keepsake for graduations, birthdays and anniversaries.",
    content: [
      {
        heading: "A gift that lasts forever",
        body: "Handmade flowers never wilt, so your graduate, partner or friend can keep the bouquet for years. We can match colours to university robes, wedding themes or a favourite colour.",
      },
      {
        heading: "Custom orders",
        body: "Want a specific colour or number of stems? Send us a WhatsApp message with a reference photo and we will confirm price and timing.",
      },
    ],
  },
  {
    slug: "dried-preserved-flowers",
    name: "Dried & Preserved Flowers",
    short: "Rustic, elegant, long-lasting",
    image: "/images/products/bouquet-b.webp",
    tone: "peach",
    seoTitle: "Dried & Preserved Flower Bouquets KL Selangor | BikaFlora",
    seoDescription:
      "Dried and preserved flower bouquets with baby's breath, bunny tails and pampas. Long-lasting gifts delivered in Kuala Lumpur and Selangor.",
    intro:
      "Dried and preserved flowers bring a soft, rustic look that suits modern homes. They last much longer than fresh stems and need no water.",
    content: [
      {
        heading: "Popular dried flowers",
        body: "Baby's breath, bunny tails, pampas grass and golden ruscus leaves are the favourites in our mixes. They pair well with soap roses and crochet tulips.",
      },
    ],
  },
  {
    slug: "birthday-flowers",
    name: "Birthday Flowers",
    short: "Make their day extra special",
    image: "/images/products/bouquet-a.webp",
    tone: "peach",
    seoTitle: "Birthday Flower Delivery KL & Selangor | Same Day | BikaFlora",
    seoDescription:
      "Send birthday flowers in Kuala Lumpur and Selangor. Bright bouquets with free card message and same-day delivery. Order in minutes on WhatsApp.",
    intro:
      "Surprise someone on their birthday with a bouquet delivered to their home, office or campus. Add a card message and we will hand-write it for you.",
    content: [
      {
        heading: "Choosing birthday flowers",
        body: "Bright pinks and reds feel cheerful and romantic, while pastel mixes suit mothers, friends and colleagues. If you are not sure, tell us who it is for and we will recommend one.",
      },
    ],
  },
  {
    slug: "anniversary-flowers",
    name: "Love & Anniversary",
    short: "Romantic bouquets for your partner",
    image: "/images/products/bouquet-a.webp",
    tone: "lavender",
    seoTitle: "Anniversary Flowers Delivery KL | Romantic Bouquets | BikaFlora",
    seoDescription:
      "Romantic anniversary and Valentine's bouquets delivered across KL and Selangor. Red roses, soap roses and everlasting bouquets. Order on WhatsApp.",
    intro: "Celebrate your love with romantic red and pink bouquets, perfect for anniversaries, Valentine's Day and 520.",
    content: [
      {
        heading: "Plan ahead for Valentine's Day",
        body: "Orders for 14 February and 20 May fill up quickly. Message us on WhatsApp a few days early to reserve your bouquet and delivery slot.",
      },
    ],
  },
  {
    slug: "graduation-flowers",
    name: "Convocation Flowers",
    short: "For graduates at UM, UiTM, UKM & more",
    image: "/images/products/bouquet-b.webp",
    tone: "lavender",
    seoTitle: "Convocation Flowers Malaysia | Graduation Bouquet KL Selangor",
    seoDescription:
      "Convocation bouquets for graduates at UM, UiTM, UKM, UPM, Taylor's, Sunway and more. Delivery to campus in KL and Selangor. Order on WhatsApp.",
    intro:
      "Congratulate your graduate with a convocation bouquet delivered to campus. Everlasting bouquets are popular because they still look perfect in photos at the end of a long day.",
    content: [
      {
        heading: "Campus delivery",
        body: "We deliver to major campuses in the Klang Valley including UM, UKM, UPM, UiTM Shah Alam, Taylor's, Sunway, MMU Cyberjaya and more. Share your hall name and time on WhatsApp and we will arrange the drop-off.",
      },
    ],
  },
  {
    slug: "tulip-bouquets",
    name: "Tulip Bouquets",
    short: "Elegant tulips in every colour",
    image: "/images/products/bouquet-b.webp",
    tone: "blush",
    seoTitle: "Tulip Bouquet Delivery Kuala Lumpur & Selangor | BikaFlora",
    seoDescription:
      "Tulip bouquets in pink, red and pastel colours. Handmade everlasting tulips and dried flower mixes delivered in KL and Selangor.",
    intro: "Tulips stand for perfect love and fresh starts. Our handmade tulip bouquets keep their shape for years.",
    content: [
      {
        heading: "Tulip colour meanings",
        body: "Red tulips mean deep love, pink tulips mean care and happiness, and yellow tulips mean cheerful thoughts. A mixed bouquet is a safe choice for any occasion.",
      },
    ],
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
