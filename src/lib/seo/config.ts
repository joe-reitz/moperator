export const siteConfig = {
  name: 'The mOperator',
  url: 'https://the-moperator.com',
  domain: 'the-moperator.com',
  description: 'A technical Marketing Operations and RevOps blog',

  author: {
    name: 'Joe Reitz',
    url: 'https://the-moperator.com',
    jobTitle: 'Marketing Operations leader and GTM Engineer',
    bio: 'Marketing Operations leader writing about the move from running go-to-market systems to building and shipping software with AI development tools.',
    knowsAbout: [
      'Marketing Operations',
      'Revenue Operations',
      'GTM Engineering',
      'AI-assisted software development',
      'Vibe coding',
      'Next.js',
      'Vercel',
      'v0',
      'Cursor',
      'Claude',
      'GitHub',
    ],
  },
  publisher: {
    name: 'The mOperator',
    url: 'https://the-moperator.com',
  },

  audience: {
    description: 'Marketing Ops leaders, RevOps ICs, and technical founders',
    defaultPersona: 'Marketing Operations Professional',
  },

  colors: {
    background: '#070a08',
    backgroundGradientEnd: '#0b120c',
    primary: '#3ee07f',
    secondary: '#2ba55d',
    text: '#e6f2e8',
    textMuted: '#6e8a76',
  },

  fonts: {
    heading: 'Space Grotesk',
    body: 'Space Grotesk',
    mono: 'JetBrains Mono',
  },

  tone: {
    description: 'Technical and professional tone. Direct, credible, substance-focused.',
    avoid: [
      'marketing fluff or hype language',
      'emojis',
      'exclamation points',
      'words like "amazing", "incredible", "revolutionary"',
    ],
    goodExample: 'This post explains how to structure campaign objects in Salesforce to avoid downstream attribution failure.',
    badExample: 'Boost your marketing with this amazing guide!',
  },

  ogImage: {
    // Opacity of the heritage ASCII crossed-mops artwork behind OG cards.
    //
    // Well above the brand guide's 6-10%, deliberately. The artwork is thin
    // glyph strokes on transparency, so opacity barely moves the average
    // brightness — it only raises peak glyph contrast. Measured against the
    // #070a08 background: 0.16 peaks at 31/255 above background, 0.30 at 58.
    // Sanity's preview downscale then averages those thin strokes toward the
    // background, so anything under ~0.25 disappears at thumbnail size.
    // Going wider than 900px pushes the art behind the title and the domain and
    // measurably hurts their legibility, so width is the binding constraint here,
    // not opacity.
    artOpacity: 0.4,
    // Drawn width of the artwork inside the 1200px card. Larger glyphs survive
    // the preview downscale, so size matters as much as opacity here.
    artWidth: 900,
    // The site-wide card centres the mark, wordmark and tagline, so the artwork
    // sits directly behind text there and has to stay much fainter. The per-post
    // card puts its copy bottom-left, clear of the art, which is why these two
    // values legitimately differ rather than having drifted.
    artOpacitySiteCard: 0.16,
    style: `
      - CRT phosphor terminal aesthetic on a FLAT near-black green-tinted background
      - Single accent colour only: phosphor green (#3ee07f). Never amber, gold, or any second hue
      - Absolutely no gradients — flat colour fields only
      - Green glow as the one signature effect, on at most one or two elements
      - Monospace type for labels and terminal lines; geometric sans for headlines
      - The heritage ASCII crossed-mops artwork is the brand's illustration: green
        monospace characters forming two crossed mops, sat behind the composition at
        roughly 6-10% opacity as a texture layer
      - Thin concentric green circles at ~10% opacity are an acceptable legacy motif
      - Professional, minimalist, airy — similar to Vercel or Linear marketing
      - No photographs of people, no stock-art feeling, no emoji
    `.trim(),
    logoDescription: `
      - The mOperator LOGO is typographic, never pictorial: a lowercase cream "m",
        then a glowing green ring standing in for the "O" of Operator, then a
        cream block cursor
      - Ring stroke is roughly one seventh of its diameter, phosphor green (#3ee07f) with a soft glow
      - Cream is #e6f2e8; never render the mark in amber or gold
      - The wordmark is typeset: "the mOperator" in monospace, with "Operator" in green
      - Place the mark subtly in the upper left or lower right
      - The ASCII crossed-mops art may appear as a faint background TEXTURE (see style),
        but it is heritage illustration and must never stand in for the logo itself
    `.trim(),
  },

  model: {
    id: 'claude-sonnet-5' as const,
  },
}

export type SiteConfig = typeof siteConfig
