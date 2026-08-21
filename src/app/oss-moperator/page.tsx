import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { Badge } from "@/app/components/ui/Badge";
import { ButtonLink } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { TerminalWindow } from "@/app/components/ui/TerminalWindow";
import { buildBreadcrumbSchema, jsonLdScriptProps } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/seo/config";

const REPO_URL = "https://github.com/joe-reitz/oss-moperator";

export const metadata: Metadata = {
  title: "mOperator: the marketing ops agent you fork | The mOperator",
  description:
    "An open-source marketing operations agent that lives in your Slack and works in your CRM. Every rule it follows is a file you can edit. Free, MIT licensed, deploys on Vercel.",
  alternates: { canonical: "/oss-moperator" },
  openGraph: {
    title: "mOperator: the marketing ops agent you fork",
    description:
      "Open-source marketing ops agent for Slack and your CRM. Every rule is a file you can edit.",
    type: "website",
    url: "/oss-moperator",
  },
};

const CAPABILITIES = [
  {
    title: "Answers questions about your data",
    body: "Ask which campaigns had the worst cost per conversion. It pulls 90 days of ad performance, analyses it in a real Linux sandbox with pandas, and tells you which differences are too small to mean anything.",
    path: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
  {
    title: "Cleans up lists nobody wants to touch",
    body: "Drop a conference list in Slack. It reads the attachment, normalises the emails, finds the ones you already have and the ones who unsubscribed, and tells you exactly how many are worth importing.",
    path: "M4 6h16M4 10h16M4 14h10M4 18h6",
  },
  {
    title: "Waits for a human on anything risky",
    body: "Bulk writes, deletions, ad budget changes, and anything that sends to real people all pause for approval. The pause is durable — Slack shows Approve or Deny and the work resumes days later if it has to, even across a redeploy.",
    path: "M12 9v2m0 4h.01M5 19h14a2 2 0 001.84-2.75L13.74 4a2 2 0 00-3.48 0L3.16 16.25A2 2 0 005 19z",
  },
  {
    title: "Builds emails and files tickets",
    body: "Hand it approved copy and it briefs Knak, which renders on-brand and reports back with your naming convention applied. Report a bug and it files a real issue with a title, body, priority, and labels.",
    path: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    title: "Enforces your tracking conventions",
    body: "A UTM builder, a UTM auditor, and a campaign-name checker. Because one paid_social among a thousand paid-social splits a channel in every report you run this year.",
    path: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    title: "Sends digests you didn't have to build",
    body: "Monday campaign activity, daily ad-spend anomalies, Friday triage. They become Vercel Cron Jobs automatically and stay inert until you name a channel.",
    path: "M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 00-4-5.66V5a2 2 0 10-4 0v.34A6 6 0 006 11v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  },
];

const INTEGRATIONS = [
  "Salesforce",
  "HubSpot",
  "Marketo",
  "Customer.io",
  "Iterable",
  "Inflection",
  "Google Ads",
  "Knak",
  "Luma",
  "GitHub",
  "Linear",
  "Asana",
  "Jira",
  "monday.com",
  "ClickUp",
];

const EDITABLE = [
  ["Who can approve what, naming and UTM conventions, limits", "agent/lib/config.ts"],
  ["How it talks and what it refuses", "agent/instructions/"],
  ["Its playbooks for SOQL, audiences, launches, list hygiene", "agent/skills/"],
  ["Which tools exist — one file per integration", "agent/tools/"],
  ["Which writes need a human", "agent/lib/approval.ts"],
  ["Scheduled digests", "agent/schedules/"],
];

function Icon({ path }: { path: string }) {
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

export default function OssMoperatorPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "mOperator",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Marketing Operations Agent",
    operatingSystem: "Web",
    url: `${siteConfig.url}/oss-moperator`,
    codeRepository: REPO_URL,
    license: "https://opensource.org/licenses/MIT",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@id": `${siteConfig.url}/#person` },
    description:
      "An open-source marketing operations agent that runs in Slack and works in your CRM. Built on eve and deployed as a single Next.js project on Vercel.",
  };

  return (
    <div className="relative min-h-screen">
      <script {...jsonLdScriptProps(softwareSchema)} />
      <script
        {...jsonLdScriptProps(
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "mOperator agent", path: "/oss-moperator" },
          ])
        )}
      />

      <SiteHeader />

      <main id="main-content">
        {/* Hero */}
        <section className="px-4 pb-12 pt-8 sm:px-6 md:px-12 md:pb-16 md:pt-14 lg:px-20">
          <div className="mx-auto max-w-[1200px] lg:flex lg:items-center lg:gap-12">
            <div className="min-w-0 flex-1">
              <p className="eyebrow mb-4">Open source</p>
              <h1 className="mb-6 text-[32px] font-bold leading-[1.12] tracking-[var(--tracking-display)] text-foreground sm:text-[42px] lg:text-[52px]">
                A marketing ops agent you{" "}
                <span className="text-accent glow-text">fork</span>
              </h1>
              <p className="mb-8 max-w-[620px] text-base leading-relaxed text-muted sm:text-[19px]">
                It lives in your Slack, works in your CRM, and every rule it
                follows is a file you can edit. Not a product you rent — a
                repository you own, MIT licensed and free.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/oss-moperator/setup" size="lg" glow>
                  Read the setup guide
                </ButtonLink>
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-[--radius-md] border border-border-strong px-6 py-3.5 text-base font-semibold text-foreground transition-colors hover:border-accent"
                >
                  View on GitHub
                </a>
              </div>
              <p className="mt-5 font-mono text-xs text-muted-dim">
                MIT licensed · built on eve · deploys to Vercel
              </p>
            </div>

            <div className="mt-10 w-full shrink-0 sm:max-w-[460px] lg:mt-0 lg:w-[400px] lg:max-w-none">
              <TerminalWindow
                glow
                title="~/moperator"
                lines={[
                  { type: "cmd", text: "npm run agent" },
                  { type: "plain", text: "> dedupe this list against Salesforce" },
                  { type: "ok", text: "388 already exist, 12 unsubscribed" },
                  { type: "out", text: "recommend importing 642" },
                ]}
              />
            </div>
          </div>
        </section>

        {/* Why fork it */}
        <section className="border-t border-border px-4 py-12 sm:px-6 md:px-12 md:py-16 lg:px-20">
          <div className="mx-auto max-w-[1200px] lg:grid lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
              <p className="eyebrow mb-4">Why fork instead of buy</p>
              <h2 className="mb-5 text-[26px] font-bold tracking-[var(--tracking-display)] text-foreground sm:text-[32px]">
                Marketing ops is not a generic problem
              </h2>
              <p className="mb-4 text-base leading-relaxed text-muted">
                Your segment field is not their segment field. Your naming
                convention is real. Your approval chain is specific, and the five
                things your team asks for every week are not the five things
                another team asks for.
              </p>
              <p className="text-base leading-relaxed text-muted">
                A closed product has to average over all of that. A fork does
                not. Everything you would want to change is a file:
              </p>
            </div>

            <div className="mt-8 overflow-x-auto lg:mt-0">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 pr-4 font-mono text-xs font-normal uppercase tracking-[var(--tracking-label)] text-muted">
                      To change
                    </th>
                    <th className="pb-3 font-mono text-xs font-normal uppercase tracking-[var(--tracking-label)] text-muted">
                      Edit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {EDITABLE.map(([what, where]) => (
                    <tr key={where} className="border-b border-border/60">
                      <td className="py-3 pr-4 align-top text-muted">{what}</td>
                      <td className="py-3 align-top">
                        <code className="whitespace-nowrap font-mono text-[13px] text-accent">
                          {where}
                        </code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="border-t border-border px-4 py-12 sm:px-6 md:px-12 md:py-16 lg:px-20">
          <div className="mx-auto max-w-[1200px]">
            <p className="eyebrow mb-4">What it does</p>
            <h2 className="mb-10 max-w-[720px] text-[26px] font-bold tracking-[var(--tracking-display)] text-foreground sm:text-[32px]">
              Six things it handles that currently land on your plate
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {CAPABILITIES.map((c) => (
                <Card key={c.title} title={c.title} icon={<Icon path={c.path} />}>
                  {c.body}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Guardrails */}
        <section className="border-t border-border px-4 py-12 sm:px-6 md:px-12 md:py-16 lg:px-20">
          <div className="mx-auto max-w-[860px]">
            <p className="eyebrow mb-4">Guardrails</p>
            <h2 className="mb-5 text-[26px] font-bold tracking-[var(--tracking-display)] text-foreground sm:text-[32px]">
              An agent with write access to your CRM needs more than a polite
              prompt
            </h2>
            <p className="mb-8 text-base leading-relaxed text-muted">
              These are enforced in code, not asked for in a system prompt:
            </p>
            <ul className="space-y-4 text-base leading-relaxed text-muted">
              {[
                ["CRM writes", "go through for people on the approver list. Everyone else's write pauses for one."],
                ["Bulk writes", "are reviewed above a threshold no matter who asks, and refused above a hard cap. Splitting a batch to get under the limit does not work — the cap is per call."],
                ["Deletions and anything that sends to real people", "always need a human, and can never run from a schedule."],
                ["Ad budget changes", "need someone on the ad-spend approver list, re-checked at the moment the change applies — so nobody approves their own spend."],
                ["Read-only means read-only", "— the SOQL it runs is validated against DML, statement stacking, and comment-hidden mutations. The analyst subagent has no write tools at all."],
              ].map(([bold, rest]) => (
                <li key={bold} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <span>
                    <strong className="font-semibold text-foreground">{bold}</strong>{" "}
                    {rest}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Integrations */}
        <section className="border-t border-border px-4 py-12 sm:px-6 md:px-12 md:py-16 lg:px-20">
          <div className="mx-auto max-w-[860px]">
            <p className="eyebrow mb-4">Connects to</p>
            <h2 className="mb-6 text-[26px] font-bold tracking-[var(--tracking-display)] text-foreground sm:text-[32px]">
              Whatever you already run
            </h2>
            <div className="mb-6 flex flex-wrap gap-2.5">
              {INTEGRATIONS.map((name) => (
                <Badge key={name} variant="muted">
                  {name}
                </Badge>
              ))}
            </div>
            <p className="text-base leading-relaxed text-muted">
              Set the credentials, restart, done. The agent only sees tools for
              what you configured, so it never offers to do something your
              install cannot do. Delete an integration by deleting two files.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border px-4 py-16 text-center sm:px-6 md:px-12 md:py-20 lg:px-20">
          <div className="mx-auto max-w-[620px]">
            <h2 className="mb-4 text-[26px] font-bold tracking-[var(--tracking-display)] text-foreground sm:text-[32px]">
              You do not need to be a developer
            </h2>
            <p className="mb-8 text-base leading-relaxed text-muted">
              The setup guide starts at &quot;create a GitHub account&quot; and
              ends with a working agent in your Slack. No prior command-line
              experience assumed, and you can try the whole thing against a fake
              CRM before you connect anything real.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/oss-moperator/setup" size="lg" glow>
                Start the setup guide
              </ButtonLink>
              <Link
                href="/blog"
                className="font-mono text-sm text-muted transition-colors hover:text-foreground"
              >
                or read the guides first
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
