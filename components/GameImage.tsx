'use client'

import { useState } from 'react'

const FALLBACK_COLORS: Record<string, string> = {
  'DSCF9550': 'bg-gradient-to-br from-forest to-forest-mid',
  'DSCF9379': 'bg-gradient-to-br from-forest-light to-forest',
  'DSCF9497': 'bg-gradient-to-br from-purple to-forest',
  'DSCF9538': 'bg-gradient-to-br from-orange to-magenta',
  'DSCF9477': 'bg-gradient-to-br from-gold to-orange',
}

const FALLBACK_EMOJI: Record<string, string> = {
  'DSCF9550': '🎲', 'DSCF9379': '📦', 'DSCF9497': '🐘', 'DSCF9538': '✨', 'DSCF9477': '🌿',
}

interface Props {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
}

export default function GameImage({ src, alt, className = '', style }: Props) {
  const [failed, setFailed] = useState(false)

  const key = Object.keys(FALLBACK_COLORS).find((k) => src.includes(k)) ?? 'full'

  if (failed) {
    return (
      <div
        className={`${FALLBACK_COLORS[key]} flex items-center justify-center ${className}`}
        style={style}
      >
        <span className="text-5xl opacity-60">{FALLBACK_EMOJI[key]}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setFailed(true)}
    />
  )
}
