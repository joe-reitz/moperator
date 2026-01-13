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
        <div className="max-w-6xl">
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
            <div className="space-y-12">
              {/* Featured Post (first post) */}
              {posts[0] && (
                <Link
                  href={`/blog/${posts[0].slug.current}`}
                  className="animate-fade-up group block"
                  style={{ animationDelay: "200ms" }}
                >
                  <article className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface via-surface to-surface-elevated border border-border group-hover:border-accent/50 transition-all duration-500 group-hover:shadow-[0_0_60px_-15px_rgba(245,158,11,0.3)]">
                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
                      <svg viewBox="0 0 128 128" fill="none">
                        <path d="M128 0L0 128V0H128Z" fill="url(#cornerGrad)" />
                        <defs>
                          <linearGradient id="cornerGrad" x1="0" y1="0" x2="128" y2="128">
                            <stop stopColor="#f59e0b" />
                            <stop offset="1" stopColor="transparent" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row">
                      {/* Image */}
                      <div className="relative lg:w-1/2 h-64 lg:h-auto overflow-hidden">
                        {posts[0].mainImage?.asset?.url ? (
                          <>
                            <img
                              src={posts[0].mainImage.asset.url}
                              alt={posts[0].title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-surface opacity-80 lg:opacity-100" />
                            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent lg:hidden" />
                          </>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-accent/20 to-surface-elevated flex items-center justify-center">
                            <img src="/icon.svg" alt="" className="w-24 h-24 opacity-30" />
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
                          {posts[0].title}
                        </h2>
                        
                        {posts[0].excerpt && (
                          <p className="text-muted text-lg mb-6 line-clamp-3">{posts[0].excerpt}</p>
                        )}

                        <div className="flex items-center gap-4 text-sm text-muted">
                          {posts[0].publishedAt && (
                            <span className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {new Date(posts[0].publishedAt).toLocaleDateString("en-US", {
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
              {posts.length > 1 && (
                <div className="grid md:grid-cols-2 gap-6">
                  {posts.slice(1).map((post, i) => (
                    <Link
                      key={post._id}
                      href={`/blog/${post.slug.current}`}
                      className="animate-fade-up group block"
                      style={{ animationDelay: `${(i + 3) * 100}ms` }}
                    >
                      <article className="relative h-full overflow-hidden rounded-xl bg-surface border border-border group-hover:border-accent/40 transition-all duration-300 group-hover:shadow-[0_0_40px_-15px_rgba(245,158,11,0.25)] group-hover:-translate-y-1">
                        {/* Image with overlay */}
                        <div className="relative h-48 overflow-hidden">
                          {post.mainImage?.asset?.url ? (
                            <>
                              <img
                                src={post.mainImage.asset.url}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />
                            </>
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-surface-elevated to-surface flex items-center justify-center">
                              <img src="/icon.svg" alt="" className="w-16 h-16 opacity-20" />
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
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </article>
                    </Link>
                  ))}
                </div>
              )}
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

