import { useState, useCallback, createElement } from 'react'
import { useDocumentOperation, useClient } from 'sanity'
import type { DocumentActionComponent, DocumentActionDialogProps } from 'sanity'
import { drawOgCard } from '@/lib/seo/og-canvas'

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

  return JSON.stringify(fixKeys(schema), null, 2)
}

/**
 * Generate a branded OG image (1200x630) using Canvas and return as a Blob.
 */
// PascalCase because Sanity invokes this as a React component (it uses hooks).
export const GenerateSeoAction: DocumentActionComponent = (props) => {
  const { draft, published } = props
  const { patch } = useDocumentOperation(props.id, props.type)
  const sanityClient = useClient({ apiVersion: '2024-01-01' })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)

  const doc = draft || published

  const handleGenerate = useCallback(async () => {
    if (!doc) return

    const title = (doc as { title?: string }).title
    const body = (doc as { body?: unknown[] }).body

    if (!title) {
      setError('Post needs a title before generating SEO.')
      return
    }

    if (!body || !Array.isArray(body) || body.length === 0) {
      setError('Post needs body content before generating SEO.')
      return
    }

    const plainText = portableTextToPlainText(body)
    if (!plainText.trim()) {
      setError('Post body appears to be empty.')
      return
    }

    setIsGenerating(true)
    setError(null)
    setCompleted(false)
    setStatus('Calling Claude to generate SEO metadata...')

    try {
      // Fire SEO API and OG image generation in parallel
      const [seoResponse, ogImageBlob] = await Promise.all([
        fetch('/api/generate-seo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, body: plainText }),
        }),
        drawOgCard(title),
      ])

      if (!seoResponse.ok) {
        const errData = await seoResponse.json().catch(() => ({}))
        throw new Error(errData.error || `API returned ${seoResponse.status}`)
      }

      setStatus('Parsing SEO response...')
      const data = await seoResponse.json()
      const seo = data.seo

      if (!seo) {
        throw new Error('No SEO data returned from API')
      }

      // Upload OG image to Sanity
      setStatus('Uploading OG image to Sanity...')
      const slug = (doc as { slug?: { current?: string } }).slug?.current || 'og-image'
      const imageAsset = await sanityClient.assets.upload('image', ogImageBlob, {
        filename: `${slug}-og.png`,
        contentType: 'image/png',
      })

      // Patch all fields at once
      setStatus('Saving all fields to document...')
      patch.execute([
        {
          set: {
            seoTitle: seo.seoTitle,
            metaDescription: seo.metaDescription,
            excerpt: seo.excerpt,
            primaryKeyword: seo.primaryKeyword,
            secondaryKeywords: seo.secondaryKeywords,
            schemaMarkup: formatSchemaForStorage(seo.schema),
            ogImage: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: imageAsset._id,
              },
            },
          },
        },
      ])

      setStatus('Done! All SEO fields + OG image have been populated.')
      setCompleted(true)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Generation failed'
      setError(msg)
      setStatus('')
    } finally {
      setIsGenerating(false)
    }
  }, [doc, patch, sanityClient])

  const dialog: DocumentActionDialogProps | null = dialogOpen
    ? {
        type: 'dialog',
        header: 'Generate SEO',
        onClose: () => {
          if (!isGenerating) {
            setDialogOpen(false)
            setError(null)
            setStatus('')
            setCompleted(false)
          }
        },
        content: createElement(
          'div',
          { style: { padding: '1rem', minWidth: 320 } },

          // Error message
          error &&
            createElement(
              'div',
              {
                style: {
                  padding: '12px 16px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 8,
                  marginBottom: 16,
                  color: '#f87171',
                  fontSize: 14,
                },
              },
              error
            ),

          // Status / progress
          status &&
            createElement(
              'div',
              {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  background: completed ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${completed ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: 8,
                  marginBottom: 16,
                  fontSize: 14,
                  color: completed ? '#4ade80' : 'inherit',
                },
              },
              !completed &&
                isGenerating &&
                createElement('span', {
                  style: {
                    display: 'inline-block',
                    width: 16,
                    height: 16,
                    border: '2px solid rgba(255, 255, 255, 0.15)',
                    borderTopColor: '#3ee07f',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  },
                }),
              completed && createElement('span', null, '\u2713'),
              status
            ),

          // Description (before generation starts)
          !isGenerating &&
            !completed &&
            !error &&
            createElement(
              'p',
              { style: { fontSize: 14, color: 'inherit', opacity: 0.7, marginBottom: 16 } },
              'This will use Claude AI to generate SEO title, meta description, excerpt, keywords, JSON-LD schema, and a branded OpenGraph image. The process takes 15-30 seconds.'
            ),

          // Buttons
          createElement(
            'div',
            { style: { display: 'flex', gap: 8, justifyContent: 'flex-end' } },
            !isGenerating &&
              !completed &&
              createElement(
                'button',
                {
                  onClick: () => {
                    setDialogOpen(false)
                    setError(null)
                  },
                  style: {
                    padding: '8px 16px',
                    borderRadius: 6,
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: 'transparent',
                    color: 'inherit',
                    cursor: 'pointer',
                    fontSize: 14,
                  },
                },
                'Cancel'
              ),
            !isGenerating &&
              !completed &&
              createElement(
                'button',
                {
                  onClick: handleGenerate,
                  style: {
                    padding: '8px 16px',
                    borderRadius: 6,
                    border: 'none',
                    background: '#3ee07f',
                    color: '#070a08',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 14,
                  },
                },
                'Generate'
              ),
            completed &&
              createElement(
                'button',
                {
                  onClick: () => {
                    setDialogOpen(false)
                    setCompleted(false)
                    setStatus('')
                  },
                  style: {
                    padding: '8px 16px',
                    borderRadius: 6,
                    border: 'none',
                    background: '#4ade80',
                    color: '#070a08',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 14,
                  },
                },
                'Close'
              )
          ),

          // Inline keyframe for spinner
          createElement('style', null, '@keyframes spin { to { transform: rotate(360deg) } }')
        ),
      }
    : null

  return {
    label: 'Generate SEO',
    disabled: !doc,
    title: 'Generate SEO metadata, schema, excerpt, and OG image using AI',
    onHandle: () => {
      setDialogOpen(true)
    },
    dialog,
  }
}
