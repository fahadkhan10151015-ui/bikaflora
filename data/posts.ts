import { content } from "@/lib/content";
import blogPosts from "./blog-posts.json";
// Blog posts for SEO. Add more posts by copying an entry.
export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  image: string;
  tone?: string;
  sections: { heading: string; body: string }[];
  /** Full article HTML written in the admin panel (used instead of `sections` when set). */
  html?: string;
  seoTitle?: string;
  keyword?: string;
  author?: string;
  category?: string;
  imageAlt?: string;
};

/** Blog categories (editable in the admin panel). */
export const blogCategories: string[] = Array.isArray((content.page["blog-categories"] as { list?: string[] } | undefined)?.list)
  ? (content.page["blog-categories"] as { list: string[] }).list
  : ["Guides", "Gift ideas", "Flower care", "Occasions"];

export const posts: Post[] = [
  {
    slug: "convocation-flowers-guide-malaysia",
    title: "Convocation Flowers in Malaysia: A Simple Guide for Proud Families",
    description: "How to choose convocation flowers in Malaysia: bouquets that last all day, when to order and how delivery to the hall works in KL and Selangor.",
    date: "2026-10-20",
    image: "/images/site/convocation.webp",
    seoTitle: "Convocation Flowers in Malaysia: A Simple Guide",
    keyword: "convocation flowers, konvo bouquet, graduation bouquet",
    category: "Occasions",
    imageAlt: "Graduate holding convocation flowers with a sunflower bouquet in Malaysia",
    author: "BikaFlora",
    html: "<p>Convocation day is a big moment for the whole family. After years of lectures, exams and late nights, the graduate finally walks across the stage. Convocation flowers are the easiest way to say \"we are proud of you\" in every photo. This guide shows you how to choose them, when to order and how to get them to the hall on time in KL and Selangor.</p><h2>Why Convocation Flowers Matter in Malaysia</h2><p>In Malaysia, a konvo bouquet is almost part of the dress code. Parents, siblings, friends and partners bring flowers, and the graduate holds them in nearly every picture. Those photos end up on the family wall and on social media for years. So the bouquet should look good from the first photo to the last one.</p><h2>Choose Convocation Flowers That Last All Day</h2><p>Convo days are long. Families wait outside the hall, then take photos in the sun for hours. Fresh flowers can start to droop by the afternoon. Soap flowers and crochet flowers do not wilt, so they look the same at 5 pm as they did at 9 am.</p><p>They also last after the day is over. A soap flower bouquet keeps its shape and colour for months, and a crochet bouquet can last for years. Many graduates keep theirs on a shelf next to the scroll.</p><h2>Popular Convocation Flowers and Bouquets</h2><h3>Sunflowers for a bright, happy look</h3><p>Sunflowers are the classic convo choice in Malaysia. They stand out in photos and suit both sons and daughters. <a href=\"/product/graduation-signature\">The Graduation Signature</a> pairs three sunflowers with blue and white soap roses and a teddy in a cap and gown.</p><h3>A teddy bear in a graduation cap</h3><p>A small graduate teddy makes the bouquet feel personal and fun. <a href=\"/product/graduates-sunshine\">Graduate's Sunshine</a> is a smaller sunflower bouquet with a teddy, and it suits a student budget.</p><h3>Handmade crochet and chenille flowers</h3><p>For something different, a <a href=\"/category/crochet-bouquets\">crochet or chenille bouquet</a> is soft, colourful and made stem by stem. It is a keepsake that never needs water.</p><p>See every design in our <a href=\"/category/graduation-bouquets\">graduation bouquets</a> collection.</p><h2>Match the Colours to the University</h2><p>Many families like to match the ribbon or wrapping to the university robe colours. For example, blue and gold, maroon or green. Tell us the university when you order, and we can suggest wrapping and ribbon that fit. You can also send us a photo of a design you like, and we can make a custom bouquet as a pre-order.</p><h2>When to Order Convocation Flowers</h2><p>Convocation season in the Klang Valley is busy, because several universities hold their ceremonies around the same time. Ready-made bouquets can be delivered the same day, but it is safer to message us a few days before. That way we can keep your bouquet aside and plan the delivery time with you.</p><p>If you want a custom design or special colours, order as a pre-order. Custom bouquets need at least 24 to 48 hours.</p><h2>How Delivery to the Hall Works</h2><p>We deliver across Kuala Lumpur and Selangor, including campuses such as UM, UKM, UiTM and Taylor's. To make the drop-off smooth, share:</p><ul><li>the hall or building name</li><li>the session time of the ceremony</li><li>the name and phone number of the person receiving the bouquet</li></ul><p>Our team plans the delivery so the flowers arrive before the photo session. Before the bouquet leaves, we send you a photo of it on WhatsApp, so you know exactly what the graduate will receive.</p><h2>How to Order Your Convocation Flowers</h2><p>Pick a bouquet on our website and tap the WhatsApp button. Tell us the convo date, the campus and the session time. We confirm the price and delivery fee, then you pay in advance by FPX, DuitNow or e-wallet. You can also add a handwritten card with your own message.</p><p>Not sure which bouquet to choose? Message our florist on WhatsApp with your budget and the graduate's favourite colours. We will help you pick convocation flowers that look great in every photo and last long after the big day.</p>",
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
    description: "Soap flowers vs fresh flowers: compare how long they last, care, scent, allergies and price to choose the right bouquet gift in Malaysia.",
    date: "2026-09-12",
    image: "/images/site/fresh-flowers.webp",
    seoTitle: "Soap Flowers vs Fresh Flowers: Which Gift to Choose?",
    keyword: "soap flowers vs fresh flowers, soap flower bouquet",
    category: "Guides",
    imageAlt: "Soap flowers vs fresh flowers side by side in a bouquet",
    author: "BikaFlora",
    html: "<p>Should you send soap flowers or fresh flowers? Both make a lovely gift, but they suit different moments. This guide compares soap flowers vs fresh flowers on lifespan, care, scent, price and occasion, so you can pick the right bouquet in Malaysia without second-guessing.</p><h2>Soap Flowers vs Fresh Flowers at a Glance</h2><table><thead><tr><th></th><th>Soap flowers</th><th>Fresh flowers</th></tr></thead><tbody><tr><td>How long they last</td><td>Months, if kept dry</td><td>About a week in warm weather</td></tr><tr><td>Water needed</td><td>No</td><td>Yes, changed often</td></tr><tr><td>Pollen</td><td>None</td><td>Yes, for most flowers</td></tr><tr><td>Scent</td><td>Light, clean soap scent</td><td>Natural flower scent</td></tr><tr><td>Best for</td><td>Keepsakes and long, hot days</td><td>A one-day wow moment</td></tr></tbody></table><h2>How Long Do Soap Flowers Last Compared with Fresh Flowers?</h2><p>This is the biggest difference. In Malaysia's warm, humid weather, fresh flowers usually look their best for only a few days. Petals drop and stems go soft, even with fresh water.</p><p>Soap flowers are made from thin sheets of soap shaped into petals. There is no water inside, so they never wilt. Kept dry and out of strong sun, a soap flower bouquet keeps its shape and colour for months. <a href=\"/category/crochet-bouquets\">Crochet bouquets</a> last even longer, often for years.</p><h2>Care and Mess</h2><p>Fresh flowers need a vase, clean water and trimming every couple of days. Soap flowers need almost nothing. Just keep them away from water, steam and direct sun. That makes them easy for busy people, students in hostels and anyone who does not own a vase.</p><h2>Can You Use Soap Flowers as Real Soap?</h2><p>Yes, the petals are made from soap, so a petal can lather a little in water. Still, most people keep the bouquet as a decoration, because it looks too pretty to use. If you do use a petal, take it from the back so the front of the bouquet still looks full.</p><h2>Scent and Allergies</h2><p>Fresh flowers have their own natural perfume, which many people love. However, some flowers carry pollen that can trigger allergies. Soap flowers have no pollen and give off a gentle, clean scent. For this reason, they are a safer choice for a hospital visit or for someone with hay fever. Always check the hospital's own rules first.</p><h2>Price and Value</h2><p>Both types come in a wide range of prices. What changes is how long you enjoy them. A fresh bouquet gives you a beautiful few days. A soap flower bouquet gives you months, so the cost per day is much lower. Our <a href=\"/category/below-100\">bouquets below RM100</a> start from RM65.</p><h2>Which One Should You Choose?</h2><h3>Choose fresh flowers when</h3><ul><li>you want a natural scent and look for one special day</li><li>the person loves arranging flowers in a vase</li><li>you are decorating an event that lasts only a few hours</li></ul><h3>Choose soap flowers when</h3><ul><li>the day is long and hot, like a convocation or an outdoor event</li><li>you want a gift they can keep as a memory</li><li>the person has allergies or no time to care for flowers</li><li>you are sending a gift for an anniversary or Valentine's Day and want it to last</li></ul><h2>Popular Soap Flower Bouquets to Start With</h2><p>If you are trying soap flowers for the first time, a rose heart is a safe and romantic pick. See our <a href=\"/category/best-seller\">best seller bouquets</a> or browse all <a href=\"/category/premium-bouquets\">premium soap flower bouquets</a>. For a sweet twist, a <a href=\"/category/chocolate-flower-bouquets\">chocolate bouquet</a> adds Ferrero Rocher or KitKat to the roses.</p><h2>The Bottom Line</h2><p>In the soap flowers vs fresh flowers choice, there is no wrong answer. Fresh flowers win for a short, fragrant moment. Soap flowers win when you want the gift to last, stay neat and travel well in the heat. If you are still unsure, message our florist on WhatsApp. Tell us who the bouquet is for and the occasion, and we will help you choose. We deliver across KL and Selangor the same day.</p>",
    sections: [
      { heading: "Lifespan", body: "Fresh flowers usually last 5–7 days in Malaysia's warm weather. Soap flowers last for months and crochet flowers can last for years." },
      { heading: "Fragrance and allergies", body: "Soap flowers carry a light scent and have no pollen, so they suit people with allergies and hospital visits where fresh flowers may not be allowed." },
      { heading: "Which one for which occasion?", body: "Fresh flowers are great for a one-day wow factor. Everlasting bouquets are better for convocations, anniversaries and anyone who likes to keep gifts as memories." },
    ],
  },
  {
    slug: "flower-colour-meanings-malaysia",
    title: "Flower Colour Meanings: What Your Bouquet Says in Malaysia",
    description: "Flower colour meanings made simple: what red, pink, white, yellow and blue flowers say, plus colours for CNY, Hari Raya and Deepavali in Malaysia.",
    date: "2026-08-05",
    image: "/images/site/roses-colours.webp",
    seoTitle: "Flower Colour Meanings: What Your Bouquet Says",
    keyword: "flower colour meanings",
    category: "Guides",
    imageAlt: "Roses in different colours showing flower colour meanings",
    author: "BikaFlora",
    html: "<p>The colour of a bouquet says something before the card is even read. Knowing flower colour meanings helps you pick a gift that fits the moment, whether it is a birthday, an anniversary or a festive visit in Malaysia. Here is a simple guide to what each colour usually means, plus a few local customs to keep in mind.</p><h2>Why Flower Colour Meanings Matter</h2><p>Most people notice the colour of a bouquet first. A deep red bouquet feels romantic, while soft pink feels gentle and kind. In a country with many cultures and festivals, colour can also carry extra meaning. So a little thought about colour helps your gift feel right.</p><h2>Red: Love and Passion</h2><p>Red is the colour of romance. Red roses say \"I love you\" in the clearest way, which is why they are the top choice for anniversaries, Valentine's Day and proposals. A dozen red roses, like our <a href=\"/product/365-days-of-love\">365 Days of Love</a>, is a classic way to say it. For a bigger moment, see our <a href=\"/category/anniversary-valentine-bouquets\">anniversary and Valentine bouquets</a>.</p><h2>Pink: Care, Thanks and Admiration</h2><p>Pink is softer than red. It stands for care, gratitude and sweetness. That makes pink a safe and lovely choice for mothers, sisters, best friends and birthdays. Light pink feels gentle, while bright pink feels fun and cheerful.</p><h2>White: Purity and New Beginnings</h2><p>White flowers stand for purity, peace and fresh starts. They look elegant at weddings and for a new baby or a new home. However, in Chinese culture an all-white bouquet is often linked with funerals and mourning. For celebrations, it is best to mix white with another colour, such as pink, red or blue.</p><h2>Yellow: Joy and Friendship</h2><p>Yellow is bright and happy. It stands for friendship, joy and success. Sunflowers and yellow blooms are a favourite for convocations and congratulations, because they look cheerful in photos. Find sunflower designs in our <a href=\"/category/graduation-bouquets\">graduation bouquets</a>.</p><h2>Blue: Calm and Trust</h2><p>Blue feels calm, loyal and steady. It is a popular colour for men, so blue bouquets work well for boyfriends, husbands and fathers. Blue and white together feel fresh and smart. Browse our <a href=\"/category/flowers-for-him\">flowers for him</a> for blue designs.</p><h2>Purple and Lavender: Charm and Respect</h2><p>Purple has long been linked with elegance and respect. Lavender, its softer shade, feels graceful and romantic. These colours suit someone with a refined, gentle style.</p><h2>Black: Bold and Mysterious</h2><p>Black flowers are rare in nature, so they feel dramatic and unique. A black rose bouquet suits a partner who loves dark, modern style. It is a bold choice, so save it for someone who will enjoy the statement.</p><h2>Flower Colours for Festivals in Malaysia</h2><ul><li><strong>Chinese New Year:</strong> red and gold are seen as lucky and prosperous colours.</li><li><strong>Hari Raya:</strong> soft greens, creams and pastels feel fresh and suit open houses.</li><li><strong>Deepavali:</strong> bright, rich colours like orange, yellow and magenta match the festive mood.</li></ul><p>When in doubt for a festive visit, a mix of bright colours is usually a safe and happy choice.</p><h2>Mixing Colours in One Bouquet</h2><p>You do not have to pick just one colour. Pink and white together feel sweet and soft. Red and white mean love and unity. Blue and white feel calm and fresh. Mixed bouquets also help you avoid any colour that might carry the wrong meaning on its own.</p><h2>Choosing Your Bouquet Colour</h2><p>Think about the person, the occasion and their culture. Then pick the colour that fits best. Remember, these flower colour meanings are a guide, not a rule. The best colour is often simply their favourite one. Not sure? Message our florist on WhatsApp, and we will help you choose a bouquet colour that says exactly what you mean. We deliver across KL and Selangor the same day.</p>",
    sections: [
      { heading: "Red and pink", body: "Red means love and passion; pink means care, admiration and thanks. Both are favourites for anniversaries and birthdays." },
      { heading: "White", body: "White means purity and new beginnings. It is elegant for weddings, but in Chinese culture an all-white bouquet is usually linked with funerals, so add colour for celebrations." },
      { heading: "Festive colours", body: "Red and gold are lucky for Chinese New Year, bright colours suit Deepavali, and soft greens and creams are popular for Hari Raya open houses." },
    ],
  },
];

// Longer guides kept in data/blog-posts.json (each one goes live on its date).
for (const b of blogPosts as Omit<Post, "sections">[]) if (!posts.some((p) => p.slug === b.slug)) posts.push({ ...b, sections: [] });

// Blog edits from the admin panel: edit, add or delete posts.
for (const [slug, doc] of Object.entries(content.post)) {
  const i = posts.findIndex((p) => p.slug === slug);
  if (doc.deleted) { if (i >= 0) posts.splice(i, 1); continue; }
  const d = doc as Partial<Post>;
  if (i >= 0) posts[i] = { ...posts[i], ...Object.fromEntries(Object.entries(d).filter(([, v]) => v !== undefined && v !== null)), slug };
  else if (d.title && d.html) posts.push({ ...(Object.fromEntries(Object.entries(d).filter(([, v]) => v !== undefined && v !== null)) as Partial<Post>), slug, title: d.title, description: d.description ?? "", date: d.date ?? new Date().toISOString().slice(0, 10), image: d.image ?? "/images/site/cover.webp", sections: [], html: d.html });
}
posts.sort((a, b) => b.date.localeCompare(a.date));

// Scheduled posts (date in the future, Malaysia time) stay hidden until that day. A daily job republishes the site.
const todayMY = new Date(Date.now() + 8 * 3600_000).toISOString().slice(0, 10);
/** Every post, including ones scheduled for a later date (for the admin panel and the daily publish job). */
export const allPosts: Post[] = [...posts];
for (let i = posts.length - 1; i >= 0; i--) if (posts[i].date > todayMY) posts.splice(i, 1);

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
