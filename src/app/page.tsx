import Image from "next/image";
import type { Metadata } from "next";
import { SubscribeForm } from "./components/SubscribeForm";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { Badge } from "@/app/components/ui/Badge";
import { ButtonLink } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { TerminalWindow } from "@/app/components/ui/TerminalWindow";
import { buildWebSiteSchema, jsonLdScriptProps } from "@/lib/seo/schema";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "The mOperator" }],
    },
  },
};

const FEATURES = [
  {
    title: "Video tutorials",
    body: "Step-by-step walkthroughs building real applications from scratch with AI-assisted development tools.",
    path: "M14.75 11.17l-3.2-2.13A1 1 0 0010 9.87v4.26a1 1 0 001.56.83l3.2-2.13a1 1 0 000-1.66zM21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Written guides",
    body: "Deep-dive articles on concepts, best practices, and patterns for AI-assisted development in marketing contexts.",
    path: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.59a1 1 0 01.7.29l5.42 5.42a1 1 0 01.29.7V19a2 2 0 01-2 2z",
  },
  {
    title: "Real projects",
    body: "Follow along with actual Marketing Ops projects—from lead scoring apps to attribution dashboards.",
    path: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
  },
];

function FeatureIcon({ path }: { path: string }) {
  return (
    <svg
      width="22"
      height="22"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <script {...jsonLdScriptProps(buildWebSiteSchema())} />

      <SiteHeader />

      <main id="main-content">
        {/* Hero */}
        <section className="relative px-4 pb-14 pt-8 sm:px-6 sm:pt-12 md:px-12 md:pb-20 md:pt-16 lg:px-20 lg:pb-20 lg:pt-[90px]">
          {/* Heritage ASCII art — illustration only, never the logo */}
          <Image
            src="/mark-ascii-green.png"
            alt=""
            width={760}
            height={541}
            aria-hidden="true"
            className="pointer-events-none absolute right-14 top-8 hidden w-[520px] opacity-[0.06] lg:block"
          />

          <div className="relative mx-auto flex max-w-[1200px] flex-col items-start gap-10 lg:flex-row lg:items-center lg:gap-12">
            <div className="min-w-0 flex-1 lg:max-w-[820px]">
              <div
                className="animate-fade-up mb-7 sm:mb-8"
                style={{ animationDelay: "0ms" }}
              >
                <Badge dot>From Operations to GTM Engineering</Badge>
              </div>

              <h1
                className="animate-fade-up mb-6 text-[32px] font-bold leading-[1.12] tracking-[var(--tracking-display)] text-foreground sm:text-[44px] md:text-[52px] lg:text-[60px] xl:text-[64px]"
                style={{ animationDelay: "100ms" }}
              >
                Learn how to{" "}
                <span className="text-accent glow-text">Ship Apps</span>:
                <br className="hidden sm:block" />{" "}
                by operators, for operators
              </h1>

              <p
                className="animate-fade-up mb-8 max-w-[600px] text-base leading-relaxed text-muted sm:text-lg md:mb-10 md:text-[19px]"
                style={{ animationDelay: "200ms" }}
              >
                Video tutorials, guides, and real-world examples for Marketing
                Operations professionals ready to break into AI app development
                using tools like v0, Cursor, Claude, and more.
              </p>

              <div
                className="animate-fade-up flex flex-col gap-3 sm:flex-row sm:gap-3.5"
                style={{ animationDelay: "300ms" }}
              >
                <ButtonLink href="/videos" size="lg" glow>
                  Watch latest videos
                </ButtonLink>
                <ButtonLink href="/coming-soon" variant="secondary" size="lg">
                  Browse tutorials
                </ButtonLink>
              </div>
            </div>

            {/* Terminal card — the brand's hero motif, so it stacks rather than hides */}
            <div
              className="animate-fade-up w-full shrink-0 sm:max-w-[420px] lg:w-[360px] lg:max-w-none"
              style={{ animationDelay: "400ms" }}
            >
              <TerminalWindow
                glow
                lines={[
                  { type: "cmd", text: "cursor --init" },
                  { type: "ok", text: "Project initialized" },
                  { type: "cmd", text: "npm run dev" },
                  { type: "out", text: "Ready on localhost:3000" },
                ]}
              />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border px-4 py-12 sm:px-6 md:px-12 md:py-16 lg:px-20">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <Card
                key={feature.title}
                title={feature.title}
                icon={<FeatureIcon path={feature.path} />}
                className={
                  i === 2 ? "animate-fade-up sm:col-span-2 md:col-span-1" : "animate-fade-up"
                }
              >
                {feature.body}
              </Card>
            ))}
          </div>
        </section>

        {/* Subscribe */}
        <section className="px-4 py-16 text-center sm:px-6 md:px-12 md:py-24 lg:px-20">
          <div className="mx-auto max-w-[560px]">
            <p className="eyebrow mb-4">Stay updated</p>
            <h2 className="mb-4 text-[26px] font-bold tracking-[var(--tracking-display)] text-foreground sm:text-[32px] md:text-[38px]">
              Get notified when new content drops
            </h2>
            <p className="mx-auto mb-8 max-w-[520px] text-[15px] leading-relaxed text-muted">
              Subscribe to get the latest tutorials, guides, and updates
              delivered straight to your inbox. No spam, just valuable content
              for operators.
            </p>
            <div className="flex justify-center">
              <SubscribeForm />
            </div>
            <div className="mt-10 flex justify-center">
              <Badge variant="muted" dot>
                Building in public...
              </Badge>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
