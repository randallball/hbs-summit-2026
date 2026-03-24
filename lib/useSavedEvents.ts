'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'hbs-saved'

export function useSavedEvents(): [string[], (id: string) => void] {
  const [savedIds, setSavedIds] = useState<string[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          setSavedIds(JSON.parse(stored))
        }
      } catch {
        // ignore
      }
    }
  }, [])

  const toggleSave = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        } catch {
          // ignore
        }
      }
      return next
    })
  }, [])

  return [savedIds, toggleSave]
}
