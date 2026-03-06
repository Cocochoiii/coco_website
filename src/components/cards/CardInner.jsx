import { memo } from 'react'
import { EYE } from '../../constants/theme'
import useIsMobile from '../../hooks/useIsMobile'

function CardInner({ exp, isHover, hovered }) {
  const m = useIsMobile()

  const titleCol  = isHover ? exp.hText : EYE.cream
  const subCol    = isHover ? `${exp.hText}bb` : 'rgba(255,255,255,0.45)'
  const dotCol    = isHover ? exp.hText : exp.color
  const hlCol     = isHover ? `${exp.hText}cc` : 'rgba(255,255,255,0.4)'
  const periodCol = isHover ? `${exp.hText}99` : exp.color

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: isHover ? 2 : 0,
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center', textAlign: 'center',
      padding: m ? '10px 8px' : '22px 24px', pointerEvents: 'none',
    }}>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: m ? 8 : 15, fontWeight: 700, letterSpacing: m ? 1 : 3, textTransform: 'uppercase', color: periodCol, marginBottom: m ? 3 : 12 }}>
        {exp.period}
      </div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: m ? 14 : 'clamp(80px, 3vw, 40px)', fontWeight: 800, color: titleCol, lineHeight: 1.05, letterSpacing: -0.5, margin: 0, marginBottom: m ? 2 : 6, transform: isHover && hovered ? 'translateY(-2px)' : 'none', transition: 'transform 0.4s cubic-bezier(0.25,0,0,1)' }}>
        {exp.title}
      </h3>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: m ? 9 : 40, fontWeight: 500, color: subCol, marginBottom: m ? 4 : 16 }}>
        {exp.role}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: m ? 1 : 5, alignItems: 'center' }}>
        {exp.highlights.map((h, i) => (
          <div key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: m ? 7 : 25, color: hlCol, lineHeight: 1.45, display: 'flex', alignItems: 'center', gap: m ? 3 : 8 }}>
            <span style={{ width: m ? 2 : 4, height: m ? 2 : 4, borderRadius: '50%', background: dotCol, opacity: 0.5, flexShrink: 0 }} />
            {h}
          </div>
        ))}
      </div>
      <div style={{ width: isHover && hovered ? (m ? 24 : 50) : (m ? 14 : 28), height: 2, background: dotCol, opacity: 0.25, borderRadius: 2, marginTop: m ? 6 : 16, transition: 'width 0.5s cubic-bezier(0.25,0,0,1)' }} />
    </div>
  )
}

export default memo(CardInner)
