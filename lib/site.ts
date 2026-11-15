// ============================================================
//  BikaFlora — business settings
//  Defaults live here. "Site settings" in the admin panel can change them (merged at build time).
// ============================================================
import { content } from "./content";

export const site = {
  name: "BikaFlora",
  description:
    "BikaFlora is an online florist in Kuala Lumpur & Selangor. Long-lasting soap rose bouquets, Ferrero Rocher bouquets, heart bouquets and graduation bouquets with same-day delivery or pre-order. Order easily on WhatsApp.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://bikaflora.my").replace(/\/$/, ""),

  // WhatsApp number: country code + number, digits only (Malaysia example: 60123456789)
  whatsapp: "601161326484",
  phoneDisplay: "+60 11-6132 6484",
  email: "support@bikaflora.my",

  currency: "RM",
  openingHours: "Daily, 9:00 AM – 9:00 PM",
  addressRegion: "Kuala Lumpur & Selangor, Malaysia",

  social: {
    instagram: "https://www.instagram.com/bikaflora",
    facebook: "https://www.facebook.com/share/1Dvac528Fg/",
    tiktok: "https://www.tiktok.com/@bikaflora",
  } as Record<"instagram" | "facebook" | "tiktok", string>,
};

export type NavLink = { label: string; href: string };
export type AnnouncementItem = { icon: string; text: string; href?: string };

/** Main menu links (after Shop by category and Delivery Areas). */
export let menuLinks: NavLink[] = [
  { href: "/shop", label: "Shop All" },
  { href: "/reviews", label: "Reviews" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export let footerShopLinks: NavLink[] = [
  { href: "/category/best-seller", label: "Best Seller Bouquets" },
  { href: "/category/birthday-flowers", label: "Birthday Flowers" },
  { href: "/category/anniversary-valentine-bouquets", label: "Anniversary Bouquets" },
  { href: "/category/graduation-bouquets", label: "Graduation Bouquets" },
  { href: "/category/chocolate-flower-bouquets", label: "Ferrero & Chocolate Bouquets" },
  { href: "/category/below-100", label: "Bouquets Below RM100" },
  { href: "/category/crochet-bouquets", label: "Crochet Bouquets" },
];

export let footerHelpLinks: NavLink[] = [
  { href: "/about", label: "About Us" },
  { href: "/faq", label: "FAQ" },
  { href: "/delivery-information", label: "Delivery Information" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/contact", label: "Contact" },
];

export let menuAreaSlugs = ["kuala-lumpur", "shah-alam", "petaling-jaya", "subang-jaya", "cheras", "klang", "puchong", "cyberjaya", "bangsar", "mont-kiara"];

export let footerAreaSlugs = ["kuala-lumpur", "shah-alam", "petaling-jaya", "subang-jaya", "cheras", "puchong", "klang"];

/** The scrolling bar above the menu. {phone} is replaced with the WhatsApp number. */
export let announcement: AnnouncementItem[] = [
  { icon: "wallet", text: "Full payment in advance" },
  { icon: "phone", text: "WhatsApp {phone}", href: "whatsapp" },
  { icon: "zap", text: "Same-day delivery, any time" },
  { icon: "calendar", text: "Pre-order & custom bouquets: send us a photo" },
  { icon: "truck", text: "Grab Express · Lalamove · J&T Express" },
  { icon: "pin", text: "Delivering across KL & Selangor" },
];

/** Default same-day cut-off shown on area pages (empty = no cut-off). */
export let defaultCutoff = "";

// ---- Edits from the admin panel ("Site settings") ----
type Settings = Partial<{
  whatsapp: string; phoneDisplay: string; email: string; openingHours: string;
  instagram: string; facebook: string; tiktok: string;
  menu: NavLink[]; footerShop: NavLink[]; footerHelp: NavLink[]; footerAreas: string[]; menuAreas: string[];
  announcement: AnnouncementItem[]; cutoff: string;
}>;
const cfg = ((content.page as Record<string, unknown>)?.settings ?? {}) as Settings;
const clean = (l?: NavLink[]) => (l ?? []).filter((x) => x?.label?.trim() && x?.href?.trim());
if (cfg.whatsapp?.replace(/\D/g, "")) site.whatsapp = cfg.whatsapp.replace(/\D/g, "");
if (cfg.phoneDisplay?.trim()) site.phoneDisplay = cfg.phoneDisplay.trim();
if (cfg.email?.trim()) site.email = cfg.email.trim();
if (cfg.openingHours?.trim()) site.openingHours = cfg.openingHours.trim();
for (const k of ["instagram", "facebook", "tiktok"] as const) if (cfg[k] !== undefined) site.social[k] = cfg[k]!.trim();
if (clean(cfg.menu).length) menuLinks = clean(cfg.menu);
if (clean(cfg.footerShop).length) footerShopLinks = clean(cfg.footerShop);
if (clean(cfg.footerHelp).length) footerHelpLinks = clean(cfg.footerHelp);
if (cfg.footerAreas?.length) footerAreaSlugs = cfg.footerAreas;
if (cfg.menuAreas?.length) menuAreaSlugs = cfg.menuAreas;
if (cfg.announcement?.some((a) => a.text?.trim())) announcement = cfg.announcement.filter((a) => a.text?.trim());
if (cfg.cutoff !== undefined) defaultCutoff = cfg.cutoff.trim();

/** Real social profile links only (empty or placeholder links are left out). */
export const socialLinks = () => Object.entries(site.social).filter(([, u]) => /^https?:\/\/[^/]+\/.+/.test(u)).map(([name, url]) => ({ name, url }));

/** The two ways a customer can order. */
export const deliveryMethods = [
  { id: "instant", label: "Instant Delivery", detail: "Ready bouquets, delivered today at any time" },
  { id: "preorder", label: "Pre-order", detail: "Tell us what you want and the date, we prepare it for you" },
] as const;

/** Couriers we use. */
export const deliveryPartners = [
  { name: "Grab Express", use: "Instant same-day delivery in KL & Selangor" },
  { name: "Lalamove", use: "Instant same-day delivery in KL & Selangor" },
  { name: "J&T Express", use: "Crochet bouquets & gifts sent further away" },
];

/** Payment policy shown across the site. */
export const paymentNote = "Full payment in advance. We start preparing once payment is received.";
export const paymentMethods = "Online bank transfer (FPX / DuitNow) or e-wallet (Touch 'n Go)";

export type DeliveryMethodId = (typeof deliveryMethods)[number]["id"];

export const absoluteUrl = (path = "/") => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;

export const formatPrice = (n: number) => `${site.currency} ${n.toLocaleString("en-MY")}`;
