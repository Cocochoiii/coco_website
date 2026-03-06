import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import NavOverlay from './NavOverlay'

/*
 * Warm palette from the oil-painting eye Rive
 */
const EYE = {
  skin:   '#c4a48a',
  rose:   '#c47a6e',
  shadow: '#3d2f2a',
  cream:  '#f0e8dc',
  iris:   '#8a9ba3',
  warm:   '#b8917a',
  bg:     '#2d2825',
}

const EXPS = [
  {
    title: 'UbiWell Lab',
    role: 'Software Engineer Intern',
    period: 'May 2025 – Oct 2025',
    color: EYE.rose,
    hBg: EYE.cream, hText: EYE.shadow,
    highlights: [
      'Django/FastAPI microservices · 2.5M+ data points/day',
      '100+ React/TS dashboards · 1,000+ daily users',
      'iOS module with on-device ML · 99.7% reliability',
      'Kafka event-driven · 50K events/s',
    ],
  },
  {
    title: 'Audi Innovation',
    role: 'Data Engineer Intern',
    period: 'Jan 2023 – Aug 2024',
    color: EYE.skin,
    hBg: EYE.shadow, hText: EYE.skin,
    highlights: [
      '500+ GB/day from 20K+ IoT sensors · 99.9% uptime',
      'Airflow + Spark ETL · batch time ↓42%',
      'Snowflake + dbt · SQL perf ↑60%',
      '15+ PySpark models · $2M/yr retention',
    ],
  },
  {
    title: 'Mars Inc. HK',
    role: 'Full Stack Developer',
    period: 'Feb 2022 – Dec 2022',
    color: EYE.warm,
    hBg: EYE.cream, hText: EYE.shadow,
    highlights: [
      'React Native + GraphQL · 5,000+ DAU',
      'Socket.IO + Redis · 10K concurrent',
      'MongoDB geospatial · latency ↓65%',
      'Architecture supporting $300K Q1 rev',
    ],
  },
  {
    title: 'Pet Paradise',
    role: 'Founder & Developer',
    period: '2024 – Now',
    color: EYE.iris,
    hBg: EYE.shadow, hText: EYE.iris,
    highlights: [
      'Next.js 14 + TypeScript + Stripe',
      'iOS companion app · Swift/SwiftUI',
      'Real-time chat · booking · admin',
      'Caring for 20+ cats & dogs',
    ],
  },
  {
    title: 'Northeastern',
    role: 'MS Computer Science',
    period: '2024 – 2027',
    color: EYE.rose,
    hBg: EYE.rose, hText: '#fff',
    highlights: [
      'GPA 3.8/4.0 · Boston, MA',
      'OOD · Algorithms · Cloud · Distributed Systems',
    ],
  },
  {
    title: 'Franklin & Marshall',
    role: 'BA Business & Film',
    period: '2018 – 2021',
    color: EYE.skin,
    hBg: EYE.skin, hText: EYE.shadow,
    highlights: [
      'GPA 3.72/4.0 · Lancaster, PA',
      'Double major: Business & Film Studies',
    ],
  },
]

/*
 * Shared content — rendered twice (normal + hover layer)
 * so text is ALWAYS readable during clip-path animation
 */
function CardInner({ exp, isHover, hovered }) {
  const titleCol = isHover ? exp.hText : EYE.cream
  const subCol = isHover ? `${exp.hText}bb` : 'rgba(255,255,255,0.45)'
  const dotCol = isHover ? exp.hText : exp.color
  const hlCol = isHover ? `${exp.hText}cc` : 'rgba(255,255,255,0.4)'
  const periodCol = isHover ? `${exp.hText}99` : exp.color

  return (
      <div style={{
        position: 'absolute', inset: 0, zIndex: isHover ? 2 : 0,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        textAlign: 'center',
        padding: '22px 24px',
        pointerEvents: 'none',
      }}>
        {/* Period */}
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15, fontWeight: 700,
          letterSpacing: 3, textTransform: 'uppercase',
          color: periodCol,
          marginBottom: 12,
        }}>
          {exp.period}
        </div>

        {/* Title — BIG */}
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(80px, 3vw, 40px)',
          fontWeight: 800,
          color: titleCol,
          lineHeight: 1.05,
          letterSpacing: -0.5,
          margin: 0, marginBottom: 6,
          transform: (isHover && hovered) ? 'translateY(-2px)' : 'none',
          transition: 'transform 0.4s cubic-bezier(0.25,0,0,1)',
        }}>
          {exp.title}
        </h3>

        {/* Role */}
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 40, fontWeight: 500,
          color: subCol,
          marginBottom: 16,
        }}>
          {exp.role}
        </div>

        {/* Highlights — centered, readable */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          gap: 5, alignItems: 'center',
        }}>
          {exp.highlights.map((h, i) => (
              <div key={i} style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 25,
                color: hlCol,
                lineHeight: 1.45,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
            <span style={{
              width: 4, height: 4, borderRadius: '50%',
              background: dotCol,
              opacity: 0.5,
              flexShrink: 0,
            }} />
                {h}
              </div>
          ))}
        </div>

        {/* Decorative line */}
        <div style={{
          width: (isHover && hovered) ? 50 : 28,
          height: 2,
          background: dotCol,
          opacity: 0.25,
          borderRadius: 2,
          marginTop: 16,
          transition: 'width 0.5s cubic-bezier(0.25,0,0,1)',
        }} />
      </div>
  )
}


function ExpCard({ exp, className = '', style = {} }) {
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
                  { clipPath: 'circle(0% at 50% 0%)' },
                  { clipPath: 'circle(150% at 50% 0%)', duration: 0.6, ease: 'power3.out' }
      )
    }
  }

  const onLeave = () => {
    setHovered(false)
    if (cardRef.current) gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power3.out' })
    if (hoverRef.current) {
      gsap.to(hoverRef.current,
              { clipPath: 'circle(0% at 50% 0%)', duration: 0.4, ease: 'power2.in' }
      )
    }
  }

  return (
      <div
          ref={cardRef}
          className={`exp-card ${className}`}
          style={{
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 16,
            overflow: 'hidden',
            position: 'relative',
            cursor: 'default',
            perspective: 800,
            border: '1px solid rgba(255,255,255,0.06)',
            transition: 'box-shadow 0.5s cubic-bezier(0.25,0,0,1)',
            boxShadow: hovered ? `0 20px 50px rgba(0,0,0,0.3), 0 0 60px ${exp.color}10` : 'none',
            ...style,
          }}
          onMouseMove={onMove}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
      >
        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2.5,
          background: `linear-gradient(90deg, ${exp.color}, ${exp.color}33)`,
          zIndex: 3,
        }} />

        {/* Layer A: normal state — always on dark bg */}
        <CardInner exp={exp} isHover={false} hovered={hovered} />

        {/* Layer B: hover bg + hover text — clip-path reveals together */}
        <div ref={hoverRef} style={{
          position: 'absolute', inset: 0,
          background: exp.hBg,
          clipPath: 'circle(0% at 50% 0%)',
          zIndex: 1,
        }}>
          <CardInner exp={exp} isHover={true} hovered={hovered} />
        </div>
      </div>
  )
}


function Particles() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const particles = Array.from({ length: 25 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.4,
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.2,
      o: Math.random() * 0.08 + 0.02,
    }))
    let frame
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(240,232,220,${p.o})`; ctx.fill()
      })
      frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
}


export default function ExperiencePage({ go }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let r = null
    import('@rive-app/canvas').then((rive) => {
      const dpr = window.devicePixelRatio || 1
      const size = 900
      canvas.width = size * dpr; canvas.height = size * dpr
      canvas.style.width = size + 'px'; canvas.style.height = size + 'px'
      r = new rive.Rive({
                          src: '/experience.riv', canvas, artboard: 'AO Eyes',
                          stateMachines: 'Eyes', autoplay: true,
                          layout: new rive.Layout({ fit: rive.Fit.Cover, alignment: rive.Alignment.Center }),
                          onLoad: () => r.resizeDrawingSurfaceToCanvas(),
                        })
    })
    return () => { if (r) r.cleanup() }
  }, [])

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo('.eye-center', { opacity: 0, scale: 0.7, y: 60 }, { opacity: 1, scale: 1, y: 0, duration: 1.1, delay: 0.15 })
    tl.fromTo('.exp-left', { opacity: 0, x: -80, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.12 }, '-=0.7')
    tl.fromTo('.exp-right', { opacity: 0, x: 80, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.12 }, '-=0.9')
    tl.fromTo('.exp-center', { opacity: 0, y: 60, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.12 }, '-=1.0')
    tl.fromTo('.exp-next', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
  }, [])

  return (
      <div style={{ width: '100vw', height: '100vh', background: EYE.bg, position: 'relative', overflow: 'hidden' }}>
        <Particles />

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.1fr 1fr',
          gridTemplateRows: '1fr 1fr 1fr',
          gap: 10, padding: 10,
          width: '100vw', height: '100vh',
          position: 'relative', zIndex: 1,
        }}>
          {/* Row 1 */}
          <ExpCard exp={EXPS[0]} className="exp-left" style={{ gridColumn: '1', gridRow: '1', opacity: 0 }} />
          <div className="exp-center" style={{
            gridColumn: '2', gridRow: '1',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 8, opacity: 0,
          }}>
            <p style={{
              fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
              fontSize: 13, color: EYE.skin, letterSpacing: 4, textTransform: 'uppercase',
            }}>Experience</p>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 38, fontWeight: 800,
              color: EYE.cream, letterSpacing: -2,
              textAlign: 'center', lineHeight: 1.1,
            }}>Where I've<br/>Worked</h2>
          </div>
          <ExpCard exp={EXPS[3]} className="exp-right" style={{ gridColumn: '3', gridRow: '1', opacity: 0 }} />

          {/* Row 2 */}
          <ExpCard exp={EXPS[1]} className="exp-left" style={{ gridColumn: '1', gridRow: '2', opacity: 0 }} />
          <div className="eye-center" style={{
            gridColumn: '2', gridRow: '2',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'visible', zIndex: 5, opacity: 0,
          }}>
            <div style={{
              width: 900, height: 900, borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: `0 24px 80px rgba(0,0,0,0.5), 0 0 0 2px rgba(255,255,255,0.04)`,
              marginTop: -150,
            }}>
              <canvas ref={canvasRef} style={{ display: 'block' }} />
            </div>
          </div>
          <ExpCard exp={EXPS[2]} className="exp-right" style={{ gridColumn: '3', gridRow: '2', opacity: 0 }} />

          {/* Row 3 */}
          <ExpCard exp={EXPS[4]} className="exp-left" style={{ gridColumn: '1', gridRow: '3', opacity: 0 }} />
          <ExpCard exp={EXPS[5]} className="exp-center" style={{ gridColumn: '2', gridRow: '3', opacity: 0 }} />

          <div className="exp-next" style={{
            gridColumn: '3', gridRow: '3',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 16, opacity: 0,
          }}>
            <button onClick={() => go('about')} style={{
              background: 'none', border: `1.5px solid ${EYE.warm}30`, borderRadius: 60,
              padding: '28px 48px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 14,
              transition: 'all 0.4s cubic-bezier(0.25,0,0,1)',
            }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = `${EYE.warm}60`
                      e.currentTarget.style.transform = 'translateX(6px)'
                      e.currentTarget.style.background = `${EYE.warm}0a`
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = `${EYE.warm}30`
                      e.currentTarget.style.transform = ''
                      e.currentTarget.style.background = 'none'
                    }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: `${EYE.warm}70`, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 4 }}>Next</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: EYE.cream, lineHeight: 1.15 }}>About Me</div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={`${EYE.warm}70`} strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <NavOverlay go={go} current="experience" dark />
      </div>
  )
}