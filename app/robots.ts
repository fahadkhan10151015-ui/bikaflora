import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

const blocked = ["/account", "/reset-password", "/admin"];
// AI search and assistant crawlers are welcome (so ChatGPT, Claude, Perplexity and Gemini can read and cite the site).
const aiBots = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Bingbot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: blocked }, { userAgent: aiBots, allow: "/", disallow: blocked }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
