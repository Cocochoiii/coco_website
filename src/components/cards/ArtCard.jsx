import { useRef, useState, memo, useCallback } from 'react'
import gsap from 'gsap'
import CardContent from './CardContent'

/**
 * Project card with 3D mouse-follow tilt and
 * circle-clip hover reveal animation.
 */
function ArtCard({ p, className = '', style = {}, compact = false }) {
  const cardRef  = useRef(null)
  const hoverRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  const onMove = useCallback((e) => {
    const c = cardRef.current
    if (!c) return
    const r = c.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width  - 0.5
    const y = (e.clientY - r.top)  / r.height - 0.5
    gsap.to(c, { rotateY: x * 5, rotateX: -y * 5, duration: 0.4, ease: 'power2.out' })
  }, [])

  const onEnter = useCallback(() => {
    setHovered(true)
    if (hoverRef.current) {
      gsap.fromTo(
        hoverRef.current,
        { clipPath: 'circle(0% at 100% 100%)' },
        { clipPath: 'circle(150% at 100% 100%)', duration: 0.55, ease: 'power3.out' },
      )
    }
  }, [])

  const onLeave = useCallback(() => {
    setHovered(false)
    if (cardRef.current) {
      gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power3.out' })
    }
    if (hoverRef.current) {
      gsap.to(hoverRef.current, { clipPath: 'circle(0% at 100% 100%)', duration: 0.4, ease: 'power2.in' })
    }
  }, [])

  const handleClick = useCallback(() => {
    if (p.link) window.open(p.link, '_blank')
  }, [p.link])

  return (
    <div
      ref={cardRef}
      className={`proj-card ${className}`}
      style={{
        background: p.bg,
        borderRadius: 16,
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden',
        perspective: 800,
        transition: 'box-shadow 0.5s cubic-bezier(0.25,0,0,1)',
        boxShadow: hovered ? '0 22px 55px rgba(0,0,0,0.28)' : 'none',
        ...style,
      }}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={handleClick}
    >
      {/* Layer A: Normal state */}
      <CardContent p={p} compact={compact} hovered={hovered} isHover={false} />

      {/* Layer B: Hover reveal */}
      <div
        ref={hoverRef}
        style={{
          position: 'absolute', inset: 0,
          background: p.hBg,
          clipPath: 'circle(0% at 100% 100%)',
          zIndex: 1,
        }}
      >
        <CardContent p={p} compact={compact} hovered={hovered} isHover={true} />
      </div>
    </div>
  )
}

export default memo(ArtCard)
