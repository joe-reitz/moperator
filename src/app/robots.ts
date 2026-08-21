import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/config";

// Crawlers that build answer-engine indexes and training corpora. They are
// already covered by the "*" rule, but naming them makes the policy explicit
// and gives one obvious place to revoke access per-bot later.
const ANSWER_ENGINE_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bytespider",
  "meta-externalagent",
  "CCBot",
];

const PRIVATE_PATHS = [
  "/studio",
  "/studio/",
  "/api/",
  "/preview-email",
  "/unsubscribe",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
      ...ANSWER_ENGINE_BOTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: PRIVATE_PATHS,
      })),
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
