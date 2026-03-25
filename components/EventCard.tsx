'use client'

import { useRouter } from 'next/navigation'
import { ScheduleEvent, getBuildingFromLocation } from '@/lib/utils'

interface EventCardProps {
  event: ScheduleEvent
  isSaved: boolean
  onToggleSave: (id: string) => void
}

const TYPE_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  keynote: { bg: 'var(--crimson)', color: 'white', label: 'KEYNOTE' },
  panel: { bg: '#f5eedd', color: '#7a5c2a', label: 'PANEL' },
  session: { bg: '#e8f0f8', color: '#2a4a7a', label: 'SESSION' },
  logistics: { bg: '#f0f0f0', color: '#666', label: 'INFO' },
  break: { bg: '#f0f0f0', color: '#666', label: 'BREAK' },
}

export default function EventCard({ event, isSaved, onToggleSave }: EventCardProps) {
  const router = useRouter()
  const typeStyle = TYPE_STYLES[event.type] || TYPE_STYLES.session
  const building = getBuildingFromLocation(event.location)
  const isKeynote = event.type === 'keynote'

  return (
    <div
      onClick={() => router.push(`/event/${event.id}`)}
      style={{
        background: 'white',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '14px 16px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        transition: 'box-shadow 0.15s, transform 0.1s',
        borderLeft: isKeynote ? '3px solid var(--crimson)' : '1px solid var(--border)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)'
        e.currentTarget.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Top row: badges + star */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span
          style={{
            background: typeStyle.bg,
            color: typeStyle.color,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.08em',
            padding: '2px 7px',
            borderRadius: 4,
            textTransform: 'uppercase',
          }}
        >
          {typeStyle.label}
        </span>
        <span
          style={{
            background: building ? 'var(--crimson-light)' : '#f0f0f0',
            color: building ? 'var(--crimson)' : '#666',
            fontSize: 10,
            fontWeight: 500,
            padding: '2px 7px',
            borderRadius: 4,
          }}
        >
          {event.location}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleSave(event.id)
          }}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 20,
            color: isSaved ? 'var(--crimson)' : '#ccc',
            padding: '0 4px',
            minWidth: 32,
            minHeight: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}
          aria-label={isSaved ? 'Unsave event' : 'Save event'}
        >
          {isSaved ? '★' : '☆'}
        </button>
      </div>

      {/* Title */}
      <h3
        className={isKeynote ? 'playfair' : undefined}
        style={{
          margin: 0,
          fontSize: isKeynote ? 16 : 14,
          fontWeight: isKeynote ? 700 : 600,
          color: 'var(--charcoal)',
          lineHeight: 1.3,
        }}
      >
        {event.title}
      </h3>

      {/* Time */}
      <p
        style={{
          margin: 0,
          fontSize: 12,
          color: 'var(--text-secondary)',
          fontWeight: 500,
        }}
      >
        {event.time}
      </p>

      {/* Moderator */}
      {event.moderator && (
        <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>
          <span style={{ fontWeight: 600 }}>Moderated by </span>
          {event.moderator.name}
        </p>
      )}

      {/* Speaker pills */}
      {event.speakers.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {event.speakers.map((s) => (
            <span
              key={s.name}
              style={{
                background: 'var(--warm-gray-1)',
                color: 'var(--charcoal)',
                fontSize: 11,
                padding: '3px 8px',
                borderRadius: 12,
                fontWeight: 500,
              }}
            >
              {s.name}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
