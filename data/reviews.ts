// ============================================================
//  SAMPLE REVIEWS — FOR PREVIEW ONLY.
//  Replace these with your REAL customer reviews (e.g. from Google,
//  WhatsApp screenshots with permission) and then set
//  `reviewsAreSamples: false` in lib/site.ts.
//  Publishing made-up reviews as real ones is misleading and
//  against Google's rules, so please replace before going live.
// ============================================================

export type Review = { name: string; area: string; rating: number; text: string; product?: string; date: string };

export const reviews: Review[] = [
  { name: "Nurul A.", area: "Shah Alam", rating: 5, date: "2026-10-02", product: "Convocation Glory Tulip Bouquet",
    text: "Bunga sampai tepat masa untuk konvo adik saya di UiTM. Cantik sangat dan tak layu langsung walaupun panas!" },
  { name: "Jason T.", area: "Petaling Jaya", rating: 5, date: "2026-09-21", product: "Rosie Blush Soap Rose Bouquet",
    text: "Ordered through WhatsApp in 5 minutes. They sent a photo before delivery. My wife loved it." },
  { name: "Priya R.", area: "Bangsar", rating: 5, date: "2026-09-10", product: "Tulip Dream Crochet Bouquet",
    text: "The crochet tulips are so neat and detailed. Perfect gift that lasts forever. Will order again for Deepavali." },
  { name: "Aiman H.", area: "Cyberjaya", rating: 5, date: "2026-08-28",
    text: "Fast reply on WhatsApp and very friendly. Delivered to my office at Cyberjaya the same day. Recommended!" },
  { name: "Mei Ling C.", area: "Cheras", rating: 4, date: "2026-08-15", product: "Sweet Peach Birthday Bouquet",
    text: "Lovely colours and nicely wrapped. Delivery was a bit later than expected because of the rain, but they kept me updated." },
  { name: "Siti Z.", area: "Bangi", rating: 5, date: "2026-07-30",
    text: "Harga berpatutan dan servis sangat baik. Kawan saya suka sangat bunga sabun ni, wangi!" },
];
