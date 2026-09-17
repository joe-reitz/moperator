import { siteConfig } from "./config";

type ArticleSchemaInput = {
  title: string;
  slug: string;
  description?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  imageUrl?: string | null;
  authorName?: string | null;
  keywords?: string[];
};

/**
 * BlogPosting JSON-LD generated from the post's own fields. Used as a fallback
 * whenever an editor hasn't pasted custom `schemaMarkup` into the Studio, so
 * every post ships structured data rather than only the hand-tuned ones.
 */
export function buildArticleSchema(post: ArticleSchemaInput) {
  const url = `${siteConfig.url}/blog/${post.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    ...(post.description && { description: post.description }),
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(post.imageUrl && { image: [post.imageUrl] }),
    ...(post.publishedAt && { datePublished: post.publishedAt }),
    ...(post.updatedAt && { dateModified: post.updatedAt }),
    inLanguage: "en-US",
    isPartOf: { "@id": `${siteConfig.url}/blog#blog` },
    audience: {
      "@type": "Audience",
      audienceType: siteConfig.audience.defaultPersona,
    },
    ...(post.keywords?.length && { keywords: post.keywords.join(", ") }),
    author: {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: post.authorName || siteConfig.author.name,
      url: siteConfig.author.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.publisher.name,
      url: siteConfig.publisher.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/icon.svg`,
      },
    },
  };
}

/** Trail an answer engine can use to place a page in the site hierarchy. */
export function buildBreadcrumbSchema(
  trail: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${siteConfig.url}${crumb.path}`,
    })),
  };
}

/** The Blog itself plus its posts, so /blog reads as a collection. */
export function buildBlogSchema(
  posts: Array<{ title: string; slug: string; publishedAt?: string | null }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${siteConfig.url}/blog#blog`,
    url: `${siteConfig.url}/blog`,
    name: `${siteConfig.name} Blog`,
    description: siteConfig.description,
    inLanguage: "en-US",
    author: { "@id": `${siteConfig.url}/#person` },
    publisher: { "@id": `${siteConfig.url}/#person` },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${siteConfig.url}/blog/${post.slug}`,
      ...(post.publishedAt && { datePublished: post.publishedAt }),
    })),
  };
}

/**
 * Everywhere the brand's own profiles live. Emitted as schema.org `sameAs` on
 * both the Person and the Organization, which is the signal an answer engine
 * uses to tie the name "The mOperator" to this domain rather than to a
 * similarly-named account somewhere else.
 */
export function brandProfiles(): string[] {
  const { contact } = siteConfig;
  return [contact.x, contact.linkedin, contact.youtube, contact.github];
}

/** The publisher entity. Referenced by @id from every other schema block. */
export function buildOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.publisher.name,
    // Every spelling someone might search for, so a query for any of them can
    // resolve to this domain.
    alternateName: siteConfig.alternateNames,
    url: siteConfig.url,
    description: siteConfig.description,
    logo: {
      "@type": "ImageObject",
      "@id": `${siteConfig.url}/#logo`,
      url: `${siteConfig.url}/icon.svg`,
    },
    image: { "@id": `${siteConfig.url}/#logo` },
    founder: { "@id": `${siteConfig.url}/#person` },
    email: siteConfig.contact.email,
    sameAs: brandProfiles(),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: siteConfig.contact.email,
        url: `${siteConfig.url}/contact`,
        availableLanguage: ["en"],
      },
    ],
  };
}

/** The author entity. Referenced by @id from every other schema block. */
export function buildPersonSchema() {
  return {
    "@type": "Person",
    "@id": `${siteConfig.url}/#person`,
    name: siteConfig.author.name,
    url: siteConfig.url,
    description: siteConfig.author.bio,
    jobTitle: siteConfig.author.jobTitle,
    knowsAbout: siteConfig.author.knowsAbout,
    worksFor: { "@id": `${siteConfig.url}/#organization` },
    sameAs: brandProfiles(),
  };
}

/** Site-level identity, rendered once on the homepage. */
export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        alternateName: siteConfig.alternateNames,
        description: siteConfig.description,
        inLanguage: "en-US",
        publisher: { "@id": `${siteConfig.url}/#organization` },
        author: { "@id": `${siteConfig.url}/#person` },
      },
      buildOrganizationSchema(),
      buildPersonSchema(),
    ],
  };
}

/**
 * A standalone page in the site graph. `type` narrows it for the pages answer
 * engines treat as trust anchors — ContactPage and AboutPage specifically.
 */
export function buildPageSchema(input: {
  type: "WebPage" | "AboutPage" | "ContactPage";
  path: string;
  name: string;
  description: string;
  dateModified?: string;
}) {
  const pageUrl = `${siteConfig.url}${input.path}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": input.type,
        "@id": `${pageUrl}#page`,
        url: pageUrl,
        name: input.name,
        description: input.description,
        inLanguage: "en-US",
        ...(input.dateModified && { dateModified: input.dateModified }),
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        about: { "@id": `${siteConfig.url}/#organization` },
        publisher: { "@id": `${siteConfig.url}/#organization` },
      },
      buildOrganizationSchema(),
      buildPersonSchema(),
    ],
  };
}

/** Renders JSON-LD safely: `</script>` inside the payload can't break out. */
export function jsonLdScriptProps(schema: unknown) {
  return {
    type: "application/ld+json" as const,
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
    },
  };
}
