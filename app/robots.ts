import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/account", "/reset-password", "/admin"] }], sitemap: absoluteUrl("/sitemap.xml") };
}
