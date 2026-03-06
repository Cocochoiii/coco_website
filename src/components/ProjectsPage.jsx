import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import NavOverlay from './NavOverlay'

/*
 * Every color here is sampled from the Warhol Rive:
 * pink = face, yellow = hair, grey = background,
 * blue = eyeshadow, orange = collar, dark = outlines/hair
 */
const PAL = {
  pink:   '#d4849e',
  yellow: '#d4b820',
  grey:   '#8a8685',
  blue:   '#9cc5d6',
  orange: '#d88a18',
  dark:   '#2a2a20',
}

const PROJECTS = [
  {
    title: 'Pet Paradise',
    meta: 'Next.js · TypeScript · MongoDB · Stripe',
    year: "'24",
    bg: PAL.pink,       text: '#fff',
    hBg: PAL.dark,      hText: PAL.pink,
    link: 'https://github.com/Cocochoiii/coco_pets',
  },
  {
    title: 'Media Recommender',
    meta: 'Python · PyTorch · BERT · AWS SageMaker',
    year: "'24",
    bg: PAL.blue,       text: PAL.dark,
    hBg: PAL.dark,      hText: PAL.blue,
    link: 'https://github.com/Cocochoiii/media-recs_platform',
  },
  {
    title: 'MedSync Pro',
    meta: 'React · FastAPI · PostgreSQL · Redis · Docker',
    year: "'25",
    bg: PAL.yellow,     text: PAL.dark,
    hBg: PAL.dark,      hText: PAL.yellow,
    link: 'https://github.com/Cocochoiii/healthcare-analytics-platform',
  },
  {
    title: 'Audi E-Charging',
    meta: 'React · TypeScript · Express · Socket.IO',
    year: "'23",
    bg: PAL.dark,       text: PAL.yellow,
    hBg: PAL.yellow,    hText: PAL.dark,
    link: 'https://github.com/Cocochoiii/audi-e-charging-app',
  },
  {
    title: 'Audi IoT Platform',
    meta: 'FastAPI · Kafka · TimescaleDB · React · ML',
    year: "'23",
    bg: PAL.orange,     text: PAL.dark,
    hBg: PAL.dark,      hText: PAL.orange,
    link: 'https://github.com/Cocochoiii/audi-iot-platform',
  },
  {
    title: 'MalHae 말해',
    meta: 'Swift · SwiftUI · MapKit · MVVM',
    year: "'25",
    bg: PAL.pink,       text: PAL.dark,
    hBg: PAL.grey,      hText: '#fff',
    link: 'https://github.com/Cocochoiii/korean_learning_APP',
  },
  {
    title: 'Mars E-Commerce',
    meta: 'React · GraphQL · Node.js · RabbitMQ',
    year: "'22",
    bg: PAL.yellow,     text: PAL.dark,
    hBg: PAL.orange,    hText: '#fff',
    link: 'https://github.com/Cocochoiii/mars-ecommerce',
  },
  {
    title: 'AdServe Pro',
    meta: 'TypeScript · TensorFlow.js · Kafka · K8s',
    year: "'25",
    bg: PAL.grey,       text: '#fff',
    hBg: PAL.blue,      hText: PAL.dark,
    link: 'https://github.com/Cocochoiii/google_ads',
  },
]


/*
 * Two-layer text approach:
 * Layer A = normal text on base bg (always visible underneath)
 * Layer B = hover text INSIDE the clip-path div (reveals with hover bg)
 * → Text is ALWAYS readable at every frame of the animation.
 */
function CardContent({ p, compact, hovered, isHover = false }) {
  const col = isHover ? p.hText : p.text
  const titleSize = compact
                    ? 'clamp(20px, 2.2vw, 28px)'
                    : 'clamp(26px, 3vw, 42px)'
  const yearSize = compact
                   ? 'clamp(70px, 10vw, 110px)'
                   : 'clamp(90px, 14vw, 180px)'

  return (
      <div style={{
        position: 'absolute', inset: 0, zIndex: isHover ? 2 : 0,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: compact ? '18px 20px' : '26px 28px',
        pointerEvents: 'none',
      }}>
        {/* Year watermark — centered, giant */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: "'Playfair Display', serif",
          fontSize: yearSize,
          fontWeight: 900,
          fontStyle: 'italic',
          color: col,
          opacity: 0.06,
          lineHeight: 1,
          letterSpacing: -6,
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}>
          {p.year}
        </div>

        {/* Year label — top left */}
        <div style={{
          position: 'absolute',
          top: compact ? 16 : 24,
          left: compact ? 20 : 28,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 3,
          color: col,
          opacity: 0.3,
        }}>
          {p.year}
        </div>

        {/* Arrow — top right, only on hover layer */}
        {isHover && (
            <div style={{
              position: 'absolute',
              top: compact ? 14 : 22,
              right: compact ? 18 : 26,
              opacity: hovered ? 0.6 : 0,
              transform: hovered ? 'translate(0,0)' : 'translate(-6px, 6px)',
              transition: 'all 0.4s cubic-bezier(0.25,0,0,1)',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8">
                <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
        )}

        {/* Title */}
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: titleSize,
          fontWeight: 800,
          color: col,
          lineHeight: 1.05,
          letterSpacing: -1,
          margin: 0,
          marginBottom: compact ? 8 : 12,
          transform: (isHover && hovered) ? 'translateX(3px)' : 'translateX(0)',
          transition: 'transform 0.45s cubic-bezier(0.25,0,0,1)',
        }}>
          {p.title}
        </h3>

        {/* Meta */}
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: compact ? 13 : 14,
          fontWeight: 500,
          letterSpacing: 1.2,
          color: col,
          opacity: 0.55,
          textTransform: 'uppercase',
          lineHeight: 1.5,
        }}>
          {p.meta}
        </div>

        {/* Decorative line */}
        <div style={{
          width: (isHover && hovered) ? 50 : 30,
          height: 2.5,
          background: col,
          opacity: 0.2,
          borderRadius: 3,
          marginTop: compact ? 10 : 14,
          transition: 'width 0.5s cubic-bezier(0.25,0,0,1)',
        }} />
      </div>
  )
}


function ArtCard({ p, className = '', style = {}, compact = false }) {
  const cardRef = useRef(null)
  const hoverRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  const onMove = (e) => {
    const c = cardRef.current
    if (!c) return
    const r = c.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    gsap.to(c, { rotateY: x * 5, rotateX: -y * 5, duration: 0.4, ease: 'power2.out' })
  }

  const onEnter = () => {
    setHovered(true)
    if (hoverRef.current) {
      gsap.fromTo(hoverRef.current,
                  { clipPath: 'circle(0% at 100% 100%)' },
                  { clipPath: 'circle(150% at 100% 100%)', duration: 0.55, ease: 'power3.out' }
      )
    }
  }

  const onLeave = () => {
    setHovered(false)
    if (cardRef.current) gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power3.out' })
    if (hoverRef.current) {
      gsap.to(hoverRef.current,
              { clipPath: 'circle(0% at 100% 100%)', duration: 0.4, ease: 'power2.in' }
      )
    }
  }

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
          onClick={() => { if (p.link) window.open(p.link, '_blank') }}
      >
        {/* Layer A: Normal state text — always on base bg */}
        <CardContent p={p} compact={compact} hovered={hovered} isHover={false} />

        {/* Hover bg + hover text together — clip-path reveals both at once */}
        <div ref={hoverRef} style={{
          position: 'absolute', inset: 0,
          background: p.hBg,
          clipPath: 'circle(0% at 100% 100%)',
          zIndex: 1,
        }}>
          <CardContent p={p} compact={compact} hovered={hovered} isHover={true} />
        </div>
      </div>
  )
}


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
    tl.fromTo('.wart', { opacity: 0, x: -100, filter: 'blur(14px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.1, delay: 0.15 })
    tl.fromTo('.proj-left', { opacity: 0, x: -60, filter: 'blur(10px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.08 }, '-=0.6')
    tl.fromTo('.proj-right', { opacity: 0, x: 60, filter: 'blur(10px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.08 }, '-=0.85')
    tl.fromTo('.proj-wide', { opacity: 0, y: 40, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7 }, '-=0.9')
  }, [])

  return (
      <div style={{
        width: '100vw', height: '100vh',
        background: PAL.grey,
        position: 'relative', overflow: 'hidden', display: 'flex',
      }}>
        {/* Warhol Rive — original 40% */}
        <div className="wart" style={{ width: '40%', flexShrink: 0, overflow: 'hidden', opacity: 0, position: 'relative', zIndex: 1 }}>
          <canvas ref={canvasRef} style={{ display: 'block' }} />
          <div style={{ position: 'absolute', bottom: 40, left: 28, right: 28, zIndex: 5 }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 12, color: '#c9a96e', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 8 }}>Selected</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: '#f0e8dc', lineHeight: 1.05, letterSpacing: -2 }}>Projects</h2>
            <div style={{ width: 40, height: 2, background: '#c9a96e', marginTop: 14, borderRadius: 2 }} />
          </div>
        </div>

        {/* Grid */}
        <div style={{
          flex: 1, display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1.15fr 0.55fr 1fr 1.3fr',
          gap: 7, padding: 7, height: '100vh',
          zIndex: 1,
        }}>
          <ArtCard p={PROJECTS[0]} className="proj-left"  style={{ gridColumn: '1', gridRow: '1', opacity: 0 }} />
          <ArtCard p={PROJECTS[1]} className="proj-right" style={{ gridColumn: '2', gridRow: '1', opacity: 0 }} />
          <ArtCard p={PROJECTS[2]} className="proj-wide"   style={{ gridColumn: '1 / 3', gridRow: '2', opacity: 0 }} />
          <ArtCard p={PROJECTS[3]} className="proj-left"  style={{ gridColumn: '1', gridRow: '3', opacity: 0 }} />
          <ArtCard p={PROJECTS[4]} className="proj-right" style={{ gridColumn: '2', gridRow: '3', opacity: 0 }} />
          <ArtCard p={PROJECTS[5]} className="proj-left"  style={{ gridColumn: '1', gridRow: '4', opacity: 0 }} />
          <div style={{ gridColumn: '2', gridRow: '4', display: 'flex', flexDirection: 'column', gap: 7 }}>
            <ArtCard p={PROJECTS[6]} className="proj-right" style={{ flex: 1, opacity: 0 }} compact />
            <ArtCard p={PROJECTS[7]} className="proj-right" style={{ flex: 1, opacity: 0 }} compact />
          </div>
        </div>

        <button className="page-back" onClick={() => go('home')} style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.12)', zIndex: 100 }}>←</button>
        <NavOverlay go={go} current="projects" dark />
      </div>
  )
}