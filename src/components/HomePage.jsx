import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { Howl } from 'howler'
import NavOverlay from './NavOverlay'

let bgMusic = null
try { bgMusic = new Howl({ src: ['/music.mp3'], loop: true, volume: 0.3, html5: true, preload: true }) } catch(e) {}

/* Piano tone synthesizer */
let audioCtx = null
function playNote(freq, duration = 0.6) {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  const osc2 = audioCtx.createOscillator()
  osc.type = 'triangle'
  osc.frequency.value = freq
  osc2.type = 'sine'
  osc2.frequency.value = freq * 2.01
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
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
)
const LinkedInIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
)
const EmailIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
)

const SOCIALS = [
  { icon: <GitHubIcon />, href: 'https://github.com/Cocochoiii', label: 'GitHub' },
  { icon: <LinkedInIcon />, href: 'https://www.linkedin.com/in/coco-choi-5a16511a2/', label: 'LinkedIn' },
  { icon: <EmailIcon />, href: 'mailto:choi.coco@northeastern.edu', label: 'Email' },
]

export default function HomePage({ go }) {
  const canvasRef = useRef(null)
  const parallaxRef = useRef(null)
  const [dialogue, setDialogue] = useState('Click on the objects\non my piano to explore')
  const [hovered, setHovered] = useState(null)
  const [musicOn, setMusicOn] = useState(false)
  const [mouse, setMouse] = useState({ x: -999, y: -999 })
  const [hintVisible, setHintVisible] = useState(true)
  const riveRef = useRef(null)

  const { displayed, start: startTyping } = useTypewriter(TITLES)

  useEffect(() => {
    const fn = (e) => {
      const { clientX, clientY } = e
      setMouse({ x: clientX, y: clientY })
      const xPos = (clientX / window.innerWidth - 0.5) * 25
      const yPos = (clientY / window.innerHeight - 0.5) * 25
      gsap.to(parallaxRef.current, { x: xPos, y: yPos, duration: 1.2, ease: 'power2.out' })
    }
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    import('@rive-app/canvas').then((rive) => {
      const dpr = window.devicePixelRatio || 1
      const SCALE = 1.55
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
    })
    return () => { if (riveRef.current) riveRef.current.cleanup() }
  }, [])

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.to('.reveal-mask', { opacity: 1, duration: 1.5, delay: 0.4 })
    tl.to('.hname', { opacity: 1, y: 0, duration: 0.5 }, '-=0.8')
    tl.to('.piano-key-letter', { opacity: 1, y: 0, duration: 0.35, stagger: 0.07, ease: 'back.out(2.5)' }, '-=0.3')
    tl.to('.hsocials', { opacity: 1, y: 0, duration: 0.7 }, '-=0.3')
    tl.to('.hsub2', { opacity: 1, y: 0, duration: 0.9, onComplete: startTyping }, '-=0.5')
    tl.to('.dial', { opacity: 1, scale: 1, duration: 0.6 }, '-=0.3')
    tl.to('.hot', { opacity: 1, duration: 0.5, stagger: 0.1 }, '-=0.3')
    tl.to('.discover-hint', { opacity: 1, duration: 0.8 }, '-=0.2')
  }, [startTyping])

  const dismissHint = () => {
    if (hintVisible) {
      setHintVisible(false)
      gsap.to('.discover-hint', { opacity: 0, y: -10, duration: 0.4 })
    }
  }

  const toggleMusic = () => {
    if (!bgMusic) { setDialogue("No music file yet!\nAdd music.mp3 to /public/"); return }
    if (musicOn) { bgMusic.pause(); setMusicOn(false); setDialogue("Music paused 🎵") }
    else { bgMusic.play(); setMusicOn(true); setDialogue("🎶 Enjoy the music!") }
  }

  const zones = [
    { id: 'exp', top: '62.5%', left: '45%', w: 100, h: 100, r: '50%', label: 'Experience', msg: "Let me show you\nwhere I've worked", nav: 'experience', freq: 261.6 },
    { id: 'proj', top: '60%', left: '48%', w: 75, h: 90, r: '8px', label: 'Projects', msg: "Check out what\nI've built", nav: 'projects', freq: 329.6 },
    { id: 'resume', top: '61%', left: '55.5%', w: 55, h: 55, r: '50%', label: 'Resume', msg: "Here's my resume", nav: null, freq: 392.0 },
    { id: 'keys', top: '69%', left: '52%', w: 500, h: 40, r: '8px', label: '♫ Music', msg: musicOn ? "Click to pause 🎵" : "Click to play music 🎶", nav: '_music', freq: 523.3 },
    { id: 'about', top: '75%', left: '51%', w: 200, h: 200, r: '50%', label: 'About Me', msg: "That's me!\nNice to meet you", nav: 'about', freq: 659.3 },
  ]

  const SCALE = 1.55
  // 这里将 offset 修改为更高的数值，强制整体上移
  const offset = ((SCALE - 1) / 2) * 100 + 8

  return (
      <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#E37B88' }}>

        <div className="noise-overlay" />

        <style>{`
          @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
          @keyframes gentleFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
          @keyframes shimmer { 0% { opacity: 0; transform: scale(0.8); } 50% { opacity: 1; } 100% { opacity: 0; transform: scale(1.6); } }
          
          .noise-overlay {
            position: fixed; inset: 0; z-index: 99; pointer-events: none; opacity: 0.045;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          }

          .social-icon {
            display: flex; align-items: center; justify-content: center;
            width: 48px; height: 48px; border-radius: 50%;
            background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
            color: rgba(255,255,255,0.7); cursor: pointer;
            transition: all 0.4s cubic-bezier(0.25, 0, 0, 1);
            backdrop-filter: blur(8px); text-decoration: none;
          }
          .social-icon:hover {
            background: rgba(255,255,255,1); color: #E37B88;
            transform: translateY(-5px) scale(1.1);
          }
        `}</style>

        {/* BG text spotlight - 向上偏移一点以匹配钢琴 */}
        <div className="reveal-mask" style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: 'translateY(-5vh)',
          WebkitMaskImage: `radial-gradient(circle 220px at ${mouse.x}px ${mouse.y}px, black 15%, transparent 100%)`,
          maskImage: `radial-gradient(circle 220px at ${mouse.x}px ${mouse.y}px, black 15%, transparent 100%)`,
        }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(60px, 12vw, 170px)', fontWeight: 900, color: '#c4606c', textAlign: 'center', whiteSpace: 'nowrap', letterSpacing: -4 }}>
            <div>CREATIVE</div><div>SOFTWARE</div><div>ENGINEER</div>
          </div>
        </div>

        {/* PARALLAX WRAPPER */}
        <div ref={parallaxRef} style={{
          position: 'absolute',
          top: `-${offset}%`, // 这里的 offset 已经包含了 +10 的上移量
          left: `-${((SCALE - 1) / 2) * 100}%`,
          width: `${SCALE * 100}%`, height: `${SCALE * 100}%`,
          zIndex: 1,
        }}>
          <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, display: 'block' }} />

          {zones.map(z => (
              <div key={z.id} className="hot" style={{
                position: 'absolute', top: z.top, left: z.left,
                transform: 'translate(-50%, -50%)',
                width: z.w, height: z.h, borderRadius: z.r,
                cursor: 'pointer', zIndex: 10, opacity: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
                   onMouseEnter={() => {
                     setHovered(z.id);
                     setDialogue(z.msg);
                     dismissHint();
                     playNote(z.freq, 0.4);
                   }}
                   onMouseLeave={() => { setHovered(null); setDialogue('Click on the objects\non my piano to explore'); }}
                   onClick={() => {
                     if (z.nav === '_music') toggleMusic()
                     else if (z.nav) { playNote(z.freq * 1.5, 0.8); go(z.nav); }
                     else { window.open('#', '_blank') }
                   }}
              >
                <div style={{
                  position: 'absolute', inset: -20, borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                  opacity: hovered === z.id ? 1 : 0, transition: 'all 0.5s ease',
                }} />
                <div style={{
                  position: 'absolute', bottom: -52, left: '50%', transform: `translateX(-50%)`,
                  fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 24, color: 'white',
                  opacity: hovered === z.id ? 1 : 0, transition: '0.3s', whiteSpace: 'nowrap',
                }}>{z.label}</div>
              </div>
          ))}

          {/* 对话气泡: 位置从 bottom 改为相对上方的定位，确保不被切掉 */}
          <div className="dial" style={{
            position: 'absolute',
            bottom: '18%', // 钢琴上方一点
            right: '35%',
            background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(10px)',
            borderRadius: 22, padding: '20px 30px', zIndex: 20, opacity: 0, transform: 'scale(0.9)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 22, color: '#2a2020', textAlign: 'center', whiteSpace: 'pre-line' }}>
              {dialogue}
            </div>
            {/* 气泡小尖角 */}
            <div style={{
              position: 'absolute', bottom: -10, left: 30,
              width: 0, height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: '10px solid rgba(255,255,255,0.96)'
            }} />
          </div>
        </div>

        {/* UI 元素向上调整 */}
        <div className="hname" style={{ position: 'absolute', top: '20%', left: 60, zIndex: 30, opacity: 0, transform: 'translateY(20px)' }}>
          {'Coco Choi'.split('').map((ch, i) => (
              <span key={i} className="piano-key-letter" style={{
                fontFamily: "'Playfair Display', serif", fontSize: 'clamp(80px, 9vw, 150px)', fontWeight: 900,
                color: 'white', display: 'inline-block',
              }}
                    onMouseEnter={(e) => {
                      playNote(261.6 * (1 + i * 0.1), 0.3);
                      gsap.to(e.currentTarget, { y: 10, scaleY: 0.9, duration: 0.1, yoyo: true, repeat: 1 })
                    }}
              >{ch === ' ' ? '\u00A0' : ch}</span>
          ))}
        </div>

        <div className="hsocials" style={{ position: 'absolute', bottom: 80, left: 60, zIndex: 30, display: 'flex', gap: 15, opacity: 0 }}>
          {SOCIALS.map((s, i) => (
              <a key={i} className="social-icon" href={s.href} target="_blank" rel="noreferrer" onMouseEnter={() => playNote(880, 0.1)}>{s.icon}</a>
          ))}
        </div>

        <div className="hsub2" style={{ position: 'absolute', top: '34%', right: 80, zIndex: 30, opacity: 0 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 6vw, 64px)', fontWeight: 900, color: 'white', letterSpacing: -1 }}>
            {displayed}<span style={{ borderRight: '3px solid white', animation: 'blink 0.7s infinite' }} />
          </div>
        </div>

        <NavOverlay go={go} current="home" />
      </div>
  )
}