import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import NavOverlay from './NavOverlay'

const EXPS = [
  { title: 'Ubiwell Lab', role: 'Software Engineer Intern', period: '2024', color: '#E37B88', desc: 'Healthcare dashboards & research tools' },
  { title: 'Audi Innovation Research', role: 'Data Engineer Intern', period: '2023', color: '#c9a96e', desc: 'IoT data pipelines & analytics' },
  { title: 'Pet Paradise', role: 'Full Stack Developer', period: '2022', color: '#8b7ecf', desc: 'Enterprise web applications' },
  { title: 'Mars Inc. Hong Kong', role: 'Founder & Developer', period: '2024–Now', color: '#7aafcb', desc: 'Full-stack pet care platform' },
  { title: 'Northeastern University', role: 'MS Computer Science', period: '2025–2026', color: '#E37B88', desc: 'GPA 4.0 · Boston, MA' },
  { title: 'Franklin & Marshall', role: 'BA Business & Film', period: '2018–2022', color: '#c9a96e', desc: 'Lancaster, PA' },
]

function Card({ exp, style, className = '' }) {
  const cardRef = useRef(null)

  const handleMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    gsap.to(card, {
      rotateY: x * 8, rotateX: -y * 8,
      duration: 0.4, ease: 'power2.out',
    })
    // Move shine
    const shine = card.querySelector('.card-shine')
    if (shine) gsap.to(shine, { x: x * 60, y: y * 60, opacity: 0.08, duration: 0.3 })
  }

  const handleLeave = () => {
    const card = cardRef.current
    if (!card) return
    gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' })
    const shine = card.querySelector('.card-shine')
    if (shine) gsap.to(shine, { opacity: 0, duration: 0.4 })
  }

  return (
    <div ref={cardRef} className={`exp-card ${className}`} style={{
      background: 'rgba(255,255,255,0.05)', borderRadius: 20,
      overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)',
      cursor: 'pointer', position: 'relative',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      perspective: 800, transformStyle: 'preserve-3d',
      transition: 'box-shadow 0.4s',
      ...style,
    }}
    onMouseMove={handleMove}
    onMouseLeave={handleLeave}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
    >
      {/* Shine overlay */}
      <div className="card-shine" style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 60%)',
        opacity: 0, pointerEvents: 'none',
      }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${exp.color}, ${exp.color}44)` }} />
      <div style={{ padding: '22px 22px' }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: exp.color, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10, fontWeight: 700 }}>{exp.period}</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#f0e8dc', marginBottom: 4, lineHeight: 1.15 }}>{exp.title}</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 500, marginBottom: 6 }}>{exp.role}</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 400 }}>{exp.desc}</div>
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
    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      o: Math.random() * 0.15 + 0.03,
    }))
    let frame
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${p.o})`; ctx.fill()
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
    // Eye — dramatic scale up
    tl.fromTo('.eye-center', { opacity: 0, scale: 0.7, y: 60 }, { opacity: 1, scale: 1, y: 0, duration: 1.1, delay: 0.15 })
    // Left column — sweep from left with blur
    tl.fromTo('.exp-left', { opacity: 0, x: -80, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.12 }, '-=0.7')
    // Right column — sweep from right with blur
    tl.fromTo('.exp-right', { opacity: 0, x: 80, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.12 }, '-=0.9')
    // Center column — rise from below
    tl.fromTo('.exp-center', { opacity: 0, y: 60, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.12 }, '-=1.0')
    // Next button
    tl.fromTo('.exp-next', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#313131', position: 'relative', overflow: 'hidden' }}>
      <Particles />

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1.1fr 1fr', gridTemplateRows: '1fr 1fr 1fr',
        gap: 12, padding: 12, width: '100vw', height: '100vh', position: 'relative', zIndex: 1,
      }}>
        <Card exp={EXPS[0]} className="exp-left" style={{ gridColumn: '1', gridRow: '1', opacity: 0 }} />
        <div className="exp-center" style={{ gridColumn: '2', gridRow: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: 0 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 13, color: '#c9a96e', letterSpacing: 4, textTransform: 'uppercase' }}>Experience</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 800, color: '#f0e8dc', letterSpacing: -2, textAlign: 'center', lineHeight: 1.1 }}>Where I've Worked</h2>
        </div>
        <Card exp={EXPS[3]} className="exp-right" style={{ gridColumn: '3', gridRow: '1', opacity: 0 }} />
        <Card exp={EXPS[1]} className="exp-left" style={{ gridColumn: '1', gridRow: '2', opacity: 0 }} />
        <div className="eye-center" style={{ gridColumn: '2', gridRow: '2', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible', zIndex: 5, opacity: 0 }}>
          <div style={{ width: 900, height: 900, borderRadius: '50%', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 2px rgba(255,255,255,0.05)', marginTop: -150 }}>
            <canvas ref={canvasRef} style={{ display: 'block' }} />
          </div>
        </div>
        <Card exp={EXPS[2]} className="exp-right" style={{ gridColumn: '3', gridRow: '2', opacity: 0 }} />
        <Card exp={EXPS[4]} className="exp-left" style={{ gridColumn: '1', gridRow: '3', opacity: 0 }} />
        <Card exp={EXPS[5]} className="exp-center" style={{ gridColumn: '2', gridRow: '3', opacity: 0 }} />

        <div className="exp-next" style={{ gridColumn: '3', gridRow: '3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, opacity: 0 }}>
          <button onClick={() => go('about')} style={{
            background: 'none', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 60,
            padding: '18px 36px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
            transition: 'all 0.4s cubic-bezier(0.25,0,0,1)',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.transform = 'translateX(6px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = ''; e.currentTarget.style.background = 'none' }}
          >
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 4 }}>Next</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#f0e8dc', lineHeight: 1.15 }}>About Me</div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      <NavOverlay go={go} current="experience" dark />
    </div>
  )
}
