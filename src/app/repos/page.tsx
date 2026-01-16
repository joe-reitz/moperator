import { client } from "@/sanity/lib/client";
import type { Metadata } from "next";
import { MobileNav } from "../components/MobileNav";

// Revalidate every 60 seconds
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Open Source Repos | The MOPerator",
  description:
    "Forkable open source projects for Marketing Operations professionals. Clone, customize, and deploy your own versions.",
};

type Repo = {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  githubUrl: string;
  demoUrl: string | null;
  screenshot: {
    asset: {
      url: string;
    };
  } | null;
  tags: string[] | null;
  featured: boolean;
};

async function getRepos(): Promise<Repo[]> {
  return client.fetch(
    `*[_type == "repo"] | order(featured desc, order asc, _createdAt desc) {
      _id,
      title,
      slug,
      description,
      githubUrl,
      demoUrl,
      screenshot {
        asset-> {
          url
        }
      },
      tags,
      featured
    }`
  );
}

export default async function ReposPage() {
  const repos = await getRepos();

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

        {/* Mobile menu */}
        <MobileNav />

        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm">
          <a
            href="/videos"
            className="text-muted hover:text-foreground transition-colors"
          >
            Videos
          </a>
          <a
            href="/blog"
            className="text-muted hover:text-foreground transition-colors"
          >
            Blog
          </a>
          <a
            href="/repos"
            className="text-foreground transition-colors"
          >
            Repos
          </a>
          <a
            href="/about"
            className="text-muted hover:text-foreground transition-colors"
          >
            About
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20 pt-8 sm:pt-12 pb-12">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-sm text-muted">Open Source</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
            Forkable <span className="text-accent">Repos</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl">
            Clone, customize, and deploy. These open source projects are built
            for Marketing Operations professionals to make their own.
          </p>
        </div>
      </section>

      {/* Repos Grid */}
      <section className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20 pb-20">
        {repos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted">No repos yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {repos.map((repo) => (
              <article
                key={repo._id}
                className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 ${
                  repo.featured
                    ? "border-accent/30 bg-gradient-to-br from-surface to-surface-elevated"
                    : "border-border bg-surface"
                }`}
              >
                {/* Featured badge */}
                {repo.featured && (
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
                    Featured
                  </div>
                )}

                {/* Screenshot */}
                {repo.screenshot?.asset?.url ? (
                  <div className="relative h-48 sm:h-56 overflow-hidden bg-surface-elevated">
                    <img
                      src={repo.screenshot.asset.url}
                      alt={repo.title}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="h-48 sm:h-56 bg-surface-elevated flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-border"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                    {repo.title}
                  </h2>
                  <p className="text-muted text-sm mb-4 line-clamp-2">
                    {repo.description}
                  </p>

                  {/* Tags */}
                  {repo.tags && repo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {repo.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs rounded-md bg-surface-elevated text-muted border border-border"
                        >
                          {tag}
                        </span>
                      ))}
                      {repo.tags.length > 4 && (
                        <span className="px-2 py-1 text-xs rounded-md text-muted">
                          +{repo.tags.length - 4} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <a
                      href={repo.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      View on GitHub
                    </a>
                    {repo.demoUrl && (
                      <a
                        href={repo.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-muted font-medium text-sm hover:text-foreground hover:border-muted transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        Demo
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20 py-16 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <a
            href="https://github.com/joe-reitz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-muted hover:text-foreground hover:border-muted transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Follow on GitHub
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-10 md:py-12 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:gap-6 md:flex-row items-center justify-between">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src="/icon.svg"
                alt="The MOPerator"
                className="h-8 sm:h-10 md:h-12 w-auto"
              />
              <span className="font-medium text-base sm:text-lg">
                The <span className="text-accent glow-text">MOP</span>erator
              </span>
            </div>
            <span className="text-xs sm:text-sm text-muted">
              © 2026 Joe Reitz.
            </span>
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

