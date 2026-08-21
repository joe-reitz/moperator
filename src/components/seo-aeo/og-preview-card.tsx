'use client'

import { Copy, Check, Download } from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'
import { siteConfig } from '@/lib/seo/config'

interface OGPreviewData {
  prompt: string
  imageUrl: string | null
  message?: string
}

interface OGPreviewCardProps {
  ogData: OGPreviewData | null
  title: string
}

export function OGPreviewCard({ ogData, title }: OGPreviewCardProps) {
  const [promptCopied, setPromptCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [logoDataUri, setLogoDataUri] = useState<string | null>(null)

  useEffect(() => {
    fetch('/icon.svg')
      .then(res => res.text())
      .then(svg => {
        setLogoDataUri(`data:image/svg+xml;base64,${btoa(svg)}`)
      })
      .catch(() => {})
  }, [])

  const handleCopyPrompt = async () => {
    if (!ogData?.prompt) return
    await navigator.clipboard.writeText(ogData.prompt)
    setPromptCopied(true)
    setTimeout(() => setPromptCopied(false), 2000)
  }

  const handleDownloadPNG = useCallback(async () => {
    setDownloading(true)
    try {
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

      // Logo
      if (logoDataUri) {
        const img = new Image()
        img.src = logoDataUri
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve()
          img.onerror = reject
        })
        const logoSize = 320
        const logoX = (W - logoSize) / 2
        const logoY = (H - logoSize) / 2 - H * 0.15
        ctx.globalAlpha = 0.4
        ctx.drawImage(img, logoX, logoY, logoSize, logoSize)
        ctx.globalAlpha = 1
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

      // Domain text
      ctx.font = '400 22px system-ui, -apple-system, sans-serif'
      ctx.fillStyle = siteConfig.colors.textMuted
      ctx.textBaseline = 'alphabetic'
      const domainY = H - pad
      ctx.fillText(siteConfig.domain, pad, domainY)

      // Title text (word-wrapped)
      ctx.font = '600 42px system-ui, -apple-system, sans-serif'
      ctx.fillStyle = siteConfig.colors.text
      const displayTitle = title || 'Your Post Title'
      const words = displayTitle.split(' ')
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

      // Download
      const link = document.createElement('a')
      link.download = `${title ? title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : 'og-image'}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Failed to generate PNG:', err)
    } finally {
      setDownloading(false)
    }
  }, [title, logoDataUri])

  if (!ogData) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-surface p-6">
        <h3 className="text-base font-medium text-foreground mb-2">OpenGraph Image Preview</h3>
        <p className="text-sm text-muted">
          OG image preview and prompt will appear here after generation.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden">
      <div className="px-6 pt-5 pb-3">
        <h3 className="text-base font-medium text-foreground">OpenGraph Image Preview</h3>
      </div>
      <div className="px-6 pb-6 space-y-4">
        {/* OG Image Preview */}
        <div
          className="aspect-[1200/630] w-full rounded-lg relative overflow-hidden"
          style={{
            background: siteConfig.colors.background,
          }}
        >
          {/* Grid texture */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `linear-gradient(${siteConfig.colors.primary}26 1px, transparent 1px), linear-gradient(90deg, ${siteConfig.colors.primary}26 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Geometric elements */}
          <div
            className="absolute top-8 left-8 w-16 h-16 rounded-full opacity-[0.06]"
            style={{ border: `1px solid ${siteConfig.colors.primary}` }}
          />
          <div
            className="absolute bottom-12 right-24 w-24 h-24 rounded-full opacity-[0.04]"
            style={{ border: `1px solid ${siteConfig.colors.secondary}` }}
          />

          {/* Center logo */}
          <div className="absolute inset-0 flex items-center justify-center -translate-y-[15%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoDataUri || '/icon.svg'}
              alt=""
              className="w-40 h-40 opacity-40"
            />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: siteConfig.colors.primary,
                  boxShadow: `0 0 8px ${siteConfig.colors.primary}99`,
                }}
              />
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: siteConfig.colors.primary }}
              >
                {siteConfig.name}
              </span>
            </div>

            <div className="space-y-2">
              <h3
                className="text-xl font-semibold leading-tight line-clamp-3"
                style={{ color: siteConfig.colors.text }}
              >
                {title || 'Your Post Title'}
              </h3>
              <p className="text-sm" style={{ color: siteConfig.colors.textMuted }}>
                {siteConfig.domain}
              </p>
            </div>
          </div>

          {/* Accent glows */}
          <div
            className="absolute top-0 right-0 w-40 h-40"
            style={{
              background: `radial-gradient(circle at top right, ${siteConfig.colors.primary}26 0%, transparent 70%)`,
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-32 h-32"
            style={{
              background: `radial-gradient(circle at bottom left, ${siteConfig.colors.secondary}14 0%, transparent 70%)`,
            }}
          />
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownloadPNG}
          disabled={downloading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-foreground hover:border-muted transition-colors disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" />
          {downloading ? 'Generating...' : 'Download PNG (1200x630)'}
        </button>

        {/* Image Prompt */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted uppercase tracking-wide">
              Image Generation Prompt
            </span>
            <button
              onClick={handleCopyPrompt}
              className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors"
            >
              {promptCopied ? (
                <>
                  <Check className="h-3 w-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  Copy
                </>
              )}
            </button>
          </div>
          <div className="rounded-lg bg-background p-3 text-xs text-muted font-mono">
            {ogData.prompt}
          </div>
        </div>
      </div>
    </div>
  )
}
