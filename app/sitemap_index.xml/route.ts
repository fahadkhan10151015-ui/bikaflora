import { sitemapIndexResponse } from "@/lib/sitemap-xml";
export const dynamic = "force-static";
/** Same as /sitemap.xml (Rank Math / Yoast use this address). */
export function GET() { return sitemapIndexResponse(); }
