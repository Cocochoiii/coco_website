import { memo } from 'react'
import useIsMobile from '../../hooks/useIsMobile'

function CardContent({ p, compact, hovered, isHover = false }) {
  const m = useIsMobile()
  const col = isHover ? p.hText : p.text

  const titleSize = m
    ? (compact ? 14 : 18)
    : (compact ? 'clamp(20px, 2.2vw, 28px)' : 'clamp(26px, 3vw, 42px)')
  const yearSize = m
    ? (compact ? 50 : 60)
    : (compact ? 'clamp(70px, 10vw, 110px)' : 'clamp(90px, 14vw, 180px)')

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: isHover ? 2 : 0,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      padding: m ? (compact ? '10px 12px' : '14px 16px') : (compact ? '18px 20px' : '26px 28px'),
      pointerEvents: 'none',
    }}>
      {/* Year watermark */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: "'Playfair Display', serif", fontSize: yearSize, fontWeight: 900, fontStyle: 'italic', color: col, opacity: 0.06, lineHeight: 1, letterSpacing: -6, userSelect: 'none', whiteSpace: 'nowrap' }}>
        {p.year}
      </div>
      {/* Year label */}
      <div style={{ position: 'absolute', top: m ? 8 : (compact ? 16 : 24), left: m ? 12 : (compact ? 20 : 28), fontFamily: "'DM Sans', sans-serif", fontSize: m ? 9 : 11, fontWeight: 700, letterSpacing: m ? 1.5 : 3, color: col, opacity: 0.3 }}>
        {p.year}
      </div>
      {/* Arrow */}
      {isHover && (
        <div style={{ position: 'absolute', top: m ? 8 : (compact ? 14 : 22), right: m ? 10 : (compact ? 18 : 26), opacity: hovered ? 0.6 : 0, transform: hovered ? 'translate(0,0)' : 'translate(-6px, 6px)', transition: 'all 0.4s cubic-bezier(0.25,0,0,1)' }}>
          <svg width={m ? 14 : 18} height={m ? 14 : 18} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8">
            <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
      {/* Title */}
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: titleSize, fontWeight: 800, color: col, lineHeight: 1.05, letterSpacing: -1, margin: 0, marginBottom: m ? 4 : (compact ? 8 : 12), transform: isHover && hovered ? 'translateX(3px)' : 'translateX(0)', transition: 'transform 0.45s cubic-bezier(0.25,0,0,1)' }}>
        {p.title}
      </h3>
      {/* Meta */}
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: m ? (compact ? 8 : 9) : (compact ? 13 : 14), fontWeight: 500, letterSpacing: m ? 0.5 : 1.2, color: col, opacity: 0.55, textTransform: 'uppercase', lineHeight: 1.5 }}>
        {p.meta}
      </div>
      {/* Line */}
      <div style={{ width: isHover && hovered ? (m ? 30 : 50) : (m ? 16 : 30), height: 2.5, background: col, opacity: 0.2, borderRadius: 3, marginTop: m ? 6 : (compact ? 10 : 14), transition: 'width 0.5s cubic-bezier(0.25,0,0,1)' }} />
    </div>
  )
}

export default memo(CardContent)
