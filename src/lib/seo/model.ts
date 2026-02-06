import { siteConfig } from '@/lib/seo/config'

/**
 * Returns the configured AI model.
 *
 * On Vercel: uses AI Gateway via the string format "anthropic/model-id".
 * For local development: set ANTHROPIC_API_KEY in .env.local.
 */
export function getModel() {
  if (process.env.ANTHROPIC_API_KEY) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { anthropic } = require('@ai-sdk/anthropic')
    return anthropic(siteConfig.model.id)
  }

  return `anthropic/${siteConfig.model.id}`
}
