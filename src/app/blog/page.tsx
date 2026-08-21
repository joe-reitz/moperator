import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { Badge } from "@/app/components/ui/Badge";
import {
  buildBlogSchema,
  buildBreadcrumbSchema,
  jsonLdScriptProps,
} from "@/lib/seo/schema";

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "The mOperator" }],
    },
  },
  title: "Blog | The mOperator",
  description:
    "Guides, tutorials, and insights for operators learning to build apps with AI.",
};

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string | null;
  publishedAt: string | null;
  tag: string | null;
};

async function getPosts(): Promise<Post[]> {
  // Ordered by coalesce(...) to match /feed.xml and /llms.txt — a post with no
  // publishedAt otherwise sorts to the very top, which is not what anyone means.
  return client.fetch(
    `*[_type == "post" && defined(slug.current)]
      | order(coalesce(publishedAt, _updatedAt) desc) {
        _id,
        title,
        slug,
        excerpt,
        publishedAt,
        "tag": categories[0]->title
      }`
  );
}

function formatDate(value: string | null) {
  if (!value) return null;
  return value.slice(0, 10);
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="relative min-h-screen">
      <script
        {...jsonLdScriptProps(
          buildBlogSchema(
            posts.map((post) => ({
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

      <SiteHeader />

      <main id="main-content">
        <div className="px-4 py-12 sm:px-6 md:px-12 md:py-16 lg:px-20 lg:py-[72px]">
          <div className="max-w-[860px]">
            <p className="eyebrow mb-3.5">Blog</p>
            <h1 className="mb-10 text-[32px] font-bold tracking-[var(--tracking-display)] text-foreground sm:text-[38px] md:text-[46px] lg:mb-12">
              Written guides
              <span className="text-accent cursor-blink" aria-hidden="true">
                _
              </span>
            </h1>

            {posts.length === 0 ? (
              <p className="font-mono text-sm text-muted">
                No posts published yet.
              </p>
            ) : (
              <div className="flex flex-col">
                {posts.map((post) => {
                  const date = formatDate(post.publishedAt);
                  return (
                    <Link
                      key={post._id}
                      href={`/blog/${post.slug.current}`}
                      className="group block border-t border-border py-7"
                    >
                      {(post.tag || date) && (
                        <div className="mb-2.5 flex items-center gap-3.5">
                          {post.tag && (
                            <Badge variant="muted">{post.tag.toLowerCase()}</Badge>
                          )}
                          {date && (
                            <span className="font-mono text-xs text-muted-dim">
                              {date}
                            </span>
                          )}
                        </div>
                      )}
                      <h2 className="mb-2 text-xl font-semibold text-foreground transition-colors group-hover:text-accent sm:text-[23px]">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-[15px] leading-relaxed text-muted">
                          {post.excerpt}
                        </p>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
