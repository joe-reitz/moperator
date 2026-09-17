import { siteConfig } from "@/lib/seo/config";
import {
  CONTACT_CHANNELS,
  CONTACT_INTRO,
  CONTACT_SECTIONS,
  PRIVACY_SECTIONS,
  PRIVACY_SUMMARY,
  type ProseSection,
} from "@/lib/site/trust-pages";
import { buildAgentInstructions } from "./instructions";
import {
  portableTextToMarkdown,
  type PortableBlock,
} from "./portable-text-to-markdown";

/**
 * The markdown representation of each page.
 *
 * Static pages are written out here; list pages and blog posts are built from
 * Sanity data by the builders at the bottom. Everything funnels through
 * `renderDocument` so every markdown response has the same shape: an H1, a
 * one-line summary, the body, then a footer pointing back at the HTML page and
 * at the site's machine-readable indexes.
 */

const { url } = siteConfig;

export type DocumentSource = {
  title: string;
  description: string;
  body: string;
};

/** Renders one markdown document, including its provenance footer. */
export function renderDocument(
  canonicalPath: string,
  source: DocumentSource
): string {
  const canonicalUrl = canonicalPath === "/" ? url : `${url}${canonicalPath}`;

  return [
    `# ${source.title}`,
    "",
    `> ${source.description}`,
    "",
    source.body.trim(),
    "",
    "---",
    "",
    `Canonical HTML: ${canonicalUrl}`,
    `Site index for agents: ${url}/llms.txt · ${url}/agents.txt`,
    `Sitemap: ${url}/sitemap.xml · RSS: ${url}/feed.xml`,
    "",
  ].join("\n");
}

/** Renders the shared trust-page prose as markdown at the given heading level. */
export function proseSectionsToMarkdown(
  sections: readonly ProseSection[],
  level = 2
): string {
  const hashes = "#".repeat(level);

  return sections
    .map((section) => {
      const parts = [`${hashes} ${section.heading}`];
      for (const paragraph of section.paragraphs ?? []) parts.push(paragraph);
      if (section.bullets?.length) {
        parts.push(section.bullets.map((item) => `- ${item}`).join("\n"));
      }
      return parts.join("\n\n");
    })
    .join("\n\n");
}

const HOME_BODY = `Video tutorials, guides, and real-world examples for Marketing Operations
professionals ready to build apps, agents, and automations with tools like v0,
Cursor, Claude, and more. Written by ${siteConfig.author.name}, who is making
that move in public.

## What you'll find here

- **Video tutorials** — step-by-step walkthroughs building real applications
  from scratch with AI-assisted development tools.
- **Written guides** — deep-dive articles on concepts, best practices, and
  patterns for AI-assisted development in marketing contexts.
- **Real projects** — actual Marketing Ops projects, from lead scoring apps to
  attribution dashboards, that you can follow along with.
- **Honest takes** — what works, what doesn't, and what is just hype.

## Sections

- [Agent](${url}/oss-moperator) — the open-source marketing ops agent you fork.
- [Videos](${url}/videos) — recorded walkthroughs.
- [Blog](${url}/blog) — written guides and tutorials.
- [Repos](${url}/repos) — example projects referenced by the tutorials.
- [About](${url}/about) — who is behind this and why.
- [Contact](${url}/contact) — how to reach ${siteConfig.author.name}.
- [Privacy](${url}/privacy) — what this site collects, which is very little.

${buildAgentInstructions()}`;

const ABOUT_BODY = `## Who runs this

${siteConfig.author.name} — ${siteConfig.author.jobTitle}. ${siteConfig.author.bio}

The best Operators are no longer just system admins; they are part product
manager, part engineer. That emerging field is becoming known as GTM
Engineering. ${siteConfig.name} is about building in public and documenting the
journey from traditional Ops work to shipping real applications that solve real
business problems.

## The mission

Operations professionals are some of the most systems-minded people in any
organisation. We build automations, design processes, manage complex tech
stacks, and solve problems every day. But there has always been a gap between
"I can configure this tool" and "I can build something better."

That gap used to require years of sweat equity: learning to code, earning a
computer science qualification, or working as a junior developer to accumulate
experience. With AI-assisted development tools — Cursor, v0, Claude and others
— operators can now build real applications. The skills operators already have,
systems thinking, problem decomposition, and understanding business logic, are
exactly the ones that matter. The AI handles the syntax.

## What you'll find here

- **Video tutorials** — real builds from start to finish.
- **Written guides** — deep dives on concepts, patterns and best practices.
- **Real projects** — apps relevant to Ops work that you can learn from.
- **Honest takes** — what works, what doesn't, and what is just hype.

## The name

**m** + **Operator**: *marketing **Op**erations* plus *Operator*. Always
lowercase "m", capital "O". It is a nod to where operators come from and what
they are becoming, and it reads just as well for SalesOps and RevOps. Also,
someone has to clean up the mess.

## Elsewhere

- X: ${siteConfig.contact.x}
- LinkedIn: ${siteConfig.contact.linkedin}
- YouTube: ${siteConfig.contact.youtube}
- GitHub: ${siteConfig.contact.github}`;

const CONTACT_BODY = `${CONTACT_INTRO}

## Channels

${CONTACT_CHANNELS.map(
  (channel) =>
    `- **${channel.label}** — ${channel.display}${
      channel.external || channel.href.startsWith("mailto:")
        ? ` (${channel.href})`
        : ""
    }. ${channel.purpose}`
).join("\n")}

${proseSectionsToMarkdown(CONTACT_SECTIONS)}`;

const PRIVACY_BODY = `${PRIVACY_SUMMARY}

Last updated: ${siteConfig.legal.privacyUpdated}

${proseSectionsToMarkdown(PRIVACY_SECTIONS)}`;

const OSS_BODY = `An open-source marketing operations agent that lives in your Slack and works
in your CRM. Every rule it follows is a file you can edit. MIT licensed, built
on eve, deploys to Vercel.

Repository: ${siteConfig.contact.agentRepo}

## Why fork instead of buy

Marketing ops is not a generic problem. Your segment field is not their segment
field, your naming convention is real, and your approval chain is specific. A
closed product has to average across every customer; a forked agent does not.

## Six things it handles

- **Answers questions about your data** — pulls ad performance, analyses it in a
  real Linux sandbox with pandas, and says which differences are too small to
  mean anything.
- **Cleans up lists nobody wants to touch** — reads an attachment, normalises
  emails, finds duplicates and unsubscribes, and reports what is worth
  importing.
- **Waits for a human on anything risky** — writes that matter are gated.
- **Builds emails and files tickets.**
- **Enforces your tracking conventions.**
- **Sends digests you didn't have to build.**

## Guardrails

An agent with write access to your CRM needs more than a polite prompt, so the
limits are enforced in code rather than asked for in a system prompt: who can
approve what, which writes need a human, naming and UTM conventions, and hard
limits.

## Editable surfaces

- Who can approve what, naming and UTM conventions, limits — \`agent/lib/config.ts\`
- How it talks and what it refuses — \`agent/instructions/\`
- Playbooks for SOQL, audiences, launches, list hygiene — \`agent/skills/\`
- Which tools exist, one file per integration — \`agent/tools/\`
- Which writes need a human — \`agent/lib/approval.ts\`
- Scheduled digests — \`agent/schedules/\`

## Connects to

Salesforce, HubSpot, Marketo, Customer.io, Iterable, Inflection, Google Ads,
Knak, Luma, GitHub, Linear, Asana, Jira, monday.com and ClickUp. Set the
credentials and restart. The agent only sees tools for what you configured, so
it never offers to do something your install cannot do.

## You do not need to be a developer

The [setup guide](${url}/oss-moperator/setup) starts at "create a GitHub
account" and ends with a working agent in your Slack, with no prior
command-line experience assumed. You can run the whole thing against a fake CRM
before connecting anything real.`;

const OSS_SETUP_BODY = `A deployment walkthrough for the open-source mOperator agent, written for
marketing operators with no command-line experience. Eight steps, and you can
stop after step three if you only want to see it work.

1. **Make three free accounts** — GitHub, Vercel and an AI provider.
2. **Get the code onto your computer.**
3. **Try it against a fake CRM first** — a mock CRM ships with the repository,
   so nothing real is at risk while you learn what it does.
4. **Give it a brain** — add the AI API key.
5. **Put it on the internet** — deploy to Vercel.
6. **Add it to Slack.**
7. **Connect your real CRM.**
8. **Lock it down before it touches real data** — including the options for
   IP-restricted CRMs.

Repository: ${siteConfig.contact.agentRepo}

Overview of what the agent does: ${url}/oss-moperator`;

const COMING_SOON_BODY = `This section is still being built. Video tutorials and guides are on the way.

In the meantime:

- [Blog](${url}/blog) — published guides and tutorials.
- [Videos](${url}/videos) — recorded walkthroughs.
- [Agent](${url}/oss-moperator) — the open-source marketing ops agent.
- Subscribe from the [home page](${url}/) to be told when new content ships.`;

/** Markdown for the pages whose content does not come from the CMS. */
export const STATIC_DOCUMENTS: Record<string, DocumentSource> = {
  "/": {
    title: siteConfig.name,
    description:
      "AI app development for Marketing Ops professionals — tutorials, guides and real projects for operators who want to ship software.",
    body: HOME_BODY,
  },
  "/about": {
    title: `About ${siteConfig.name}`,
    description: `Who ${siteConfig.author.name} is, why this site exists, and what the name means.`,
    body: ABOUT_BODY,
  },
  "/contact": {
    title: `Contact ${siteConfig.name}`,
    description: `How to reach ${siteConfig.author.name}: email, X, LinkedIn, GitHub, and what each channel is for.`,
    body: CONTACT_BODY,
  },
  "/privacy": {
    title: "Privacy policy",
    description: PRIVACY_SUMMARY,
    body: PRIVACY_BODY,
  },
  "/oss-moperator": {
    title: "mOperator: the marketing ops agent you fork",
    description:
      "An open-source marketing ops agent for Slack and your CRM. Every rule it follows is a file you can edit. MIT licensed, deploys on Vercel.",
    body: OSS_BODY,
  },
  "/oss-moperator/setup": {
    title: "Set up the mOperator agent: a guide for non-developers",
    description:
      "Step-by-step deployment of the open-source mOperator agent, assuming no command-line experience.",
    body: OSS_SETUP_BODY,
  },
  "/coming-soon": {
    title: "Coming soon",
    description: "This section is still being built.",
    body: COMING_SOON_BODY,
  },
};

/**
 * The markdown body of a 404.
 *
 * An agent that hits a dead path should be able to recover from the response
 * alone rather than having to guess at the site's shape, so this lists both the
 * machine-readable indexes and every real section.
 */
export function buildNotFoundDocument(requestedPath: string): string {
  const body = `The path \`${requestedPath}\` does not exist on ${siteConfig.domain}, and it
never did — this is a real 404, not a soft one. Nothing here answers a missing
path with a 200.

## Where to look instead

- [${url}/llms.txt](${url}/llms.txt) — every page on the site with a one-line
  summary. Start here.
- [${url}/agents.txt](${url}/agents.txt) — when to use this site and how to call it.
- [${url}/sitemap.xml](${url}/sitemap.xml) — the machine-readable index of every URL.
- [${url}/feed.xml](${url}/feed.xml) — RSS feed of new posts.

## Sections

- [Home](${url}/)
- [Blog](${url}/blog) — written guides and tutorials.
- [Videos](${url}/videos) — recorded walkthroughs.
- [Repos](${url}/repos) — example projects.
- [Agent](${url}/oss-moperator) — the open-source marketing ops agent.
- [About](${url}/about)
- [Contact](${url}/contact)
- [Privacy](${url}/privacy)

## If you were looking for a post

Blog post URLs are \`${url}/blog/<slug>\`. The current list of slugs is in
[llms.txt](${url}/llms.txt) and in the [sitemap](${url}/sitemap.xml). Append
\`.md\` to any page URL to get its markdown representation directly.`;

  return renderDocument(requestedPath, {
    title: "404 — page not found",
    description: `No page exists at ${requestedPath}.`,
    body,
  });
}

/* -------------------------------------------------------------------------- */
/* CMS-backed documents                                                        */
/* -------------------------------------------------------------------------- */

export type PostSummary = {
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string | null;
};

export type PostDetail = PostSummary & {
  updatedAt: string | null;
  authorName: string | null;
  tag: string | null;
  metaDescription: string | null;
  body: PortableBlock[] | null;
};

export type VideoSummary = {
  title: string;
  description: string | null;
  videoUrl: string;
  duration: string | null;
  publishedAt: string | null;
};

export type RepoSummary = {
  title: string;
  description: string;
  githubUrl: string;
  demoUrl: string | null;
  tags: string[] | null;
};

function oneLine(text: string | null | undefined): string {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

export function buildBlogIndexDocument(posts: readonly PostSummary[]): DocumentSource {
  const list = posts.length
    ? posts
        .map((post) => {
          const summary = oneLine(post.excerpt);
          const date = post.publishedAt ? ` (${post.publishedAt.slice(0, 10)})` : "";
          return `- [${post.title}](${url}/blog/${post.slug})${date}${
            summary ? `: ${summary}` : ""
          }`;
        })
        .join("\n")
    : "No posts are published yet.";

  return {
    title: `${siteConfig.name} — Blog`,
    description:
      "Guides, tutorials, and insights for operators learning to build apps with AI.",
    body: `${posts.length} post${posts.length === 1 ? "" : "s"}, newest first. Append \`.md\` to any
post URL for its markdown representation.

## Posts

${list}`,
  };
}

export function buildPostDocument(post: PostDetail): DocumentSource {
  const meta: string[] = [];
  if (post.publishedAt) meta.push(`Published: ${post.publishedAt.slice(0, 10)}`);
  if (post.updatedAt) meta.push(`Updated: ${post.updatedAt.slice(0, 10)}`);
  if (post.authorName) meta.push(`Author: ${post.authorName}`);
  if (post.tag) meta.push(`Category: ${post.tag}`);

  const content = portableTextToMarkdown(post.body);

  return {
    title: post.title,
    description:
      oneLine(post.metaDescription) ||
      oneLine(post.excerpt) ||
      `A post from ${siteConfig.name}.`,
    body: [meta.join(" · "), content].filter(Boolean).join("\n\n"),
  };
}

export function buildVideosDocument(videos: readonly VideoSummary[]): DocumentSource {
  const list = videos.length
    ? videos
        .map((video) => {
          const parts = [oneLine(video.description), video.duration]
            .filter(Boolean)
            .join(" · ");
          return `- [${video.title}](${video.videoUrl})${parts ? `: ${parts}` : ""}`;
        })
        .join("\n")
    : "No videos are published yet.";

  return {
    title: `${siteConfig.name} — Videos`,
    description:
      "Video tutorials and walkthroughs for Marketing Operations professionals learning to build apps with AI.",
    body: `## Videos\n\n${list}`,
  };
}

export function buildReposDocument(repos: readonly RepoSummary[]): DocumentSource {
  const list = repos.length
    ? repos
        .map((repo) => {
          const links = [`source: ${repo.githubUrl}`];
          if (repo.demoUrl) links.push(`demo: ${repo.demoUrl}`);
          const tags = repo.tags?.length ? ` Tags: ${repo.tags.join(", ")}.` : "";
          return `- **${repo.title}** — ${oneLine(repo.description)}${tags} (${links.join(
            ", "
          )})`;
        })
        .join("\n")
    : "No repositories are published yet.";

  return {
    title: `${siteConfig.name} — Open source repos`,
    description:
      "Forkable open source projects for Marketing Operations professionals. Clone, customise, and deploy your own versions.",
    body: `## Repositories\n\n${list}`,
  };
}
