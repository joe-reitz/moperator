"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, isActivePath } from "./SiteHeader";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname() ?? "/";

  // Close on route change so the panel never survives a navigation.
  // Adjusting state during render (rather than in an effect) avoids the
  // extra render pass an effect-based reset would cost.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setIsOpen(false);
  }

  // Escape to close, and lock background scroll while open
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="text-muted hover:text-foreground transition-colors p-2"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-panel"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div
            id="mobile-nav-panel"
            className="fixed top-0 right-0 h-full w-64 bg-surface border-l border-border z-50 animate-slide-in-right"
          >
            <div className="flex justify-end p-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-muted hover:text-foreground transition-colors p-2"
                aria-label="Close menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav aria-label="Mobile" className="flex flex-col gap-2 px-6">
              {NAV_LINKS.map((link, index) => {
                const active = isActivePath(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg transition-colors py-3 ${
                      index < NAV_LINKS.length - 1 ? "border-b border-border" : ""
                    } ${active ? "text-foreground" : "text-muted hover:text-foreground"}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
