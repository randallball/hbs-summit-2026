'use client'

import { useRouter } from 'next/navigation'
import Avatar from './Avatar'
import { SpeakerWithEvent } from '@/lib/utils'

interface SpeakerCardProps {
  speaker: SpeakerWithEvent
}

export default function SpeakerCard({ speaker }: SpeakerCardProps) {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push(`/speaker/${encodeURIComponent(speaker.name)}`)}
      style={{
        background: 'white',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '14px 16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        transition: 'box-shadow 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <Avatar name={speaker.name} size={44} photo={speaker.photo} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          className="playfair"
          style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 700,
            color: 'var(--charcoal)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {speaker.name}
        </p>
        {speaker.company && (
          <p
            style={{
              margin: '2px 0 0',
              fontSize: 12,
              color: 'var(--text-secondary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {speaker.company}
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
              letterSpacing: '0.04em',
            }}
          >
            {speaker.industry}
          </span>
        )}
      </div>

      <span style={{ color: 'var(--text-muted)', fontSize: 18, flexShrink: 0 }}>›</span>
    </div>
  )
}
