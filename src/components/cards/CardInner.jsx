import { memo } from 'react'
import { EYE } from '../../constants/theme'

/**
 * Inner content layer for ExpCard. Rendered twice per card
 * (normal + hover) so text is always readable during clip-path animation.
 */
function CardInner({ exp, isHover, hovered }) {
  const titleCol  = isHover ? exp.hText : EYE.cream
  const subCol    = isHover ? `${exp.hText}bb` : 'rgba(255,255,255,0.45)'
  const dotCol    = isHover ? exp.hText : exp.color
  const hlCol     = isHover ? `${exp.hText}cc` : 'rgba(255,255,255,0.4)'
  const periodCol = isHover ? `${exp.hText}99` : exp.color

  return (
    <div
      style={{
        position: 'absolute', inset: 0, zIndex: isHover ? 2 : 0,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        textAlign: 'center',
        padding: '22px 24px',
        pointerEvents: 'none',
      }}
    >
      {/* Period */}
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15, fontWeight: 700,
          letterSpacing: 3, textTransform: 'uppercase',
          color: periodCol,
          marginBottom: 12,
        }}
      >
        {exp.period}
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(80px, 3vw, 40px)',
          fontWeight: 800,
          color: titleCol,
          lineHeight: 1.05,
          letterSpacing: -0.5,
          margin: 0, marginBottom: 6,
          transform: isHover && hovered ? 'translateY(-2px)' : 'none',
          transition: 'transform 0.4s cubic-bezier(0.25,0,0,1)',
        }}
      >
        {exp.title}
      </h3>

      {/* Role */}
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 40, fontWeight: 500,
          color: subCol,
          marginBottom: 16,
        }}
      >
        {exp.role}
      </div>

      {/* Highlights */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center' }}>
        {exp.highlights.map((h, i) => (
          <div
            key={i}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 25,
              color: hlCol,
              lineHeight: 1.45,
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <span
              style={{
                width: 4, height: 4, borderRadius: '50%',
                background: dotCol, opacity: 0.5, flexShrink: 0,
              }}
            />
            {h}
          </div>
        ))}
      </div>

      {/* Decorative line */}
      <div
        style={{
          width: isHover && hovered ? 50 : 28,
          height: 2,
          background: dotCol,
          opacity: 0.25,
          borderRadius: 2,
          marginTop: 16,
          transition: 'width 0.5s cubic-bezier(0.25,0,0,1)',
        }}
      />
    </div>
  )
}

export default memo(CardInner)
