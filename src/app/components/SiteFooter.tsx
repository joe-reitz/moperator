import Link from "next/link";
import { Wordmark } from "./Logo";

const LINKS = [
  { href: "https://x.com/joe_reitz", label: "Twitter", external: true },
  { href: "https://www.linkedin.com/in/joereitz/", label: "LinkedIn", external: true },
  {
    href: "https://www.youtube.com/playlist?list=PLY67q0EVU695eunjuo0G9KjysmzqbDez9",
    label: "YouTube",
    external: true,
  },
  { href: "/feed.xml", label: "RSS", external: false },
  { href: "https://venmo.com/joe-reitz-1", label: "Buy me a coffee", external: true },
];

// Trust anchors and the machine-readable indexes. Kept as a separate row so
// they are crawlable from every page — an agent checking whether this site is a
// real business looks for exactly these.
const SITE_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/llms.txt", label: "llms.txt" },
  { href: "/agents.txt", label: "agents.txt" },
];

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-border px-4 py-10 sm:px-6 md:px-12 lg:px-20">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
        <Link href="/" className="inline-flex items-center">
          <Wordmark />
        </Link>

        <p className="font-mono text-xs text-muted">
          © {new Date().getFullYear()} · built in public by an operator, for operators
        </p>

        <nav
          aria-label="Social and feeds"
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs"
        >
          {LINKS.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            )
          )}
        </nav>
      </div>

      <nav
        aria-label="Site and agent resources"
        className="mx-auto mt-6 flex max-w-[1200px] flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-border pt-6 font-mono text-xs md:justify-start"
      >
        {SITE_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-muted transition-colors hover:text-foreground"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
