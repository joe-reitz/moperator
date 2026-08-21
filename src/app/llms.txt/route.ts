import { client } from "@/sanity/lib/client";
import { siteConfig } from "@/lib/seo/config";

export const revalidate = 3600;

type LlmsPost = {
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string | null;
  _updatedAt: string;
};

/**
 * llms.txt — a plain-text map of the site for answer engines and agents.
 * Convention: https://llmstxt.org
 */
export async function GET() {
  const posts = await client.fetch<LlmsPost[]>(
    `*[_type == "post" && defined(slug.current)]
      | order(coalesce(publishedAt, _updatedAt) desc) {
        title, "slug": slug.current, excerpt, publishedAt, _updatedAt
      }`
  );

  const postLines = posts
    .map((post) => {
      const summary = (post.excerpt ?? "").replace(/\s+/g, " ").trim();
      return `- [${post.title}](${siteConfig.url}/blog/${post.slug})${
        summary ? `: ${summary}` : ""
      }`;
    })
    .join("\n");

  const body = `# ${siteConfig.name}

> ${siteConfig.description}. Written by ${siteConfig.author.name} for ${siteConfig.audience.description} — people moving from running marketing/revenue systems into actually building and shipping software with AI tools.

The site documents that transition in public: hands-on tutorials using tools like v0, Cursor, Claude, GitHub and Vercel, aimed at readers who are technical operators but not career software engineers.

## Guides and tutorials

${postLines}

## The mOperator agent (open source)

- [mOperator agent](${siteConfig.url}/oss-moperator): an open-source marketing operations agent that runs in Slack and works in your CRM. MIT licensed, built on eve, deploys to Vercel. Every rule it follows is an editable file, so teams fork it rather than buy a closed product.
- [Setup guide for non-developers](${siteConfig.url}/oss-moperator/setup): step-by-step deployment written for marketing operators with no command-line experience — creating accounts, running it against a mock CRM, deploying to Vercel, adding Slack, connecting a real CRM, and the security options for IP-restricted CRMs.

## Sections

- [Blog](${siteConfig.url}/blog): all written guides and tutorials.
- [Videos](${siteConfig.url}/videos): recorded walkthroughs of the same material.
- [Repos](${siteConfig.url}/repos): example projects referenced by the tutorials.
- [About](${siteConfig.url}/about): who ${siteConfig.author.name} is and why this site exists.

## Feeds

- [RSS](${siteConfig.url}/feed.xml)
- [Sitemap](${siteConfig.url}/sitemap.xml)
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
