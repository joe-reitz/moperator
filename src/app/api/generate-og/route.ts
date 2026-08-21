import { generateText } from 'ai'
import { siteConfig } from '@/lib/seo/config'
import { getModel } from '@/lib/seo/model'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, description } = body

    if (!title?.trim()) {
      return Response.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const { text: imagePrompt } = await generateText({
      model: getModel(),
      system: `You are an expert at writing prompts for AI image generation. Create prompts for professional, technical blog OpenGraph images that match the ${siteConfig.name} brand identity.

BRAND SPECIFICATIONS:
- Background: FLAT near-black, green-tinted (${siteConfig.colors.background}). Never a gradient.
- Accent: ${siteConfig.colors.primary} — the ONLY accent colour, with green glow effects
- Dimmed accent (sparingly): ${siteConfig.colors.secondary}
- Text: ${siteConfig.colors.text}; muted sage text: ${siteConfig.colors.textMuted}
- Typography: geometric sans-serif (${siteConfig.fonts.heading}) for display, monospace (${siteConfig.fonts.mono}) for labels and terminal lines

VISUAL STYLE:
${siteConfig.ogImage.style}

LOGO INTEGRATION:
${siteConfig.ogImage.logoDescription}`,
      messages: [
        {
          role: 'user',
          content: `Create a detailed image generation prompt for an OpenGraph image (1200x630) for a blog post titled: "${title}"

Description: ${description || title}

The image should incorporate the ${siteConfig.name} brand identity: phosphor green on flat near-black, the typographic mark, and — where it suits the composition — the heritage ASCII crossed-mops art as a faint background texture. Generate ONLY the prompt, nothing else.`,
        },
      ],
      maxOutputTokens: 500,
      temperature: 0.7,
    })

    return Response.json({
      prompt: imagePrompt,
      imageUrl: null,
      message: 'Image prompt generated. Connect an image generation service (fal.ai, DALL-E) to generate the actual image.'
    })
  } catch (error) {
    console.error('OG generation error:', error)
    const message = error instanceof Error ? error.message : 'Failed to generate OG image prompt'
    return Response.json({ error: message }, { status: 500 })
  }
}
