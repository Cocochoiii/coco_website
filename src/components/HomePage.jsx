import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { Howl } from 'howler'
import NavOverlay from './NavOverlay'

let bgMusic = null
try { bgMusic = new Howl({ src: ['/music.mp3'], loop: true, volume: 0.3, html5: true, preload: true }) } catch(e) {}

/* Piano tone synthesizer — generates real piano-like sounds via Web Audio API */
let audioCtx = null
function playNote(freq, duration = 0.6) {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  const osc2 = audioCtx.createOscillator()
  // Main tone + slight detune for warmth
  osc.type = 'triangle'
  osc.frequency.value = freq
  osc2.type = 'sine'
  osc2.frequency.value = freq * 2.01 // slight harmonic shimmer
  // Piano-like envelope: quick attack, gentle decay
  gain.gain.setValueAtTime(0, audioCtx.currentTime)
  gain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration)
  osc.connect(gain)
  osc2.connect(gain)
  gain.connect(audioCtx.destination)
  osc.start(); osc2.start()
  osc.stop(audioCtx.currentTime + duration)
  osc2.stop(audioCtx.currentTime + duration)
}
// C major scale frequencies for the piano keys
const NOTES = [261.6, 293.7, 329.6, 349.2, 392.0, 440.0, 493.9, 523.3, 587.3, 659.3, 698.5, 784.0]

const SCALE = 1.55

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

const GitHubIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
)
const LinkedInIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
    </svg>
)
const EmailIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
)

const SOCIALS = [
  { icon: <GitHubIcon />, href: 'https://github.com/Cocochoiii', label: 'GitHub' },
  { icon: <LinkedInIcon />, href: 'https://www.linkedin.com/in/coco-choi-5a16511a2/', label: 'LinkedIn' },
  { icon: <EmailIcon />, href: 'mailto:choi.coco@northeastern.edu', label: 'Email' },
]

export default function HomePage({ go }) {
  const canvasRef = useRef(null)
  const [dialogue, setDialogue] = useState('Click on the objects\non my piano to explore')
  const [hovered, setHovered] = useState(null)
  const [musicOn, setMusicOn] = useState(false)
  const [mouse, setMouse] = useState({ x: -999, y: -999 })
  const [hintVisible, setHintVisible] = useState(true)
  const riveRef = useRef(null)
  const glowRef = useRef(null)

  const { displayed, start: startTyping } = useTypewriter(TITLES)

  useEffect(() => {
    const fn = (e) => setMouse({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  /* Rive setup — unchanged */
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

  /* Entrance animations */
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.to('.reveal-mask', { opacity: 1, duration: 1.5, delay: 0.4 })
    // Name container fades in
    tl.to('.hname', { opacity: 1, y: 0, duration: 0.5 }, '-=0.8')
    // Each letter drops in like a piano key — staggered
    tl.to('.piano-key-letter', {
      opacity: 1, y: 0, duration: 0.35,
      stagger: 0.07,
      ease: 'back.out(2.5)',
    }, '-=0.3')
    tl.to('.hsocials', { opacity: 1, y: 0, duration: 0.7 }, '-=0.3')
    tl.to('.hsub2', { opacity: 1, y: 0, duration: 0.9, onComplete: startTyping }, '-=0.5')
    tl.to('.dial', { opacity: 1, scale: 1, duration: 0.6 }, '-=0.3')
    tl.to('.hot', { opacity: 1, duration: 0.5, stagger: 0.1 }, '-=0.3')
    tl.to('.discover-hint', { opacity: 1, duration: 0.8 }, '-=0.2')
  }, [startTyping])

  /* Fade out discover hint after 5 seconds or first hover */
  useEffect(() => {
    const timer = setTimeout(() => {
      setHintVisible(false)
      gsap.to('.discover-hint', { opacity: 0, y: -10, duration: 0.6 })
    }, 6000)
    return () => clearTimeout(timer)
  }, [])

  const dismissHint = () => {
    if (hintVisible) {
      setHintVisible(false)
      gsap.to('.discover-hint', { opacity: 0, y: -10, duration: 0.4 })
    }
  }

  const goWith = (target, text) => {
    setDialogue(text)
    gsap.to('.piano-key-letter,.hsocials,.hsub2,.hot', { opacity: 0, y: -8, duration: 0.3, stagger: 0.02 })
    gsap.to('.dial', { scale: 1.08, duration: 0.2, yoyo: true, repeat: 1 })
    setTimeout(() => go(target), 800)
  }

  const toggleMusic = () => {
    if (!bgMusic) { setDialogue("No music file yet!\nAdd music.mp3 to /public/"); return }
    if (musicOn) { bgMusic.pause(); setMusicOn(false); setDialogue("Music paused") }
    else { bgMusic.play(); setMusicOn(true); setDialogue("Enjoy the music") }
  }

  const zones = [
    { id: 'exp', top: '62.5%', left: '45%', w: 100, h: 100, r: '50%', label: 'Experience', msg: "Let me show you\nwhere I've worked", nav: 'experience' },
    { id: 'proj', top: '60%', left: '48%', w: 75, h: 90, r: '8px', label: 'Projects', msg: "Check out what\nI've built", nav: 'projects' },
    { id: 'resume', top: '61%', left: '55.5%', w: 55, h: 55, r: '50%', label: 'Resume', msg: "Here's my resume", nav: null },
    { id: 'about', top: '75%', left: '51%', w: 200, h: 200, r: '50%', label: 'About Me', msg: "That's me!\nNice to meet you", nav: 'about' },
  ]

  // Piano keys — 12 individual keys across the keyboard area
  const pianoKeys = NOTES.map((freq, i) => ({
    id: `key-${i}`,
    top: '69%',
    left: `${43 + i * 1.8}%`,
    w: 28, h: 44, r: '4px',
    freq,
    note: ['C','D','E','F','G','A','B','C','D','E','F','G'][i],
  }))

  const offset = ((SCALE - 1) / 2) * 100

  return (
      <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#E37B88' }}>

        <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes gentleFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes shimmer { 0% { opacity: 0; transform: scale(0.8); } 50% { opacity: 1; } 100% { opacity: 0; transform: scale(1.6); } }
        @keyframes keyPress {
          0% { transform: translateY(-8px) scaleY(1.05); opacity: 0.5; }
          40% { transform: translateY(3px) scaleY(0.97); opacity: 1; }
          70% { transform: translateY(-2px) scaleY(1.01); }
          100% { transform: translateY(0) scaleY(1); opacity: 1; }
        }
        @keyframes keyDrop {
          0% { transform: translateY(-25px); opacity: 0; }
          50% { transform: translateY(4px); opacity: 1; }
          75% { transform: translateY(-2px); }
          100% { transform: translateY(0); }
        }
        .social-icon {
          display: flex; align-items: center; justify-content: center;
          width: 56px; height: 56px; border-radius: 50%;
          background: rgba(255,255,255,0.12); border: 1.5px solid rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.55); cursor: pointer;
          transition: all 0.4s cubic-bezier(0.25, 0, 0, 1);
          backdrop-filter: blur(6px); text-decoration: none;
        }
        .social-icon:hover {
          background: rgba(255,255,255,0.95); color: #E37B88;
          border-color: rgba(255,255,255,0.9);
          transform: translateY(-5px) scale(1.12);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
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

        {/* SCALED WRAPPER — canvas + hotspots */}
        <div style={{
          position: 'absolute',
          top: `-${offset + 5}%`, left: `-${offset}%`,
          width: `${SCALE * 100}%`, height: `${SCALE * 100}%`,
          zIndex: 1,
        }}>
          <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, display: 'block' }} />

          {/* Invisible hotspots — NO borders, NO circles, NO backgrounds
            Just invisible clickable areas. Cursor changes to pointer.
            On hover: a soft radial glow appears + italic label floats up */}
          {zones.map(z => (
              <div key={z.id} className="hot" style={{
                position: 'absolute', top: z.top, left: z.left,
                transform: 'translate(-50%, -50%)',
                width: z.w, height: z.h, borderRadius: z.r,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer', zIndex: 10, opacity: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
                   onMouseEnter={() => { setHovered(z.id); setDialogue(z.msg); dismissHint() }}
                   onMouseLeave={() => { setHovered(null); setDialogue('Click on the objects\non my piano to explore') }}
                   onClick={() => {
                     if (z.nav === '_music') toggleMusic()
                     else if (z.nav) goWith(z.nav, z.msg)
                     else { setDialogue('Opening resume'); window.open('#', '_blank') }
                   }}
              >
                {/* Soft glow on hover — like a warm light discovering an object */}
                <div style={{
                  position: 'absolute', inset: -20,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)',
                  opacity: hovered === z.id ? 1 : 0,
                  transform: hovered === z.id ? 'scale(1)' : 'scale(0.6)',
                  transition: 'all 0.5s cubic-bezier(0.25,0,0,1)',
                  pointerEvents: 'none',
                }} />

                {/* Shimmer ring on hover */}
                {hovered === z.id && (
                    <div style={{
                      position: 'absolute', inset: -10,
                      borderRadius: '50%',
                      border: '1px solid rgba(255,255,255,0.2)',
                      animation: 'shimmer 1.5s ease-out infinite',
                      pointerEvents: 'none',
                    }} />
                )}

                {/* Elegant italic label — floats up on hover, well below the object */}
                <div style={{
                  position: 'absolute', bottom: -52, left: '50%',
                  transform: `translateX(-50%) translateY(${hovered === z.id ? '0' : '12px'})`,
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: 'italic',
                  fontSize: 28, fontWeight: 600,
                  color: 'white',
                  letterSpacing: 3,
                  opacity: hovered === z.id ? 0.9 : 0,
                  transition: 'all 0.45s cubic-bezier(0.25,0,0,1)',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  textShadow: '0 3px 16px rgba(0,0,0,0.25)',
                }}>{z.label}</div>
              </div>
          ))}

          {/* Dialogue — handwritten note style */}
          <div className="dial" style={{
            position: 'absolute',
            bottom: '18%', right: '27%',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(12px)',
            borderRadius: 22,
            padding: '26px 38px',
            zIndex: 20,
            pointerEvents: 'none',
            opacity: 0, transform: 'scale(0.9)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
            maxWidth: 380,
            transition: 'transform 0.3s',
          }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: 26, fontWeight: 600,
              color: '#2a2020', lineHeight: 1.4,
              textAlign: 'center', whiteSpace: 'pre-line',
            }}>
              {dialogue}
            </div>
            {/* Subtle speech tail — triangular, matching bg */}
            <div style={{
              position: 'absolute', top: -10, left: 36,
              width: 0, height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderBottom: '10px solid rgba(255,255,255,0.95)',
            }} />
          </div>
        </div>

        {/* Discover hint — appears initially, fades after 6s or first hover */}
        <div className="discover-hint" style={{
          position: 'absolute', bottom: 'clamp(30px, 5vh, 60px)', left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 30, opacity: 0, pointerEvents: 'none',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          animation: 'gentleFloat 3s ease-in-out infinite',
        }}>
          <div style={{
            fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
            fontSize: 20, color: 'rgba(255,255,255,0.7)',
            letterSpacing: 3, textShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}>
            explore the objects on the piano
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>

        {/* Name — each letter is a playable piano key */}
        <div className="hname" style={{
          position: 'absolute', top: '22%', left: 80, zIndex: 30,
          pointerEvents: 'auto',
          display: 'flex', gap: 0,
          opacity: 0, transform: 'translateY(20px)',
        }}>
          {'Coco Choi'.split('').map((ch, i) => (
              <span key={i} className="piano-key-letter" style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(80px, 12vw, 180px)', fontWeight: 900,
                color: 'white', lineHeight: 0.95,
                letterSpacing: ch === ' ' ? '0.15em' : '-0.03em',
                textShadow: '0 4px 30px rgba(0,0,0,0.12)',
                display: 'inline-block',
                opacity: 0,
                transform: 'translateY(-20px)',
                cursor: 'default',
                transition: 'color 0.15s',
                transformOrigin: 'bottom center',
              }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget
                      // Piano key press — down, bounce, settle
                      gsap.timeline()
                          .to(el, { y: 6, scaleY: 0.93, duration: 0.1, ease: 'power2.in' })
                          .to(el, { y: -4, scaleY: 1.04, color: '#ffd4da', duration: 0.15, ease: 'power2.out' })
                          .to(el, { y: 0, scaleY: 1, color: 'white', duration: 0.3, ease: 'elastic.out(1, 0.4)' })
                    }}
              >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
          ))}
        </div>

        {/* Social icons */}
        <div className="hsocials" style={{
          position: 'absolute', top: '60%', left: 100,
          zIndex: 30, display: 'flex', gap: 18, opacity: 0, transform: 'translateY(15px)',
        }}>
          {SOCIALS.map((s, i) => (
              <a key={i} className="social-icon" href={s.href}
                 target={s.href.startsWith('mailto') ? '_self' : '_blank'}
                 rel="noopener noreferrer" title={s.label}
              >{s.icon}</a>
          ))}
        </div>

        {/* Typewriter — piano-key style: each letter drops in with bounce */}
        <div className="hsub2" style={{
          position: 'absolute', top: '40%', right: 80, zIndex: 30,
          pointerEvents: 'none', textAlign: 'right',
          opacity: 0, transform: 'translateY(20px)', whiteSpace: 'nowrap',
        }}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(64px, 12vw, 80px)', fontWeight: 900,
            color: 'white', lineHeight: 1, letterSpacing: -4,
            textShadow: '0 4px 30px rgba(0,0,0,0.12)',
            display: 'inline',
          }}>
            {displayed.split('').map((ch, i) => (
                <span key={`${displayed.length}-${i}`} style={{
                  display: 'inline-block',
                  animation: i === displayed.length - 1 ? 'keyPress 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
                  transformOrigin: 'bottom center',
                }}>
              {ch === ' ' ? '\u00A0' : ch}
            </span>
            ))}
            <span style={{
              display: 'inline-block', width: '3px', height: '0.85em',
              background: 'white', marginLeft: '4px', verticalAlign: 'baseline',
              animation: 'blink 0.6s step-end infinite',
            }} />
          </div>
        </div>

        <NavOverlay go={go} current="home" />
      </div>
  )
}