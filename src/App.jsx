import { useState, useCallback, useRef, useEffect } from 'react'
import gsap from 'gsap'
import HomePage from './components/HomePage'
import ProjectsPage from './components/ProjectsPage'
import ExperiencePage from './components/ExperiencePage'
import AboutPage from './components/AboutPage'

const BG = { home: '#E37B88', projects: '#8a8685', experience: '#313131', about: '#ffffff' }
const STRIP_COUNT = 5

export default function App() {
  const [page, setPage] = useState('home')
  const [busy, setBusy] = useState(false)
  const stripsRef = useRef([])
  const grainRef = useRef(null)

  // Grain texture animation
  useEffect(() => {
    if (!grainRef.current) return
    let frame
    const animate = () => {
      if (grainRef.current) {
        grainRef.current.style.transform = `translate(${Math.random() * 100}px, ${Math.random() * 100}px)`
      }
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  const go = useCallback((target) => {
    if (target === page || busy) return
    setBusy(true)
    const color = BG[target] || '#1a1a1a'

    const tl = gsap.timeline()

    // Set all strips to target color and reset
    stripsRef.current.forEach(el => {
      if (el) gsap.set(el, { scaleY: 0, background: color, transformOrigin: 'top center' })
    })

    // Stagger strips in
    tl.to(stripsRef.current.filter(Boolean), {
      scaleY: 1,
      duration: 0.6,
      stagger: 0.06,
      ease: 'power3.inOut',
    })

    // Switch page at peak coverage
    tl.call(() => setPage(target), null, '-=0.1')

    // Stagger strips out (from bottom)
    tl.to(stripsRef.current.filter(Boolean), {
      scaleY: 0,
      duration: 0.6,
      stagger: 0.05,
      ease: 'power2.inOut',
      delay: 0.15,
      onComplete: () => setBusy(false),
    })
    // Change origin for exit
    tl.set(stripsRef.current.filter(Boolean), { transformOrigin: 'bottom center' }, `-=${0.45 + 0.05 * STRIP_COUNT + 0.15}`)

  }, [page, busy])

  return (
    <>
      <div style={{ position: 'fixed', inset: 0 }}>
        {page === 'home' && <HomePage go={go} />}
        {page === 'projects' && <ProjectsPage go={go} />}
        {page === 'experience' && <ExperiencePage go={go} />}
        {page === 'about' && <AboutPage go={go} />}
      </div>

      {/* Film grain overlay — subtle texture across entire app */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 999, pointerEvents: 'none',
        opacity: 0.03, mixBlendMode: 'multiply',
      }}>
        <div ref={grainRef} style={{
          position: 'absolute', inset: '-200px',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }} />
      </div>

      {/* 增强型胶片层：混合模式改为 overlay 增加质感 */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 999, pointerEvents: 'none',
        opacity: 0.05, mixBlendMode: 'overlay',
      }}>
        <div ref={grainRef} style={{
          position: 'absolute', inset: '-100%',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Transition strips */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 600,
        pointerEvents: 'none',
        display: 'flex',
      }}>
        {Array.from({ length: STRIP_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={el => stripsRef.current[i] = el}
            style={{
              flex: 1,
              height: '100%',
              transform: 'scaleY(0)',
              transformOrigin: 'top center',
            }}
          />
        ))}
      </div>
    </>
  )
}
