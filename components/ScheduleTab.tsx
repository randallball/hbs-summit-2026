'use client'

import { useState, useMemo } from 'react'
import EventCard from './EventCard'
import { ScheduleEvent, getBuildingFromLocation } from '@/lib/utils'

interface ScheduleTabProps {
  schedule: ScheduleEvent[]
  savedIds: string[]
  onToggleSave: (id: string) => void
}

// Ordering priority for parallel sessions within a time slot
function locationSortOrder(location: string): number {
  const loc = location.toLowerCase()
  if (loc.includes('klarman')) return 0
  if (loc.includes('spangler')) return 1
  if (loc.includes('aldrich 112')) return 2
  if (loc.includes('aldrich 111')) return 3
  if (loc.includes('aldrich 110')) return 4
  if (loc.includes('aldrich')) return 5
  if (loc.includes('batten')) return 6
  return 99
}

export default function ScheduleTab({ schedule, savedIds, onToggleSave }: ScheduleTabProps) {
  const [query, setQuery] = useState('')
  const [buildingFilter, setBuildingFilter] = useState('')

  // Filter events
  const filtered = useMemo(() => {
    return schedule.filter((event) => {
      if (query) {
        const q = query.toLowerCase()
        const titleMatch = event.title.toLowerCase().includes(q)
        const speakerMatch = event.speakers.some(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            (s.company || '').toLowerCase().includes(q)
        )
        if (!titleMatch && !speakerMatch) return false
      }
      if (buildingFilter) {
        const building = getBuildingFromLocation(event.location)
        if (building !== buildingFilter) return false
      }
      return true
    })
  }, [schedule, query, buildingFilter])

  // Group by time slot, preserving original schedule order
  const timeSlots = useMemo(() => {
    const slotMap = new Map<string, ScheduleEvent[]>()
    const slotOrder: string[] = []
    for (const event of filtered) {
      if (!slotMap.has(event.time)) {
        slotMap.set(event.time, [])
        slotOrder.push(event.time)
      }
      slotMap.get(event.time)!.push(event)
    }
    return slotOrder.map((time) => {
      const events = slotMap.get(time)!
      // Sort within slot by location priority
      const sorted = [...events].sort((a, b) => locationSortOrder(a.location) - locationSortOrder(b.location))
      return { time, events: sorted, isParallel: sorted.length > 1 }
    })
  }, [filtered])

  const BUILDINGS = [
    { value: '', label: 'All Rooms' },
    { value: 'Klarman', label: 'Klarman' },
    { value: 'Aldrich', label: 'Aldrich' },
    { value: 'Batten', label: 'Batten' },
    { value: 'Spangler', label: 'Spangler' },
  ]

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Search + filter — padded normally */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ marginBottom: 10 }}>
          <input
            type="search"
            placeholder="Search events, speakers, companies..."
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
        <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
          <select
            value={buildingFilter}
            onChange={(e) => setBuildingFilter(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 10px',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 13,
              background: 'white',
              color: 'var(--charcoal)',
              cursor: 'pointer',
            }}
          >
            {BUILDINGS.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Schedule */}
      {timeSlots.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: 32, margin: '0 0 8px' }}>🔍</p>
          <p style={{ margin: 0, fontSize: 15 }}>No events match your search</p>
        </div>
      ) : (
        <div style={{ marginTop: 12 }}>
          {timeSlots.map(({ time, events, isParallel }) => (
            <div key={time} style={{ marginBottom: 8 }}>
              {/* Time slot header */}
              <div
                style={{
                  padding: '10px 16px 6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'var(--crimson)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {time}
                </span>
                {isParallel && (
                  <>
                    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                    <span
                      style={{
                        fontSize: 10,
                        color: 'var(--text-muted)',
                        letterSpacing: '0.05em',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {events.length} rooms · scroll →
                    </span>
                  </>
                )}
                {!isParallel && (
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                )}
              </div>

              {/* Single event — full width */}
              {!isParallel && (
                <div style={{ padding: '0 16px' }}>
                  <EventCard
                    event={events[0]}
                    isSaved={savedIds.includes(events[0].id)}
                    onToggleSave={onToggleSave}
                  />
                </div>
              )}

              {/* Parallel events — horizontal scroll on mobile, grid on desktop */}
              {isParallel && (
                <div
                  style={{
                    display: 'flex',
                    gap: 10,
                    overflowX: 'auto',
                    paddingBottom: 6,
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch',
                    msOverflowStyle: 'none',
                  }}
                  className="hide-scrollbar parallel-row"
                >
                  <div className="parallel-spacer" style={{ flex: '0 0 16px', width: 16, minWidth: 16 }} />
                  {events.map((event) => (
                    <div
                      key={event.id}
                      style={{
                        flex: '0 0 80%',
                        maxWidth: 320,
                        scrollSnapAlign: 'start',
                      }}
                    >
                      <EventCard
                        event={event}
                        isSaved={savedIds.includes(event.id)}
                        onToggleSave={onToggleSave}
                      />
                    </div>
                  ))}
                  <div className="parallel-spacer" style={{ flex: '0 0 16px', width: 16, minWidth: 16 }} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
