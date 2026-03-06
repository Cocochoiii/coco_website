import { memo } from 'react'

/**
 * Inner content layer for ArtCard. Rendered twice per card
 * (normal + hover) so text is always readable during clip-path animation.
 */
function CardContent({ p, compact, hovered, isHover = false }) {
  const col = isHover ? p.hText : p.text

  const titleSize = compact
    ? 'clamp(20px, 2.2vw, 28px)'
    : 'clamp(26px, 3vw, 42px)'

  const yearSize = compact
    ? 'clamp(70px, 10vw, 110px)'
    : 'clamp(90px, 14vw, 180px)'

  return (
    <div
      style={{
        position: 'absolute', inset: 0, zIndex: isHover ? 2 : 0,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: compact ? '18px 20px' : '26px 28px',
        pointerEvents: 'none',
      }}
    >
      {/* Year watermark */}
      <div
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: "'Playfair Display', serif",
          fontSize: yearSize,
          fontWeight: 900, fontStyle: 'italic',
          color: col, opacity: 0.06,
          lineHeight: 1, letterSpacing: -6,
          userSelect: 'none', whiteSpace: 'nowrap',
        }}
      >
        {p.year}
      </div>

      {/* Year label — top left */}
      <div
        style={{
          position: 'absolute',
          top:  compact ? 16 : 24,
          left: compact ? 20 : 28,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11, fontWeight: 700,
          letterSpacing: 3, color: col, opacity: 0.3,
        }}
      >
        {p.year}
      </div>

      {/* Arrow — top right, hover layer only */}
      {isHover && (
        <div
          style={{
            position: 'absolute',
            top:   compact ? 14 : 22,
            right: compact ? 18 : 26,
            opacity: hovered ? 0.6 : 0,
            transform: hovered ? 'translate(0,0)' : 'translate(-6px, 6px)',
            transition: 'all 0.4s cubic-bezier(0.25,0,0,1)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8">
            <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {/* Title */}
      <h3
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: titleSize, fontWeight: 800,
          color: col, lineHeight: 1.05, letterSpacing: -1,
          margin: 0, marginBottom: compact ? 8 : 12,
          transform: isHover && hovered ? 'translateX(3px)' : 'translateX(0)',
          transition: 'transform 0.45s cubic-bezier(0.25,0,0,1)',
        }}
      >
        {p.title}
      </h3>

      {/* Meta */}
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: compact ? 13 : 14,
          fontWeight: 500, letterSpacing: 1.2,
          color: col, opacity: 0.55,
          textTransform: 'uppercase', lineHeight: 1.5,
        }}
      >
        {p.meta}
      </div>

      {/* Decorative line */}
      <div
        style={{
          width: isHover && hovered ? 50 : 30,
          height: 2.5,
          background: col, opacity: 0.2,
          borderRadius: 3,
          marginTop: compact ? 10 : 14,
          transition: 'width 0.5s cubic-bezier(0.25,0,0,1)',
        }}
      />
    </div>
  )
}

export default memo(CardContent)
