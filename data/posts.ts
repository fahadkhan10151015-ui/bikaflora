// Blog posts for SEO. Add more posts by copying an entry.
export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  image: string;
  tone?: string;
  sections: { heading: string; body: string }[];
};

export const posts: Post[] = [
  {
    slug: "convocation-flowers-guide-malaysia",
    title: "Convocation Flowers in Malaysia: A Simple Guide for Proud Families",
    description: "How to choose, time and deliver a convocation bouquet in KL and Selangor, from UM and UKM to UiTM and Taylor's.",
    date: "2026-10-20",
    image: "/images/site/convocation.webp",
    sections: [
      { heading: "Why everlasting bouquets work best for konvo", body: "Convocation days are long and hot. Fresh flowers can droop after a few hours of photos, while crochet and soap bouquets still look perfect at the end of the day and become a keepsake on the graduate's shelf." },
      { heading: "Order early in convocation season", body: "University convocations in the Klang Valley often happen in the same few weeks. Message us at least three days before the ceremony so we can reserve your bouquet and delivery slot." },
      { heading: "Campus delivery tips", body: "Share the hall name, the session time and the graduate's phone number. We will coordinate the drop-off so the bouquet arrives before the photo session." },
      { heading: "Matching colours", body: "Many families match the bouquet ribbon to the university robe colour. Tell us the university and we will suggest a matching ribbon." },
    ],
  },
  {
    slug: "soap-flowers-vs-fresh-flowers",
    title: "Soap Flowers vs Fresh Flowers: Which Gift Should You Choose?",
    description: "Compare soap flowers, crochet flowers and fresh flowers by price, lifespan and occasion to pick the right bouquet in Malaysia.",
    date: "2026-09-12",
    image: "/images/site/fresh-flowers.webp",
    sections: [
      { heading: "Lifespan", body: "Fresh flowers usually last 5–7 days in Malaysia's warm weather. Soap flowers last for months and crochet flowers can last for years." },
      { heading: "Fragrance and allergies", body: "Soap flowers carry a light scent and have no pollen, so they suit people with allergies and hospital visits where fresh flowers may not be allowed." },
      { heading: "Which one for which occasion?", body: "Fresh flowers are great for a one-day wow factor. Everlasting bouquets are better for convocations, anniversaries and anyone who likes to keep gifts as memories." },
    ],
  },
  {
    slug: "flower-colour-meanings-malaysia",
    title: "Flower Colour Meanings: What Your Bouquet Says in Malaysia",
    description: "Red, pink, white or yellow? Learn what flower colours mean for birthdays, anniversaries, Hari Raya, CNY and Deepavali gifts.",
    date: "2026-08-05",
    image: "/images/site/roses-colours.webp",
    sections: [
      { heading: "Red and pink", body: "Red means love and passion; pink means care, admiration and thanks. Both are favourites for anniversaries and birthdays." },
      { heading: "White", body: "White means purity and new beginnings. It is elegant for weddings, but in Chinese culture an all-white bouquet is usually linked with funerals, so add colour for celebrations." },
      { heading: "Festive colours", body: "Red and gold are lucky for Chinese New Year, bright colours suit Deepavali, and soft greens and creams are popular for Hari Raya open houses." },
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
