import { allPagePaths } from "@/lib/sitemap-entries";

/** Every page address on the website, for "pick a page" lists in the admin panel. */
export const sitePaths = () => [...new Set(["/", "/shop", "/reviews", "/blog", "/contact", "/flower-delivery", ...allPagePaths().map((p) => p.path)])].sort();
