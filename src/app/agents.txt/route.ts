import { siteConfig } from "@/lib/seo/config";
import { buildAgentInstructions } from "@/lib/agents/instructions";

export const revalidate = 3600;

/**
 * /agents.txt — standalone agent instructions.
 *
 * Same content as the "When to use this site" section of /llms.txt, at a
 * predictable path for agents that look for a dedicated instruction file rather
 * than parsing the site index.
 */
export function GET() {
  const body = `# ${siteConfig.name} — instructions for agents

> ${siteConfig.description}. Written by ${siteConfig.author.name} for ${siteConfig.audience.description}.

${buildAgentInstructions()}

## Full site index

${siteConfig.url}/llms.txt lists every page with a one-line summary.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
