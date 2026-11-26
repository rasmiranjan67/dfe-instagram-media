import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
export const dynamic = "force-static";
// Search engines and AI answer engines are all welcome, so DFE can appear in Google, Bing, ChatGPT, Perplexity, Gemini and Claude answers.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Google-Extended", "ClaudeBot", "Claude-SearchBot", "Bingbot", "Applebot-Extended"], allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
