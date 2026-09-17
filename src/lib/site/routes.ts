import type { MetadataRoute } from "next";

/**
 * Every static (non-CMS) page on the site, in one place.
 *
 * Shared by the sitemap and by the tests that assert each of these paths also
 * has a markdown representation — the two drifting apart is exactly how a page
 * ends up invisible to agents.
 */
export type StaticRoute = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

export const STATIC_ROUTES: readonly StaticRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/blog", changeFrequency: "daily", priority: 0.9 },
  { path: "/oss-moperator", changeFrequency: "monthly", priority: 0.9 },
  { path: "/oss-moperator/setup", changeFrequency: "monthly", priority: 0.8 },
  { path: "/videos", changeFrequency: "weekly", priority: 0.8 },
  { path: "/repos", changeFrequency: "weekly", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
];

/** Routes whose markdown body is built from Sanity rather than from a constant. */
export const CMS_BACKED_ROUTES: readonly string[] = ["/blog", "/videos", "/repos"];
