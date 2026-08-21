import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { PortableText, PortableTextBlock } from "@portabletext/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { Badge } from "@/app/components/ui/Badge";
import { blurProps, type SanityImageAsset } from "@/sanity/lib/image";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  jsonLdScriptProps,
} from "@/lib/seo/schema";
import { portableTextComponents } from "../portable-text-components";

// Convert video URLs to embed URLs
function getEmbedUrl(url: string): string {
  // YouTube
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Loom
  const loomMatch = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
  if (loomMatch) {
    return `https://www.loom.com/embed/${loomMatch[1]}`;
  }

  // Return original if no match
  return url;
}

type Post = {
  _id: string;
  _updatedAt: string;
  title: string;
  slug: { current: string };
  excerpt: string | null;
  publishedAt: string | null;
  body: PortableTextBlock[] | null;
  mainImage: {
    asset: SanityImageAsset;
  } | null;
  author: {
    name: string;
    image: {
      asset: SanityImageAsset;
    } | null;
  } | null;
  featuredVideo: {
    title: string;
    videoUrl: string;
    duration: string | null;
  } | null;
  seoTitle: string | null;
  metaDescription: string | null;
  schemaMarkup: string | null;
  tag: string | null;
  primaryKeyword: string | null;
  secondaryKeywords: string[] | null;
  ogImage: {
    asset: SanityImageAsset;
  } | null;
};

// Posts are prerendered at build time and refreshed by the Sanity webhook
// (revalidatePath). The hourly window is just a safety net if a webhook is missed.
export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(
    `*[_type == "post" && defined(slug.current)].slug.current`
  );
  return slugs.map((slug) => ({ slug }));
}

async function getPost(slug: string): Promise<Post | null> {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id,
      _updatedAt,
      title,
      slug,
      excerpt,
      publishedAt,
      body,
      mainImage {
        asset-> {
          url,
          metadata { lqip, dimensions { width, height } }
        }
      },
      author-> {
        name,
        image {
          asset-> {
            url,
            metadata { lqip, dimensions { width, height } }
          }
        }
      },
      featuredVideo-> {
        title,
        videoUrl,
        duration
      },
      seoTitle,
      metaDescription,
      schemaMarkup,
      "tag": categories[0]->title,
      primaryKeyword,
      secondaryKeywords,
      ogImage {
        asset-> {
          url,
          metadata { lqip, dimensions { width, height } }
        }
      }
    }`,
    { slug }
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Post Not Found | The mOperator",
    };
  }

  const pageTitle = post.seoTitle || post.title;
  const pageDescription = post.metaDescription || post.excerpt || "A post from The mOperator";
  const ogImageUrl = post.ogImage?.asset?.url || post.mainImage?.asset?.url;

  return {
    title: `${pageTitle} | The mOperator`,
    description: pageDescription,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      type: "article",
      url: `/blog/${slug}`,
      ...(post.publishedAt && { publishedTime: post.publishedAt }),
      ...(post.author?.name && { authors: [post.author.name] }),
      ...(ogImageUrl && {
        images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen relative">
      {/* JSON-LD: hand-authored markup from the Studio wins, otherwise we
          derive BlogPosting from the post's own fields. */}
      {post.schemaMarkup ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: post.schemaMarkup }}
        />
      ) : (
        <script
          {...jsonLdScriptProps(
            buildArticleSchema({
              title: post.title,
              slug: post.slug.current,
              description: post.metaDescription || post.excerpt,
              publishedAt: post.publishedAt,
              updatedAt: post._updatedAt,
              imageUrl: post.ogImage?.asset?.url || post.mainImage?.asset?.url,
              authorName: post.author?.name,
              keywords: [
                post.primaryKeyword,
                ...(post.secondaryKeywords ?? []),
              ].filter((k): k is string => Boolean(k)),
            })
          )}
        />
      )}

      <script
        {...jsonLdScriptProps(
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug.current}` },
          ])
        )}
      />

      <SiteHeader />

      <main id="main-content">

      {/* Article */}
      <article className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20 pt-4 sm:pt-8 pb-16 sm:pb-24">
        <div className="mx-auto max-w-[760px]">
          {/* Back link */}
          <Link
            href="/blog"
            className="font-mono text-[13px] text-accent transition-colors hover:brightness-110"
          >
            ← back to blog
          </Link>

          {/* Header */}
          <header className="mb-8 mt-7 sm:mb-12">
            <div className="mb-4 flex flex-wrap items-center gap-3.5">
              {post.tag && <Badge variant="muted">{post.tag.toLowerCase()}</Badge>}
              {post.publishedAt && (
                <time
                  dateTime={post.publishedAt}
                  className="font-mono text-xs text-muted-dim"
                >
                  {post.publishedAt.slice(0, 10)}
                </time>
              )}
            </div>

            <h1 className="mb-6 text-[28px] font-bold leading-[1.15] tracking-[var(--tracking-display)] text-foreground sm:text-[34px] md:text-[42px]">
              {post.title}
            </h1>

            {post.author && (
              <div className="flex items-center gap-3">
                {post.author.image?.asset?.url ? (
                  <Image
                    src={post.author.image.asset.url}
                    alt=""
                    width={36}
                    height={36}
                    {...blurProps(post.author.image.asset)}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-glow-soft)] font-medium text-accent">
                    {post.author.name.charAt(0)}
                  </div>
                )}
                <span className="font-mono text-xs text-muted">
                  {post.author.name}
                </span>
              </div>
            )}
          </header>

          {/* Featured Video */}
          {post.featuredVideo && (
            <div className="mb-12">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-surface-elevated">
                <iframe
                  src={getEmbedUrl(post.featuredVideo.videoUrl)}
                  title={post.featuredVideo.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {post.featuredVideo.duration && (
                <p className="text-sm text-muted mt-2 text-center">
                  Duration: {post.featuredVideo.duration}
                </p>
              )}
            </div>
          )}

          {/* Featured Image (only if no video) */}
          {!post.featuredVideo && post.mainImage?.asset?.url && (
            <div className="mb-12 rounded-xl overflow-hidden">
              <Image
                src={post.mainImage.asset.url}
                alt={post.title}
                width={post.mainImage.asset.metadata?.dimensions?.width ?? 1200}
                height={post.mainImage.asset.metadata?.dimensions?.height ?? 675}
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                {...blurProps(post.mainImage.asset)}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Content */}
          <div className="article-content">
            {post.body && (
              <PortableText
                value={post.body}
                components={portableTextComponents}
              />
            )}
          </div>

          {/* Join the Discussion */}
          <div className="mt-16 p-6 sm:p-8 rounded-xl bg-surface border border-border">
            <h3 className="text-lg font-semibold mb-2">Join the Discussion</h3>
            <p className="text-muted text-sm mb-5">
              Got thoughts on this post? Let&apos;s chat on social.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://x.com/joe_reitz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Discuss on X
              </a>
              <a
                href="https://www.linkedin.com/in/joereitz/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-muted font-medium text-sm hover:text-foreground hover:border-muted transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Connect on LinkedIn
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-8 border-t border-border">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-accent hover:underline"
            >
              <span>←</span>
              <span>Back to all posts</span>
            </Link>
          </div>
        </div>
      </article>

      </main>

      <SiteFooter />
    </div>
  );
}

