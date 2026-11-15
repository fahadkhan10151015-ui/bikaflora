import { subSitemapResponse } from "@/lib/sitemap-xml";
export const dynamic = "force-static";
export function GET() { return subSitemapResponse("category-sitemap.xml"); }
