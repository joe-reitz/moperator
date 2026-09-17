import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { siteConfig } from "@/lib/seo/config";
import { STATIC_ROUTES } from "@/lib/site/routes";

export const revalidate = 3600;

type SitemapPost = {
  slug: string;
  publishedAt: string | null;
  _updatedAt: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await client.fetch<SitemapPost[]>(
    `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
      "slug": slug.current,
      publishedAt,
      _updatedAt
    }`
  );

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post._updatedAt ?? post.publishedAt ?? Date.now()),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...postEntries];
}
