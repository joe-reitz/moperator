import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming Soon | The MOPerator",
  description: "New content is on the way. Check back soon!",
};

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Geometric background pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10">
          <svg viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="400" cy="400" r="380" stroke="#f59e0b" strokeWidth="1" />
            <circle cx="400" cy="400" r="280" stroke="#f59e0b" strokeWidth="1" />
            <circle cx="400" cy="400" r="180" stroke="#f59e0b" strokeWidth="1" />
            <circle cx="400" cy="400" r="80" stroke="#f59e0b" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 lg:px-20">
        <a href="/" className="flex items-center gap-4">
          <img
            src="/icon.svg"
            alt="The MOPerator"
            className="h-14 md:h-16 lg:h-20 w-auto"
          />
          <span className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight">
            The <span className="text-accent glow-text">MOP</span>erator
          </span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm">
          <a href="/#videos" className="text-muted hover:text-foreground transition-colors">
            Videos
          </a>
          <a href="/blog" className="text-muted hover:text-foreground transition-colors">
            Blog
          </a>
          <a href="/about" className="text-muted hover:text-foreground transition-colors">
            About
          </a>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-2xl">
          <div className="animate-fade-up" style={{ animationDelay: "0ms" }}>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-border bg-surface mb-8">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm text-muted font-mono">Building in progress...</span>
            </div>
          </div>

          <h1
            className="animate-fade-up text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6"
            style={{ animationDelay: "100ms" }}
          >
            <span className="text-accent glow-text">Coming Soon</span>
          </h1>

          <p
            className="animate-fade-up text-lg md:text-xl text-muted mb-12"
            style={{ animationDelay: "200ms" }}
          >
            We&apos;re working on something great. Video tutorials and guides are on the way. 
            Follow along for updates!
          </p>

          <div
            className="animate-fade-up flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{ animationDelay: "300ms" }}
          >
            <a
              href="/"
              className="gradient-border rounded-lg px-8 py-4 font-medium hover:bg-surface-elevated transition-colors"
            >
              Back to Home
            </a>
            <a
              href="https://x.com/joe_reitz"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-border rounded-lg px-8 py-4 font-medium text-muted hover:text-foreground hover:border-muted transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Follow for Updates
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-6 md:px-12 lg:px-20 py-12 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/icon.svg" alt="The MOPerator" className="h-12 w-auto" />
            <span className="font-medium text-lg">
              The <span className="text-accent glow-text">MOP</span>erator
            </span>
            <span className="text-sm text-muted">© 2026 Joe Reitz.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted">
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
            <a href="#" className="hover:text-foreground transition-colors">
              YouTube
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

