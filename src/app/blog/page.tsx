import Image from "next/image";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { blurProps, type SanityImageAsset } from "@/sanity/lib/image";
import {
  buildBlogSchema,
  buildBreadcrumbSchema,
  jsonLdScriptProps,
} from "@/lib/seo/schema";

// Revalidate every 60 seconds
export const revalidate = 60;

export const metadata: Metadata = {
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "The mOperator" }],
    },
  },
  title: "Blog | The mOperator",
  description: "Guides, tutorials, and insights for operators learning to build apps with AI.",
};

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string | null;
  publishedAt: string | null;
  featured: boolean | null;
  mainImage: {
    asset: SanityImageAsset;
  } | null;
};

async function getFeaturedPost(): Promise<Post | null> {
  // First try to get an explicitly featured post
  const featured = await client.fetch(
    `*[_type == "post" && featured == true] | order(coalesce(publishedAt, _updatedAt) desc)[0] {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      featured,
      mainImage {
        asset-> {
          url,
          metadata { lqip, dimensions { width, height } }
        }
      }
    }`
  );
  
  if (featured) return featured;
  
  // Fall back to most recent post
  return client.fetch(
    `*[_type == "post"] | order(coalesce(publishedAt, _updatedAt) desc)[0] {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      featured,
      mainImage {
        asset-> {
          url,
          metadata { lqip, dimensions { width, height } }
        }
      }
    }`
  );
}

async function getPosts(excludeId?: string): Promise<Post[]> {
  const filter = excludeId 
    ? `*[_type == "post" && _id != $excludeId]`
    : `*[_type == "post"]`;
  
  return client.fetch(
    `${filter} | order(coalesce(publishedAt, _updatedAt) desc) {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      featured,
      mainImage {
        asset-> {
          url,
          metadata { lqip, dimensions { width, height } }
        }
      }
    }`,
    { excludeId }
  );
}

export default async function BlogPage() {
  const featuredPost = await getFeaturedPost();
  const posts = await getPosts(featuredPost?._id);

  const allPosts = [featuredPost, ...posts].filter((p) => p !== null);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <script
        {...jsonLdScriptProps(
          buildBlogSchema(
            allPosts.map((post) => ({
              title: post.title,
              slug: post.slug.current,
              publishedAt: post.publishedAt,
            }))
          )
        )}
      />
      <script
        {...jsonLdScriptProps(
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ])
        )}
      />
      {/* Geometric background pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[300px] sm:w-[400px] lg:w-[600px] h-[300px] sm:h-[400px] lg:h-[600px] opacity-10">
          <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="300" cy="300" r="280" stroke="#3ee07f" strokeWidth="1" />
            <circle cx="300" cy="300" r="200" stroke="#3ee07f" strokeWidth="1" />
            <circle cx="300" cy="300" r="120" stroke="#3ee07f" strokeWidth="1" />
          </svg>
        </div>
      </div>

      <SiteHeader />

      <main id="main-content">

      {/* Hero */}
      <section className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20 pt-8 sm:pt-12 md:pt-20 pb-8 sm:pb-12">
        <div className="max-w-4xl">
          <h1 className="animate-fade-up text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-3 sm:mb-4">
            <span className="text-accent glow-text">Blog</span>
          </h1>
          <p className="animate-fade-up text-base sm:text-lg md:text-xl text-muted" style={{ animationDelay: "100ms" }}>
            Guides, insights, and lessons learned on the journey from operator to builder.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20 pb-16 sm:pb-24">
        <div className="max-w-6xl">
          {!featuredPost && posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted text-lg mb-4">No posts yet. Check back soon!</p>
              <Link
                href="/"
                className="text-accent hover:underline"
              >
                ← Back to home
              </Link>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Featured Post */}
              {featuredPost && (
                <Link
                  href={`/blog/${featuredPost.slug.current}`}
                  className="animate-fade-up group block"
                  style={{ animationDelay: "200ms" }}
                >
                  <article className="relative overflow-hidden rounded-[--radius-lg] bg-surface border border-border group-hover:border-accent/50 transition-all duration-500 group-hover:shadow-[0_0_60px_-15px_rgba(62,224,127,0.3)]">
                    {/* Decorative corner accent */}
                    <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 opacity-[0.07]">
                      <svg viewBox="0 0 128 128" fill="none" aria-hidden="true">
                        <path d="M128 0L0 128V0H128Z" fill="#3ee07f" />
                      </svg>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row">
                      {/* Image */}
                      <div className="relative lg:w-1/2 h-64 lg:h-auto overflow-hidden">
                        {featuredPost.mainImage?.asset?.url ? (
                          <>
                            <Image
                              src={featuredPost.mainImage.asset.url}
                              alt={featuredPost.title}
                              fill
                              priority
                              sizes="(max-width: 1024px) 100vw, 50vw"
                              {...blurProps(featuredPost.mainImage.asset)}
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Scrim, not decoration: the brand bans gradients as a
                                styling device, but text over a poster still needs
                                a contrast ramp. Tinted to --surface. */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-surface opacity-80 lg:opacity-100" />
                            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent lg:hidden" />
                          </>
                        ) : (
                          <div className="w-full h-full bg-[var(--accent-glow-soft)] flex items-center justify-center">
                            <Image src="/icon.svg" alt="" width={96} height={96} unoptimized className="w-24 h-24 opacity-30" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="relative lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                        {/* Featured badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 w-fit mb-6">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                          <span className="text-xs font-medium text-accent uppercase tracking-wider">Featured</span>
                        </div>

                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight group-hover:text-accent transition-colors duration-300">
                          {featuredPost.title}
                        </h2>
                        
                        {featuredPost.excerpt && (
                          <p className="text-muted text-lg mb-6 line-clamp-3">{featuredPost.excerpt}</p>
                        )}

                        <div className="flex items-center gap-4 text-sm text-muted">
                          {featuredPost.publishedAt && (
                            <span className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {new Date(featuredPost.publishedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          )}
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            5 min read
                          </span>
                        </div>

                        {/* Read arrow */}
                        <div className="mt-8 flex items-center gap-2 text-accent font-medium">
                          <span>Read article</span>
                          <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              )}

              {/* Other posts */}
              {posts.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6">
                  {posts.map((post, i) => (
                    <Link
                      key={post._id}
                      href={`/blog/${post.slug.current}`}
                      className="animate-fade-up group block"
                      style={{ animationDelay: `${(i + 3) * 100}ms` }}
                    >
                      <article className="relative h-full overflow-hidden rounded-[--radius-lg] bg-surface border border-border group-hover:border-accent/40 transition-all duration-300 group-hover:shadow-[0_0_40px_-15px_rgba(62,224,127,0.25)] group-hover:-translate-y-1">
                        {/* Image with overlay */}
                        <div className="relative h-48 overflow-hidden">
                          {post.mainImage?.asset?.url ? (
                            <>
                              <Image
                                src={post.mainImage.asset.url}
                                alt={post.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                {...blurProps(post.mainImage.asset)}
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              {/* Legibility scrim for the date badge and title */}
                              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />
                            </>
                          ) : (
                            <div className="w-full h-full bg-surface-elevated flex items-center justify-center">
                              <Image src="/icon.svg" alt="" width={64} height={64} unoptimized className="w-16 h-16 opacity-20" />
                            </div>
                          )}
                          
                          {/* Floating date badge */}
                          {post.publishedAt && (
                            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-surface/80 backdrop-blur-sm border border-border/50 text-xs font-mono text-muted">
                              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors duration-300 line-clamp-2">
                            {post.title}
                          </h3>
                          
                          {post.excerpt && (
                            <p className="text-muted text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                          )}

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                              4 min read
                            </span>
                            <span className="text-accent text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              Read
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </div>

                        {/* Bottom accent line */}
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      </main>

      <SiteFooter />
    </div>
  );
}

