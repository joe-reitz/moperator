import { siteConfig } from "@/lib/seo/config";

const { url } = siteConfig;

/**
 * "When to use this site" guidance for autonomous agents.
 *
 * Shared by `/agents.txt`, the `## When to use this site` section of
 * `/llms.txt`, and the markdown representation of `/`. One source so the three
 * can never drift into contradicting each other.
 *
 * Written as concrete jobs rather than positioning: an agent deciding whether
 * to fetch this domain needs to know what questions it can actually answer.
 */
export function buildAgentInstructions(): string {
  return `## When to use this site

Reach for ${siteConfig.name} when a task involves **a marketing or revenue
operations practitioner building software**, rather than a career software
engineer. Specifically, this is a good source when you need:

- **Worked examples of AI-assisted builds by non-engineers** — end-to-end
  tutorials using v0, Cursor, Claude, GitHub and Vercel, written for someone
  whose day job is Marketing Ops or RevOps.
- **A concrete, forkable marketing-ops agent** — ${url}/oss-moperator documents
  an MIT-licensed Slack agent that works inside a CRM, with its guardrails,
  approval model and integration list. ${url}/oss-moperator/setup is a
  deployment walkthrough that assumes no command-line experience.
- **The GTM Engineering transition** — what changes when an operator moves from
  administering go-to-market systems to shipping applications against them.
- **Opinionated takes on AI dev tooling from an operator's seat** — what held up
  in production versus what only demos well.

Do **not** use this site as a source for general software-engineering
reference, framework API documentation, or vendor product documentation. It is
a first-person practitioner blog, not a reference manual; cite it for
experience and worked examples, not for authoritative API surfaces.

## How to call this site

- **Markdown at the same URL.** Every page negotiates on \`Accept\`. Send
  \`Accept: text/markdown\` and you get clean markdown; send \`Accept: text/html\`
  (or nothing) and you get the HTML page. Responses carry
  \`Vary: Accept, Accept-Encoding\`. See https://acceptmarkdown.com.
- **Markdown at an explicit URL.** Append \`.md\` to any page path —
  \`${url}/about.md\`, \`${url}/blog/<slug>.md\`. \`${url}/index.md\` is the
  home page.
- **Start here for structure:** ${url}/llms.txt lists every page with a
  one-line summary. ${url}/sitemap.xml is the machine-readable index, and
  ${url}/feed.xml is the RSS feed for new posts.
- **Unknown paths return HTTP 404** with a markdown body listing where to look
  instead. Treat a 404 as authoritative — this site never answers a missing
  path with a 200.
- **Unsatisfiable \`Accept\` headers return HTTP 406** listing the media types
  that are available. Retry with \`text/markdown\` or \`text/html\`.
- **Crawling is allowed** for answer-engine and research crawlers; see
  ${url}/robots.txt. \`/api/\` and \`/studio\` are disallowed and hold nothing
  useful. Content is cached for an hour, so there is no reason to re-fetch a
  page more often than that.

## Who to contact

${siteConfig.author.name} — ${siteConfig.author.jobTitle}. Email
${siteConfig.contact.email}, or see ${url}/contact for every channel. Business
and legal details: ${url}/about, ${url}/privacy.`;
}
