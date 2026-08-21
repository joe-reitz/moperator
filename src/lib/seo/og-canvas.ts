import { siteConfig } from './config'

const W = 1200
const H = 630
const PAD = 48
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
const SANS = 'system-ui, -apple-system, sans-serif'

/** Opacity of the heritage ASCII texture. The brand guide specifies 6-10%. */
const ART_OPACITY = 0.09

/**
 * Draws a branded 1200x630 OG card on a canvas and returns it as a PNG blob.
 *
 * Browser-only — it uses `document` and `Image`. Shared by the Sanity document
 * action and the standalone SEO tool, which previously carried two drifting
 * copies of this drawing code.
 *
 * Brand rules applied here: flat background (no gradients, no radial glow
 * washes), one accent colour, and the crossed-mops ASCII art as the illustration
 * layer. The logo is typographic, so the mark is never drawn as a picture.
 */
export async function drawOgCard(title: string): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // Flat field
  ctx.fillStyle = siteConfig.colors.background
  ctx.fillRect(0, 0, W, H)

  // Heritage ASCII crossed-mops art — illustration only, never the logo
  try {
    const art = new Image()
    art.src = '/mark-ascii-green.png'
    await new Promise<void>((resolve, reject) => {
      art.onload = () => resolve()
      art.onerror = reject
    })
    const artW = 620
    const artH = artW * (art.height / art.width || 541 / 760)
    ctx.globalAlpha = ART_OPACITY
    ctx.drawImage(art, W - artW + 40, (H - artH) / 2, artW, artH)
    ctx.globalAlpha = 1
  } catch {
    // Decorative: a failed load must not fail the card.
  }

  // Thin concentric line art — legacy motif, used sparingly
  ctx.strokeStyle = `${siteConfig.colors.primary}12`
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(PAD + 40, H - PAD - 40, 150, 0, Math.PI * 2)
  ctx.stroke()

  // Top-left badge: glowing dot plus the mono wordmark
  ctx.fillStyle = siteConfig.colors.primary
  ctx.shadowColor = `${siteConfig.colors.primary}99`
  ctx.shadowBlur = 10
  ctx.beginPath()
  ctx.arc(PAD + 7, PAD + 9, 7, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0
  ctx.shadowColor = 'transparent'

  ctx.font = `700 15px ${MONO}`
  ctx.fillStyle = siteConfig.colors.primary
  ctx.textBaseline = 'middle'
  ctx.letterSpacing = '2px'
  ctx.fillText('the mOperator', PAD + 24, PAD + 9)
  ctx.letterSpacing = '0px'

  // Domain
  ctx.font = `400 20px ${MONO}`
  ctx.fillStyle = siteConfig.colors.textMuted
  ctx.textBaseline = 'alphabetic'
  const domainY = H - PAD
  ctx.fillText(siteConfig.domain, PAD, domainY)

  // Title, wrapped to at most three lines
  ctx.font = `700 46px ${SANS}`
  ctx.fillStyle = siteConfig.colors.text
  const maxWidth = W - PAD * 2 - 60
  const lines: string[] = []
  let currentLine = ''
  for (const word of (title || 'Your post title').split(' ')) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }
  if (currentLine) lines.push(currentLine)

  const displayLines = lines.slice(0, 3)
  if (lines.length > 3) {
    displayLines[2] = `${displayLines[2].replace(/\s+\S+$/, '')}...`
  }

  const lineHeight = 56
  const titleBottomY = domainY - 36
  for (let i = displayLines.length - 1; i >= 0; i -= 1) {
    const y = titleBottomY - (displayLines.length - 1 - i) * lineHeight
    ctx.fillText(displayLines[i], PAD, y)
  }

  // Accent rule along the bottom edge
  ctx.fillStyle = siteConfig.colors.primary
  ctx.fillRect(0, H - 4, W, 4)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png')
  })
}
