'use client'

import { useState, useMemo, useCallback } from 'react'
import { useIsHydrated } from './use-is-hydrated'

const HISTORY_KEY = 'seo-optimizer-history:v1'
const MAX_HISTORY_ITEMS = 10

export interface HistoryItem {
  id: string
  title: string
  seoTitle: string
  metaDescription: string
  slug: string
  ogPrompt: string
  createdAt: number
}

function readStoredHistory(): HistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY)
    return stored ? (JSON.parse(stored) as HistoryItem[]) : []
  } catch {
    return []
  }
}

export function useGenerationHistory() {
  const isHydrated = useIsHydrated()

  // Read once on the first client render rather than syncing via an effect,
  // which would cost an extra render pass.
  const storedHistory = useMemo(
    () => (isHydrated ? readStoredHistory() : []),
    [isHydrated]
  )

  // Only set once the user actually mutates the list.
  const [localHistory, setLocalHistory] = useState<HistoryItem[] | null>(null)
  const history = localHistory ?? storedHistory

  const addToHistory = useCallback((item: Omit<HistoryItem, 'id' | 'createdAt'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    }

    setLocalHistory(prev => {
      const current = prev ?? readStoredHistory()
      const updated = [newItem, ...current].slice(0, MAX_HISTORY_ITEMS)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    setLocalHistory([])
    localStorage.removeItem(HISTORY_KEY)
  }, [])

  const getHistoryItem = useCallback((id: string): HistoryItem | undefined => {
    return history.find(item => item.id === id)
  }, [history])

  return { history, addToHistory, clearHistory, getHistoryItem, isHydrated }
}
