import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import type { Metadata } from "next";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { blurProps, type SanityImageAsset } from "@/sanity/lib/image";

// Revalidate every 60 seconds
export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: "/repos" },
  title: "Open Source Repos | The mOperator",
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
    asset: SanityImageAsset;
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
          url,
          metadata { lqip, dimensions { width, height } }
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
    <div className="min-h-screen relative">
      <SiteHeader />

      <main id="main-content">

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20 pt-8 sm:pt-12 pb-12">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface mb-6">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-sm text-muted">Open Source</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
            Forkable <span className="text-accent">Repos</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl">
            Clone, customize, and deploy. These open source projects are built
            for Marketing Operations professionals to make their own.
          </p>

          <div className="mt-8 rounded-[--radius-lg] border border-border bg-surface p-6 transition-colors hover:border-accent/35">
            <p className="eyebrow mb-3">Start here</p>
            <h2 className="mb-2 text-xl font-semibold text-foreground">
              The mOperator agent
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-muted">
              A marketing ops agent that lives in your Slack and works in your
              CRM. Every rule it follows is a file you can edit — and the setup
              guide assumes no command-line experience.
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[13px]">
              <Link href="/oss-moperator" className="text-accent hover:brightness-110">
                Read the overview →
              </Link>
              <Link
                href="/oss-moperator/setup"
                className="text-muted transition-colors hover:text-foreground"
              >
                Setup guide
              </Link>
            </div>
          </div>
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
                    <Image
                      src={repo.screenshot.asset.url}
                      alt={repo.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      {...blurProps(repo.screenshot.asset)}
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
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

      </main>

      <SiteFooter />
    </div>
  );
}

