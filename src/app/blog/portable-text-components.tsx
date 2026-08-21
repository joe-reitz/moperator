import type { PortableTextComponents } from "@portabletext/react";

export const portableTextComponents: PortableTextComponents = {
  block: {
    /**
     * The page template already renders the post title as the page's only <h1>.
     * Editors sometimes add an h1 inside the body too, which produces two <h1>
     * elements — bad for both accessibility and how crawlers infer document
     * structure. Render body h1s as h2s instead.
     */
    h1: ({ children }) => <h2>{children}</h2>,

    /**
     * "Aside" style — a side note set apart from the main argument. A real
     * <aside> element, so assistive tech and crawlers can tell it is
     * complementary rather than part of the through-line.
     */
    aside: ({ children }) => (
      <aside className="article-aside">{children}</aside>
    ),
  },
};
