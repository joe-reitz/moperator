import Image from "next/image";
import Link from "next/link";

const SOCIAL_LINKS = [
  { href: "https://x.com/joe_reitz", label: "Twitter" },
  { href: "https://www.linkedin.com/in/joereitz/", label: "LinkedIn" },
  {
    href: "https://www.youtube.com/playlist?list=PLY67q0EVU695eunjuo0G9KjysmzqbDez9",
    label: "YouTube",
  },
];

export function SiteFooter() {
  return (
    <footer className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-10 md:py-12 border-t border-border">
      <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:gap-6 md:flex-row items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <Image
              src="/icon.svg"
              alt=""
              width={48}
              height={48}
              unoptimized
              className="h-8 sm:h-10 md:h-12 w-auto"
            />
            <span className="font-medium text-base sm:text-lg">
              The <span className="text-accent glow-text">m</span>Operator
            </span>
          </Link>
          <span className="text-xs sm:text-sm text-muted">
            © {new Date().getFullYear()} Joe Reitz.
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/feed.xml"
            className="hover:text-foreground transition-colors"
          >
            RSS
          </a>
          <span className="text-border" aria-hidden="true">
            |
          </span>
          <a
            href="https://venmo.com/joe-reitz-1"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors flex items-center gap-1"
          >
            <span aria-hidden="true">☕</span>
            <span>Buy me a coffee</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
