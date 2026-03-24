'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ScheduleEvent, getBuildingFromLocation } from '@/lib/utils'

interface MapTabProps {
  schedule: ScheduleEvent[]
}

const BUILDINGS = ['Klarman', 'Aldrich', 'Batten', 'Spangler'] as const

// Coordinates as percentages of the 2560×1978 image
// Each entry: [x%, y%, width%, height%] defining a highlight rectangle over the building
const BUILDING_HIGHLIGHTS: Record<string, { x: number; y: number; w: number; h: number; label: string }> = {
  Aldrich: { x: 44.5, y: 38.5, w: 11.5, h: 12, label: 'Aldrich' },
  Klarman: { x: 67.5, y: 56.5, w: 10.5, h: 11.5, label: 'Klarman' },
  Spangler: { x: 46.5, y: 52.5, w: 11, h: 11, label: 'Spangler' },
  Batten: { x: 22, y: 71.5, w: 12, h: 10, label: 'Batten' },
}

const DIRECTIONS_URLS: Record<string, string> = {
  Klarman: 'https://maps.google.com/maps?q=Klarman+Hall+Harvard+Business+School',
  Aldrich: 'https://maps.google.com/maps?q=Aldrich+Hall+Harvard+Business+School',
  Batten: 'https://maps.google.com/maps?q=Batten+Hall+Harvard+Business+School',
  Spangler: 'https://maps.google.com/maps?q=Spangler+Center+Harvard+Business+School',
}

export default function MapTab({ schedule }: MapTabProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null)
  const router = useRouter()

  const buildingCounts: Record<string, number> = {}
  for (const event of schedule) {
    const b = getBuildingFromLocation(event.location)
    if (b) {
      buildingCounts[b] = (buildingCounts[b] || 0) + 1
    }
  }

  const filteredEvents = selectedBuilding
    ? schedule.filter((e) => getBuildingFromLocation(e.location) === selectedBuilding)
    : []

  return (
    <div style={{ padding: '16px 16px 100px' }}>
      {/* Campus map with building highlight overlays */}
      <div
        style={{
          position: 'relative',
          borderRadius: 12,
          overflow: 'hidden',
          marginBottom: 16,
          border: '1px solid var(--border)',
          background: '#f0ebe4',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/campus-map.jpg"
          alt="HBS Campus Map"
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />
        {/* SVG overlay for building highlights */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {BUILDINGS.map((building) => {
            const h = BUILDING_HIGHLIGHTS[building]
            const isSelected = selectedBuilding === building
            if (!isSelected) return null
            return (
              <rect
                key={building}
                x={h.x}
                y={h.y}
                width={h.w}
                height={h.h}
                rx="0.5"
                ry="0.5"
                fill="rgba(165, 28, 48, 0.35)"
                stroke="#A51C30"
                strokeWidth="0.4"
              />
            )
          })}
        </svg>
      </div>

      {/* Directions link */}
      {selectedBuilding && (
        <a
          href={DIRECTIONS_URLS[selectedBuilding]}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            textAlign: 'center',
            marginBottom: 16,
            color: 'var(--crimson)',
            fontWeight: 600,
            fontSize: 13,
            textDecoration: 'none',
          }}
        >
          Directions to {selectedBuilding} ↗
        </a>
      )}

      {/* Building buttons */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          marginBottom: 20,
        }}
      >
        {BUILDINGS.map((building) => {
          const count = buildingCounts[building] || 0
          const isSelected = selectedBuilding === building
          return (
            <button
              key={building}
              onClick={() => setSelectedBuilding(isSelected ? null : building)}
              style={{
                padding: '14px 12px',
                borderRadius: 10,
                border: '1px solid',
                borderColor: isSelected ? 'var(--crimson)' : 'var(--border)',
                background: isSelected ? 'var(--crimson)' : 'white',
                color: isSelected ? 'white' : 'var(--charcoal)',
                cursor: 'pointer',
                textAlign: 'left',
                minHeight: 44,
                transition: 'all 0.15s',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 14 }}>
                {building === 'Spangler' ? 'Spangler Center' : `${building} Hall`}
              </div>
              <div style={{ fontSize: 11, marginTop: 2, opacity: 0.8 }}>
                {count} event{count !== 1 ? 's' : ''}
              </div>
            </button>
          )
        })}
      </div>

      {/* Filtered events for selected building */}
      {selectedBuilding && filteredEvents.length > 0 && (
        <div>
          <h3
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              margin: '0 0 10px',
            }}
          >
            {selectedBuilding === 'Spangler' ? 'Spangler Center' : `${selectedBuilding} Hall`} Events
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => router.push(`/event/${event.id}`)}
                style={{
                  background: 'var(--warm-gray-1)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  borderLeft: '3px solid var(--crimson)',
                  border: 'none',
                  borderLeftWidth: 3,
                  borderLeftStyle: 'solid',
                  borderLeftColor: 'var(--crimson)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--charcoal)' }}>
                  {event.title}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {event.time} · {event.location}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
