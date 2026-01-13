import { client } from "@/sanity/lib/client";
import { PortableText, PortableTextBlock } from "@portabletext/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
          <a href="/coming-soon" className="text-muted hover:text-foreground transition-colors">
            Videos
          </a>
          <a href="/blog" className="text-muted hover:text-foreground transition-colors">
            Blog
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

          {/* Featured Image */}
          {post.mainImage?.asset?.url && (
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

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-border">
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
            <a href="#" className="hover:text-foreground transition-colors">
              YouTube
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

