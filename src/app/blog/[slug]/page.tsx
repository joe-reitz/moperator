import { client } from "@/sanity/lib/client";
import { PortableText, PortableTextBlock } from "@portabletext/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
  title: string;
  slug: { current: string };
  excerpt: string | null;
  publishedAt: string | null;
  body: PortableTextBlock[] | null;
  mainImage: {
    asset: {
      url: string;
    };
  } | null;
  author: {
    name: string;
    image: {
      asset: {
        url: string;
      };
    } | null;
  } | null;
  featuredVideo: {
    title: string;
    videoUrl: string;
    duration: string | null;
  } | null;
};

async function getPost(slug: string): Promise<Post | null> {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      body,
      mainImage {
        asset-> {
          url
        }
      },
      author-> {
        name,
        image {
          asset-> {
            url
          }
        }
      },
      featuredVideo-> {
        title,
        videoUrl,
        duration
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
      title: "Post Not Found | The MOPerator",
    };
  }

  return {
    title: `${post.title} | The MOPerator`,
    description: post.excerpt || "A post from The MOPerator",
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
    <main className="min-h-screen relative">
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-4 py-4 sm:px-6 sm:py-6 md:px-12 lg:px-20">
        <a href="/" className="flex items-center gap-2 sm:gap-4">
          <img
            src="/icon.svg"
            alt="The MOPerator"
            className="h-10 sm:h-14 md:h-16 lg:h-20 w-auto"
          />
          <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight">
            The <span className="text-accent glow-text">MOP</span>erator
          </span>
        </a>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <a href="/" className="text-muted hover:text-foreground transition-colors p-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </a>
        </div>

        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm">
          <a href="/videos" className="text-muted hover:text-foreground transition-colors">
            Videos
          </a>
          <a href="/blog" className="text-muted hover:text-foreground transition-colors">
            Blog
          </a>
          <a href="/repos" className="text-muted hover:text-foreground transition-colors">
            Repos
          </a>
          <a href="/about" className="text-muted hover:text-foreground transition-colors">
            About
          </a>
        </div>
      </nav>

      {/* Article */}
      <article className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20 pt-4 sm:pt-8 pb-16 sm:pb-24">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <a
            href="/blog"
            className="inline-flex items-center gap-2 text-sm sm:text-base text-muted hover:text-foreground transition-colors mb-6 sm:mb-8"
          >
            <span>←</span>
            <span>Back to Blog</span>
          </a>

          {/* Header */}
          <header className="mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.2] tracking-tight mb-4 sm:mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base text-muted">
              {post.author && (
                <div className="flex items-center gap-3">
                  {post.author.image?.asset?.url ? (
                    <img
                      src={post.author.image.asset.url}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium">
                      {post.author.name.charAt(0)}
                    </div>
                  )}
                  <span className="font-medium text-foreground">{post.author.name}</span>
                </div>
              )}
              {post.publishedAt && (
                <>
                  <span>•</span>
                  <time>
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </>
              )}
            </div>
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
              <img
                src={post.mainImage.asset.url}
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Content */}
          <div className="article-content">
            {post.body && <PortableText value={post.body} />}
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
            <a
              href="/blog"
              className="inline-flex items-center gap-2 text-accent hover:underline"
            >
              <span>←</span>
              <span>Back to all posts</span>
            </a>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-10 md:py-12 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:gap-6 md:flex-row items-center justify-between">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <img src="/icon.svg" alt="The MOPerator" className="h-8 sm:h-10 md:h-12 w-auto" />
              <span className="font-medium text-base sm:text-lg">
                The <span className="text-accent glow-text">MOP</span>erator
              </span>
            </div>
            <span className="text-xs sm:text-sm text-muted">© 2026 Joe Reitz.</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted">
            <a
              href="https://x.com/joe_reitz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Twitter
            </a>
            <a
              href="https://www.linkedin.com/in/joereitz/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>
            <a href="https://www.youtube.com/playlist?list=PLY67q0EVU695eunjuo0G9KjysmzqbDez9" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              YouTube
            </a>
            <span className="text-border">|</span>
            <a
              href="https://venmo.com/joe-reitz-1"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <span>☕</span>
              <span>Buy me a coffee</span>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

