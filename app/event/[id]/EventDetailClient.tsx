'use client'

import { useRouter } from 'next/navigation'
import { useSavedEvents } from '@/lib/useSavedEvents'
import Avatar from '@/components/Avatar'
import { ScheduleEvent, getBuildingFromLocation, getBuildingMapQuery } from '@/lib/utils'

interface EventDetailClientProps {
  event: ScheduleEvent
}

const TYPE_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  keynote: { bg: 'var(--crimson)', color: 'white', label: 'KEYNOTE' },
  panel: { bg: '#f5eedd', color: '#7a5c2a', label: 'PANEL' },
  session: { bg: '#e8f0f8', color: '#2a4a7a', label: 'SESSION' },
  logistics: { bg: '#f0f0f0', color: '#666', label: 'INFO' },
}

export default function EventDetailClient({ event }: EventDetailClientProps) {
  const router = useRouter()
  const [savedIds, toggleSave] = useSavedEvents()
  const isSaved = savedIds.includes(event.id)
  const typeStyle = TYPE_STYLES[event.type] || TYPE_STYLES.session
  const building = getBuildingFromLocation(event.location)
  const mapQuery = building ? getBuildingMapQuery(building) : 'Harvard+Business+School'
  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&z=16&output=embed`
  const mapsOpenUrl = `https://maps.google.com/maps?q=${mapQuery}`

  return (
    <div className="app-shell">
      {/* Header bar */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
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
      <div style={{ padding: '20px 16px 100px', overflowY: 'auto', flex: 1 }}>
        {/* Badges */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          <span
            style={{
              background: typeStyle.bg,
              color: typeStyle.color,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.08em',
              padding: '3px 8px',
              borderRadius: 5,
              textTransform: 'uppercase',
            }}
          >
            {typeStyle.label}
          </span>
          <span
            style={{
              background: building ? 'var(--crimson-light)' : '#f0f0f0',
              color: building ? 'var(--crimson)' : '#666',
              fontSize: 11,
              fontWeight: 500,
              padding: '3px 8px',
              borderRadius: 5,
            }}
          >
            📍 {event.location}
          </span>
        </div>

        {/* Title & time */}
        <h1
          className="playfair"
          style={{
            fontSize: 22,
            fontWeight: 700,
            margin: '0 0 6px',
            color: 'var(--charcoal)',
            lineHeight: 1.2,
          }}
        >
          {event.title}
        </h1>
        <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>
          {event.time}
        </p>

        {/* Save button */}
        <button
          onClick={() => toggleSave(event.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            border: '1.5px solid',
            borderColor: isSaved ? 'var(--crimson)' : 'var(--border)',
            borderRadius: 8,
            background: isSaved ? 'var(--crimson-light)' : 'white',
            color: isSaved ? 'var(--crimson)' : 'var(--text-secondary)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 14,
            marginBottom: 24,
            minHeight: 44,
            transition: 'all 0.15s',
          }}
        >
          <span style={{ fontSize: 18 }}>{isSaved ? '★' : '☆'}</span>
          {isSaved ? 'Saved' : 'Save Event'}
        </button>

        {/* Moderator */}
        {event.moderator && (
          <div
            style={{
              background: 'var(--cream)',
              borderRadius: 10,
              padding: '14px 16px',
              marginBottom: 20,
              border: '1px solid var(--border)',
            }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                margin: '0 0 6px',
              }}
            >
              Moderator
            </p>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: 'var(--charcoal)' }}>
              {event.moderator.name}
            </p>
            {event.moderator.title && (
              <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
                {event.moderator.title}
              </p>
            )}
          </div>
        )}

        {/* Speakers */}
        {event.speakers.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h2
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                margin: '0 0 12px',
              }}
            >
              Speakers
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {event.speakers.map((speaker) => (
                <div
                  key={speaker.name}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    padding: '16px',
                    background: 'white',
                  }}
                >
                  {/* Speaker header */}
                  <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    <Avatar name={speaker.name} size={52} photo={speaker.photo} />
                    <div style={{ flex: 1 }}>
                      <p
                        className="playfair"
                        style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--charcoal)' }}
                      >
                        {speaker.name}
                      </p>
                      {speaker.title && (
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>
                          {speaker.title}
                        </p>
                      )}
                      {speaker.industry && (
                        <span
                          style={{
                            display: 'inline-block',
                            marginTop: 4,
                            background: 'var(--crimson-light)',
                            color: 'var(--crimson)',
                            fontSize: 10,
                            fontWeight: 600,
                            padding: '2px 6px',
                            borderRadius: 4,
                          }}
                        >
                          {speaker.industry}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Links */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                    {speaker.companyUrl && (
                      <a
                        href={speaker.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          fontSize: 12,
                          color: 'var(--crimson)',
                          fontWeight: 600,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
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
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          fontSize: 12,
                          color: '#0077B5',
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        LinkedIn ↗
                      </a>
                    )}
                  </div>

                  {/* Bio */}
                  {speaker.bio && (
                    <div style={{ marginBottom: 10 }}>
                      <p
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: '0.10em',
                          textTransform: 'uppercase',
                          color: 'var(--text-muted)',
                          margin: '0 0 4px',
                        }}
                      >
                        About
                      </p>
                      <p style={{ margin: 0, fontSize: 13, color: 'var(--charcoal)', lineHeight: 1.6 }}>
                        {speaker.bio}
                      </p>
                    </div>
                  )}

                  {/* Company desc */}
                  {speaker.companyDesc && speaker.company && (
                    <div
                      style={{
                        borderLeft: '3px solid var(--crimson)',
                        paddingLeft: 12,
                        marginTop: 10,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: '0.10em',
                          textTransform: 'uppercase',
                          color: 'var(--text-muted)',
                          margin: '0 0 4px',
                        }}
                      >
                        About {speaker.company}
                      </p>
                      <p style={{ margin: '0 0 6px', fontSize: 13, color: 'var(--charcoal)', lineHeight: 1.5 }}>
                        {speaker.companyDesc}
                      </p>
                      {speaker.companyUrl && (
                        <a
                          href={speaker.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: 12,
                            color: 'var(--crimson)',
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                        >
                          {speaker.companyUrl.replace('https://', '')} ↗
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map */}
        <div>
          <h2
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              margin: '0 0 12px',
            }}
          >
            Location
          </h2>
          <div
            style={{
              borderRadius: 10,
              overflow: 'hidden',
              border: '1px solid var(--border)',
              marginBottom: 8,
            }}
          >
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="220"
              style={{ display: 'block', border: 'none' }}
              title={`Map for ${event.location}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href={mapsOpenUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              textAlign: 'center',
              color: 'var(--crimson)',
              fontWeight: 600,
              fontSize: 13,
              textDecoration: 'none',
            }}
          >
            Open in Google Maps ↗
          </a>
        </div>
      </div>
    </div>
  )
}
