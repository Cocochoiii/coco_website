import { useState, useCallback, useRef, useEffect } from 'react'
import gsap from 'gsap'

import HomePage from './components/HomePage'
import ProjectsPage from './components/ProjectsPage'
import ExperiencePage from './components/ExperiencePage'
import AboutPage from './components/AboutPage'
import { BG, STRIP_COUNT } from './constants/theme'

/* ─── Grain noise SVGs (data-URIs) ─── */

const GRAIN_A = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
const GRAIN_B = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`

/* ─── Page lookup ─── */

const PAGES = { home: HomePage, projects: ProjectsPage, experience: ExperiencePage, about: AboutPage }

export default function App() {
  const [page, setPage] = useState('home')
  const [busy, setBusy] = useState(false)
  const stripsRef = useRef([])
  const grainRefA = useRef(null)   // FIX: separate refs for each grain layer
  const grainRefB = useRef(null)

  /* ── Grain texture animation ── */
  useEffect(() => {
    let frame

    const animate = () => {
      if (grainRefA.current) {
        grainRefA.current.style.transform = `translate(${Math.random() * 100}px, ${Math.random() * 100}px)`
      }
      if (grainRefB.current) {
        grainRefB.current.style.transform = `translate(${Math.random() * 80}px, ${Math.random() * 80}px)`
      }
      frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  /* ── Page transition ── */
  const go = useCallback(
    (target) => {
      if (target === page || busy) return
      setBusy(true)

      const color = BG[target] || '#1a1a1a'
      const strips = stripsRef.current.filter(Boolean)
      const tl = gsap.timeline()

      // Reset all strips
      strips.forEach((el) => {
        gsap.set(el, { scaleY: 0, background: color, transformOrigin: 'top center' })
      })

      // Stagger in
      tl.to(strips, { scaleY: 1, duration: 0.6, stagger: 0.06, ease: 'power3.inOut' })

      // Switch page at peak
      tl.call(() => setPage(target), null, '-=0.1')

      // Change origin for exit, then stagger out
      tl.set(strips, { transformOrigin: 'bottom center' }, `-=${0.45 + 0.05 * STRIP_COUNT + 0.15}`)
      tl.to(strips, {
        scaleY: 0, duration: 0.6, stagger: 0.05,
        ease: 'power2.inOut', delay: 0.15,
        onComplete: () => setBusy(false),
      })
    },
    [page, busy],
  )

  /* ── Render active page ── */
  const ActivePage = PAGES[page]

  return (
    <>
      <div style={{ position: 'fixed', inset: 0 }}>
        <ActivePage go={go} />
      </div>

      {/* Film grain layer A — multiply */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 999, pointerEvents: 'none', opacity: 0.03, mixBlendMode: 'multiply' }}>
        <div
          ref={grainRefA}
          style={{
            position: 'absolute', inset: '-200px',
            backgroundImage: GRAIN_A,
            backgroundSize: '200px 200px',
          }}
        />
      </div>

      {/* Film grain layer B — overlay */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 999, pointerEvents: 'none', opacity: 0.05, mixBlendMode: 'overlay' }}>
        <div
          ref={grainRefB}
          style={{
            position: 'absolute', inset: '-100%',
            backgroundImage: GRAIN_B,
          }}
        />
      </div>

      {/* Transition strips */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 600, pointerEvents: 'none', display: 'flex' }}>
        {Array.from({ length: STRIP_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={(el) => (stripsRef.current[i] = el)}
            style={{
              flex: 1, height: '100%',
              transform: 'scaleY(0)',
              transformOrigin: 'top center',
            }}
          />
        ))}
      </div>
    </>
  )
}
