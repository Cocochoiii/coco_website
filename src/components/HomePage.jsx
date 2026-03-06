import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { Howl } from 'howler'
import NavOverlay from './NavOverlay'

let bgMusic = null
try { bgMusic = new Howl({ src: ['/music.mp3'], loop: true, volume: 0.3, html5: true, preload: true }) } catch(e) {}

const SCALE = 1.55

/* Rotating titles — "Creative Software Engineering" is the longest */
const TITLES = [
  'Creative Software Engineering',
  'Full Stack Development',
  'Innovative iOS Development',
  'Data Engineering & IoT',
  'Product & Project Innovation',
  'Design Driven Development',
]

function useTypewriter(strings, typingSpeed = 65, deletingSpeed = 35, pauseAfterType = 1800, pauseAfterDelete = 400) {
  const [displayed, setDisplayed] = useState('')
  const [index, setIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [ready, setReady] = useState(false)

  const start = useCallback(() => setReady(true), [])

  useEffect(() => {
    if (!ready) return
    const current = strings[index]
    let timer

    if (!isDeleting) {
      if (displayed.length < current.length) {
        timer = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), typingSpeed)
      } else {
        timer = setTimeout(() => setIsDeleting(true), pauseAfterType)
      }
    } else {
      if (displayed.length > 0) {
        timer = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), deletingSpeed)
      } else {
        setIsDeleting(false)
        setIndex((prev) => (prev + 1) % strings.length)
        timer = setTimeout(() => {}, pauseAfterDelete)
      }
    }

    return () => clearTimeout(timer)
  }, [displayed, isDeleting, index, ready, strings, typingSpeed, deletingSpeed, pauseAfterType, pauseAfterDelete])

  return { displayed, start }
}

/* Social icon components — monochrome line style */
const GitHubIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
)

const LinkedInIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
)

const EmailIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
)

const SOCIALS = [
  { icon: <GitHubIcon />, href: 'https://github.com/Cocochoiii', label: 'GitHub' },
  { icon: <LinkedInIcon />, href: 'https://www.linkedin.com/in/coco-choi-5a16511a2/', label: 'LinkedIn' },
  { icon: <EmailIcon />, href: 'mailto:choi.coco@northeastern.edu', label: 'Email' },
]

export default function HomePage({ go }) {
  const canvasRef = useRef(null)
  const [dialogue, setDialogue] = useState('Click on my stuff\nto explore!')
  const [hovered, setHovered] = useState(null)
  const [musicOn, setMusicOn] = useState(false)
  const [mouse, setMouse] = useState({ x: -999, y: -999 })
  const riveRef = useRef(null)

  const { displayed, start: startTyping } = useTypewriter(TITLES)

  useEffect(() => {
    const fn = (e) => setMouse({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    import('@rive-app/canvas').then((rive) => {
      const dpr = window.devicePixelRatio || 1
      const W = window.innerWidth * SCALE, H = window.innerHeight * SCALE
      canvas.width = W * dpr; canvas.height = H * dpr
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
      const r = new rive.Rive({
                                src: '/piano.riv', canvas, artboard: 'Bye Quincy',
                                stateMachines: 'State Machine 1', autoplay: true,
                                layout: new rive.Layout({ fit: rive.Fit.Cover, alignment: rive.Alignment.Center }),
                                onLoad: () => {
                                  r.resizeDrawingSurfaceToCanvas()
                                  const inputs = r.stateMachineInputs('State Machine 1')
                                  const roll = inputs?.find(i => i.name === 'roll')
                                  if (roll) setTimeout(() => { roll.value = true }, 800)
                                },
                              })
      riveRef.current = r
      const onResize = () => {
        const W2 = window.innerWidth * SCALE, H2 = window.innerHeight * SCALE
        canvas.width = W2 * dpr; canvas.height = H2 * dpr
        canvas.style.width = W2 + 'px'; canvas.style.height = H2 + 'px'
        r.layout = new rive.Layout({ fit: rive.Fit.Cover, alignment: rive.Alignment.Center })
        r.resizeDrawingSurfaceToCanvas()
      }
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    })
    return () => { if (riveRef.current) riveRef.current.cleanup() }
  }, [])

  useEffect(() => {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
        .to('.reveal-mask', { opacity: 1, duration: 1.5, delay: 0.4 })
        .to('.hname', { opacity: 1, y: 0, duration: 0.9 }, '-=0.8')
        .to('.hsocials', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
        .to('.hsub2', { opacity: 1, y: 0, duration: 0.9, onComplete: startTyping }, '-=0.7')
        .to('.dial', { opacity: 1, scale: 1, duration: 0.6 }, '-=0.3')
        .to('.hot', { opacity: 1, duration: 0.5, stagger: 0.1 }, '-=0.3')
  }, [startTyping])

  const goWith = (target, text) => {
    setDialogue(text)
    gsap.to('.hname,.hsocials,.hsub2,.hot', { opacity: 0, y: -8, duration: 0.3, stagger: 0.02 })
    gsap.to('.dial', { scale: 1.05, duration: 0.15, yoyo: true, repeat: 1 })
    setTimeout(() => go(target), 800)
  }

  const toggleMusic = () => {
    if (!bgMusic) { setDialogue("No music file yet!\nAdd music.mp3 to /public/"); return }
    if (musicOn) { bgMusic.pause(); setMusicOn(false); setDialogue("Music paused 🎵") }
    else { bgMusic.play(); setMusicOn(true); setDialogue("🎶 Enjoy the music!") }
  }

  const zones = [
    { id: 'exp', top: '62.5%', left: '45%', w: 100, h: 100, r: '50%', label: 'Experience', msg: "Let me show you\nwhere I've worked 👁️", nav: 'experience' },
    { id: 'proj', top: '60%', left: '48%', w: 75, h: 90, r: '8px', label: 'Projects', msg: "Check out what\nI've built 🎵", nav: 'projects' },
    { id: 'resume', top: '61%', left: '55.5%', w: 55, h: 55, r: '50%', label: 'Resume', msg: "Here's my\nresume 📄", nav: null },
    { id: 'keys', top: '69%', left: '52%', w: 500, h: 40, r: '8px', label: '♫ Music', msg: musicOn ? "Click to pause 🎵" : "Click to play music 🎶", nav: '_music' },
    { id: 'about', top: '75%', left: '51%', w: 200, h: 200, r: '50%', label: 'About Me', msg: "That's me!\nNice to meet you ☕", nav: 'about' },
  ]

  const offset = ((SCALE - 1) / 2) * 100

  return (
      <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#E37B88' }}>

        {/* Keyframes & social icon styles */}
        <style>{`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 15px rgba(255,255,255,0.08), inset 0 0 15px rgba(255,255,255,0.04); }
            50% { box-shadow: 0 0 35px rgba(255,255,255,0.2), inset 0 0 25px rgba(255,255,255,0.08); }
          }
          .hot-active {
            animation: pulseGlow 1.4s ease-in-out infinite !important;
            background: rgba(255,255,255,0.1) !important;
            border-color: rgba(255,255,255,0.3) !important;
          }
          .social-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: rgba(255,255,255,0.12);
            border: 1.5px solid rgba(255,255,255,0.2);
            color: rgba(255,255,255,0.55);
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.25, 0, 0, 1);
            backdrop-filter: blur(6px);
            text-decoration: none;
          }
          .social-icon:hover {
            background: rgba(255,255,255,0.95);
            color: #E37B88;
            border-color: rgba(255,255,255,0.9);
            transform: translateY(-5px) scale(1.12);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          }
          .social-icon:active {
            transform: translateY(-2px) scale(1.05);
          }
        `}</style>

        {/* BG text spotlight */}
        <div className="reveal-mask" style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          WebkitMaskImage: `radial-gradient(circle 220px at ${mouse.x}px ${mouse.y}px, black 15%, transparent 100%)`,
          maskImage: `radial-gradient(circle 220px at ${mouse.x}px ${mouse.y}px, black 15%, transparent 100%)`,
        }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(60px, 12vw, 170px)', fontWeight: 900, lineHeight: 0.88, color: '#c4606c', textAlign: 'center', whiteSpace: 'nowrap', letterSpacing: -4, userSelect: 'none' }}>
            <div>CREATIVE</div><div>SOFTWARE</div><div>ENGINEER</div>
          </div>
        </div>

        {/* SCALED WRAPPER */}
        <div style={{
          position: 'absolute',
          top: `-${offset + 5}%`, left: `-${offset}%`,
          width: `${SCALE * 100}%`, height: `${SCALE * 100}%`,
          zIndex: 1,
        }}>
          <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, display: 'block' }} />

          {zones.map(z => (
              <div key={z.id} className={`hot ${hovered === z.id ? 'hot-active' : ''}`} style={{
                position: 'absolute', top: z.top, left: z.left,
                transform: 'translate(-50%, -50%)',
                width: z.w, height: z.h, borderRadius: z.r,
                background: 'transparent',
                border: '2px solid transparent',
                cursor: 'pointer', zIndex: 10, opacity: 0,
                transition: 'all 0.3s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
                   onMouseEnter={() => { setHovered(z.id); setDialogue(z.msg) }}
                   onMouseLeave={() => { setHovered(null); setDialogue('Click on my stuff\nto explore!') }}
                   onClick={() => {
                     if (z.nav === '_music') toggleMusic()
                     else if (z.nav) goWith(z.nav, z.msg)
                     else { setDialogue('Opening resume 📄'); window.open('#', '_blank') }
                   }}
              >
                {/* Slide-up bubble label */}
                <div style={{
                  position: 'absolute', bottom: -36, left: '50%',
                  transform: `translateX(-50%) translateY(${hovered === z.id ? '0' : '8px'})`,
                  background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)',
                  color: 'white', padding: '6px 16px', borderRadius: 20, whiteSpace: 'nowrap',
                  fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 700,
                  letterSpacing: 1.2, textTransform: 'uppercase',
                  opacity: hovered === z.id ? 1 : 0,
                  transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  pointerEvents: 'none',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                }}>{z.label}</div>
              </div>
          ))}

          {/* Dialogue bubble */}
          <div className="dial" style={{
            position: 'absolute',
            bottom: '20%', right: '30%',
            background: 'white',
            borderRadius: 22,
            padding: '22px 34px',
            zIndex: 20,
            pointerEvents: 'none',
            opacity: 0, transform: 'scale(0.9)',
            boxShadow: '6px 8px 0 rgba(0,0,0,0.08)',
            border: '3.5px solid #1a1a1a',
            maxWidth: 320,
            transition: 'transform 0.3s',
          }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 22, fontWeight: 800,
              color: '#1a1a1a', lineHeight: 1.4,
              textAlign: 'center', whiteSpace: 'pre-line',
            }}>
              {dialogue}
            </div>
            <div style={{ position: 'absolute', top: -18, left: 40, width: 0, height: 0, borderLeft: '15px solid transparent', borderRight: '15px solid transparent', borderBottom: '18px solid #1a1a1a' }} />
            <div style={{ position: 'absolute', top: -13, left: 42, width: 0, height: 0, borderLeft: '13px solid transparent', borderRight: '13px solid transparent', borderBottom: '16px solid white', zIndex: 1 }} />
          </div>
        </div>

        {/* Name — left side, big */}
        <h1 className="hname" style={{ position: 'absolute', top: '22%', left: 80, zIndex: 30, pointerEvents: 'none', fontFamily: "'Playfair Display', serif", fontSize: 'clamp(80px, 12vw, 180px)', fontWeight: 900, color: 'white', lineHeight: 0.95, letterSpacing: -4, textShadow: '0 4px 30px rgba(0,0,0,0.12)', opacity: 0, transform: 'translateY(20px)' }}>Coco Choi</h1>

        {/* Social icons — at ashtray height */}
        <div className="hsocials" style={{
          position: 'absolute', top: '60%', left: 100,
          zIndex: 30, display: 'flex', gap: 18, opacity: 0, transform: 'translateY(15px)',
        }}>
          {SOCIALS.map((s, i) => (
              <a
                  key={i}
                  className="social-icon"
                  href={s.href}
                  target={s.href.startsWith('mailto') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  title={s.label}
              >
                {s.icon}
              </a>
          ))}
        </div>

        {/* Typewriter subtitle — single line, at piano bend height */}
        <div className="hsub2" style={{ position: 'absolute', top: '40%', right: 80, zIndex: 30, pointerEvents: 'none', textAlign: 'right', opacity: 0, transform: 'translateY(20px)', whiteSpace: 'nowrap' }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(64px, 12vw, 80px)', fontWeight: 900, color: 'white', lineHeight: 1, letterSpacing: -4, textShadow: '0 4px 30px rgba(0,0,0,0.12)', display: 'inline' }}>
            {displayed}
            <span style={{
              display: 'inline-block',
              width: '3px',
              height: '0.85em',
              background: 'white',
              marginLeft: '4px',
              verticalAlign: 'baseline',
              animation: 'blink 0.6s step-end infinite',
            }} />
          </div>
        </div>

        <NavOverlay go={go} current="home" />
      </div>
  )
}