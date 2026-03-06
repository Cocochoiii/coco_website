import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'

import NavOverlay from './NavOverlay'
import AnimatedNumber from './shared/AnimatedNumber'
import useParallax from '../hooks/useParallax'
import useScrollReveal from '../hooks/useScrollReveal'
import useIsMobile from '../hooks/useIsMobile'
import { EYE } from '../constants/theme'
import { SKILLS, ABOUT_STATS, ABOUT_BIG_STATS, CONTACT_INFO, ABOUT_SOCIALS } from '../constants/data'

const MailIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>)
const GitHubIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>)
const LinkedInIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>)
const SOCIAL_ICONS = [<GitHubIcon />, <LinkedInIcon />]

const PAGE_CSS = `
  .ab-input:focus { border-color: ${EYE.rose} !important; background: #fff !important; box-shadow: 0 0 0 3px ${EYE.rose}18 !important; }
  .skill-pill { transition: all 0.35s cubic-bezier(0.25,0,0,1); cursor: default; }
  .skill-pill:hover { transform: translateY(-3px) scale(1.06); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
  .ab-scroll-hint { animation: scrollBounce 2s ease-in-out infinite; }
  @keyframes scrollBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
  @keyframes marqueeRight { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  @keyframes marqueeLeft  { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
`

export default function AboutPage({ go }) {
  const m = useIsMobile()
  const canvasRef = useRef(null)
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const scrollRef = useRef(null)
  const [hoveredStat, setHoveredStat] = useState(null)

  useParallax(leftRef, { xFactor: -10, yFactor: -8, enabled: !m })
  useParallax(rightRef, { xFactor: 10, yFactor: 8, enabled: !m })
  useScrollReveal(scrollRef)

  /* Rive */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let r = null
    import('@rive-app/canvas').then((rive) => {
      const dpr = window.devicePixelRatio || 1
      const size = m ? Math.min(window.innerWidth * 1.2, 600) : Math.min(window.innerWidth * 2.0, window.innerHeight * 2.0, 2200)
      canvas.width = size * dpr; canvas.height = size * dpr
      canvas.style.width = size + 'px'; canvas.style.height = size + 'px'
      r = new rive.Rive({
        src: '/about_me.riv', canvas, stateMachines: 'State Machine 1', autoplay: true,
        layout: new rive.Layout({ fit: rive.Fit.Contain, alignment: rive.Alignment.Center }),
        onLoad: () => r.resizeDrawingSurfaceToCanvas(),
      })
      const onResize = () => {
        const s = m ? Math.min(window.innerWidth * 1.2, 600) : Math.min(window.innerWidth * 1.2, window.innerHeight * 1.2, 1800)
        canvas.width = s * dpr; canvas.height = s * dpr
        canvas.style.width = s + 'px'; canvas.style.height = s + 'px'
        r.layout = new rive.Layout({ fit: rive.Fit.Contain, alignment: rive.Alignment.Center })
        r.resizeDrawingSurfaceToCanvas()
      }
      window.addEventListener('resize', onResize)
      canvas._onResize = onResize
    })
    return () => { if (canvas._onResize) window.removeEventListener('resize', canvas._onResize); if (r) r.cleanup() }
  }, [m])

  /* Entrance */
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo('.ab-left', { opacity: 0, x: m ? 0 : -40, y: m ? 20 : 0, filter: 'blur(8px)' }, { opacity: 1, x: 0, y: 0, filter: 'blur(0px)', duration: 1, delay: 0.4 })
    tl.fromTo('.ab-right', { opacity: 0, x: m ? 0 : 40, y: m ? 20 : 0, filter: 'blur(8px)' }, { opacity: 1, x: 0, y: 0, filter: 'blur(0px)', duration: 1 }, '-=0.7')
    tl.fromTo('.ab-scroll-hint', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.2')
    return () => tl.kill()
  }, [m])

  const goHome = useCallback(() => go('home'), [go])
  const handleCtaEnter = useCallback((e) => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.03)'; e.currentTarget.style.boxShadow = `0 16px 50px ${EYE.rose}50` }, [])
  const handleCtaLeave = useCallback((e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 8px 30px ${EYE.rose}40` }, [])

  const pad = m ? '0 20px' : '0 clamp(40px, 8vw, 160px)'

  return (
    <div ref={scrollRef} style={{ width: '100vw', height: '100vh', background: '#fff', position: 'relative', overflowX: 'hidden', overflowY: 'auto' }}>
      <style>{PAGE_CSS}</style>

      {/* ===== HERO ===== */}
      <div style={{ width: '100%', minHeight: m ? 'auto' : '100vh', position: 'relative', display: m ? 'flex' : 'block', flexDirection: 'column', alignItems: 'center', paddingTop: m ? 60 : 0, paddingBottom: m ? 40 : 0 }}>

        {/* Rive */}
        <div style={{ position: m ? 'relative' : 'absolute', inset: m ? undefined : 0, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: m ? '100%' : undefined }}>
          <canvas ref={canvasRef} style={{ display: 'block', maxWidth: m ? '80vw' : undefined }} />
        </div>

        {/* LEFT panel */}
        <div ref={leftRef} className="ab-left" style={{
          position: m ? 'relative' : 'absolute', right: m ? undefined : '70%',
          top: m ? undefined : '44%', transform: m ? undefined : 'translateY(-50%)',
          width: m ? '100%' : 'clamp(280px, 28vw, 420px)', zIndex: 10, opacity: 0,
          padding: m ? '0 24px' : 0, textAlign: m ? 'center' : 'left',
        }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: m ? 16 : 30, fontWeight: 700, letterSpacing: m ? 3 : 6, textTransform: 'uppercase', color: EYE.rose, marginBottom: m ? 10 : 20 }}>About Me</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: m ? 48 : 'clamp(180px, 9vw, 130px)', fontWeight: 900, color: EYE.shadow, marginBottom: m ? 12 : 24, lineHeight: 0.92, letterSpacing: m ? -2 : -5 }}>
            Coco<br/>Choi
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: m ? 15 : 'clamp(25px, 1.8vw, 30px)', lineHeight: 1.55, color: '#444', fontWeight: 400 }}>
            Engineer who thinks like a designer. I ship products that people{' '}
            <span style={{ color: EYE.rose, fontWeight: 600 }}>actually enjoy using.</span>
          </p>
        </div>

        {/* RIGHT panel */}
        <div ref={rightRef} className="ab-right" style={{
          position: m ? 'relative' : 'absolute', left: m ? undefined : '70%',
          top: m ? undefined : '50%', transform: m ? undefined : 'translateY(-50%)',
          width: m ? '100%' : 'clamp(280px, 28vw, 420px)', zIndex: 10, opacity: 0,
          padding: m ? '0 24px' : 0, marginTop: m ? 20 : 0,
        }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: m ? 14 : 'clamp(25px, 1.8vw, 30px)', lineHeight: 1.6, color: '#444', marginBottom: m ? 20 : 32, fontWeight: 400 }}>
            Northeastern CS grad student. Previously at{' '}
            <span style={{ fontWeight: 700, color: EYE.shadow }}>Audi</span>,{' '}
            <span style={{ fontWeight: 700, color: EYE.shadow }}>Mars Inc.</span>, &{' '}
            <span style={{ fontWeight: 700, color: EYE.shadow }}>UbiWell Lab</span>.
            I turn complex systems into experiences that feel effortless.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: m ? 8 : 12 }}>
            {ABOUT_STATS.map((st, i) => (
              <div key={st.label} style={{ position: 'relative', overflow: 'hidden', padding: m ? '16px 0' : '24px 0', borderRadius: 14, background: hoveredStat === i ? st.color : 'rgba(0,0,0,0.025)', border: `1.5px solid ${hoveredStat === i ? st.color : 'rgba(0,0,0,0.05)'}`, cursor: 'default', textAlign: 'center', transition: 'all 0.4s cubic-bezier(0.25,0,0,1)', boxShadow: hoveredStat === i ? `0 12px 30px ${st.color}30` : 'none' }}
                onMouseEnter={() => setHoveredStat(i)} onMouseLeave={() => setHoveredStat(null)}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: m ? 28 : 44, fontWeight: 800, lineHeight: 1, color: hoveredStat === i ? '#fff' : st.color, transition: 'color 0.3s' }}>
                  <AnimatedNumber target={st.n} suffix={st.s} delay={0.8 + i * 0.2} />
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: m ? 9 : 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: hoveredStat === i ? 'rgba(255,255,255,0.75)' : '#bbb', marginTop: 6, transition: 'color 0.3s' }}>{st.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="ab-scroll-hint" style={{ position: m ? 'relative' : 'absolute', bottom: m ? undefined : 36, left: m ? undefined : '50%', transform: m ? undefined : 'translateX(-50%)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0, marginTop: m ? 24 : 0 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#bbb' }}>Scroll</div>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="1" width="14" height="22" rx="7"/><line x1="8" y1="6" x2="8" y2="10"/></svg>
        </div>
      </div>

      {/* ===== STORY ===== */}
      <div style={{ width: '100%', background: '#faf5f0', padding: m ? '60px 0' : 'clamp(80px, 10vw, 160px) 0', overflow: 'hidden' }}>
        {/* Pull quote */}
        <div className="ab-reveal" style={{ maxWidth: 1100, margin: '0 auto', padding: pad, opacity: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: m ? 12 : 20, marginBottom: m ? 36 : 60 }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: m ? 60 : 'clamp(80px, 10vw, 140px)', fontWeight: 900, color: EYE.rose, lineHeight: 0.8, opacity: 0.2 }}>"</span>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: m ? 20 : 'clamp(28px, 3.5vw, 46px)', fontWeight: 700, fontStyle: 'italic', color: EYE.shadow, lineHeight: 1.3, letterSpacing: -1, marginTop: m ? 8 : 16 }}>
              In a great product, every element on screen should react to the user — that's the philosophy I bring to my work.
            </h3>
          </div>
        </div>

        {/* Two-column editorial (single col on mobile) */}
        <div className="ab-reveal" style={{ maxWidth: 1100, margin: '0 auto', padding: pad, opacity: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: m ? 24 : 'clamp(40px, 5vw, 80px)' }}>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: m ? 14 : 17, lineHeight: 2, color: '#666' }}>I hold a BA in Business and Film from Franklin & Marshall College and I'm currently pursuing my MS in Computer Science at Northeastern University. This blend of technical and creative backgrounds shapes how I approach every project.</p>
              <div style={{ margin: m ? '20px 0' : '32px 0', height: 1, background: `linear-gradient(90deg, ${EYE.rose}40, transparent)` }} />
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: m ? 14 : 17, lineHeight: 2, color: '#666' }}>My professional journey includes building healthcare research tools at UbiWell Lab, designing IoT data pipelines at Audi, and developing enterprise web apps at Mars Inc. in Hong Kong.</p>
            </div>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: m ? 14 : 17, lineHeight: 2, color: '#666' }}>I combine software engineering, design, and animation to create digital experiences that feel delightful to interact with. Outside of work, I founded Pet Paradise — a full-stack platform born from my love of caring for 20+ cats and dogs.</p>
              <div style={{ margin: m ? '20px 0' : '32px 0', height: 1, background: `linear-gradient(90deg, ${EYE.skin}40, transparent)` }} />
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: m ? 14 : 17, lineHeight: 2, color: '#666' }}>When I'm not coding, you'll find me drawing, exploring new design tools, or experimenting with Rive animations — like the ones you see on this very website.</p>
            </div>
          </div>
        </div>

        {/* Big stats */}
        <div className="ab-reveal" style={{ maxWidth: 1100, margin: m ? '40px auto 0' : '80px auto 0', padding: pad, opacity: 0 }}>
          <div style={{ display: m ? 'grid' : 'flex', gridTemplateColumns: '1fr 1fr', gap: m ? 20 : 0, justifyContent: m ? undefined : 'space-between', borderTop: m ? 'none' : `2px solid ${EYE.shadow}10`, paddingTop: m ? 0 : 40 }}>
            {ABOUT_BIG_STATS.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', flex: m ? undefined : 1 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: m ? 28 : 'clamp(32px, 3.5vw, 52px)', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: m ? 9 : 11, letterSpacing: 2, textTransform: 'uppercase', color: '#aaa', marginTop: m ? 4 : 10, lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills marquee */}
        <div className="ab-reveal" style={{ marginTop: m ? 40 : 80, opacity: 0 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: m ? 11 : 14, color: EYE.skin, letterSpacing: 4, textTransform: 'uppercase', textAlign: 'center', marginBottom: m ? 16 : 28 }}>My Stack</p>
          <div style={{ overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: m ? 40 : 80, background: 'linear-gradient(90deg, #faf5f0, transparent)', zIndex: 2 }} />
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: m ? 40 : 80, background: 'linear-gradient(-90deg, #faf5f0, transparent)', zIndex: 2 }} />
            <div style={{ display: 'flex', gap: m ? 8 : 14, animation: 'marqueeRight 30s linear infinite', width: 'max-content' }}>
              {[...SKILLS, ...SKILLS].map((s, i) => <SkillPill key={i} skill={s} small={m} />)}
            </div>
            <div style={{ display: 'flex', gap: m ? 8 : 14, animation: 'marqueeLeft 35s linear infinite', width: 'max-content', marginTop: m ? 8 : 14 }}>
              {[...SKILLS.slice().reverse(), ...SKILLS.slice().reverse()].map((s, i) => <SkillPill key={i} skill={s} small={m} />)}
            </div>
          </div>
        </div>
      </div>

      {/* ===== CONTACT ===== */}
      <div style={{ width: '100%', background: EYE.shadow, padding: m ? '60px 20px' : 'clamp(80px, 10vw, 160px) clamp(40px, 8vw, 160px)', textAlign: 'center' }}>
        <div className="ab-reveal" style={{ maxWidth: 800, margin: '0 auto', opacity: 0 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: m ? 11 : 14, color: EYE.skin, letterSpacing: 4, textTransform: 'uppercase', marginBottom: m ? 12 : 20 }}>Get In Touch</p>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: m ? 28 : 'clamp(36px, 5vw, 64px)', fontWeight: 800, color: EYE.cream, marginBottom: m ? 12 : 20, lineHeight: 1.1, letterSpacing: -2 }}>
            Let's create something<br/>beautiful together
          </h3>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: m ? 14 : 18, color: 'rgba(255,255,255,0.4)', marginBottom: m ? 28 : 48, lineHeight: 1.7 }}>
            Whether it's a project, a job opportunity, or just to say hi — I'd love to hear from you.
          </p>
          <a href="mailto:choi.coco@northeastern.edu" onMouseEnter={handleCtaEnter} onMouseLeave={handleCtaLeave} style={{ display: 'inline-flex', alignItems: 'center', gap: m ? 10 : 16, padding: m ? '16px 32px' : '22px 48px', borderRadius: 60, background: EYE.rose, color: 'white', fontFamily: "'DM Sans', sans-serif", fontSize: m ? 14 : 17, fontWeight: 700, letterSpacing: 1.5, textDecoration: 'none', transition: 'all 0.4s cubic-bezier(0.25,0,0,1)', boxShadow: `0 8px 30px ${EYE.rose}40` }}>
            <MailIcon /> Say Hello
          </a>

          <div style={{ display: 'flex', justifyContent: 'center', gap: m ? 20 : 'clamp(30px, 4vw, 60px)', marginTop: m ? 36 : 56, flexWrap: 'wrap' }}>
            {CONTACT_INFO.map((c, i) => (
              <div key={i}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: m ? 9 : 10, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 6 }}>{c.label}</div>
                {c.href ? (
                  <a href={c.href} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: m ? 12 : 15, color: EYE.cream, textDecoration: 'none', fontWeight: 500, transition: 'color 0.3s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = EYE.rose)} onMouseLeave={(e) => (e.currentTarget.style.color = EYE.cream)}>{c.value}</a>
                ) : (
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: m ? 12 : 15, color: EYE.cream, fontWeight: 500 }}>{c.value}</div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: m ? 32 : 48 }}>
            {ABOUT_SOCIALS.map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label} style={{ width: m ? 44 : 52, height: m ? 44 : 52, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'all 0.4s cubic-bezier(0.25,0,0,1)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = EYE.rose; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = EYE.rose; e.currentTarget.style.transform = 'translateY(-4px) scale(1.08)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = '' }}>
                {SOCIAL_ICONS[i]}
              </a>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: m ? '40px auto 0' : '80px auto 0', paddingTop: m ? 20 : 40, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: m ? 'column' : 'row', gap: m ? 8 : 0 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: m ? 16 : 20, fontWeight: 700, color: EYE.cream }}>Coco Choi</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: m ? 10 : 12, color: 'rgba(255,255,255,0.2)', letterSpacing: 2 }}>© 2025 · Built with React, Rive & GSAP</div>
        </div>
      </div>

      <button className="page-back" onClick={goHome} style={{ color: '#aaa', background: 'rgba(0,0,0,0.03)', borderColor: 'rgba(0,0,0,0.06)', zIndex: 20, position: 'fixed' }}>←</button>
      <NavOverlay go={go} current="about" light />
    </div>
  )
}

function SkillPill({ skill, small }) {
  return (
    <span className="skill-pill" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: small ? 12 : 15, fontWeight: 600, padding: small ? '8px 16px' : '12px 26px', borderRadius: 40, whiteSpace: 'nowrap', background: 'white', color: skill.color, border: `1.5px solid ${skill.color}25`, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
      {skill.label}
    </span>
  )
}
