'use client'

import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/**
 * False during SSR and the first client render, true afterwards.
 *
 * `useSyncExternalStore` with differing server/client snapshots is the
 * supported way to express this — it avoids a setState-in-effect, which
 * causes an extra cascading render.
 */
export function useIsHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}
