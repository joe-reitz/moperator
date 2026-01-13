import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | The MOPerator",
  description:
    "Learn about The MOPerator - a resource for Marketing Operations professionals learning to build apps with AI development tools.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Geometric background pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] opacity-10">
          <svg viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="400" cy="400" r="380" stroke="#f59e0b" strokeWidth="1" />
            <circle cx="400" cy="400" r="280" stroke="#f59e0b" strokeWidth="1" />
            <circle cx="400" cy="400" r="180" stroke="#f59e0b" strokeWidth="1" />
            <circle cx="400" cy="400" r="80" stroke="#f59e0b" strokeWidth="1" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] opacity-5">
          <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="50" y="50" width="500" height="500" stroke="#f59e0b" strokeWidth="1" />
            <rect x="150" y="150" width="300" height="300" stroke="#f59e0b" strokeWidth="1" />
            <rect x="250" y="250" width="100" height="100" stroke="#f59e0b" strokeWidth="1" />
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
          <a href="/#blog" className="text-muted hover:text-foreground transition-colors">
            Blog
          </a>
          <a href="/about" className="text-foreground transition-colors">
            About
          </a>
        </div>
      </nav>

      {/* Hero with Giant Logo */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 pt-8 md:pt-16 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Giant Logo */}
            <div className="animate-fade-up flex-shrink-0" style={{ animationDelay: "0ms" }}>
              <div className="relative">
                <div className="absolute inset-0 blur-3xl bg-accent/20 rounded-full scale-75" />
                <img
                  src="/icon.svg"
                  alt="The MOPerator"
                  className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96"
                />
              </div>
            </div>

            {/* Hero Text */}
            <div className="animate-fade-up text-center lg:text-left" style={{ animationDelay: "100ms" }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-4">
                About{" "}
                <span className="text-accent glow-text">The MOPerator</span>
              </h1>
<blockquote className="text-lg md:text-xl text-muted max-w-xl italic leading-relaxed">
                  <p className="mb-1">Only where love and need are one,</p>
                  <p className="mb-1">And the work is play for mortal stakes,</p>
                  <p>Is the deed ever really done.</p>
                  <p>For Heaven and the Future's sakes.</p>
                  <footer className="mt-4 text-sm not-italic text-accent">
                    — Robert Frost, &quot;Two Tramps in Mud Time&quot;
                  </footer>
                </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Author Card */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 py-12">
        <div className="max-w-4xl mx-auto">
          <div
            className="animate-fade-up gradient-border rounded-2xl overflow-hidden"
            style={{ animationDelay: "200ms" }}
          >
            <div className="bg-surface p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                <div className="flex-shrink-0">
                  <img
                    src="/joe-reitz.jpg"
                    alt="Joe Reitz"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover glow"
                  />
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Joe Reitz</h2>
                  <p className="text-accent font-medium mb-4">Marketing Operations → GTM Engineer</p>
                  <p className="text-muted text-lg leading-relaxed">
                    Whether we wanted it or not, times are changing. The best Operators are no longer just system admins, they're part product manager, part engineer. This new emerging field is becoming known as GTM Engineering. The MOPerator is about building in public and documenting the journey from traditional Ops work to shipping 
                    real applications that solve real business challenges.
                  </p>
                  <a
                    href="https://x.com/joe_reitz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 text-muted hover:text-foreground transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>@joe_reitz</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Mission */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="animate-fade-up" style={{ animationDelay: "300ms" }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
              <h2 className="text-sm uppercase tracking-widest text-muted">The Mission</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            <div className="space-y-6 text-lg md:text-xl leading-relaxed">
              <p className="text-muted">
                Marketing Operations professionals are some of the{" "}
                <span className="text-foreground font-medium">most systems-minded people</span> in 
                any organization. We build automations, design processes, manage complex tech stacks, 
                and solve problems every single day.
              </p>
              <p className="text-muted">
                But there&apos;s always been a gap between{" "}
                <span className="text-foreground">&quot;I can configure this tool&quot;</span> and{" "}
                <span className="text-accent font-medium">&quot;I can build something better.&quot;</span>
              </p>
              <p className="text-muted">
                That gap used to require years of sweat equity: learning to code, earning a computer science certification, 
                and/or toiling away for years as a junior developer in the honorable pursuit of working experience.
              </p>
              <div className="py-8 text-center">
                <span className="text-3xl md:text-4xl font-bold text-accent glow-text">
                  Not anymore.
                </span>
              </div>
              <p className="text-muted">
                With AI-powered development tools like{" "}
                <span className="text-foreground font-medium">Cursor</span>,{" "}
                <span className="text-foreground font-medium">v0</span>,{" "}
                <span className="text-foreground font-medium">Claude</span>, and others—operators 
                can now build real applications.
              </p>
              <p className="text-muted">
                And who better to do it? We've worked for years under the constraints of legacy systems and always found a way to make it work. The skills you already have—systems thinking, problem decomposition, understanding 
                business logic—are{" "}
                <span className="text-accent font-medium">exactly what you need</span>. 
                The AI handles the syntax, your ideas become the product.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Find */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="animate-fade-up" style={{ animationDelay: "400ms" }}>
            <div className="flex items-center gap-4 mb-12">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
              <h2 className="text-sm uppercase tracking-widest text-muted">What You&apos;ll Find Here</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: "Video Tutorials",
                  description: "Real builds from start to finish. No fluff, just shipping.",
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  ),
                  title: "Written Guides",
                  description: "Deep dives on concepts, patterns, and best practices.",
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  ),
                  title: "Real Projects",
                  description: "Apps relevant to Marketing Ops work you can learn from.",
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  ),
                  title: "Honest Takes",
                  description: "What works, what doesn't, and what's just hype.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group p-6 rounded-xl bg-surface border border-border hover:border-accent/30 transition-all"
                >
                  <div className="w-14 h-14 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Name */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-up" style={{ animationDelay: "500ms" }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
              <h2 className="text-sm uppercase tracking-widest text-muted">The Name</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            <div className="text-2xl md:text-3xl font-bold mb-6">
              <span className="text-accent glow-text">MOP</span>erator
            </div>
            <p className="text-xl text-muted mb-4">
              <span className="text-accent font-semibold">M</span>arketing{" "}
              <span className="text-accent font-semibold">Op</span>erations +{" "}
              Op<span className="text-accent font-semibold">erator</span>
            </p>
            <p className="text-muted text-lg max-w-xl mx-auto">
              It&apos;s a nod to where we come from and what we&apos;re becoming. 
              Also, someone has to clean up the mess.
            </p>
            <div className="mt-6 text-6xl">🧹</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-fade-up" style={{ animationDelay: "600ms" }}>
            <p className="text-muted mb-6 text-lg">Want to follow along or connect?</p>
            <a
              href="https://x.com/joe_reitz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl gradient-border bg-surface hover:bg-surface-elevated transition-colors text-lg font-medium"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
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
