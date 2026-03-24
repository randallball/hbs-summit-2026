'use client'

import { useState, useMemo } from 'react'
import SpeakerCard from './SpeakerCard'
import { ScheduleEvent, extractSpeakers, SpeakerWithEvent } from '@/lib/utils'

interface SpeakersTabProps {
  schedule: ScheduleEvent[]
}

type SortMode = 'event' | 'az'

export default function SpeakersTab({ schedule }: SpeakersTabProps) {
  const [sortMode, setSortMode] = useState<SortMode>('event')
  const [query, setQuery] = useState('')

  const allSpeakers = useMemo(() => extractSpeakers(schedule), [schedule])

  const filteredSpeakers = useMemo(() => {
    if (!query) return allSpeakers
    const q = query.toLowerCase()
    return allSpeakers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.company || '').toLowerCase().includes(q) ||
        (s.industry || '').toLowerCase().includes(q)
    )
  }, [allSpeakers, query])

  const sorted = useMemo(() => {
    if (sortMode === 'az') {
      return [...filteredSpeakers].sort((a, b) => a.name.localeCompare(b.name))
    }
    // By event: keynotes first (Shayne, JD, Alejandro), then panels, then others
    const keynoteOrder: Record<string, number> = {
      'Shayne Coplan': 0,
      'JD Ross': 1,
      'Alejandro Matamala-Ortiz': 2,
    }
    return [...filteredSpeakers].sort((a, b) => {
      const typeOrder: Record<string, number> = { keynote: 0, panel: 1, session: 2, logistics: 3 }
      const typeDiff = (typeOrder[a.eventType] ?? 9) - (typeOrder[b.eventType] ?? 9)
      if (typeDiff !== 0) return typeDiff
      // Within keynotes, apply explicit order
      if (a.eventType === 'keynote' && b.eventType === 'keynote') {
        return (keynoteOrder[a.name] ?? 99) - (keynoteOrder[b.name] ?? 99)
      }
      return 0
    })
  }, [filteredSpeakers, sortMode])

  // Group for "by event" mode
  const keynotes = sorted.filter((s) => s.eventType === 'keynote')
  const panelists = sorted.filter((s) => s.eventType !== 'keynote')

  const renderGroup = (label: string, speakers: SpeakerWithEvent[]) => (
    <div key={label} style={{ marginBottom: 24 }}>
      <h2
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
          margin: '0 0 10px',
          paddingBottom: 6,
          borderBottom: '1px solid var(--border)',
        }}
      >
        {label}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {speakers.map((s) => (
          <SpeakerCard key={s.name} speaker={s} />
        ))}
      </div>
    </div>
  )

return (
    <div style={{ padding: '16px 16px 100px' }}>
      {/* Search */}
      <div style={{ marginBottom: 12 }}>
        <input
          type="search"
          placeholder="Search speakers, companies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px',
            border: '1px solid var(--border)',
            borderRadius: 8,
            fontSize: 14,
            background: 'var(--warm-gray-1)',
            color: 'var(--charcoal)',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Sort buttons */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 20,
          background: 'var(--warm-gray-1)',
          borderRadius: 8,
          padding: 4,
        }}
      >
        {([
          { id: 'event', label: 'By Event' },
          { id: 'az', label: 'A–Z' },
        ] as const).map((btn) => (
          <button
            key={btn.id}
            onClick={() => setSortMode(btn.id)}
            style={{
              flex: 1,
              padding: '7px 4px',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: sortMode === btn.id ? 700 : 500,
              background: sortMode === btn.id ? 'white' : 'transparent',
              color: sortMode === btn.id ? 'var(--crimson)' : 'var(--text-secondary)',
              boxShadow: sortMode === btn.id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {sortMode === 'event' && (
        <>
          {keynotes.length > 0 && renderGroup('Keynote Speakers', keynotes)}
          {panelists.length > 0 && renderGroup('Panel Speakers', panelists)}
        </>
      )}

      {sortMode === 'az' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sorted.map((s) => (
            <SpeakerCard key={s.name} speaker={s} />
          ))}
        </div>
      )}
    </div>
  )
}
