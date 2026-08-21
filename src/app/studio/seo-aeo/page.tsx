'use client'

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from 'react'
import { SEOInputForm } from '@/components/seo-aeo/seo-input-form'
import { SEOMetadataCard } from '@/components/seo-aeo/seo-metadata-card'
import { SchemaCard } from '@/components/seo-aeo/schema-card'
import { OGPreviewCard } from '@/components/seo-aeo/og-preview-card'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { useLocalStorageDraft } from '@/hooks/use-local-storage-draft'
import { useGenerationHistory } from '@/hooks/use-generation-history'
import { siteConfig } from '@/lib/seo/config'

interface SEOResult {
  seoTitle: string
  metaDescription: string
  slug: string
  canonicalUrl: string
  primaryKeyword: string
  secondaryKeywords: string[]
  excerpt: string
  schema: {
    context: string
    type: string
    headline: string
    description: string
    abstract: string
    url: string
    mainEntityOfPage: { type: string; id: string }
    isPartOf: { type: string; name: string; url: string }
    image: string
    thumbnailUrl: string
    wordCount: number
    isAccessibleForFree: boolean
    author: { type: string; name: string; url: string; sameAs: string[] }
    publisher: { type: string; name: string; url: string; logo: { type: string; url: string } }
    datePublished: string
    dateModified: string
    keywords: string[]
    articleSection: string
    inLanguage: string
    about: Array<{ type: string; name: string; description: string; sameAs?: string }>
    mentions: Array<{ type: string; name: string; sameAs?: string }>
    audience: { type: string; audienceType: string }
    speakable: { type: string; cssSelector: string[] }
    hasPart: Array<{ type: string; name: string; cssSelector: string }>
    faqPage: {
      context: string
      type: string
      mainEntity: Array<{
        type: string
        name: string
        acceptedAnswer: { type: string; text: string }
      }>
    } | null
    howTo: {
      context: string
      type: string
      name: string
      description: string
      step: Array<{ type: string; name: string; text: string }>
    } | null
  }
}

interface OGResult {
  prompt: string
  imageUrl: string | null
  message?: string
}

export default function SEOOptimizerPage() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [targetKeyword, setTargetKeyword] = useState('')
  const [audiencePersona, setAudiencePersona] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [seoResult, setSeoResult] = useState<SEOResult | null>(null)
  const [ogResult, setOgResult] = useState<OGResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { saveDraft, loadDraft, clearDraft, isHydrated } = useLocalStorageDraft()
  const { addToHistory, history, clearHistory } = useGenerationHistory()

  // Restore draft once hydration completes. This has to be an effect: the
  // server has no localStorage, so seeding the initial state from it would
  // produce a hydration mismatch, and reading it during render would make
  // render impure. It runs at most once.
  useEffect(() => {
    if (!isHydrated) return
    const draft = loadDraft()
    if (draft) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(draft.title)
      setBody(draft.body)
      setTargetKeyword(draft.targetKeyword)
      setAudiencePersona(draft.audiencePersona)
    }
  }, [isHydrated, loadDraft])

  // Auto-save draft
  useEffect(() => {
    if (!isHydrated) return
    if (!title && !body) return
    const timer = setTimeout(() => {
      saveDraft({ title, body, targetKeyword, audiencePersona })
    }, 1000)
    return () => clearTimeout(timer)
  }, [title, body, targetKeyword, audiencePersona, saveDraft, isHydrated])

  const handleGenerate = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [seoResponse, ogResponse] = await Promise.all([
        fetch('/api/generate-seo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, body, targetKeyword, audiencePersona }),
        }),
        fetch('/api/generate-og', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description: '' }),
        }),
      ])

      if (!seoResponse.ok) {
        const errData = await seoResponse.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to generate SEO metadata')
      }

      const seoData = await seoResponse.json()
      setSeoResult(seoData.seo)

      if (!ogResponse.ok) {
        const errData = await ogResponse.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to generate OG image prompt')
      }

      const ogData = await ogResponse.json()
      setOgResult(ogData)

      if (seoData.seo) {
        addToHistory({
          title,
          seoTitle: seoData.seo.seoTitle,
          metaDescription: seoData.seo.metaDescription,
          slug: seoData.seo.slug,
          ogPrompt: ogData.prompt || '',
        })
      }

      clearDraft()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [title, body, targetKeyword, audiencePersona, addToHistory, clearDraft])

  const canGenerate = !isLoading && title.trim().length > 0 && body.trim().length > 0

  useKeyboardShortcuts({ onGenerate: handleGenerate, canGenerate })

  const handleLoadFromHistory = useCallback((item: typeof history[number]) => {
    setTitle(item.title)
    setSeoResult(null)
    setOgResult(null)
  }, [])

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/icon.svg" alt="" width={32} height={32} unoptimized className="h-8 w-auto" />
              </Link>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {siteConfig.name} SEO Optimizer
              </h1>
            </div>
            <p className="mt-1 text-sm text-muted">
              Generate SEO metadata, structured schema, and OG images for {siteConfig.domain}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {history.length > 0 && (
              <span className="hidden sm:block text-xs text-muted">
                {history.length} generation{history.length !== 1 ? 's' : ''} saved
              </span>
            )}
            <Link
              href="/studio"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted hover:text-foreground hover:border-muted transition-colors"
            >
              Back to Studio
            </Link>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 rounded-lg border border-danger/30 bg-danger/10 p-4">
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        {/* History Bar */}
        {history.length > 0 && (
          <div className="mb-6 rounded-lg border border-border bg-surface p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted uppercase tracking-wide">
                Recent Generations
              </span>
              <button
                onClick={clearHistory}
                className="text-xs text-muted hover:text-foreground transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {history.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleLoadFromHistory(item)}
                  className="shrink-0 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:bg-surface-elevated transition-colors max-w-[200px] truncate"
                  title={item.title}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left - Input */}
          <div>
            <div className="rounded-lg border border-border bg-surface p-6">
              <SEOInputForm
                title={title}
                setTitle={setTitle}
                body={body}
                setBody={setBody}
                targetKeyword={targetKeyword}
                setTargetKeyword={setTargetKeyword}
                audiencePersona={audiencePersona}
                setAudiencePersona={setAudiencePersona}
                onSubmit={handleGenerate}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Right - Output */}
          <div className="flex flex-col gap-6">
            <SEOMetadataCard
              metadata={
                seoResult
                  ? {
                      seoTitle: seoResult.seoTitle,
                      metaDescription: seoResult.metaDescription,
                      slug: seoResult.slug,
                      canonicalUrl: seoResult.canonicalUrl,
                      primaryKeyword: seoResult.primaryKeyword,
                      secondaryKeywords: seoResult.secondaryKeywords,
                      excerpt: seoResult.excerpt,
                    }
                  : null
              }
            />
            <SchemaCard schema={seoResult?.schema || null} />
            <OGPreviewCard ogData={ogResult} title={title} />
          </div>
        </div>
      </div>
    </main>
  )
}
