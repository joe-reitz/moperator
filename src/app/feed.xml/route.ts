import { client } from "@/sanity/lib/client";
import { siteConfig } from "@/lib/seo/config";

export const revalidate = 3600;

type FeedPost = {
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string | null;
  _updatedAt: string;
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await client.fetch<FeedPost[]>(
    // Match what the sitemap and /blog already treat as live. Requiring
    // publishedAt here silently dropped posts that render publicly but were
    // never given a date in the Studio.
    `*[_type == "post" && defined(slug.current) && (!defined(publishedAt) || publishedAt <= now())]
      | order(coalesce(publishedAt, _updatedAt) desc)[0...50] {
        title,
        "slug": slug.current,
        excerpt,
        publishedAt,
        _updatedAt
      }`
  );

  const items = posts
    .map((post) => {
      const url = `${siteConfig.url}/blog/${post.slug}`;
      const pubDate = new Date(post.publishedAt ?? post._updatedAt).toUTCString();
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.excerpt ?? "")}</description>
    </item>`;
    })
    .join("\n");

  const lastBuildDate = new Date(
    posts[0]?.publishedAt ?? Date.now()
  ).toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${siteConfig.url}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
