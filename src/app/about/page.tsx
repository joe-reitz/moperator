import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | The MOPerator",
  description:
    "Learn about The MOPerator - a resource for Marketing Operations professionals learning to build apps with AI development tools.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen relative">
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
          <a
            href="/#videos"
            className="text-muted hover:text-foreground transition-colors"
          >
            Videos
          </a>
          <a
            href="/#blog"
            className="text-muted hover:text-foreground transition-colors"
          >
            Blog
          </a>
          <a
            href="/about"
            className="text-foreground transition-colors"
          >
            About
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 pt-16 md:pt-24 pb-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
            About <span className="text-accent glow-text">The MOPerator</span>
          </h1>
          <p className="text-xl text-muted">
            A resource built by an operator, for operators ready to level up.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 pb-24">
        <div className="max-w-3xl space-y-8 text-lg leading-relaxed">
          <div className="p-6 rounded-xl bg-surface border border-border">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center text-2xl font-bold text-background">
                JR
              </div>
              <div>
                <h2 className="text-xl font-semibold">Joe Reitz</h2>
                <p className="text-muted">Marketing Operations → GTM Engineer</p>
              </div>
            </div>
            <p className="text-muted">
              Building in public and documenting the journey from Marketing Ops to shipping real applications.
            </p>
          </div>

          <h2 className="text-2xl font-bold pt-4">The Mission</h2>
          <p className="text-muted">
            Marketing Operations professionals are some of the most systems-minded people in any organization. 
            We build automations, design processes, manage complex tech stacks, and solve problems every single day.
          </p>
          <p className="text-muted">
            But there&apos;s always been a gap between &quot;I can configure this tool&quot; and &quot;I can build this tool.&quot; 
            That gap used to require years of learning to code, computer science degrees, or expensive bootcamps.
          </p>
          <p className="text-muted">
            <span className="text-foreground font-medium">Not anymore.</span>
          </p>
          <p className="text-muted">
            With AI-powered development tools like Cursor, v0, Claude, and others, operators can now build real applications. 
            The skills you already have—systems thinking, problem decomposition, understanding business logic—are exactly 
            what you need. The AI handles the syntax.
          </p>

          <h2 className="text-2xl font-bold pt-4">What You&apos;ll Find Here</h2>
          <ul className="space-y-3 text-muted">
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">→</span>
              <span><strong className="text-foreground">Video tutorials</strong> walking through real builds from start to finish</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">→</span>
              <span><strong className="text-foreground">Written guides</strong> breaking down concepts and patterns</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">→</span>
              <span><strong className="text-foreground">Real projects</strong> relevant to Marketing Ops work</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">→</span>
              <span><strong className="text-foreground">Honest takes</strong> on what works, what doesn&apos;t, and what&apos;s hype</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold pt-4">The Name</h2>
          <p className="text-muted">
            <span className="text-accent font-semibold">MOP</span>erator = <span className="text-accent">M</span>arketing <span className="text-accent">Op</span>erations + Op<span className="text-accent">erator</span>. 
            It&apos;s a nod to where we come from and what we&apos;re becoming. Also, someone has to clean up the mess. 🧹
          </p>

          <div className="pt-8 border-t border-border">
            <p className="text-muted mb-4">
              Want to follow along or connect?
            </p>
            <a
              href="https://x.com/joe_reitz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-surface hover:border-accent/30 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>Follow @joe_reitz</span>
            </a>
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

