import type { Metadata } from "next";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { ProseSections } from "@/app/components/ProseSections";
import { Badge } from "@/app/components/ui/Badge";
import {
  buildBreadcrumbSchema,
  buildPageSchema,
  jsonLdScriptProps,
} from "@/lib/seo/schema";
import { siteConfig } from "@/lib/seo/config";
import {
  CONTACT_CHANNELS,
  CONTACT_INTRO,
  CONTACT_SECTIONS,
} from "@/lib/site/trust-pages";

const DESCRIPTION = `How to reach ${siteConfig.author.name} about ${siteConfig.name}: email, X, LinkedIn and GitHub, and what each channel is actually for.`;

export const metadata: Metadata = {
  title: `Contact | ${siteConfig.name}`,
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact | ${siteConfig.name}`,
    description: DESCRIPTION,
    type: "website",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="relative min-h-screen">
      <script
        {...jsonLdScriptProps(
          buildPageSchema({
            type: "ContactPage",
            path: "/contact",
            name: `Contact ${siteConfig.name}`,
            description: DESCRIPTION,
          })
        )}
      />
      <script
        {...jsonLdScriptProps(
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ])
        )}
      />

      <SiteHeader />

      <main id="main-content">
        <section className="relative z-10 px-4 pb-10 pt-8 sm:px-6 sm:pt-12 md:px-12 lg:px-20">
          <div className="mx-auto max-w-[760px]">
            <div className="mb-6">
              <Badge dot>One person, no support desk</Badge>
            </div>
            <h1 className="mb-5 text-3xl font-bold leading-[1.12] tracking-[var(--tracking-display)] sm:text-4xl md:text-5xl">
              Contact
            </h1>
            <p className="max-w-[640px] text-base leading-relaxed text-muted sm:text-lg">
              {CONTACT_INTRO}
            </p>
          </div>
        </section>

        <section className="relative z-10 px-4 py-8 sm:px-6 md:px-12 lg:px-20">
          <div className="mx-auto max-w-[760px]">
            <h2 className="eyebrow mb-6">Channels</h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {CONTACT_CHANNELS.map((channel) => (
                <li
                  key={channel.label}
                  className="rounded-[--radius-lg] border border-border bg-surface p-5 transition-colors duration-200 hover:border-accent/35"
                >
                  <h3 className="mb-1 text-[17px] font-semibold text-foreground">
                    {channel.label}
                  </h3>
                  <a
                    href={channel.href}
                    {...(channel.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="font-mono text-[13px] text-accent transition-colors hover:brightness-110"
                  >
                    {channel.display}
                  </a>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {channel.purpose}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="relative z-10 px-4 py-10 sm:px-6 md:px-12 md:py-14 lg:px-20">
          <div className="mx-auto max-w-[760px]">
            <ProseSections sections={CONTACT_SECTIONS} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
