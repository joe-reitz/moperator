import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | The MOPerator",
  description: "Guides, tutorials, and insights for operators learning to build apps with AI.",
};

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string | null;
  publishedAt: string | null;
  mainImage: {
    asset: {
      url: string;
    };
  } | null;
};

async function getPosts(): Promise<Post[]> {
  return client.fetch(
    `*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      mainImage {
        asset-> {
          url
        }
      }
    }`
  );
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Geometric background pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-10">
          <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="300" cy="300" r="280" stroke="#f59e0b" strokeWidth="1" />
            <circle cx="300" cy="300" r="200" stroke="#f59e0b" strokeWidth="1" />
            <circle cx="300" cy="300" r="120" stroke="#f59e0b" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 lg:px-20">
        <a href="/" className="flex items-center gap-4">
          <img
            src="/icon.svg"
            alt="The MOPerator"
            className="h-14 md:h-16 lg:h-20 w-auto"
          />
          <span className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight">
            The <span className="text-accent glow-text">MOP</span>erator
          </span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm">
          <a href="/coming-soon" className="text-muted hover:text-foreground transition-colors">
            Videos
          </a>
          <a href="/blog" className="text-foreground transition-colors">
            Blog
          </a>
          <a href="/about" className="text-muted hover:text-foreground transition-colors">
            About
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 pt-16 md:pt-24 pb-12">
        <div className="max-w-4xl">
          <h1 className="animate-fade-up text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-4">
            <span className="text-accent glow-text">Blog</span>
          </h1>
          <p className="animate-fade-up text-lg md:text-xl text-muted" style={{ animationDelay: "100ms" }}>
            Guides, insights, and lessons learned on the journey from operator to builder.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 pb-24">
        <div className="max-w-5xl">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted text-lg mb-4">No posts yet. Check back soon!</p>
              <a
                href="/"
                className="text-accent hover:underline"
              >
                ← Back to home
              </a>
            </div>
          ) : (
            <div className="grid gap-8">
              {posts.map((post, i) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug.current}`}
                  className="animate-fade-up group block"
                  style={{ animationDelay: `${(i + 2) * 100}ms` }}
                >
                  <article className="p-6 md:p-8 rounded-xl bg-surface border border-border hover:border-accent/30 transition-all">
                    <div className="flex flex-col md:flex-row gap-6">
                      {post.mainImage?.asset?.url && (
                        <div className="flex-shrink-0 w-full md:w-48 h-32 rounded-lg overflow-hidden bg-surface-elevated">
                          <img
                            src={post.mainImage.asset.url}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h2 className="text-xl md:text-2xl font-semibold mb-2 group-hover:text-accent transition-colors">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="text-muted mb-4 line-clamp-2">{post.excerpt}</p>
                        )}
                        {post.publishedAt && (
                          <p className="text-sm text-muted">
                            {new Date(post.publishedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 md:px-12 lg:px-20 py-12 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/icon.svg" alt="The MOPerator" className="h-12 w-auto" />
            <span className="font-medium text-lg">
              The <span className="text-accent glow-text">MOP</span>erator
            </span>
            <span className="text-sm text-muted">© 2026 Joe Reitz.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted">
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

