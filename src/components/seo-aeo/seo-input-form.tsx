'use client'

import { Loader2, Command } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const ReactMarkdown = dynamic(() => import('react-markdown'), {
  loading: () => (
    <div className="min-h-[300px] rounded-lg border border-border bg-surface p-4 text-muted text-sm">
      Loading preview...
    </div>
  ),
})

const WORD_SPLIT_RE = /\s+/

interface SEOInputFormProps {
  title: string
  setTitle: (value: string) => void
  body: string
  setBody: (value: string) => void
  targetKeyword: string
  setTargetKeyword: (value: string) => void
  audiencePersona: string
  setAudiencePersona: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
}

function CharacterCount({ current, min, max }: { current: number; min: number; max: number }) {
  const isOptimal = current >= min && current <= max
  const isOver = current > max

  return (
    <span
      className={`text-xs ${
        isOptimal ? 'text-green-500' : isOver ? 'text-accent' : 'text-muted'
      }`}
    >
      {current}/{max} chars
      {isOptimal && ' (optimal)'}
      {isOver && ' (too long)'}
    </span>
  )
}

export function SEOInputForm({
  title,
  setTitle,
  body,
  setBody,
  targetKeyword,
  setTargetKeyword,
  audiencePersona,
  setAudiencePersona,
  onSubmit,
  isLoading,
}: SEOInputFormProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')
  const canSubmit = !isLoading && title.trim().length > 0 && body.trim().length > 0

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="title" className="text-sm font-medium text-foreground">
            Post Title
          </label>
          <CharacterCount current={title.length} min={30} max={70} />
        </div>
        <input
          id="title"
          type="text"
          placeholder="How to Structure Campaign Objects in Salesforce"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
        />
      </div>

      {/* Body with Write/Preview Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="body" className="text-sm font-medium text-foreground">
            Post Body
          </label>
          <span className="text-xs text-muted">
            {body.split(WORD_SPLIT_RE).filter(Boolean).length} words
          </span>
        </div>
        <div className="w-full">
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab('write')}
              className={`px-4 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'write'
                  ? 'text-accent border-b-2 border-accent -mb-px'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Write
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'text-accent border-b-2 border-accent -mb-px'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Preview
            </button>
          </div>
          {activeTab === 'write' ? (
            <textarea
              id="body"
              placeholder="Paste your blog post content here (markdown supported)..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="mt-2 w-full min-h-[300px] rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground font-mono placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors resize-y"
            />
          ) : (
            <div className="mt-2 min-h-[300px] rounded-lg border border-border bg-surface p-4 article-content text-sm overflow-auto">
              {body ? (
                <ReactMarkdown>{body}</ReactMarkdown>
              ) : (
                <p className="text-muted italic">Nothing to preview yet...</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Target Keyword */}
      <div className="space-y-2">
        <label htmlFor="keyword" className="text-sm text-muted">
          Target Keyword <span className="text-xs">(optional)</span>
        </label>
        <input
          id="keyword"
          type="text"
          placeholder="salesforce campaign structure"
          value={targetKeyword}
          onChange={(e) => setTargetKeyword(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
        />
      </div>

      {/* Audience Persona */}
      <div className="space-y-2">
        <label htmlFor="persona" className="text-sm text-muted">
          Audience Persona <span className="text-xs">(optional)</span>
        </label>
        <input
          id="persona"
          type="text"
          placeholder="Marketing Ops leader, RevOps IC, Founder"
          value={audiencePersona}
          onChange={(e) => setAudiencePersona(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
        />
      </div>

      {/* Generate Button */}
      <div className="space-y-2">
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="w-full rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-background hover:bg-accent-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate SEO + OG'
          )}
        </button>
        <p className="text-xs text-muted text-center flex items-center justify-center gap-1">
          <Command className="h-3 w-3" />
          <span>+ Enter to generate</span>
        </p>
      </div>
    </div>
  )
}
