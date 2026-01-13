export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Geometric background pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-10">
          <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="300" cy="300" r="280" stroke="#f59e0b" strokeWidth="1" />
            <circle cx="300" cy="300" r="200" stroke="#f59e0b" strokeWidth="1" />
            <circle cx="300" cy="300" r="120" stroke="#f59e0b" strokeWidth="1" />
            <line x1="300" y1="0" x2="300" y2="600" stroke="#f59e0b" strokeWidth="0.5" />
            <line x1="0" y1="300" x2="600" y2="300" stroke="#f59e0b" strokeWidth="0.5" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-5">
          <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="50" y="50" width="300" height="300" stroke="#f59e0b" strokeWidth="1" />
            <rect x="100" y="100" width="200" height="200" stroke="#f59e0b" strokeWidth="1" />
            <rect x="150" y="150" width="100" height="100" stroke="#f59e0b" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 lg:px-20">
        <a href="/" className="flex items-center gap-4">
          <img
            src="/icon.svg"
            alt="The MOPerator"
            className="h-16 md:h-20 lg:h-24 w-auto"
          />
          <span className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight">
            The <span className="text-accent glow-text">MOP</span>erator
          </span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm">
          <a href="#videos" className="text-muted hover:text-foreground transition-colors">
            Videos
          </a>
          <a href="#blog" className="text-muted hover:text-foreground transition-colors">
            Blog
          </a>
          <a href="#about" className="text-muted hover:text-foreground transition-colors">
            About
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 pt-16 md:pt-24 lg:pt-32 pb-20">
        <div className="max-w-5xl">
          {/* Tag line */}
          <div
            className="animate-fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface mb-8"
            style={{ animationDelay: "0ms" }}
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm text-muted">
              For Operators becoming GTM Engineers
            </span>
          </div>

          {/* Main headline */}
          <h1
            className="animate-fade-up text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
            style={{ animationDelay: "100ms" }}
          >
            Learn to{" "}
            <span className="text-accent glow-text">ship apps</span>—from
            operators, to{" "}
            <span className="inline-block">
              <span className="relative">
                operators
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 8"
                  fill="none"
                >
                  <path
                    d="M2 6C50 2 150 2 198 6"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="animate-fade-up text-lg md:text-xl text-muted max-w-2xl mb-12"
            style={{ animationDelay: "200ms" }}
          >
            Video tutorials, guides, and real-world examples for Marketing
            Operations professionals ready to break into AI app development
            using Cursor, v0, and more.
          </p>

          {/* CTA Buttons */}
          <div
            className="animate-fade-up flex flex-col sm:flex-row gap-4"
            style={{ animationDelay: "300ms" }}
          >
            <button className="gradient-border rounded-lg px-8 py-4 font-medium hover:bg-surface-elevated transition-colors">
              Watch Latest Videos
            </button>
            <button className="border border-border rounded-lg px-8 py-4 font-medium text-muted hover:text-foreground hover:border-muted transition-colors">
              Browse Tutorials
            </button>
          </div>
        </div>

        {/* Terminal-style decoration */}
        <div
          className="animate-fade-up hidden lg:block absolute right-20 top-1/2 -translate-y-1/2 w-[380px]"
          style={{ animationDelay: "400ms" }}
        >
          <div className="gradient-border rounded-xl overflow-hidden">
            <div className="bg-surface p-1">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-xs text-muted ml-2 font-mono">
                  ~/projects/my-ai-app
                </span>
              </div>
              <div className="p-4 font-mono text-sm">
                <div className="text-muted">
                  <span className="text-accent">$</span> cursor --init
                </div>
                <div className="text-green-400 mt-2">
                  ✓ Project initialized
                </div>
                <div className="text-muted mt-2">
                  <span className="text-accent">$</span> npm run dev
                </div>
                <div className="text-foreground mt-2">
                  → Ready on localhost:3000
                </div>
                <div className="text-muted mt-4 flex items-center">
                  <span className="text-accent">$</span>
                  <span className="ml-2 w-2 h-4 bg-accent cursor-blink" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 py-20 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div
              className="animate-fade-up group p-6 rounded-xl bg-surface border border-border hover:border-accent/30 transition-all"
              style={{ animationDelay: "500ms" }}
            >
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
                Video Tutorials
              </h3>
              <p className="text-muted text-sm">
                Step-by-step walkthroughs building real applications from
                scratch with AI-assisted development tools.
              </p>
            </div>

            {/* Card 2 */}
            <div
              className="animate-fade-up group p-6 rounded-xl bg-surface border border-border hover:border-accent/30 transition-all"
              style={{ animationDelay: "600ms" }}
            >
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
                Written Guides
              </h3>
              <p className="text-muted text-sm">
                Deep-dive articles on concepts, best practices, and patterns
                for AI-assisted development in marketing contexts.
              </p>
            </div>

            {/* Card 3 */}
            <div
              className="animate-fade-up group p-6 rounded-xl bg-surface border border-border hover:border-accent/30 transition-all"
              style={{ animationDelay: "700ms" }}
            >
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
                Real Projects
              </h3>
              <p className="text-muted text-sm">
                Follow along with actual Marketing Ops projects—from lead
                scoring apps to attribution dashboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 py-24 text-center">
        <div
          className="animate-fade-up max-w-2xl mx-auto"
          style={{ animationDelay: "800ms" }}
        >
          <p className="text-muted uppercase tracking-widest text-sm mb-4">
            Coming Soon
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Content is on the way
          </h2>
          <p className="text-muted mb-8">
            We&apos;re building out our library of tutorials and guides. Check
            back soon or follow along as we document the journey.
          </p>
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-lg border border-border bg-surface">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-sm">Building in public...</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 md:px-12 lg:px-20 py-12 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/icon.svg"
              alt="The MOPerator"
              className="h-12 w-auto"
            />
            <span className="font-medium text-lg">
              The <span className="text-accent glow-text">MOP</span>erator
            </span>
            <span className="text-sm text-muted">
              © 2026 Joe Reitz.
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted">
            <a href="#" className="hover:text-foreground transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              YouTube
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
      </main>
  );
}
