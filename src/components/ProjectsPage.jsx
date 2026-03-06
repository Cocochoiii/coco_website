import { useEffect, useRef } from 'react'
import gsap from 'gsap'

import NavOverlay from './NavOverlay'
import ArtCard from './cards/ArtCard'
import { PAL } from '../constants/theme'
import { PROJECTS } from '../constants/data'

export default function ProjectsPage({ go }) {
  const canvasRef = useRef(null)

  /* ── Rive — Warhol animation ── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let r = null

    import('@rive-app/canvas')
      .then((rive) => {
        const dpr = window.devicePixelRatio || 1
        const cW  = window.innerWidth * 0.4
        const H   = window.innerHeight

        canvas.width  = cW * dpr
        canvas.height = H  * dpr
        canvas.style.width  = cW + 'px'
        canvas.style.height = H  + 'px'

        r = new rive.Rive({
          src: '/warhol.riv',
          canvas,
          artboard: 'New Artboard',
          animations: 'Animation 1',
          autoplay: true,
          layout: new rive.Layout({ fit: rive.Fit.Cover, alignment: rive.Alignment.Center }),
          onLoad: () => r.resizeDrawingSurfaceToCanvas(),
        })
      })
      .catch(() => {})

    return () => { if (r) r.cleanup() }
  }, [])

  /* ── Entrance animations ── */
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo('.wart',       { opacity: 0, x: -100, filter: 'blur(14px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.1, delay: 0.15 })
    tl.fromTo('.proj-left',  { opacity: 0, x:  -60, filter: 'blur(10px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.08 }, '-=0.6')
    tl.fromTo('.proj-right', { opacity: 0, x:   60, filter: 'blur(10px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.08 }, '-=0.85')
    tl.fromTo('.proj-wide',  { opacity: 0, y:   40, filter: 'blur(8px)' },  { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7 },                '-=0.9')

    return () => tl.kill()
  }, [])

  return (
    <div
      style={{
        width: '100vw', height: '100vh',
        background: PAL.grey,
        position: 'relative', overflow: 'hidden', display: 'flex',
      }}
    >
      {/* Warhol Rive — 40% left panel */}
      <div className="wart" style={{ width: '40%', flexShrink: 0, overflow: 'hidden', opacity: 0, position: 'relative', zIndex: 1 }}>
        <canvas ref={canvasRef} style={{ display: 'block' }} />
        <div style={{ position: 'absolute', bottom: 40, left: 28, right: 28, zIndex: 5 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 20, color: '#c9a96e', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 8 }}>
            Selected
          </p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(48px, 4vw, 60px)', fontWeight: 800, color: '#f0e8dc', lineHeight: 1.05, letterSpacing: -2 }}>
            Projects
          </h2>
          <div style={{ width: 40, height: 2, background: '#c9a96e', marginTop: 14, borderRadius: 2 }} />
        </div>
      </div>

      {/* Project grid */}
      <div
        style={{
          flex: 1, display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1.15fr 0.55fr 1fr 1.3fr',
          gap: 7, padding: 7, height: '100vh',
          zIndex: 1,
        }}
      >
        <ArtCard p={PROJECTS[0]} className="proj-left"  style={{ gridColumn: '1',     gridRow: '1', opacity: 0 }} />
        <ArtCard p={PROJECTS[1]} className="proj-right" style={{ gridColumn: '2',     gridRow: '1', opacity: 0 }} />
        <ArtCard p={PROJECTS[2]} className="proj-wide"  style={{ gridColumn: '1 / 3', gridRow: '2', opacity: 0 }} />
        <ArtCard p={PROJECTS[3]} className="proj-left"  style={{ gridColumn: '1',     gridRow: '3', opacity: 0 }} />
        <ArtCard p={PROJECTS[4]} className="proj-right" style={{ gridColumn: '2',     gridRow: '3', opacity: 0 }} />
        <ArtCard p={PROJECTS[5]} className="proj-left"  style={{ gridColumn: '1',     gridRow: '4', opacity: 0 }} />

        <div style={{ gridColumn: '2', gridRow: '4', display: 'flex', flexDirection: 'column', gap: 7 }}>
          <ArtCard p={PROJECTS[6]} className="proj-right" style={{ flex: 1, opacity: 0 }} compact />
          <ArtCard p={PROJECTS[7]} className="proj-right" style={{ flex: 1, opacity: 0 }} compact />
        </div>
      </div>

      <button className="page-back" onClick={() => go('home')} style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.12)', zIndex: 100 }}>
        ←
      </button>
      <NavOverlay go={go} current="projects" dark />
    </div>
  )
}
