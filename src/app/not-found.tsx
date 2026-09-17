import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";

/**
 * Next.js serves this with a real HTTP 404. The recovery lists below are here
 * so the response is self-sufficient: a crawler or agent that lands on a dead
 * path can find the site's shape without a second guess, and the same paths
 * are rendered as markdown when the request negotiates for it (see
 * `src/app/md/[[...path]]/route.ts`).
 */

const SECTIONS = [
  { href: "/blog", label: "/blog", note: "Written guides and tutorials" },
  { href: "/videos", label: "/videos", note: "Recorded walkthroughs" },
  { href: "/repos", label: "/repos", note: "Example projects" },
  {
    href: "/oss-moperator",
    label: "/oss-moperator",
    note: "The open-source marketing ops agent",
  },
  { href: "/about", label: "/about", note: "Who runs this site" },
  { href: "/contact", label: "/contact", note: "How to get in touch" },
  { href: "/privacy", label: "/privacy", note: "What this site collects" },
];

const MACHINE_READABLE = [
  { href: "/llms.txt", label: "/llms.txt", note: "Every page, with summaries" },
  {
    href: "/agents.txt",
    label: "/agents.txt",
    note: "When to use this site and how to call it",
  },
  { href: "/sitemap.xml", label: "/sitemap.xml", note: "Index of every URL" },
  { href: "/feed.xml", label: "/feed.xml", note: "RSS feed of new posts" },
];

function LinkList({
  items,
}: {
  items: ReadonlyArray<{ href: string; label: string; note: string }>;
}) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item.href} className="text-sm">
          <a
            href={item.href}
            className="font-mono text-accent transition-colors hover:brightness-110"
          >
            {item.label}
          </a>
          <span className="text-muted"> — {item.note}</span>
        </li>
      ))}
    </ul>
  );
}

export default function NotFound() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      <SiteHeader />

      <main
        id="main-content"
        className="relative z-10 flex-1 px-4 py-16 sm:px-6 md:px-12 md:py-20 lg:px-20"
      >
        <div className="mx-auto max-w-[760px]">
          <div className="text-center">
            <p className="font-mono text-accent text-sm mb-4">404</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              This page didn&apos;t ship
            </h1>
            <p className="text-muted mb-8">
              The page you&apos;re looking for doesn&apos;t exist, or it moved
              somewhere better.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/"
                className="accent-border rounded-lg px-6 py-3 font-medium hover:bg-surface-elevated transition-colors"
              >
                Back home
              </Link>
              <Link
                href="/blog"
                className="border border-border rounded-lg px-6 py-3 font-medium text-muted hover:text-foreground hover:border-muted transition-colors"
              >
                Read the blog
              </Link>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 border-t border-border pt-10 sm:grid-cols-2 sm:gap-10">
            <div>
              <h2 className="eyebrow mb-4">Where to look next</h2>
              <LinkList items={SECTIONS} />
            </div>
            <div>
              <h2 className="eyebrow mb-4">Machine-readable</h2>
              <LinkList items={MACHINE_READABLE} />
              <p className="mt-5 text-sm leading-relaxed text-muted">
                Append{" "}
                <code className="font-mono text-accent">.md</code> to any page
                path, or send{" "}
                <code className="font-mono text-accent">
                  Accept: text/markdown
                </code>
                , to get that page as markdown.
              </p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
