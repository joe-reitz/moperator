import { useState, useCallback, createElement } from 'react'
import { useDocumentOperation, useClient } from 'sanity'
import type { DocumentActionComponent, DocumentActionDialogProps } from 'sanity'
import { siteConfig } from '@/lib/seo/config'

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
async function generateOGImageBlob(title: string): Promise<Blob> {
  const W = 1200
  const H = 630
  const pad = 48
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, siteConfig.colors.background)
  bg.addColorStop(1, siteConfig.colors.backgroundGradientEnd)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // Grid overlay
  ctx.strokeStyle = `${siteConfig.colors.primary}14`
  ctx.lineWidth = 1
  for (let x = 0; x <= W; x += 48) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
  }
  for (let y = 0; y <= H; y += 48) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
  }

  // Decorative circles
  ctx.strokeStyle = `${siteConfig.colors.primary}10`
  ctx.lineWidth = 2
  ctx.beginPath(); ctx.arc(pad + 64, pad + 64, 64, 0, Math.PI * 2); ctx.stroke()
  ctx.strokeStyle = `${siteConfig.colors.secondary}0A`
  ctx.beginPath(); ctx.arc(W - 144, H - 96, 96, 0, Math.PI * 2); ctx.stroke()

  // Radial glow accents
  const topGlow = ctx.createRadialGradient(W, 0, 0, W, 0, 320)
  topGlow.addColorStop(0, `${siteConfig.colors.primary}26`)
  topGlow.addColorStop(1, 'transparent')
  ctx.fillStyle = topGlow
  ctx.fillRect(W - 320, 0, 320, 320)

  const bottomGlow = ctx.createRadialGradient(0, H, 0, 0, H, 256)
  bottomGlow.addColorStop(0, `${siteConfig.colors.secondary}14`)
  bottomGlow.addColorStop(1, 'transparent')
  ctx.fillStyle = bottomGlow
  ctx.fillRect(0, H - 256, 256, 256)

  // Try to load and draw the logo
  try {
    const svgRes = await fetch('/icon.svg')
    const svgText = await svgRes.text()
    const logoDataUri = `data:image/svg+xml;base64,${btoa(svgText)}`
    const img = new Image()
    img.src = logoDataUri
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = reject
    })
    const logoSize = 320
    ctx.globalAlpha = 0.4
    ctx.drawImage(img, (W - logoSize) / 2, (H - logoSize) / 2 - H * 0.15, logoSize, logoSize)
    ctx.globalAlpha = 1
  } catch {
    // Logo load failed, continue without it
  }

  // Top badge
  ctx.fillStyle = siteConfig.colors.primary
  ctx.shadowColor = `${siteConfig.colors.primary}99`
  ctx.shadowBlur = 8
  ctx.beginPath(); ctx.arc(pad + 8, pad + 8, 8, 0, Math.PI * 2); ctx.fill()
  ctx.shadowBlur = 0
  ctx.shadowColor = 'transparent'

  ctx.font = '600 16px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = siteConfig.colors.primary
  ctx.textBaseline = 'middle'
  ctx.fillText(siteConfig.name.toUpperCase(), pad + 24, pad + 8)

  // Domain
  ctx.font = '400 22px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = siteConfig.colors.textMuted
  ctx.textBaseline = 'alphabetic'
  const domainY = H - pad
  ctx.fillText(siteConfig.domain, pad, domainY)

  // Title (word-wrapped)
  ctx.font = '600 42px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = siteConfig.colors.text
  const words = title.split(' ')
  const maxWidth = W - pad * 2
  const lines: string[] = []
  let currentLine = ''
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    if (ctx.measureText(testLine).width > maxWidth) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }
  if (currentLine) lines.push(currentLine)
  const displayLines = lines.slice(0, 3)
  if (lines.length > 3) {
    displayLines[2] = displayLines[2].replace(/\s+\S+$/, '...')
  }

  const lineHeight = 52
  const titleBottomY = domainY - 32
  for (let i = displayLines.length - 1; i >= 0; i--) {
    const y = titleBottomY - (displayLines.length - 1 - i) * lineHeight
    ctx.fillText(displayLines[i], pad, y)
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png')
  })
}

export const generateSeoAction: DocumentActionComponent = (props) => {
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
        generateOGImageBlob(title),
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
                    borderTopColor: '#f59e0b',
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
                    background: '#f59e0b',
                    color: '#0c0c0f',
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
                    color: '#0c0c0f',
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
