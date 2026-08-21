import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { CodeBlock } from "@/app/components/ui/CodeBlock";
import { Callout } from "@/app/components/ui/Callout";
import { buildBreadcrumbSchema, jsonLdScriptProps } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/seo/config";

const REPO_URL = "https://github.com/joe-reitz/oss-moperator";

export const metadata: Metadata = {
  title: "Set up the mOperator agent: a guide for non-developers | The mOperator",
  description:
    "Step-by-step setup for the open-source mOperator marketing ops agent. Starts at creating a GitHub account, ends with a working agent in your Slack. No command-line experience assumed.",
  alternates: { canonical: "/oss-moperator/setup" },
  openGraph: {
    title: "Set up the mOperator agent: a guide for non-developers",
    description:
      "From zero to a working marketing ops agent in your Slack. Written for operators, not engineers.",
    type: "article",
    url: "/oss-moperator/setup",
  },
};

const STEPS = [
  { id: "accounts", n: 1, title: "Make three free accounts" },
  { id: "install", n: 2, title: "Get the code onto your computer" },
  { id: "mock", n: 3, title: "Try it against a fake CRM first" },
  { id: "keys", n: 4, title: "Give it a brain (the AI key)" },
  { id: "deploy", n: 5, title: "Put it on the internet" },
  { id: "slack", n: 6, title: "Add it to Slack" },
  { id: "crm", n: 7, title: "Connect your real CRM" },
  { id: "security", n: 8, title: "Lock it down before it touches real data" },
];

function H2({ id, n, children }: { id: string; n: number; children: string }) {
  return (
    <h2
      id={id}
      className="mt-14 mb-5 scroll-mt-24 border-b border-border pb-3 text-[24px] font-bold tracking-[var(--tracking-display)] text-foreground sm:text-[27px]"
    >
      <span className="mr-3 font-mono text-base text-accent">
        {String(n).padStart(2, "0")}
      </span>
      {children}
    </h2>
  );
}

function H3({ children }: { children: string }) {
  return (
    <h3 className="mb-3 mt-8 text-[17px] font-semibold text-accent">{children}</h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-[17px] leading-[1.8] text-foreground">{children}</p>;
}

function Muted({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-[15px] leading-relaxed text-muted">{children}</p>;
}

function A({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent underline decoration-accent/30 underline-offset-2 transition-colors hover:decoration-accent"
    >
      {children}
    </a>
  );
}

export default function SetupGuidePage() {
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Set up the mOperator marketing ops agent",
    description:
      "Deploy an open-source marketing operations agent to Slack and your CRM, written for people who are not software engineers.",
    url: `${siteConfig.url}/oss-moperator/setup`,
    totalTime: "PT90M",
    tool: [
      { "@type": "HowToTool", name: "A GitHub account" },
      { "@type": "HowToTool", name: "A Vercel account" },
      { "@type": "HowToTool", name: "Node.js" },
    ],
    step: STEPS.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      url: `${siteConfig.url}/oss-moperator/setup#${s.id}`,
    })),
    author: { "@id": `${siteConfig.url}/#person` },
  };

  return (
    <div className="relative min-h-screen">
      <script {...jsonLdScriptProps(howTo)} />
      <script
        {...jsonLdScriptProps(
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "mOperator agent", path: "/oss-moperator" },
            { name: "Setup guide", path: "/oss-moperator/setup" },
          ])
        )}
      />

      <SiteHeader />

      <main id="main-content">
        <article className="px-4 pb-20 pt-6 sm:px-6 md:px-12 lg:px-20">
          <div className="max-w-[760px]">
            <Link
              href="/oss-moperator"
              className="font-mono text-[13px] text-accent transition-colors hover:brightness-110"
            >
              ← back to mOperator
            </Link>

            <p className="eyebrow mb-3.5 mt-8">Setup guide</p>
            <h1 className="mb-6 text-[30px] font-bold leading-[1.15] tracking-[var(--tracking-display)] text-foreground sm:text-[38px] md:text-[42px]">
              Set up the agent, start to finish
            </h1>
            <p className="mb-4 text-[19px] leading-[1.7] text-muted">
              This guide assumes you have never opened a terminal. It starts at
              &quot;make a GitHub account&quot; and ends with an agent answering
              questions in your Slack. Budget about ninety minutes, and less than
              that if you stop after step 3.
            </p>
            <Muted>
              Everything here is free unless you choose otherwise. The one thing
              that eventually costs money is the AI model usage, which is
              pay-as-you-go and pennies while you are learning.
            </Muted>

            {/* Contents */}
            <nav
              aria-label="Contents"
              className="my-10 rounded-[--radius-lg] border border-border bg-surface p-6"
            >
              <p className="eyebrow mb-4">What you are about to do</p>
              <ol className="space-y-2">
                {STEPS.map((s) => (
                  <li key={s.id} className="flex gap-3 text-[15px]">
                    <span className="font-mono text-muted-dim">
                      {String(s.n).padStart(2, "0")}
                    </span>
                    <a
                      href={`#${s.id}`}
                      className="text-muted transition-colors hover:text-accent"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {/* 1 */}
            <H2 id="accounts" n={1}>Make three free accounts</H2>
            <P>
              You need three things, and all three have a free tier that is
              genuinely enough to finish this guide.
            </P>
            <H3>GitHub — where the code lives</H3>
            <Muted>
              Go to <A href="https://github.com/signup">github.com/signup</A>.
              GitHub is where code is stored and shared. You are going to make
              your own copy of the agent here, which is what &quot;forking&quot;
              means.
            </Muted>
            <H3>Vercel — where it runs</H3>
            <Muted>
              Go to <A href="https://vercel.com/signup">vercel.com/signup</A> and
              choose <strong className="text-foreground">Continue with GitHub</strong>.
              Signing up through GitHub links the two accounts, which saves you a
              step later. Vercel is the company that hosts the running agent;
              their free Hobby plan is fine to start.
            </Muted>
            <H3>Node.js — so your computer can run the code</H3>
            <Muted>
              Download the LTS version from{" "}
              <A href="https://nodejs.org">nodejs.org</A> and run the installer.
              Nothing to configure. This is what lets your own machine run the
              agent while you experiment, before it goes on the internet.
            </Muted>
            <Callout>
              Windows users: install{" "}
              <A href="https://learn.microsoft.com/windows/wsl/install">WSL</A>{" "}
              first and run every command in this guide inside it. Mac and Linux
              users can use the built-in Terminal app.
            </Callout>

            {/* 2 */}
            <H2 id="install" n={2}>Get the code onto your computer</H2>
            <P>
              First make your own copy. Open{" "}
              <A href={REPO_URL}>the repository</A> and click{" "}
              <strong className="text-foreground">Fork</strong> in the top right,
              then <strong className="text-foreground">Create fork</strong>. You
              now own a full copy at{" "}
              <code className="font-mono text-[15px] text-accent">
                github.com/your-username/oss-moperator
              </code>
              .
            </P>
            <P>
              Now open your terminal and run these four commands, one at a time.
              Replace{" "}
              <code className="font-mono text-[15px] text-accent">
                your-username
              </code>{" "}
              with your actual GitHub username.
            </P>
            <CodeBlock label="terminal">{`git clone https://github.com/your-username/oss-moperator.git
cd oss-moperator
npm install
cp .env.example .env.local`}</CodeBlock>
            <Muted>
              In order: download your copy, move into the folder, install the
              libraries it depends on, and create the file where your private
              keys will live. The install prints a lot of text — that is normal.
            </Muted>
            <Callout tone="warning" title="Never commit .env.local">
              That file holds your passwords and keys. The repository is already
              configured to ignore it, so as long as you do not rename it, it
              will never be uploaded to GitHub.
            </Callout>

            {/* 3 */}
            <H2 id="mock" n={3}>Try it against a fake CRM first</H2>
            <P>
              Before connecting anything real, run it against a pretend
              Salesforce. Nothing you do here can touch production data, because
              there is no connection to production data.
            </P>
            <CodeBlock label="terminal">{`MOPERATOR_MOCK=true npm run agent`}</CodeBlock>
            <P>
              You now have a chat prompt in your terminal. Ask it something an
              operator would actually ask:
            </P>
            <CodeBlock>{`> how many contacts do we have at Acme?
> export every contact at Acme as a CSV
> dedupe this list against Salesforce`}</CodeBlock>
            <Muted>
              This is the moment to decide whether you want to keep going. If the
              answers look useful, continue. If not, you have spent twenty
              minutes and installed nothing on your company&apos;s systems.
            </Muted>
            <Callout title="Two commands worth remembering">
              <code className="font-mono text-accent">npm run agent:info</code>{" "}
              lists every tool, skill, and schedule it found on disk.{" "}
              <code className="font-mono text-accent">npm run agent:doctor</code>{" "}
              makes one read-only call per integration and reports what came
              back. When something mysteriously does not work, run doctor first —
              it catches the silent failures.
            </Callout>

            {/* 4 */}
            <H2 id="keys" n={4}>Give it a brain (the AI key)</H2>
            <P>
              The agent needs access to a language model. The simplest route is
              Vercel&apos;s AI Gateway, which gets you many models behind one key.
            </P>
            <P>
              In your Vercel dashboard, open{" "}
              <strong className="text-foreground">AI Gateway</strong> and create an
              API key. Then open{" "}
              <code className="font-mono text-[15px] text-accent">.env.local</code>{" "}
              in any text editor and fill in three values:
            </P>
            <CodeBlock label=".env.local">{`AI_GATEWAY_API_KEY=your-key-here
AUTHORIZED_USER_EMAILS=you@company.com
MOPERATOR_SESSION_SECRET=paste-the-random-string-below`}</CodeBlock>
            <P>
              For that last one, generate a random string and paste the output in:
            </P>
            <CodeBlock label="terminal">{`openssl rand -hex 32`}</CodeBlock>
            <Muted>
              <strong className="text-foreground">AUTHORIZED_USER_EMAILS</strong>{" "}
              is your first and most important guardrail. Only the email addresses
              you list here can talk to the agent at all. Start with just your own
              and add colleagues later.
            </Muted>
            <P>Now run it for real:</P>
            <CodeBlock label="terminal">{`npm run agent`}</CodeBlock>

            {/* 5 */}
            <H2 id="deploy" n={5}>Put it on the internet</H2>
            <P>
              So far it only runs while your terminal is open. Deploying puts it
              on a real URL that Slack can reach.
            </P>
            <CodeBlock label="terminal">{`npx vercel deploy --prod`}</CodeBlock>
            <Muted>
              The first run asks a few setup questions — accept the defaults and
              log in with GitHub when prompted. One Vercel project serves the
              website, the admin pages, and the agent itself. Any scheduled
              digests in the repo become Vercel Cron Jobs automatically.
            </Muted>
            <P>
              You also need to copy your keys into Vercel, since{" "}
              <code className="font-mono text-[15px] text-accent">.env.local</code>{" "}
              stays on your laptop. In your project&apos;s{" "}
              <strong className="text-foreground">Settings → Environment Variables</strong>,
              add the same three values from step 4.
            </P>
            <Callout title="You can skip the model key in production">
              If you deploy on Vercel, you can drop{" "}
              <code className="font-mono text-accent">AI_GATEWAY_API_KEY</code>{" "}
              entirely. Vercel issues a short-lived token per run, with nothing
              written to disk. Locally the equivalent is{" "}
              <code className="font-mono text-accent">vercel link</code> then{" "}
              <code className="font-mono text-accent">
                vercel env run -- npm run agent
              </code>
              .
            </Callout>

            {/* 6 */}
            <H2 id="slack" n={6}>Add it to Slack</H2>
            <P>
              One command scaffolds the Slack integration and walks you through
              creating the app:
            </P>
            <CodeBlock label="terminal">{`npx eve add channel/slack`}</CodeBlock>
            <P>
              When it asks how to authenticate, choose{" "}
              <strong className="text-foreground">Vercel Connect</strong>. That
              way Vercel manages the bot token, verifies that inbound requests
              genuinely came from Slack, and handles rotation — so no Slack secret
              ever sits in your environment.
            </P>
            <Callout tone="warning" title="The permission everyone forgets">
              Your Slack app needs the{" "}
              <code className="font-mono text-warning">users:read.email</code>{" "}
              scope. Without it the agent cannot match a Slack user to an email
              address, which silently makes{" "}
              <em>everyone</em> a non-approver and refuses every CRM write.{" "}
              <code className="font-mono text-accent">npm run agent:doctor</code>{" "}
              catches exactly this.
            </Callout>
            <Muted>
              You can skip Slack entirely if you want. The deployed app has a
              browser chat at{" "}
              <code className="font-mono text-accent">/chat</code> with the same
              agent, tools, and approval rules.
            </Muted>

            {/* 7 */}
            <H2 id="crm" n={7}>Connect your real CRM</H2>
            <P>
              Adding an integration is just setting its credentials and
              restarting. The agent only shows itself tools for what you have
              configured, so it never offers to do something your install cannot
              do.
            </P>
            <div className="my-6 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 pr-4 font-mono text-xs font-normal uppercase tracking-[var(--tracking-label)] text-muted">
                      Service
                    </th>
                    <th className="pb-3 font-mono text-xs font-normal uppercase tracking-[var(--tracking-label)] text-muted">
                      What you need
                    </th>
                  </tr>
                </thead>
                <tbody className="text-muted">
                  {[
                    ["Salesforce", "An access token and your instance URL"],
                    ["HubSpot", "A private app token"],
                    ["Marketo", "Client ID, secret, and REST endpoint"],
                    ["Customer.io", "An App API key"],
                    ["Google Ads", "Client ID, secret, developer token, customer ID"],
                    ["Linear / Asana / Jira / monday / ClickUp", "An API token for whichever one you use"],
                  ].map(([svc, need]) => (
                    <tr key={svc} className="border-b border-border/60">
                      <td className="py-3 pr-4 align-top font-medium text-foreground">
                        {svc}
                      </td>
                      <td className="py-3 align-top">{need}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Muted>
              Each service has its own walkthrough in the repo under{" "}
              <A href={`${REPO_URL}/tree/main/docs`}>docs/</A> — for example{" "}
              <code className="font-mono text-accent">setup-salesforce.md</code>.
              The{" "}
              <code className="font-mono text-accent">.env.example</code> file
              lists every variable with a note on what it does and whether you
              need it.
            </Muted>
            <Callout tone="warning" title="Give it the narrowest access that works">
              Create a dedicated integration user in your CRM rather than using
              your own admin credentials, and give it access only to the objects
              and fields the agent actually needs. If something goes wrong, the
              blast radius is whatever you granted.
            </Callout>

            {/* 8 */}
            <H2 id="security" n={8}>Lock it down before it touches real data</H2>
            <P>
              An agent with write access to your CRM deserves real thought. Here
              is the honest ladder, cheapest first — the first four cost nothing
              and matter most.
            </P>

            <H3>Free, and the ones that actually matter</H3>
            <Muted>
              <strong className="text-foreground">Keep the authorised email list short.</strong>{" "}
              <code className="font-mono text-accent">AUTHORIZED_USER_EMAILS</code>{" "}
              is the front door. Everything else is secondary to who can open it.
            </Muted>
            <Muted>
              <strong className="text-foreground">Set your approver lists deliberately.</strong>{" "}
              In{" "}
              <code className="font-mono text-accent">agent/lib/config.ts</code>{" "}
              you decide who can approve CRM writes and, separately, who can
              approve ad-spend changes. Bulk-write thresholds and hard caps live
              here too.
            </Muted>
            <Muted>
              <strong className="text-foreground">Use a least-privilege integration user</strong>{" "}
              in every connected system, as in step 7.
            </Muted>
            <Muted>
              <strong className="text-foreground">Turn on Vercel Deployment Protection</strong>{" "}
              so the admin pages, the SOQL console, and the analytics views are
              not publicly reachable. Project{" "}
              <strong className="text-foreground">Settings → Deployment Protection</strong>{" "}
              → enable Vercel Authentication.
            </Muted>

            <H3>If your CRM requires IP allowlisting</H3>
            <Muted>
              Some security teams will only open an API to known IP addresses. By
              default, traffic from Vercel can come from any IP, so there is
              nothing to allowlist. Two paid options fix that:
            </Muted>
            <div className="my-6 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 pr-4 font-mono text-xs font-normal uppercase tracking-[var(--tracking-label)] text-muted">
                      Option
                    </th>
                    <th className="pb-3 pr-4 font-mono text-xs font-normal uppercase tracking-[var(--tracking-label)] text-muted">
                      Plan
                    </th>
                    <th className="pb-3 font-mono text-xs font-normal uppercase tracking-[var(--tracking-label)] text-muted">
                      What you get
                    </th>
                  </tr>
                </thead>
                <tbody className="text-muted">
                  <tr className="border-b border-border/60">
                    <td className="py-3 pr-4 align-top font-medium text-foreground">
                      Static IPs
                    </td>
                    <td className="py-3 pr-4 align-top whitespace-nowrap">
                      Pro, $100/mo per project
                    </td>
                    <td className="py-3 align-top">
                      Fixed outbound IPs from a shared pool, which you paste into
                      your CRM&apos;s allowlist. Enough for most teams.
                    </td>
                  </tr>
                  <tr className="border-b border-border/60">
                    <td className="py-3 pr-4 align-top font-medium text-foreground">
                      Secure Compute
                    </td>
                    <td className="py-3 pr-4 align-top whitespace-nowrap">
                      Enterprise, custom
                    </td>
                    <td className="py-3 align-top">
                      A dedicated private network with VPC peering to your own AWS
                      environment, so traffic never crosses the public internet.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Callout tone="warning" title="Secure Compute is not a toggle">
              It is an Enterprise-only feature with custom pricing, arranged
              through a Vercel account team — you cannot switch it on from a
              Hobby or Pro plan. If you just need IP allowlisting, Static IPs are
              the cheaper and much simpler answer. Details:{" "}
              <A href="https://vercel.com/docs/networking/static-ips">Static IPs</A>{" "}
              and{" "}
              <A href="https://vercel.com/docs/networking/secure-compute">
                Secure Compute
              </A>
              .
            </Callout>
            <Muted>
              Whichever you choose, an IP allowlist is never the only control —
              you still authenticate with a token on top of it. And note that
              neither applies to Edge-runtime code, so keep the agent on the
              default Node.js runtime.
            </Muted>
            <Muted>
              The repo has a fuller production checklist at{" "}
              <A href={`${REPO_URL}/blob/main/docs/security.md`}>docs/security.md</A>.
            </Muted>

            {/* Wrap */}
            <H2 id="next" n={9}>When something breaks</H2>
            <Muted>
              Run{" "}
              <code className="font-mono text-accent">npm run agent:doctor</code>{" "}
              first, every time. It makes one read-only call per integration and
              tells you which credential is actually wrong, which beats guessing
              from a stack trace.
            </Muted>
            <Muted>
              Then read{" "}
              <A href={`${REPO_URL}/blob/main/docs/fork-this.md`}>docs/fork-this.md</A>,
              which covers making the agent genuinely yours — your naming
              conventions, your approval chain, your playbooks.
            </Muted>

            <div className="mt-12 rounded-[--radius-lg] border border-border bg-surface p-6">
              <p className="mb-2 text-[17px] font-semibold text-foreground">
                Stuck on a step?
              </p>
              <p className="text-[15px] leading-relaxed text-muted">
                Tell me which one and I will fix the guide.{" "}
                <A href="https://x.com/joe_reitz">@joe_reitz</A> or{" "}
                <A href={`${REPO_URL}/issues`}>open an issue</A>.
              </p>
            </div>
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
