'use client'

import { useRouter } from 'next/navigation'
import Avatar from '@/components/Avatar'
import { Speaker, ScheduleEvent } from '@/lib/utils'

interface SpeakerDetailClientProps {
  speaker: Speaker
  event: ScheduleEvent
}

const TYPE_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  keynote: { bg: 'var(--crimson)', color: 'white', label: 'KEYNOTE' },
  panel: { bg: '#f5eedd', color: '#7a5c2a', label: 'PANEL' },
  session: { bg: '#e8f0f8', color: '#2a4a7a', label: 'SESSION' },
  logistics: { bg: '#f0f0f0', color: '#666', label: 'INFO' },
}

export default function SpeakerDetailClient({ speaker, event }: SpeakerDetailClientProps) {
  const router = useRouter()
  const typeStyle = TYPE_STYLES[event.type] || TYPE_STYLES.session

  return (
    <div className="app-shell">
      {/* Header bar */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          background: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 16,
            color: 'var(--crimson)',
            fontWeight: 600,
            padding: '4px 8px 4px 0',
            minHeight: 44,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          ← Back
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 16px 100px', overflowY: 'auto', flex: 1 }}>
        {/* Speaker header */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
          <Avatar name={speaker.name} size={80} photo={speaker.photo} />
          <div style={{ flex: 1, paddingTop: 4 }}>
            <h1
              className="playfair"
              style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: 'var(--charcoal)', lineHeight: 1.2 }}
            >
              {speaker.name}
            </h1>
            {speaker.title && (
              <p style={{ margin: '0 0 6px', fontSize: 13, color: 'var(--text-secondary)' }}>
                {speaker.title}
              </p>
            )}
            {speaker.industry && (
              <span
                style={{
                  display: 'inline-block',
                  background: 'var(--crimson-light)',
                  color: 'var(--crimson)',
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: 4,
                  letterSpacing: '0.04em',
                }}
              >
                {speaker.industry}
              </span>
            )}
          </div>
        </div>

        {/* Links */}
        {(speaker.companyUrl || speaker.linkedin) && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
            {speaker.companyUrl && (
              <a
                href={speaker.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '9px 16px',
                  border: '1.5px solid var(--crimson)',
                  borderRadius: 8,
                  color: 'var(--crimson)',
                  fontWeight: 600,
                  fontSize: 13,
                  textDecoration: 'none',
                  minHeight: 44,
                }}
              >
                🌐 Website ↗
              </a>
            )}
            {speaker.linkedin && (
              <a
                href={speaker.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '9px 16px',
                  border: '1.5px solid #0077B5',
                  borderRadius: 8,
                  color: '#0077B5',
                  fontWeight: 600,
                  fontSize: 13,
                  textDecoration: 'none',
                  minHeight: 44,
                }}
              >
                LinkedIn ↗
              </a>
            )}
          </div>
        )}

        {/* About */}
        {speaker.bio && (
          <div style={{ marginBottom: 24 }}>
            <h2
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                margin: '0 0 8px',
              }}
            >
              About
            </h2>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--charcoal)', lineHeight: 1.7 }}>
              {speaker.bio}
            </p>
          </div>
        )}

        {/* About company */}
        {speaker.company && speaker.companyDesc && (
          <div style={{ marginBottom: 24 }}>
            <h2
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                margin: '0 0 8px',
              }}
            >
              About {speaker.company}
            </h2>
            <div
              style={{
                borderLeft: '3px solid var(--crimson)',
                paddingLeft: 14,
              }}
            >
              <p style={{ margin: '0 0 8px', fontSize: 14, color: 'var(--charcoal)', lineHeight: 1.6 }}>
                {speaker.companyDesc}
              </p>
              {speaker.companyUrl && (
                <a
                  href={speaker.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 13,
                    color: 'var(--crimson)',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  {speaker.companyUrl.replace('https://', '')} ↗
                </a>
              )}
            </div>
          </div>
        )}

        {/* Speaking at */}
        <div>
          <h2
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              margin: '0 0 10px',
            }}
          >
            Speaking At
          </h2>
          <div
            onClick={() => router.push(`/event/${event.id}`)}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '14px 16px',
              cursor: 'pointer',
              borderLeft: event.type === 'keynote' ? '3px solid var(--crimson)' : '1px solid var(--border)',
              transition: 'box-shadow 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
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
                  background: 'var(--crimson-light)',
                  color: 'var(--crimson)',
                  fontSize: 10,
                  padding: '2px 7px',
                  borderRadius: 4,
                }}
              >
                📍 {event.location}
              </span>
            </div>
            <p
              className={event.type === 'keynote' ? 'playfair' : undefined}
              style={{
                margin: '0 0 4px',
                fontSize: event.type === 'keynote' ? 16 : 14,
                fontWeight: 700,
                color: 'var(--charcoal)',
                lineHeight: 1.3,
              }}
            >
              {event.title}
            </p>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
              {event.time}
            </p>
            <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--crimson)', fontWeight: 600 }}>
              View event details →
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
