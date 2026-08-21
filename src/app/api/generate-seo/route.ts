import { generateText, Output, NoObjectGeneratedError } from 'ai'
import { z } from 'zod'
import { siteConfig } from '@/lib/seo/config'
import { getModel } from '@/lib/seo/model'

/**
 * Models reliably return most of this schema correctly but will sometimes emit a
 * comma-separated string where an array of strings is expected — which fails
 * validation for the whole object, losing an otherwise good generation. Accept
 * either shape and normalise to an array.
 */
const stringArray = z.preprocess((value) => {
  if (value === undefined || value === null) return []
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
  }
  return value
}, z.array(z.string()))

/**
 * The `schema` field holds JSON-LD, and models frequently return it as a
 * JSON-encoded string rather than a nested object — the whole generation then
 * fails validation. Parse a string back into an object before validating.
 */
function objectFromJson(value: unknown) {
  if (typeof value !== 'string') return value
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

const seoOutputSchema = z.object({
  seoTitle: z.string().describe('SEO-optimized title, 50-60 characters'),
  metaDescription: z.string().describe('Meta description, 150-160 characters'),
  slug: z.string().describe('URL-friendly slug derived from the title'),
  canonicalUrl: z.string().describe(`Full canonical URL using ${siteConfig.url}`),
  primaryKeyword: z.string().describe('Main keyword to target'),
  secondaryKeywords: stringArray.describe('3-5 secondary keywords'),
  excerpt: z.string().describe('2-4 sentence summary of the post for email newsletters and subscriber notifications. Should be compelling enough to drive click-through but substantive, not clickbait. Match the brand tone.'),
  schema: z.preprocess(objectFromJson, z.object({
    context: z.string(),
    type: z.string().describe('Use "TechArticle" for technical/how-to content, "BlogPosting" for opinion/commentary'),
    headline: z.string(),
    description: z.string(),
    abstract: z.string().describe('2-3 sentence summary that directly answers the core question of the article. AI search engines extract this as a featured answer.').optional(),
    url: z.string().describe('Canonical URL of the article'),
    mainEntityOfPage: z.object({
      type: z.string(),
      id: z.string(),
    }).optional(),
    isPartOf: z.object({
      type: z.string(),
      name: z.string(),
      url: z.string(),
    }).optional(),
    image: z.string().describe('OG image URL using the canonical URL + /og.png').optional(),
    thumbnailUrl: z.string().optional(),
    wordCount: z.number().optional(),
    isAccessibleForFree: z.boolean().optional(),
    author: z.object({
      type: z.string(),
      name: z.string(),
      url: z.string(),
      sameAs: stringArray,
    }).optional(),
    publisher: z.object({
      type: z.string(),
      name: z.string(),
      url: z.string(),
      logo: z.object({
        type: z.string(),
        url: z.string(),
      }),
    }).optional(),
    datePublished: z.string().optional(),
    dateModified: z.string().optional(),
    keywords: stringArray,
    articleSection: z.string().optional(),
    inLanguage: z.string().optional(),
    about: z.array(z.object({
      type: z.string(),
      name: z.string(),
      description: z.string(),
      sameAs: z.string().optional(),
    })).optional(),
    mentions: z.array(z.object({
      type: z.string(),
      name: z.string(),
      sameAs: z.string().optional(),
    })).optional(),
    audience: z.object({
      type: z.string(),
      audienceType: z.string(),
    }).optional(),
    speakable: z.object({
      type: z.string(),
      cssSelector: stringArray,
    }).optional(),
    hasPart: z.array(z.object({
      type: z.string(),
      name: z.string(),
      cssSelector: z.string(),
    })).optional(),
    faqPage: z.object({
      context: z.string(),
      type: z.string(),
      mainEntity: z.array(z.object({
        type: z.string(),
        name: z.string(),
        acceptedAnswer: z.object({
          type: z.string(),
          text: z.string(),
        }),
      })),
    }).nullish(),
    howTo: z.object({
      context: z.string(),
      type: z.string(),
      name: z.string(),
      description: z.string(),
      step: z.array(z.object({
        type: z.string(),
        name: z.string(),
        text: z.string(),
      })),
    }).nullish(),
  })),
})

/**
 * The AI SDK wraps validation failures a couple of layers deep, and its message
 * prints the whole candidate object rather than the field that failed. Walk the
 * cause chain to find the underlying Zod issues, which name the actual paths.
 */
function zodIssuePaths(error: unknown): string[] {
  let current = error as { issues?: unknown; cause?: unknown } | undefined
  for (let depth = 0; depth < 6 && current; depth += 1) {
    const issues = current.issues
    if (Array.isArray(issues)) {
      return issues.map((issue) => {
        const i = issue as { path?: unknown[]; message?: string; code?: string }
        const path = (i.path ?? []).join('.') || '(root)'
        return `${path}: ${i.message} [${i.code}]`
      })
    }
    current = current.cause as typeof current
  }
  return []
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, body: postBody, targetKeyword, audiencePersona } = body

    if (!title?.trim() || !postBody?.trim()) {
      return Response.json(
        { error: 'Title and body are required' },
        { status: 400 }
      )
    }

    const systemPrompt = `You are an expert SEO and AEO (Answer Engine Optimization) specialist for ${siteConfig.description} called "${siteConfig.name}" (${siteConfig.url}).

Your task is to generate comprehensive SEO metadata and structured schema that ranks in BOTH traditional search engines AND AI search engines (Perplexity, ChatGPT Search, Google AI Overviews).

CRITICAL TONE REQUIREMENTS:
- ${siteConfig.tone.description}
- Avoid: ${siteConfig.tone.avoid.join(', ')}

GOOD EXAMPLE: "${siteConfig.tone.goodExample}"
BAD EXAMPLE: "${siteConfig.tone.badExample}"

The audience is primarily ${siteConfig.audience.description}.

Generate content that optimizes for:
1. Google SEO - rich results, featured snippets, knowledge panels
2. AEO (Answer Engine Optimization) - AI assistants extracting direct answers
3. Social preview optimization - X, LinkedIn, Slack unfurls
4. Email newsletter excerpts - subscriber-facing summaries that drive click-through
5. Voice search - speakable structured data
6. E-E-A-T signals - author expertise, entity disambiguation

SCHEMA REQUIREMENTS:
- Use "https://schema.org" as the @context
- Use "TechArticle" as @type for technical/how-to content, "BlogPosting" for commentary/opinion
- Author: "${siteConfig.author.name}" with url "${siteConfig.author.url}"
- Publisher: "${siteConfig.publisher.name}" organization with url "${siteConfig.publisher.url}"
- Publisher logo: "${siteConfig.url}/logo.png" as ImageObject
- isPartOf: WebSite with name "${siteConfig.name}" and url "${siteConfig.url}"
- isAccessibleForFree: always true

AEO-SPECIFIC REQUIREMENTS:
- "abstract" MUST be a 2-3 sentence summary that directly answers the core question. AI search engines use this as their primary extraction point.
- "about" should be DefinedTerm objects with descriptions and sameAs links to Wikipedia or authoritative sources where applicable
- "mentions" should capture every tool, platform, company, or standard referenced
- "hasPart" should break the article into its major sections for AI content structure understanding
- Include HowTo schema ONLY for genuinely instructional content with clear steps
- Include FAQPage schema ONLY if the content naturally supports 2-4 FAQ questions
- Use today's date for datePublished and dateModified

Be concise and technical in all generated text.`

    const userPrompt = `Generate comprehensive SEO + AEO metadata and schema for this blog post:

TITLE: ${title}

BODY:
${postBody}

${targetKeyword ? `TARGET KEYWORD: ${targetKeyword}` : ''}
${audiencePersona ? `AUDIENCE PERSONA: ${audiencePersona}` : `AUDIENCE PERSONA: ${siteConfig.audience.defaultPersona}`}`

    const { output } = await generateText({
      model: getModel(),
      output: Output.object({
        schema: seoOutputSchema,
      }),
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      maxOutputTokens: 16000,
      temperature: 0.3,
    })

    return Response.json({ seo: output })
  } catch (error) {
    // "response did not match schema" on its own is undebuggable. Surface what
    // actually happened: whether the model ran out of output tokens, and which
    // fields failed validation.
    if (NoObjectGeneratedError.isInstance(error)) {
      const truncated = error.finishReason === 'length'
      const issues = zodIssuePaths(error.cause)
      console.error('SEO generation failed to match schema', {
        finishReason: error.finishReason,
        outputTokens: error.usage?.outputTokens,
        issues,
      })

      return Response.json(
        {
          error: truncated
            ? 'The model ran out of output tokens before finishing the schema. Try a shorter post body.'
            : 'The model returned data that did not fit the schema.',
          finishReason: error.finishReason,
          issues: zodIssuePaths(error.cause),
        },
        { status: 500 }
      )
    }

    console.error('SEO generation error:', error)
    const message = error instanceof Error ? error.message : 'Failed to generate SEO metadata'
    return Response.json({ error: message }, { status: 500 })
  }
}
