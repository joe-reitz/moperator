import { siteConfig } from "@/lib/seo/config";

/**
 * Copy for the two trust-anchor pages, /contact and /privacy.
 *
 * Held as data rather than JSX because each page has two renderings — the HTML
 * page and the markdown one served under `Accept: text/markdown`. A privacy
 * policy that says different things to a person and to an agent is worse than
 * no policy, so both renderings read from here.
 */

export type ProseSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type ContactChannel = {
  label: string;
  /** What this channel is actually for — the part that saves a round trip. */
  purpose: string;
  href: string;
  /** Displayed instead of the raw href. */
  display: string;
  external: boolean;
};

const { contact, author, url } = siteConfig;

export const CONTACT_INTRO =
  "There is one person behind this site, so every channel below reaches the same inbox eventually. Pick whichever one fits what you need, and expect a reply within a few business days.";

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    label: "Email",
    purpose:
      "Anything that needs a paper trail: corrections to a post, speaking or podcast invitations, sponsorship questions, privacy and data requests, or press enquiries.",
    href: `mailto:${contact.email}`,
    display: contact.email,
    external: false,
  },
  {
    label: "X",
    purpose:
      "Quick questions about a tutorial, and the fastest way to get a short answer. Public replies and DMs are both open.",
    href: contact.x,
    display: contact.xHandle,
    external: true,
  },
  {
    label: "LinkedIn",
    purpose:
      "Professional enquiries, consulting conversations, and anything where you would rather have a work profile attached to the message.",
    href: contact.linkedin,
    display: "linkedin.com/in/joereitz",
    external: true,
  },
  {
    label: "GitHub",
    purpose:
      "Bugs, feature requests and pull requests for the open-source mOperator agent. File an issue on the repository rather than emailing — it keeps the fix discoverable for the next person who hits it.",
    href: contact.agentRepo,
    display: "github.com/joe-reitz/oss-moperator",
    external: true,
  },
  {
    label: "Newsletter",
    purpose:
      "One-way, but it is how new tutorials get announced. Subscribe from the home page; every email has a one-click unsubscribe link.",
    href: "/",
    display: `${siteConfig.domain}`,
    external: false,
  },
];

export const CONTACT_SECTIONS: ProseSection[] = [
  {
    heading: "Who you are writing to",
    paragraphs: [
      `${author.name} publishes ${siteConfig.name} as an independent, self-funded project. It is not a company, an agency, or a product with a support desk, and there is no team to escalate to. ${author.jobTitle}, writing about the move from running go-to-market systems to building software against them.`,
      "That matters for expectations: there is no SLA here. Email gets read every day and answered in batches, usually within two or three business days. If something is genuinely time-sensitive, say so in the subject line.",
    ],
  },
  {
    heading: "What gets answered, and what does not",
    paragraphs: [
      "Questions about a specific tutorial, corrections, and anything involving the open-source agent are always worth sending — those make the site better for everyone.",
    ],
    bullets: [
      "Corrections and technical questions about a published post: yes, always.",
      "Bug reports for the open-source agent: yes, but as a GitHub issue rather than email.",
      "Speaking, podcast, workshop and collaboration invitations: yes.",
      "Privacy, data-access and data-deletion requests: yes, by email, and see the privacy policy for what is held.",
      "Unsolicited guest posts, link insertions, paid backlinks and AI-generated pitches: no, and these are not answered.",
      "Requests to review or promote a product in exchange for payment: no. Tools mentioned here are mentioned because they were actually used.",
    ],
  },
  {
    heading: "Data and privacy requests",
    paragraphs: [
      `If you subscribed to the newsletter and want to know what is stored, or want it deleted, email ${contact.email} from the address you subscribed with and it will be handled directly. Every newsletter email also carries a one-click unsubscribe link, which removes you without needing to contact anyone. The full detail of what is collected is on the privacy page at ${url}/privacy.`,
    ],
  },
];

export const PRIVACY_SUMMARY =
  "This site collects as little as it can get away with: privacy-preserving page analytics, and your email address only if you hand it over to the newsletter. There is no advertising, no third-party tracking pixels, and nothing is sold or shared with data brokers.";

export const PRIVACY_SECTIONS: ProseSection[] = [
  {
    heading: "Who is responsible",
    paragraphs: [
      `${siteConfig.name} (${siteConfig.domain}) is an independent publication run by ${author.name}. There is no parent company and no third-party publisher. Questions about anything on this page go to ${contact.email}.`,
    ],
  },
  {
    heading: "Analytics",
    paragraphs: [
      "Page views are measured with Vercel Web Analytics. It is cookieless: it does not set a persistent identifier, does not fingerprint your device, and cannot follow you to other sites. What it records is the page you visited, a coarse country-level location, and the general type of device and browser, all aggregated.",
      "There is no Google Analytics, no advertising pixel, no Meta or LinkedIn tag, and no session-recording or heatmap tool on this site.",
    ],
  },
  {
    heading: "The newsletter",
    paragraphs: [
      "If you subscribe, your email address and the date you subscribed are stored in Sanity, the content platform this site runs on, and the emails themselves are delivered by Resend. Those two processors see your address because they have to; nobody else does.",
      "Your address is used for one thing: telling you when something new is published. It is never sold, rented, or shared for anyone else's marketing. Every email contains a one-click unsubscribe link that works immediately, and you can also ask for outright deletion by email.",
    ],
  },
  {
    heading: "Cookies",
    paragraphs: [
      "This site sets no advertising or analytics cookies, which is why there is no cookie banner. The only cookie it ever sets is a session cookie for the private editing tools behind /studio, and that is only issued after an administrator signs in. As a reader you will never receive it.",
      "Embedded videos are the exception worth knowing about. Posts with a YouTube, Vimeo or Loom embed load that player from the provider, and the provider may set its own cookies when the embed loads. Those cookies are governed by that provider's policy, not this one.",
    ],
  },
  {
    heading: "Server logs",
    paragraphs: [
      "The site is hosted on Vercel, which keeps short-lived request logs containing IP addresses and user-agent strings as a normal part of operating and securing a web server. These are Vercel's operational logs, retained on their schedule, and are not used to build any profile of you.",
    ],
  },
  {
    heading: "Automated clients and AI crawlers",
    paragraphs: [
      "Answer-engine and research crawlers are allowed to read the public pages of this site, and there is a markdown representation of every page for exactly that purpose. Crawler requests are subject to the same server logging as any other request and nothing additional is collected from them.",
    ],
  },
  {
    heading: "Your rights",
    paragraphs: [
      `Wherever you live, you can ask what is held about you, ask for it to be corrected, and ask for it to be deleted. In practice the only thing likely to be held is a newsletter subscription. Email ${contact.email} from the relevant address and it will be actioned; there is no form and no waiting queue.`,
      "If you are in the EU, UK or California, the same request satisfies your GDPR or CCPA rights and no additional process is required.",
    ],
  },
  {
    heading: "Children",
    paragraphs: [
      "This site is aimed at working professionals and is not directed at children under 13. No information is knowingly collected from them.",
    ],
  },
  {
    heading: "Changes to this policy",
    paragraphs: [
      `This policy was last updated on ${siteConfig.legal.privacyUpdated}. If it changes in a way that affects what is collected or who it is shared with, the date here changes with it, and the previous versions remain in this site's public git history.`,
    ],
  },
];
