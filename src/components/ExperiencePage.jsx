import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'

import NavOverlay from './NavOverlay'
import ExpCard from './cards/ExpCard'
import Particles from './shared/Particles'
import { EYE } from '../constants/theme'
import { EXPERIENCES } from '../constants/data'

export default function ExperiencePage({ go }) {
  const canvasRef = useRef(null)

  /* ── Rive — eye animation ── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let r = null

    import('@rive-app/canvas').then((rive) => {
      const dpr  = window.devicePixelRatio || 1
      const size = 900

      canvas.width  = size * dpr
      canvas.height = size * dpr
      canvas.style.width  = size + 'px'
      canvas.style.height = size + 'px'

      r = new rive.Rive({
        src: '/experience.riv',
        canvas,
        artboard: 'AO Eyes',
        stateMachines: 'Eyes',
        autoplay: true,
        layout: new rive.Layout({ fit: rive.Fit.Cover, alignment: rive.Alignment.Center }),
        onLoad: () => r.resizeDrawingSurfaceToCanvas(),
      })
    })

    return () => { if (r) r.cleanup() }
  }, [])

  /* ── Entrance animations ── */
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo('.eye-center', { opacity: 0, scale: 0.7, y: 60 },   { opacity: 1, scale: 1, y: 0, duration: 1.1, delay: 0.15 })
    tl.fromTo('.exp-left',   { opacity: 0, x: -80, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.12 }, '-=0.7')
    tl.fromTo('.exp-right',  { opacity: 0, x:  80, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.12 }, '-=0.9')
    tl.fromTo('.exp-center', { opacity: 0, y:  60, filter: 'blur(8px)' },  { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.12 }, '-=1.0')
    tl.fromTo('.exp-next',   { opacity: 0, y:  20 },                       { opacity: 1, y: 0, duration: 0.5 },                                     '-=0.3')

    return () => tl.kill()
  }, [])

  /* ── Next-button hover handlers ── */
  const onNextEnter = useCallback((e) => {
    const el = e.currentTarget
    el.style.borderColor = `${EYE.warm}60`
    el.style.transform   = 'translateX(6px)'
    el.style.background  = `${EYE.warm}0a`
  }, [])

  const onNextLeave = useCallback((e) => {
    const el = e.currentTarget
    el.style.borderColor = `${EYE.warm}30`
    el.style.transform   = ''
    el.style.background  = 'none'
  }, [])

  const goAbout = useCallback(() => go('about'), [go])

  return (
    <div style={{ width: '100vw', height: '100vh', background: EYE.bg, position: 'relative', overflow: 'hidden' }}>
      <Particles />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.1fr 1fr',
          gridTemplateRows: '1fr 1fr 1fr',
          gap: 10, padding: 10,
          width: '100vw', height: '100vh',
          position: 'relative', zIndex: 1,
        }}
      >
        {/* Row 1 */}
        <ExpCard exp={EXPERIENCES[0]} className="exp-left"  style={{ gridColumn: '1', gridRow: '1', opacity: 0 }} />

        <div
          className="exp-center"
          style={{
            gridColumn: '2', gridRow: '1',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 8, opacity: 0,
          }}
        >
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 13, color: EYE.skin, letterSpacing: 4, textTransform: 'uppercase' }}>
            Experience
          </p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 800, color: EYE.cream, letterSpacing: -2, textAlign: 'center', lineHeight: 1.1 }}>
            Where I've<br />Worked
          </h2>
        </div>

        <ExpCard exp={EXPERIENCES[3]} className="exp-right" style={{ gridColumn: '3', gridRow: '1', opacity: 0 }} />

        {/* Row 2 */}
        <ExpCard exp={EXPERIENCES[1]} className="exp-left"  style={{ gridColumn: '1', gridRow: '2', opacity: 0 }} />

        <div
          className="eye-center"
          style={{
            gridColumn: '2', gridRow: '2',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'visible', zIndex: 5, opacity: 0,
          }}
        >
          <div
            style={{
              width: 900, height: 900, borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 2px rgba(255,255,255,0.04)',
              marginTop: -150,
            }}
          >
            <canvas ref={canvasRef} style={{ display: 'block' }} />
          </div>
        </div>

        <ExpCard exp={EXPERIENCES[2]} className="exp-right" style={{ gridColumn: '3', gridRow: '2', opacity: 0 }} />

        {/* Row 3 */}
        <ExpCard exp={EXPERIENCES[4]} className="exp-left"   style={{ gridColumn: '1', gridRow: '3', opacity: 0 }} />
        <ExpCard exp={EXPERIENCES[5]} className="exp-center"  style={{ gridColumn: '2', gridRow: '3', opacity: 0 }} />

        <div
          className="exp-next"
          style={{
            gridColumn: '3', gridRow: '3',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 16, opacity: 0,
          }}
        >
          <button
            onClick={goAbout}
            onMouseEnter={onNextEnter}
            onMouseLeave={onNextLeave}
            style={{
              background: 'none',
              border: `1.5px solid ${EYE.warm}30`,
              borderRadius: 60, padding: '28px 48px',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 14,
              transition: 'all 0.4s cubic-bezier(0.25,0,0,1)',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: `${EYE.warm}70`, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 4 }}>Next</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: EYE.cream, lineHeight: 1.15 }}>About Me</div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={`${EYE.warm}70`} strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <NavOverlay go={go} current="experience" dark />
    </div>
  )
}
