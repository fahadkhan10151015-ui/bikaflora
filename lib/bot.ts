// ============================================================
//  Built-in florist assistant (works without any AI service).
//  Understands the question (price, delivery, area, payment ...),
//  copes with spelling mistakes, and answers from the site data.
// ============================================================
import { products, type Product } from "@/data/products";
import { categories } from "@/data/categories";
import { locations, type Location } from "@/data/locations";
import { site, deliveryMethods, deliveryPartners, paymentMethods, formatPrice } from "@/lib/site";

export type BotMsg = { role: "user" | "assistant"; content: string };

// ---------- text helpers ----------
const norm = (s: string) =>
  s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9一-鿿]+/g, " ").replace(/\s+/g, " ").trim();

function lev(a: string, b: string) {
  if (a === b) return 0;
  const dp = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return dp[b.length];
}

/** How many typos we forgive for a word of this length. */
const tolerance = (len: number) => (len <= 4 ? 0 : len <= 7 ? 1 : 2);

/** Does `word` look like `target`, allowing small spelling mistakes and endings (deliver → delivery)? */
function like(word: string, target: string) {
  if (word === target) return true;
  if (target.length >= 5 && word.startsWith(target)) return true;
  const tol = tolerance(target.length);
  if (!tol || Math.abs(word.length - target.length) > tol) return false;
  if (target.length <= 6 && word[0] !== target[0]) return false; // short words: typos rarely hit the first letter
  return lev(word, target) <= tol;
}

/** Finds a keyword or phrase in the message. Works with typos and missing spaces ("howmuch", "shahalam"). */
function has(tokens: string[], phrase: string) {
  const p = norm(phrase);
  const n = p.split(" ").length;
  const glued = p.replace(/ /g, "");
  for (let i = 0; i < tokens.length; i++) {
    for (let k = 1; k <= Math.min(3, tokens.length - i); k++) {
      const win = tokens.slice(i, i + k);
      if (k === n && like(win.join(" "), p)) return true;
      if (glued.length >= 5 && like(win.join(""), glued)) return true;
    }
  }
  return false;
}
const any = (tokens: string[], words: string[]) => words.some((w) => has(tokens, w));

// ---------- intents ----------
const INTENTS: Record<string, string[]> = {
  greet: ["hi", "hello", "hey", "hai", "helo", "salam", "assalamualaikum", "good morning", "good evening", "selamat"],
  thanks: ["thanks", "thank you", "thank", "tq", "thx", "terima kasih", "appreciate"],
  order: ["order", "buy", "purchase", "beli", "tempah", "booking", "book", "checkout", "cart", "how to get", "want this", "nak"],
  price: ["price", "cost", "how much", "berapa", "harga", "rm", "ringgit", "cheap", "cheapest", "murah", "expensive", "budget", "rate", "pricing"],
  fee: ["delivery fee", "delivery charge", "shipping", "shipping fee", "postage", "caj", "charges", "fee", "transport"],
  today: ["today", "same day", "sameday", "tonight", "now", "urgent", "asap", "hari ini", "harini", "express", "instant", "cutoff", "cut off", "last order"],
  partner: ["grab", "lalamove", "jnt", "courier", "kurier", "rider", "delivery company", "delivery partner", "poslaju", "shipping company"],
  when: ["tomorrow", "esok", "when", "how long", "how fast", "time", "schedule", "scheduled", "date", "next week", "next month", "pre order", "preorder"],
  area: ["deliver", "delivery", "area", "location", "send to", "hantar", "kawasan", "cover", "coverage", "reach", "ship to", "penghantaran"],
  payment: ["pay", "payment", "bank", "transfer", "fpx", "duitnow", "tng", "touch n go", "ewallet", "e wallet", "credit card", "debit", "cod", "cash", "bayar", "online banking"],
  photo: ["photo", "foto", "picture", "pic", "gambar", "image", "see before", "see the bouquet"],
  custom: ["custom", "customise", "customize", "personalise", "personalize", "own design", "reference", "special request", "different colour", "different color", "design", "send pic", "send photo", "this type", "like this"],
  account: ["account", "login", "log in", "sign up", "signup", "register", "password"],
  contact: ["contact", "whatsapp", "phone", "number", "call", "email", "talk", "human", "agent", "staff", "admin", "real person"],
  hours: ["open", "opening", "hours", "close", "closing", "operating", "buka", "tutup", "working hours"],
  card: ["message card", "card", "note", "kad", "wish", "wording"],
  recommend: ["recommend", "suggest", "suggestion", "best", "popular", "nice", "gift", "idea", "what should", "bestseller", "best seller", "favourite", "cadang"],
  care: ["fresh", "care", "water", "wilt", "last", "lasting", "vase", "segar", "keep", "die"],
  refund: ["refund", "cancel", "return", "exchange", "change order", "complaint", "damaged", "wrong"],
  pickup: ["pickup", "pick up", "self collect", "collect", "shop address", "where are you", "store", "kedai", "walk in", "physical shop"],
  discount: ["discount", "promo", "promotion", "voucher", "coupon", "sale", "offer", "code", "diskaun"],
  list: ["order list", "multiple", "many", "several", "more than one", "bulk", "banyak"],
};

const OCCASIONS: Record<string, string[]> = {
  "best-seller": ["best seller", "bestseller", "popular", "most popular", "favourite", "best"],
  "fresh-flowers": ["fresh", "fresh flower", "real flower", "rose", "roses", "mawar", "lily", "tulip", "sunflower", "hydrangea", "bunga segar", "玫瑰"],
  "premium-bouquets": ["premium", "luxury", "mewah", "expensive", "grand", "propose", "proposal", "anniversary", "vip"],
  "flower-gift-box": ["flower box", "gift box", "box", "kotak"],
  "below-100": ["below 100", "under 100", "bawah 100", "cheap", "murah", "affordable"],
  "crochet-bouquets": ["crochet", "knit", "knitted", "yarn", "kait", "forever", "never wilt", "last forever"],
  "chocolate-flower-bouquets": ["chocolate", "coklat", "ferrero", "strawberry"],
  "mini-bouquets": ["mini", "small", "kecil", "cute", "classmate", "convocation", "convo", "konvo", "graduation"],
  "pre-order": ["pre order", "preorder", "advance booking", "tempah awal"],
  "add-ons": ["add on", "addon", "teddy", "bear", "balloon", "balloons", "extra gift"],
};

// ---------- data matching ----------
const GENERIC = new Set(["bouquet", "flower", "flowers", "box", "and", "the", "dream", "s", "pre", "order", "set", "add", "on", "gift", "custom"]);
const tokenCount: Record<string, number> = {};
products.forEach((p) => new Set(norm(p.name).split(" ")).forEach((t) => (tokenCount[t] = (tokenCount[t] || 0) + 1)));

/** Finds a specific bouquet the customer named (e.g. "peony", "red rose", "hydrangia"). */
function findProduct(tokens: string[]): Product | undefined {
  let best: Product | undefined;
  let bestScore = 0;
  for (const p of products) {
    const words = norm(p.name).split(" ").filter((w) => !GENERIC.has(w));
    let score = 0;
    let rare = false;
    for (const w of words) {
      if (tokens.some((t) => like(t, w))) {
        score += tokenCount[w] <= 2 ? 2 : 1;
        if (tokenCount[w] <= 2) rare = true;
      }
    }
    if (tokens.includes(norm(p.sku).replace(" ", "")) || has(tokens, p.sku)) { score += 5; rare = true; }
    if (rare && score > bestScore) { best = p; bestScore = score; }
  }
  return bestScore >= 2 ? best : undefined;
}

function findArea(tokens: string[]): { loc: Location; via?: string } | undefined {
  for (const l of locations) if (has(tokens, l.name)) return { loc: l };
  for (const l of locations) for (const n of l.nearby) if (has(tokens, n)) return { loc: l, via: n };
  if (any(tokens, ["kl", "klcc"])) return { loc: locations.find((l) => l.slug === "kuala-lumpur")! };
  if (any(tokens, ["pj"])) return { loc: locations.find((l) => l.slug === "petaling-jaya")! };
  return undefined;
}

function budgetOf(text: string) {
  const m = text.match(/(?:rm|under|below|bawah|budget|max|less than|within)\s*(?:rm)?\s*(\d{2,4})/i) || text.match(/(\d{2,4})\s*(?:rm|ringgit|myr)/i);
  return m ? Number(m[1]) : 0;
}

const priceText = (p: Product) =>
  p.options ? p.options.map((o) => `${o.label}: **${formatPrice(o.price)}**`).join(", ") : `**${formatPrice(p.price)}**`;

const productLine = (p: Product) => `- [${p.name}](/product/${p.slug}) · ${p.options ? "from " : ""}${formatPrice(p.price)}${p.rating ? ` · ★ ${p.rating}` : ""}`;

const HOW_TO_ORDER = `Tap **Order now** on the bouquet and WhatsApp opens with everything typed. Just press send. Ordering several? Tap **+** on each one, then **Send order on WhatsApp**.`;

const bouquets = products.filter((p) => !p.categories.includes("add-ons"));

// ---------- main ----------
export function botReply(history: BotMsg[], page?: string): string {
  const last = history[history.length - 1]?.content || "";
  const text = norm(last);
  const tokens = text.split(" ").filter(Boolean);
  const is = (k: string) => any(tokens, INTENTS[k]);

  // "this" bouquet = the one named now, the one on the current page, or the one discussed just before.
  let product = findProduct(tokens);
  const pageSlug = page?.startsWith("/product/") ? page.split("/")[2] : undefined;
  const pronoun = tokens.some((t) => ["this", "that", "it", "ini", "itu"].includes(t));
  const refersBack = pronoun;
  if (!product && refersBack && pageSlug) product = products.find((p) => p.slug === pageSlug);
  if (!product && refersBack) {
    for (let i = history.length - 2; i >= 0 && !product; i--) {
      const prev = history[i];
      const link = prev.content.match(/\(\/product\/([a-z0-9-]+)\)/g);
      product = prev.role === "user"
        ? findProduct(norm(prev.content).split(" "))
        : link?.length === 1 ? products.find((p) => `(/product/${p.slug})` === link[0]) : undefined;
    }
  }

  const area = findArea(tokens);
  const occasion = Object.entries(OCCASIONS).filter(([, w]) => any(tokens, w)).map(([c]) => c);
  const budget = budgetOf(last);
  const out: string[] = [];

  // Small talk
  if (is("thanks") && tokens.length <= 6) return `You're welcome! 🌷 If you need anything else, just ask, or WhatsApp us at ${site.phoneDisplay}.`;
  const onlyGreeting = is("greet") && tokens.length <= 3 && !product && !area && !occasion.length;
  if (onlyGreeting) return `Hi! 👋 I'm Bika, the ${site.name} florist assistant. I can help you:\n- find a bouquet by occasion or budget\n- check delivery to your area\n- explain prices, payment and how to order\nWhat are you looking for?`;

  // 1. A specific bouquet
  if (product) {
    out.push(`**${product.name}** (${product.sku})\nPrice: ${priceText(product)}`);
    if (!is("price")) out.push(`${product.short}\nIncludes: ${product.includes.join(", ")}.`);
    out.push(`[View ${product.name}](/product/${product.slug})`);
    if (is("order") || !is("price")) out.push(HOW_TO_ORDER);
  }
  const feeQ = is("fee") || (is("area") && is("price") && !product);
  const knownWords = (t: string[]) => Object.values(INTENTS).some((l) => any(t, l)) || Object.values(OCCASIONS).some((l) => any(t, l));

  // 2. Delivery area
  if (area) {
    const { loc, via } = area;
    out.push(`Yes, we deliver to **${via ? `${via} (${loc.name} area)` : loc.name}**, ${loc.state}. **Instant Delivery** if you order before ${site.sameDayCutoff} (by Grab Express or Lalamove), or **Pre-order** for your chosen date. [Delivery to ${loc.name}](/flower-delivery/${loc.slug})`);
  } else if (is("area") && !product) {
    const ask = last.match(/(?:to|ke|in|at|di)\s+([a-z][a-z ]{2,20})/i)?.[1]?.trim().replace(/\s+(today|tomorrow|now|please|pls|esok)$/i, "");
    const askTokens = ask ? norm(ask).split(" ") : [];
    if (ask && !knownWords(askTokens) && !any(askTokens, ["my", "your", "home", "house", "office", "you", "me", "there", "here"])) {
      out.push(`Sorry, I couldn't find **${ask}** in our delivery areas. We deliver across **Kuala Lumpur and Selangor** (Shah Alam, Petaling Jaya, Subang Jaya, Klang, Cheras, Puchong, Cyberjaya, Kajang and more). WhatsApp us at ${site.phoneDisplay} and we'll check your address. [All delivery areas](/flower-delivery)`);
    } else if (!feeQ && !is("today") && !is("when")) {
      out.push(`We deliver across **Kuala Lumpur and Selangor**: ${locations.slice(0, 12).map((l) => l.name).join(", ")} and more. [See all ${locations.length} areas](/flower-delivery)\nTell me your area and I'll confirm.`);
    }
  }

  // 3. Delivery fee, timing
  if (feeQ) out.push(`The delivery fee depends on your area and the courier (Grab Express, Lalamove or J&T Express). Send your address on WhatsApp and we confirm the exact total first. Payment is made in advance.`);
  if (is("today")) out.push(`**Instant Delivery:** order a ready bouquet before **${site.sameDayCutoff}** and it's delivered today by Grab Express or Lalamove. After ${site.sameDayCutoff}, WhatsApp us and we'll check if a slot is still free.`);
  else if (is("when") && !is("hours") && !is("care")) out.push(`Two options:\n- **${deliveryMethods[0].label}**: ${deliveryMethods[0].detail}\n- **${deliveryMethods[1].label}**: ${deliveryMethods[1].detail}\nFor pre-orders, just tell us your date in the WhatsApp message.`);

  // 4. Other topics
  if (is("partner") || /j\s*&\s*t|j\s*n\s*t/i.test(last)) out.push(`Our delivery partners:\n${deliveryPartners.map((d) => `- **${d.name}**: ${d.use}`).join("\n")}`);
  if (is("payment") || any(tokens, ["advance", "deposit", "pay first"])) out.push(`**Payment is made in advance.** We first confirm your order and total on WhatsApp, then you pay by ${paymentMethods}. We start preparing once payment is received.`);
  if (is("photo") && !is("custom")) out.push(`Yes! We send you a **photo of your actual bouquet** on WhatsApp before it goes out.`);
  if (is("custom") || occasion.includes("pre-order")) out.push(`Yes! Send us a **photo** on WhatsApp (${site.phoneDisplay}) and say "I want this type", with your colours, budget and date. We confirm the design and price, you pay in advance, and we prepare it as a **pre-order**. [Pre-order & custom](/category/pre-order)`);
  if (is("card")) out.push(`A **free message card** is included. Write your message in the WhatsApp chat and we'll handwrite it for you.`);
  if (is("account")) out.push(`No account is needed to order. An account just adds your name and email to WhatsApp messages automatically. [Sign up](/signup) · [Login](/login)`);
  if (is("hours")) out.push(`We're open **${site.openingHours}**. WhatsApp messages outside these hours are answered the next morning.`);
  if (is("care") && !is("today")) out.push(`All our flowers are sourced fresh every morning. Fresh bouquets last about 5-7 days: trim the stems and change the water every 2 days. Soap and everlasting bouquets last for months. [Everlasting bouquets](/category/everlasting-bouquets)`);
  if (is("refund")) out.push(`For cancellations, changes or any problem with an order, please WhatsApp us at **${site.phoneDisplay}** with your order details and we'll sort it out quickly. [Refund policy](/refund-policy)`);
  if (is("pickup")) out.push(`We're an online florist delivering across KL & Selangor. For self-collection, WhatsApp us at ${site.phoneDisplay} and we'll arrange it.`);
  if (is("discount")) out.push(`Discounted bouquets show a **-%** tag and the old price crossed out. For bulk or corporate orders, WhatsApp us at ${site.phoneDisplay} for a special price.`);
  if ((is("list") || /\b([2-9]|two|three|four|five|dua|tiga)\s+(bouq|bouc|flow|bunga|box)/.test(text)) && !product) out.push(`To order several bouquets: tap **+** on each bouquet to add it to your order list (bag icon at the top), choose delivery, then tap **Send order on WhatsApp**. Everything goes in one message.`);
  if (is("contact") && !out.length) out.push(`You can reach our florist on WhatsApp at **${site.phoneDisplay}** (tap the green button) or email ${site.email}. We're open ${site.openingHours}.`);
  if (is("order") && !product && !out.some((o) => o.includes("Order now") || o.includes("order list") || o.includes("pre-order**"))) out.push(`Ordering is easy:\n1. ${HOW_TO_ORDER}\n2. We confirm the total and delivery on WhatsApp.\n3. You pay in advance, we send a photo, and deliver by Grab Express, Lalamove or J&T Express.`);

  // 5. Suggestions by occasion / flower type / budget
  const wantsList = occasion.length || budget || is("recommend") || (is("price") && !product && !feeQ);
  if (wantsList && !product) {
    let list = products.filter((p) => (occasion.length ? p.categories.some((c) => occasion.includes(c)) : true) && (occasion.includes("add-ons") || !p.categories.includes("add-ons")));
    if (budget) list = list.filter((p) => p.price <= budget);
    const cheap = any(tokens, ["cheap", "cheapest", "murah", "lowest", "affordable"]);
    list = [...list].sort((a, b) => (cheap ? a.price - b.price : (b.rating || 0) - (a.rating || 0))).slice(0, 4);
    const label = occasion.map((c) => categories.find((x) => x.slug === c)?.name).filter(Boolean).join(" / ");
    if (list.length) {
      out.push(`${label ? `**${label}**` : cheap ? "Most affordable bouquets" : "Popular bouquets"}${budget ? ` under ${formatPrice(budget)}` : ""}:\n${list.map(productLine).join("\n")}`);
      if (occasion.length === 1) out.push(`[See all ${label}](/category/${occasion[0]})`);
    } else if (budget) {
      const cheapest = [...bouquets].sort((a, b) => a.price - b.price).slice(0, 3);
      out.push(`Our bouquets start from **${formatPrice(cheapest[0].price)}**, so nothing is under ${formatPrice(budget)} yet. The most affordable ones:\n${cheapest.map(productLine).join("\n")}\nFor a smaller budget, WhatsApp us and we'll make a custom bouquet.`);
    }
    if (is("price") && !budget && !occasion.length) out.unshift(`Our bouquets range from **${formatPrice(Math.min(...bouquets.map((p) => p.price)))}** to **${formatPrice(Math.max(...bouquets.flatMap((p) => p.options?.map((o) => o.price) || [p.price])))}**.${is("custom") ? " Custom pre-orders start from **RM 150**." : ""} Tell me your budget and I'll find the best options.`);
  }

  if (out.length) return out.join("\n\n");

  // 6. Nothing understood
  return `Sorry, I didn't quite get that. 🌷 I can help with:\n- **bouquets** by occasion or budget (e.g. "birthday flowers under RM150")\n- **delivery** to your area (e.g. "deliver to Shah Alam today?")\n- **prices, payment and how to order**\nOr WhatsApp our florist at **${site.phoneDisplay}**.`;
}
