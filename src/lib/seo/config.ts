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
    background: '#0c0c0f',
    backgroundGradientEnd: '#1a1a22',
    primary: '#f59e0b',
    secondary: '#fbbf24',
    text: '#e8e4dd',
    textMuted: '#6b7280',
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
    style: `
      - Operator/terminal aesthetic with subtle tech grid patterns
      - Geometric shapes (circles, rectangles) as decorative overlays at very low opacity
      - Amber/gold glowing accents and highlights (similar to neon terminal styling)
      - Professional, minimalist aesthetic similar to Vercel or Linear marketing
      - No photographs of people
      - No stock-art feeling
      - Clean, geometric accents with subtle glow effects
    `.trim(),
    logoDescription: `
      - The mOperator logo features a geometric "M" mark made of overlapping angular shapes
      - Logo uses amber (#f59e0b) and gold (#fbbf24) on white elements
      - Place branding subtly in upper left or lower right
      - Include "The mOperator" text badge
    `.trim(),
  },

  model: {
    id: 'claude-sonnet-5' as const,
  },
}

export type SiteConfig = typeof siteConfig
