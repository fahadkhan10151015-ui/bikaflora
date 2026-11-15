import raw from "@/data/site-config.json";

/** Admin settings that the browser also needs (Site settings, Delivery areas, Redirects, Hero). Written at build time. */
export const siteConfig = raw as Record<string, Record<string, unknown> | undefined>;
