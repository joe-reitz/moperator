import type { PortableTextComponents } from "@portabletext/react";

/**
 * The page template already renders the post title as the page's only <h1>.
 * Editors sometimes add an h1 inside the body too, which produces two <h1>
 * elements on the page — bad for both accessibility and how crawlers infer
 * document structure. Render body h1s as h2s instead.
 */
export const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h2>{children}</h2>,
  },
};
