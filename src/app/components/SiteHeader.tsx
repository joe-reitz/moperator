"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "./Logo";
import { MobileNav } from "./MobileNav";

export const NAV_LINKS = [
  { href: "/oss-moperator", label: "Agent" },
  { href: "/videos", label: "Videos" },
  { href: "/blog", label: "Blog" },
  { href: "/repos", label: "Repos" },
  { href: "/about", label: "About" },
] as const;

export function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";

  return (
    <header className="relative z-10">
      <nav
        aria-label="Main"
        className="flex items-center justify-between px-4 py-5 sm:px-6 sm:py-6 md:px-12 lg:px-20 lg:py-7"
      >
        {/* Mark only — the brand forbids mark + wordmark together in the header,
            so the link carries the accessible name instead. */}
        <Link
          href="/"
          aria-label="The mOperator — home"
          className="inline-flex items-center"
        >
          <span className="lg:hidden">
            <LogoMark size={40} />
          </span>
          <span className="hidden lg:inline-flex">
            <LogoMark size={58} />
          </span>
        </Link>

        <MobileNav />

        <div className="hidden items-center gap-7 text-[15px] md:flex lg:gap-9">
          {NAV_LINKS.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "text-accent transition-colors"
                    : "text-muted transition-colors hover:text-foreground"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
