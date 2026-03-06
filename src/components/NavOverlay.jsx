import { useState, useEffect, useRef, useCallback, memo } from 'react'
import gsap from 'gsap'
import { NAV_PAGES } from '../constants/data'

function NavOverlay({ go, current = 'home', dark = false, light = false }) {
  const [open, setOpen]     = useState(false)
  const overlayRef          = useRef(null)
  const itemsRef            = useRef([])
  const lineRef             = useRef(null)
  const counterRef          = useRef(null)
  const progressRef         = useRef(null)
  const decorRef            = useRef(null)

  /* ── Derived styles ── */
  const barColor  = light ? '#999' : dark ? '#f0e8dc' : '#1a1a1a'
  const btnBg     = light ? 'rgba(0,0,0,0.04)' : dark ? 'rgba(255,255,255,0.07)' : 'white'
  const btnBorder = light ? '1.5px solid rgba(0,0,0,0.08)' : dark ? '1.5px solid rgba(255,255,255,0.1)' : 'none'
  const btnShadow = light ? 'none' : dark ? 'none' : '0 4px 15px rgba(0,0,0,0.1)'

  const currentIndex = NAV_PAGES.findIndex((p) => p.key === current)

  /* ── Open animation ── */
  useEffect(() => {
    if (!open) return

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
    tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 })
    tl.fromTo(decorRef.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 0.03, duration: 1.2, ease: 'power2.out' }, '-=0.3')
    tl.fromTo(progressRef.current, { scaleX: 0 }, { scaleX: (currentIndex + 1) / NAV_PAGES.length, duration: 0.8, ease: 'power2.out' }, '-=0.8')
    tl.fromTo(counterRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.6')
    tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.7 }, '-=0.4')

    itemsRef.current.forEach((el) => {
      if (el) tl.fromTo(el, { opacity: 0, x: 60, skewX: -3 }, { opacity: 1, x: 0, skewX: 0, duration: 0.6, ease: 'power3.out' }, '-=0.45')
    })

    return () => tl.kill()
  }, [open, currentIndex])

  /* ── Navigate with exit animation ── */
  const handleNav = useCallback(
    (key) => {
      if (key === current) { setOpen(false); return }

      const tl = gsap.timeline({
        onComplete: () => { setOpen(false); go(key) },
      })

      itemsRef.current.forEach((el, i) => {
        if (el) tl.to(el, { opacity: 0, x: -30, skewX: 2, duration: 0.25, ease: 'power2.in' }, i * 0.03)
      })

      tl.to(overlayRef.current, { opacity: 0, duration: 0.35 }, '-=0.15')
    },
    [current, go],
  )

  const toggleOpen = useCallback(() => setOpen((prev) => !prev), [])
  const close      = useCallback(() => setOpen(false), [])

  return (
    <>
      {/* Hamburger button */}
      <button
        className={`ham-btn hbtn ${open ? 'open' : ''}`}
        onClick={toggleOpen}
        style={{
          zIndex: 200, opacity: 1,
          background: open ? 'transparent' : btnBg,
          border: open ? 'none' : btnBorder,
          boxShadow: open ? 'none' : btnShadow,
        }}
      >
        <span className="bar" style={{ background: open ? 'white' : barColor }} />
        <span className="bar" style={{ background: open ? 'white' : barColor }} />
        <span className="bar" style={{ background: open ? 'white' : barColor }} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          ref={overlayRef}
          onClick={close}
          style={{
            position: 'fixed', inset: 0, zIndex: 150,
            background: 'rgba(10, 8, 8, 0.96)',
            backdropFilter: 'blur(24px) saturate(1.2)',
            display: 'flex', opacity: 0, overflow: 'hidden',
          }}
        >
          {/* Decorative circle */}
          <div
            ref={decorRef}
            style={{
              position: 'absolute', top: '50%', left: '25%',
              width: '60vh', height: '60vh', borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.08)',
              transform: 'translate(-50%, -50%) scale(0)',
              pointerEvents: 'none',
            }}
          />

          {/* Progress bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.05)' }}>
            <div
              ref={progressRef}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #E37B88, #c9a96e)',
                transformOrigin: 'left center', transform: 'scaleX(0)',
              }}
            />
          </div>

          {/* Counter */}
          <div style={{ position: 'absolute', bottom: 48, left: 60, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div
              ref={counterRef}
              style={{
                fontFamily: "'Playfair Display', serif", fontSize: 14,
                color: 'rgba(255,255,255,0.25)', letterSpacing: 3, opacity: 0,
              }}
            >
              {String(currentIndex + 1).padStart(2, '0')} / {String(NAV_PAGES.length).padStart(2, '0')}
            </div>
            <div ref={lineRef} style={{ width: 80, height: 1, background: 'rgba(255,255,255,0.12)', transformOrigin: 'left center' }} />
          </div>

          {/* Side label */}
          <div
            style={{
              position: 'absolute', left: 28, top: '50%',
              transform: 'translateY(-50%) rotate(-90deg)',
              fontFamily: "'DM Sans', sans-serif", fontSize: 10,
              letterSpacing: 4, color: 'rgba(255,255,255,0.1)', textTransform: 'uppercase',
            }}
          >
            Navigation
          </div>

          {/* Nav items */}
          <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: 'clamp(60px, 8vw, 140px)', gap: 6 }}>
            {NAV_PAGES.map((p, i) => {
              const isActive = p.key === current
              return (
                <NavItem
                  key={p.key}
                  page={p}
                  index={i}
                  isActive={isActive}
                  onNav={handleNav}
                  ref={(el) => (itemsRef.current[i] = el)}
                />
              )
            })}
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute', bottom: 48, right: 60,
              fontFamily: "'DM Sans', sans-serif", fontSize: 11,
              color: 'rgba(255,255,255,0.15)', letterSpacing: 2.5, textTransform: 'uppercase',
            }}
          >
            Coco Choi · 2025
          </div>
        </div>
      )}
    </>
  )
}

/* ── Single nav item (avoids inline handlers on every render) ── */

import { forwardRef } from 'react'

const NavItem = memo(
  forwardRef(function NavItem({ page, index, isActive, onNav }, ref) {
    const handleClick = (e) => {
      e.stopPropagation()
      onNav(page.key)
    }

    const handleEnter = (e) => {
      if (isActive) return
      gsap.to(e.currentTarget.querySelector('.nav-label'), { letterSpacing: 10, color: page.accent, duration: 0.4, ease: 'power2.out' })
      gsap.to(e.currentTarget.querySelector('.nav-sub'),   { opacity: 1, x: 0, duration: 0.35 })
      gsap.to(e.currentTarget.querySelector('.nav-line'),  { scaleX: 1, opacity: 1, duration: 0.4 })
    }

    const handleLeave = (e) => {
      if (isActive) return
      gsap.to(e.currentTarget.querySelector('.nav-label'), { letterSpacing: 3, color: 'rgba(255,255,255,0.8)', duration: 0.4 })
      gsap.to(e.currentTarget.querySelector('.nav-sub'),   { opacity: 0, x: 15, duration: 0.3 })
      gsap.to(e.currentTarget.querySelector('.nav-line'),  { scaleX: 0, opacity: 0, duration: 0.3 })
    }

    return (
      <button
        ref={ref}
        onClick={handleClick}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'right', padding: '14px 0', position: 'relative',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
          opacity: 0,
        }}
      >
        <div
          className="nav-line"
          style={{
            position: 'absolute', bottom: 8, right: 0, width: '100%', height: 1,
            background: page.accent,
            opacity: isActive ? 0.3 : 0,
            transformOrigin: 'right center',
            transform: isActive ? 'scaleX(0.3)' : 'scaleX(0)',
          }}
        />

        <span
          style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500,
            color: isActive ? page.accent : 'rgba(255,255,255,0.15)',
            letterSpacing: 3, marginBottom: 6,
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <span
          className="nav-label"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(38px, 5.5vw, 68px)', fontWeight: 800,
            color: isActive ? page.accent : 'rgba(255,255,255,0.8)',
            letterSpacing: isActive ? 8 : 3,
            lineHeight: 1.1,
            transition: 'letter-spacing 0.4s, color 0.4s',
          }}
        >
          {page.label}
        </span>

        <span
          className="nav-sub"
          style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500,
            color: 'rgba(255,255,255,0.3)', letterSpacing: 2.5,
            textTransform: 'uppercase', marginTop: 6,
            opacity: isActive ? 0.7 : 0,
            transform: isActive ? 'translateX(0)' : 'translateX(15px)',
          }}
        >
          {page.subtitle}
        </span>

        {isActive && (
          <div
            style={{
              position: 'absolute', right: -28, top: '50%',
              transform: 'translateY(-50%)',
              width: 7, height: 7, borderRadius: '50%',
              background: page.accent,
              boxShadow: `0 0 16px ${page.accent}80`,
            }}
          />
        )}
      </button>
    )
  }),
)

export default memo(NavOverlay)
