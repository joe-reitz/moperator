import type { Metadata } from "next";

/**
 * `<link rel="alternate">` entries for the agent-facing files.
 *
 * Next.js replaces `alternates` wholesale rather than deep-merging it, so any
 * page that sets its own `alternates` has to spread these back in or it
 * silently drops the llms.txt/agents.txt discovery links.
 */
export const AGENT_ALTERNATE_TYPES: NonNullable<
  NonNullable<Metadata["alternates"]>["types"]
> = {
  "application/rss+xml": [{ url: "/feed.xml", title: "The mOperator" }],
  "text/plain": [
    { url: "/llms.txt", title: "Site index for agents (llms.txt)" },
    { url: "/agents.txt", title: "Agent instructions" },
  ],
};
