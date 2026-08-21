'use client'

import { Copy, Check, Download } from 'lucide-react'
import { useState, useCallback } from 'react'
import { siteConfig } from '@/lib/seo/config'
import { drawOgCard } from '@/lib/seo/og-canvas'

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
  const handleCopyPrompt = async () => {
    if (!ogData?.prompt) return
    await navigator.clipboard.writeText(ogData.prompt)
    setPromptCopied(true)
    setTimeout(() => setPromptCopied(false), 2000)
  }

  const handleDownloadPNG = useCallback(async () => {
    setDownloading(true)
    try {
      const blob = await drawOgCard(title)
      const url = URL.createObjectURL(blob)

      // Download
      const link = document.createElement('a')
      link.download = `${title ? title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : 'og-image'}.png`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to generate PNG:', err)
    } finally {
      setDownloading(false)
    }
  }, [title])

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
          {/* Heritage ASCII crossed-mops art — mirrors drawOgCard */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mark-ascii-green.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 w-[52%] -translate-y-1/2 opacity-[0.09]"
            style={{ right: "-3%" }}
          />

          {/* Thin concentric line art — legacy motif, used sparingly */}
          <div
            className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-[0.07]"
            style={{ border: `1px solid ${siteConfig.colors.primary}` }}
          />

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
                className="font-mono text-xs font-bold tracking-[0.14em]"
                style={{ color: siteConfig.colors.primary }}
              >
                the mOperator
              </span>
            </div>

            <div className="space-y-2">
              <h3
                className="text-xl font-bold leading-tight line-clamp-3"
                style={{ color: siteConfig.colors.text }}
              >
                {title || 'Your post title'}
              </h3>
              <p
                className="font-mono text-sm"
                style={{ color: siteConfig.colors.textMuted }}
              >
                {siteConfig.domain}
              </p>
            </div>
          </div>

          {/* Accent rule along the bottom edge */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ backgroundColor: siteConfig.colors.primary }}
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
