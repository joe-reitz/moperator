'use client'

import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface SEOMetadata {
  seoTitle: string
  metaDescription: string
  slug: string
  canonicalUrl: string
  primaryKeyword: string
  secondaryKeywords: string[]
  excerpt: string
}

interface SEOMetadataCardProps {
  metadata: SEOMetadata | null
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="text-muted hover:text-foreground transition-colors"
      title={`Copy ${label}`}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}

function MetadataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted uppercase tracking-wide">
          {label}
        </span>
        <CopyButton text={value} label={label} />
      </div>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  )
}

export function SEOMetadataCard({ metadata }: SEOMetadataCardProps) {
  if (!metadata) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-surface p-6">
        <h3 className="text-base font-medium text-foreground mb-2">SEO Metadata</h3>
        <p className="text-sm text-muted">
          Enter your post content and generate to see SEO metadata.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden">
      <div className="px-6 pt-5 pb-3">
        <h3 className="text-base font-medium text-foreground">SEO Metadata</h3>
      </div>
      <div className="px-6 pb-6 space-y-4">
        <MetadataRow label="SEO Title" value={metadata.seoTitle} />
        <MetadataRow label="Meta Description" value={metadata.metaDescription} />
        <MetadataRow label="Excerpt" value={metadata.excerpt} />
        <MetadataRow label="Slug" value={metadata.slug} />
        <MetadataRow label="Canonical URL" value={metadata.canonicalUrl} />
        <MetadataRow label="Primary Keyword" value={metadata.primaryKeyword} />

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted uppercase tracking-wide">
              Secondary Keywords
            </span>
            <CopyButton text={metadata.secondaryKeywords.join(', ')} label="Secondary Keywords" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {metadata.secondaryKeywords.map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-surface-elevated text-foreground"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
