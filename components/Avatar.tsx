'use client'

import { useState } from 'react'
import { nameToPhotoSlug, getInitials } from '@/lib/utils'

interface AvatarProps {
  name: string
  size?: number
  photo?: string | null
}

export default function Avatar({ name, size = 40, photo }: AvatarProps) {
  const [imgError, setImgError] = useState(false)
  const slug = nameToPhotoSlug(name)
  const src = photo || `/speakers/${slug}.jpg`
  const initials = getInitials(name)

  if (!imgError) {
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        onError={() => setImgError(true)}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />
    )
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'var(--cream)',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: size * 0.35,
        fontWeight: 600,
        color: 'var(--crimson)',
        letterSpacing: '0.02em',
      }}
    >
      {initials}
    </div>
  )
}
