import type { Metadata } from "next";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { ProseSections } from "@/app/components/ProseSections";
import {
  buildBreadcrumbSchema,
  buildPageSchema,
  jsonLdScriptProps,
} from "@/lib/seo/schema";
import { siteConfig } from "@/lib/seo/config";
import { PRIVACY_SECTIONS, PRIVACY_SUMMARY } from "@/lib/site/trust-pages";

export const metadata: Metadata = {
  title: `Privacy policy | ${siteConfig.name}`,
  description: PRIVACY_SUMMARY,
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: `Privacy policy | ${siteConfig.name}`,
    description: PRIVACY_SUMMARY,
    type: "website",
    url: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen">
      <script
        {...jsonLdScriptProps(
          buildPageSchema({
            type: "WebPage",
            path: "/privacy",
            name: `Privacy policy | ${siteConfig.name}`,
            description: PRIVACY_SUMMARY,
            dateModified: siteConfig.legal.privacyUpdated,
          })
        )}
      />
      <script
        {...jsonLdScriptProps(
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Privacy", path: "/privacy" },
          ])
        )}
      />

      <SiteHeader />

      <main id="main-content">
        <section className="relative z-10 px-4 pb-10 pt-8 sm:px-6 sm:pt-12 md:px-12 lg:px-20">
          <div className="mx-auto max-w-[760px]">
            <p className="eyebrow mb-4">
              Last updated {siteConfig.legal.privacyUpdated}
            </p>
            <h1 className="mb-5 text-3xl font-bold leading-[1.12] tracking-[var(--tracking-display)] sm:text-4xl md:text-5xl">
              Privacy policy
            </h1>
            <p className="max-w-[640px] text-base leading-relaxed text-muted sm:text-lg">
              {PRIVACY_SUMMARY}
            </p>
          </div>
        </section>

        <section className="relative z-10 px-4 py-8 sm:px-6 md:px-12 md:py-12 lg:px-20">
          <div className="mx-auto max-w-[760px]">
            <ProseSections sections={PRIVACY_SECTIONS} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
