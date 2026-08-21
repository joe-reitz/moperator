import type { PortableTextComponents } from "@portabletext/react";
import { ArticleCodeBlock, type SanityCode } from "./ArticleCodeBlock";
import { ArticleImage, type BodyImage } from "./ArticleImage";

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }: { value: BodyImage }) => <ArticleImage value={value} />,
    codeBlock: ({ value }: { value: SanityCode }) => (
      <ArticleCodeBlock value={value} />
    ),
    // Documents authored before the field was named still carry _type "code"
    code: ({ value }: { value: SanityCode }) => <ArticleCodeBlock value={value} />,
  },

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
