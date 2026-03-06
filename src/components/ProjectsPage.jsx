import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import NavOverlay from './NavOverlay'

const W = { pink: '#d4849e', yellow: '#d4b820', grey: '#8a8685', blue: '#9cc5d6', orange: '#d88a18', dark: '#2a2a20' }

const PROJECTS = [
  { title: 'Pet Paradise', meta: 'React · Express · Full Stack', year: '2024', bg: `linear-gradient(160deg, ${W.pink}, ${W.pink}aa)` },
  { title: 'Kambaz Web App', meta: 'Next.js · Redux · TypeScript', year: '2024', bg: `linear-gradient(135deg, ${W.yellow}, ${W.yellow}aa)` },
  { title: 'Healthcare Dashboard', meta: 'React · TypeScript · UbiWell', year: '2023', bg: `linear-gradient(to right, ${W.blue}, ${W.blue}aa)` },
  { title: 'IoT Data Pipeline', meta: 'Python · Airflow · AWS', year: '2023', bg: `linear-gradient(145deg, ${W.orange}, ${W.orange}aa)` },
  { title: 'iOS Pet App', meta: 'Swift · SwiftUI · CoreData', year: '2024', bg: `linear-gradient(135deg, ${W.dark}, #3a3a30)` },
  { title: 'Piano Portfolio', meta: 'React · Rive · GSAP', year: '2025', bg: `linear-gradient(135deg, ${W.grey}, ${W.grey}cc)` },
]

export default function ProjectsPage({ go }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let r = null
    import('@rive-app/canvas').then((rive) => {
      const dpr = window.devicePixelRatio || 1
      const cW = window.innerWidth * 0.4, H = window.innerHeight
      canvas.width = cW * dpr; canvas.height = H * dpr
      canvas.style.width = cW + 'px'; canvas.style.height = H + 'px'
      r = new rive.Rive({
        src: '/warhol.riv', canvas, artboard: 'New Artboard',
        animations: 'Animation 1', autoplay: true,
        layout: new rive.Layout({ fit: rive.Fit.Cover, alignment: rive.Alignment.Center }),
        onLoad: () => r.resizeDrawingSurfaceToCanvas(),
      })
    }).catch(() => {})
    return () => { if (r) r.cleanup() }
  }, [])

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    // Warhol — dramatic slide from far left with blur
    tl.fromTo('.wart', { opacity: 0, x: -100, filter: 'blur(14px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.1, delay: 0.15 })
    // Left column — from left
    tl.fromTo('.proj-left', { opacity: 0, x: -70, filter: 'blur(10px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.75, stagger: 0.1 }, '-=0.6')
    // Right column — from right
    tl.fromTo('.proj-right', { opacity: 0, x: 70, filter: 'blur(10px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.75, stagger: 0.1 }, '-=0.9')
    // Wide card — rise from below
    tl.fromTo('.proj-wide', { opacity: 0, y: 50, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.75 }, '-=1.0')
  }, [])

  const cardStyle = (bg) => ({
    background: bg, borderRadius: 20, position: 'relative', cursor: 'pointer',
    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    overflow: 'hidden', transformStyle: 'preserve-3d',
    transition: 'box-shadow 0.4s',
  })

  const handleCardMove = (e) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    gsap.to(card, { rotateY: x * 6, rotateX: -y * 6, scale: 1.02, duration: 0.3, ease: 'power2.out' })
    card.style.boxShadow = `${-x * 20}px ${y * 20}px 40px rgba(0,0,0,0.3)`
  }

  const handleCardLeave = (e) => {
    gsap.to(e.currentTarget, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.5, ease: 'power3.out' })
    e.currentTarget.style.boxShadow = ''
  }

  const info = (p, size = 28) => (
    <div style={{ padding: '24px 24px', background: 'linear-gradient(transparent, rgba(0,0,0,0.4))', marginTop: 'auto' }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: size, fontWeight: 700, color: 'white', marginBottom: 4 }}>{p.title}</div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.55)', letterSpacing: 1.5, textTransform: 'uppercase' }}>{p.meta} · {p.year}</div>
    </div>
  )

  return (
    <div style={{ width: '100vw', height: '100vh', background: W.grey, position: 'relative', overflow: 'hidden', display: 'flex' }}>

      <div className="wart" style={{ width: '40%', flexShrink: 0, overflow: 'hidden', opacity: 0 }}>
        <canvas ref={canvasRef} style={{ display: 'block' }} />
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1.2fr 0.8fr 1fr', gap: 10, padding: 10, height: '100vh', perspective: 1000 }}>
        <div className="proj-card proj-left" style={{ ...cardStyle(PROJECTS[0].bg), gridColumn: '1', gridRow: '1', opacity: 0 }} onMouseMove={handleCardMove} onMouseLeave={handleCardLeave}>{info(PROJECTS[0])}</div>
        <div className="proj-card proj-right" style={{ ...cardStyle(PROJECTS[1].bg), gridColumn: '2', gridRow: '1', opacity: 0 }} onMouseMove={handleCardMove} onMouseLeave={handleCardLeave}>{info(PROJECTS[1])}</div>
        <div className="proj-card proj-wide" style={{ ...cardStyle(PROJECTS[2].bg), gridColumn: '1 / 3', gridRow: '2', opacity: 0 }} onMouseMove={handleCardMove} onMouseLeave={handleCardLeave}>{info(PROJECTS[2], 32)}</div>
        <div className="proj-card proj-left" style={{ ...cardStyle(PROJECTS[3].bg), gridColumn: '1', gridRow: '3', opacity: 0 }} onMouseMove={handleCardMove} onMouseLeave={handleCardLeave}>{info(PROJECTS[3])}</div>
        <div style={{ gridColumn: '2', gridRow: '3', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="proj-card proj-right" style={{ ...cardStyle(PROJECTS[4].bg), flex: 1, opacity: 0 }} onMouseMove={handleCardMove} onMouseLeave={handleCardLeave}>{info(PROJECTS[4], 22)}</div>
          <div className="proj-card proj-right" style={{ ...cardStyle(PROJECTS[5].bg), flex: 1, opacity: 0 }} onMouseMove={handleCardMove} onMouseLeave={handleCardLeave}>{info(PROJECTS[5], 22)}</div>
        </div>
      </div>

      <button className="page-back" onClick={() => go('home')} style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.12)', zIndex: 20 }}>←</button>
      <NavOverlay go={go} current="projects" dark />
    </div>
  )
}
