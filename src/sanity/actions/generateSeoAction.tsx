import { useState, useCallback } from 'react'
import { useDocumentOperation } from 'sanity'
import type { DocumentActionComponent } from 'sanity'

/**
 * Extract plain text from Portable Text blocks.
 */
function portableTextToPlainText(blocks: unknown[]): string {
  if (!Array.isArray(blocks)) return ''

  return blocks
    .filter((block: unknown): block is { _type: string; children?: Array<{ text?: string }> } =>
      typeof block === 'object' && block !== null && '_type' in block
    )
    .map((block) => {
      if (block._type !== 'block' || !block.children) return ''
      return block.children
        .map((child) => child.text || '')
        .join('')
    })
    .filter(Boolean)
    .join('\n\n')
}

/**
 * Format schema data for JSON-LD storage.
 */
function formatSchemaForStorage(schema: Record<string, unknown>): string {
  const formatted: Record<string, unknown> = { ...schema }

  // Replace `type` with `@type` and `context` with `@context`
  if ('context' in formatted) {
    formatted['@context'] = formatted.context
    delete formatted.context
  }
  if ('type' in formatted) {
    formatted['@type'] = formatted.type
    delete formatted.type
  }

  // Recursively fix nested objects
  const fixKeys = (obj: unknown): unknown => {
    if (Array.isArray(obj)) return obj.map(fixKeys)
    if (obj && typeof obj === 'object') {
      const result: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
        const newKey = key === 'type' ? '@type' : key === 'context' ? '@context' : key === 'id' ? '@id' : key
        result[newKey] = fixKeys(value)
      }
      return result
    }
    return obj
  }

  return JSON.stringify(fixKeys(formatted), null, 2)
}

export const generateSeoAction: DocumentActionComponent = (props) => {
  const { draft, published } = props
  const { patch } = useDocumentOperation(props.id, props.type)
  const [isGenerating, setIsGenerating] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const doc = draft || published

  const handleGenerate = useCallback(async () => {
    if (!doc) return

    const title = (doc as { title?: string }).title
    const body = (doc as { body?: unknown[] }).body

    if (!title) {
      setStatus('Post needs a title before generating SEO.')
      return
    }

    if (!body || !Array.isArray(body) || body.length === 0) {
      setStatus('Post needs body content before generating SEO.')
      return
    }

    const plainText = portableTextToPlainText(body)
    if (!plainText.trim()) {
      setStatus('Post body appears to be empty.')
      return
    }

    setIsGenerating(true)
    setStatus('Generating SEO metadata...')

    try {
      const response = await fetch('/api/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          body: plainText,
        }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to generate SEO metadata')
      }

      const data = await response.json()
      const seo = data.seo

      if (!seo) {
        throw new Error('No SEO data returned')
      }

      // Patch the document with generated SEO data
      patch.execute([
        {
          set: {
            seoTitle: seo.seoTitle,
            metaDescription: seo.metaDescription,
            excerpt: seo.excerpt,
            primaryKeyword: seo.primaryKeyword,
            secondaryKeywords: seo.secondaryKeywords,
            schemaMarkup: formatSchemaForStorage(seo.schema),
          },
        },
      ])

      setStatus('SEO fields updated successfully.')
      setTimeout(() => setStatus(null), 3000)
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Generation failed.')
      setTimeout(() => setStatus(null), 5000)
    } finally {
      setIsGenerating(false)
    }
  }, [doc, patch])

  return {
    label: isGenerating ? 'Generating SEO...' : 'Generate SEO',
    disabled: isGenerating || !doc,
    title: status || 'Generate SEO metadata, schema, and excerpt using AI',
    onHandle: handleGenerate,
  }
}
