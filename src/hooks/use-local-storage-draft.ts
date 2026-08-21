'use client'

import { useCallback } from 'react'
import { useIsHydrated } from './use-is-hydrated'

const STORAGE_KEY = 'seo-optimizer-draft:v1'

interface DraftData {
  title: string
  body: string
  targetKeyword: string
  audiencePersona: string
  savedAt: number
}

export function useLocalStorageDraft() {
  const isHydrated = useIsHydrated()

  const saveDraft = useCallback((data: Omit<DraftData, 'savedAt'>) => {
    if (typeof window === 'undefined') return
    const draft: DraftData = { ...data, savedAt: Date.now() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
  }, [])

  const loadDraft = useCallback((): Omit<DraftData, 'savedAt'> | null => {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    try {
      const draft: DraftData = JSON.parse(stored)
      if (Date.now() - draft.savedAt < 7 * 24 * 60 * 60 * 1000) {
        return {
          title: draft.title,
          body: draft.body,
          targetKeyword: draft.targetKeyword,
          audiencePersona: draft.audiencePersona,
        }
      }
    } catch {
      // Invalid data
    }
    return null
  }, [])

  const clearDraft = useCallback(() => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const hasDraft = useCallback((): boolean => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(STORAGE_KEY) !== null
  }, [])

  return { saveDraft, loadDraft, clearDraft, hasDraft, isHydrated }
}
