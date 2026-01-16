"use client";

import { useState } from "react";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-muted hover:text-foreground transition-colors p-2"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="fixed top-0 right-0 h-full w-64 bg-surface border-l border-border z-50 animate-slide-in-right">
            {/* Close button */}
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted hover:text-foreground transition-colors p-2"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-2 px-6">
              <a
                href="/videos"
                className="text-lg text-muted hover:text-foreground transition-colors py-3 border-b border-border"
                onClick={() => setIsOpen(false)}
              >
                Videos
              </a>
              <a
                href="/blog"
                className="text-lg text-muted hover:text-foreground transition-colors py-3 border-b border-border"
                onClick={() => setIsOpen(false)}
              >
                Blog
              </a>
              <a
                href="/repos"
                className="text-lg text-muted hover:text-foreground transition-colors py-3 border-b border-border"
                onClick={() => setIsOpen(false)}
              >
                Repos
              </a>
              <a
                href="/about"
                className="text-lg text-muted hover:text-foreground transition-colors py-3"
                onClick={() => setIsOpen(false)}
              >
                About
              </a>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
