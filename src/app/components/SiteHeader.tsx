"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNav } from "./MobileNav";

export const NAV_LINKS = [
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
        className="flex items-center justify-between px-4 py-4 sm:px-6 sm:py-6 md:px-12 lg:px-20"
      >
        <Link href="/" className="flex items-center gap-2 sm:gap-4">
          {/* Decorative: the wordmark beside it already names the site */}
          <Image
            src="/icon.svg"
            alt=""
            width={80}
            height={80}
            priority
            unoptimized
            className="h-10 sm:h-14 md:h-16 lg:h-20 w-auto"
          />
          <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight">
            The <span className="text-accent glow-text">m</span>Operator
          </span>
        </Link>

        <MobileNav />

        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm">
          {NAV_LINKS.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "text-foreground transition-colors"
                    : "text-muted hover:text-foreground transition-colors"
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
