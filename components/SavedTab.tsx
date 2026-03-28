'use client'

import EventCard from './EventCard'
import { ScheduleEvent } from '@/lib/utils'

interface SavedTabProps {
  schedule: ScheduleEvent[]
  savedIds: string[]
  onToggleSave: (id: string) => void
}

export default function SavedTab({ schedule, savedIds, onToggleSave }: SavedTabProps) {
  const savedEvents = schedule.filter((e) => savedIds.includes(e.id))

  const notice = (
    <p
      style={{
        fontSize: 12,
        color: 'var(--text-muted)',
        background: 'var(--warm-gray-1)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '8px 12px',
        margin: '0 0 14px',
        lineHeight: 1.5,
      }}
    >
      💡 Saved events are cached locally. Please save events on your mobile device for best results.
    </p>
  )

  if (savedEvents.length === 0) {
    return (
      <div style={{ padding: '24px 16px 100px' }}>
        {notice}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 24px',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: 48, marginBottom: 16 }}>☆</span>
          <h2
            className="playfair"
            style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px', color: 'var(--charcoal)' }}
          >
            No saved events yet
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0, maxWidth: 280, lineHeight: 1.5 }}>
            Tap the star ☆ on any event in the Schedule tab to save it here for quick access.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '16px 16px 100px' }}>
      {notice}
      <p
        style={{
          fontSize: 12,
          color: 'var(--text-secondary)',
          margin: '0 0 14px',
          fontWeight: 500,
        }}
      >
        {savedEvents.length} saved event{savedEvents.length !== 1 ? 's' : ''}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {savedEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isSaved={true}
            onToggleSave={onToggleSave}
          />
        ))}
      </div>
    </div>
  )
}
