import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import NavOverlay from './NavOverlay'

/*
 * Eye Rive palette only
 */
const EYE = {
  skin:   '#c4a48a',
  rose:   '#c47a6e',
  shadow: '#3d2f2a',
  cream:  '#f0e8dc',
  iris:   '#8a9ba3',
  warm:   '#b8917a',
}

function AnimatedNumber({ target, suffix = '', duration = 1.5, delay = 0.8 }) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const num = parseFloat(target)
    const obj = { val: 0 }
    const tween = gsap.to(obj, {
      val: num, duration, delay, ease: 'power2.out',
      onUpdate: () => { if (target.includes('.')) setValue(obj.val.toFixed(1)); else setValue(Math.round(obj.val)) }
    })
    return () => tween.kill()
  }, [target, duration, delay])
  return <span>{value}{suffix}</span>
}

const SKILLS = [
  { label: 'React', color: EYE.rose },
  { label: 'TypeScript', color: EYE.skin },
  { label: 'Next.js', color: EYE.iris },
  { label: 'Node.js', color: EYE.warm },
  { label: 'Python', color: EYE.rose },
  { label: 'Swift', color: EYE.skin },
  { label: 'Django', color: EYE.iris },
  { label: 'FastAPI', color: EYE.warm },
  { label: 'GraphQL', color: EYE.rose },
  { label: 'Kafka', color: EYE.skin },
  { label: 'Docker', color: EYE.iris },
  { label: 'MongoDB', color: EYE.warm },
  { label: 'PostgreSQL', color: EYE.rose },
  { label: 'AWS', color: EYE.skin },
  { label: 'Redis', color: EYE.iris },
  { label: 'Spark', color: EYE.warm },
  { label: 'SwiftUI', color: EYE.rose },
  { label: 'GSAP', color: EYE.skin },
  { label: 'Rive', color: EYE.iris },
  { label: 'Git', color: EYE.warm },
]

export default function AboutPage({ go }) {
  const canvasRef = useRef(null)
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const scrollRef = useRef(null)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [hoveredStat, setHoveredStat] = useState(null)

  /* Rive — untouched */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let r = null
    import('@rive-app/canvas').then((rive) => {
      const dpr = window.devicePixelRatio || 1
      const size = Math.min(window.innerWidth * 2.0, window.innerHeight * 2.0, 2200)
      canvas.width = size * dpr; canvas.height = size * dpr
      canvas.style.width = size + 'px'; canvas.style.height = size + 'px'
      r = new rive.Rive({
                          src: '/about_me.riv', canvas,
                          stateMachines: 'State Machine 1', autoplay: true,
                          layout: new rive.Layout({ fit: rive.Fit.Contain, alignment: rive.Alignment.Center }),
                          onLoad: () => r.resizeDrawingSurfaceToCanvas(),
                        })
      const onResize = () => {
        const s = Math.min(window.innerWidth * 1.2, window.innerHeight * 1.2, 1800)
        canvas.width = s * dpr; canvas.height = s * dpr
        canvas.style.width = s + 'px'; canvas.style.height = s + 'px'
        r.layout = new rive.Layout({ fit: rive.Fit.Contain, alignment: rive.Alignment.Center })
        r.resizeDrawingSurfaceToCanvas()
      }
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    })
    return () => { if (r) r.cleanup() }
  }, [])

  /* Mouse parallax */
  useEffect(() => {
    const onMove = (e) => {
      const xP = (e.clientX / window.innerWidth - 0.5) * 2
      const yP = (e.clientY / window.innerHeight - 0.5) * 2
      if (leftRef.current) gsap.to(leftRef.current, { x: -xP * 10, y: -yP * 8, duration: 0.8, ease: 'power2.out' })
      if (rightRef.current) gsap.to(rightRef.current, { x: xP * 10, y: yP * 8, duration: 0.8, ease: 'power2.out' })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  /* Entrance */
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo('.ab-left', { opacity: 0, x: -40, filter: 'blur(8px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1, delay: 0.4 })
    tl.fromTo('.ab-right', { opacity: 0, x: 40, filter: 'blur(8px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1 }, '-=0.7')
    tl.fromTo('.ab-scroll-hint', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.2')
  }, [])

  /* Scroll-reveal */
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const onScroll = () => {
      const sections = container.querySelectorAll('.ab-reveal')
      sections.forEach(el => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.85 && !el.dataset.revealed) {
          el.dataset.revealed = 'true'
          gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        }
      })
    }
    container.addEventListener('scroll', onScroll)
    setTimeout(onScroll, 500)
    return () => container.removeEventListener('scroll', onScroll)
  }, [])

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) return
    window.location.href = `mailto:choi.coco@northeastern.edu?subject=Portfolio Contact from ${formData.name}&body=${encodeURIComponent(formData.message)}%0A%0AFrom: ${formData.name} (${formData.email})`
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  const inputStyle = {
    width: '100%', padding: '16px 20px', borderRadius: 14,
    border: '1.5px solid #eee', background: '#fafafa',
    fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: '#333',
    outline: 'none', transition: 'all 0.3s',
  }

  const STATS = [
    { n: '3.8', s: '', label: 'GPA', color: EYE.rose },
    { n: '3', s: '+', label: 'Internships', color: EYE.skin },
    { n: '8', s: '+', label: 'Projects', color: EYE.iris },
  ]

  return (
      <div ref={scrollRef} style={{ width: '100vw', height: '100vh', background: '#fff', position: 'relative', overflowX: 'hidden', overflowY: 'auto' }}>

        <style>{`
        .ab-input:focus { border-color: ${EYE.rose} !important; background: #fff !important; box-shadow: 0 0 0 3px ${EYE.rose}18 !important; }
        .skill-pill { transition: all 0.35s cubic-bezier(0.25,0,0,1); cursor: default; }
        .skill-pill:hover { transform: translateY(-3px) scale(1.06); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
        .contact-card { transition: all 0.35s cubic-bezier(0.25,0,0,1); }
        .contact-card:hover { transform: translateY(-4px); box-shadow: 0 12px 35px rgba(0,0,0,0.08); }
        .ab-scroll-hint { animation: scrollBounce 2s ease-in-out infinite; }
        @keyframes scrollBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
        .send-btn { transition: all 0.35s cubic-bezier(0.25,0,0,1); }
        .send-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 30px ${EYE.rose}44; }
      `}</style>

        {/* ===== HERO ===== */}
        <div style={{ width: '100%', height: '100vh', position: 'relative', flexShrink: 0 }}>

          {/* Rive */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <canvas ref={canvasRef} style={{ display: 'block' }} />
          </div>

          {/* LEFT panel — near the girl's left hand */}
          <div ref={leftRef} className="ab-left" style={{
            position: 'absolute', right: '70%',
            top: '44%', transform: 'translateY(-50%)',
            width: 'clamp(280px, 28vw, 420px)', zIndex: 10, opacity: 0,
          }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 30, fontWeight: 700,
              letterSpacing: 6, textTransform: 'uppercase', color: EYE.rose, marginBottom: 20,
            }}>About Me</p>

            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(180px, 9vw, 130px)',
              fontWeight: 900, color: EYE.shadow,
              marginBottom: 24, lineHeight: 0.92, letterSpacing: -5,
            }}>
              Coco<br/>Choi
            </h2>

            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(25px, 1.8vw, 30px)', lineHeight: 1.55, color: '#444', fontWeight: 400,
            }}>
              Engineer who thinks like a designer.
              I ship products that people{' '}
              <span style={{ color: EYE.rose, fontWeight: 600 }}>actually enjoy using.</span>
            </p>
          </div>

          {/* RIGHT panel — near the girl's right hand */}
          <div ref={rightRef} className="ab-right" style={{
            position: 'absolute', left: '70%',
            top: '50%', transform: 'translateY(-50%)',
            width: 'clamp(280px, 28vw, 420px)', zIndex: 10, opacity: 0,
          }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(25px, 1.8vw, 30px)', lineHeight: 1.6, color: '#444', marginBottom: 32, fontWeight: 400,
            }}>
              Northeastern CS grad student.
              Previously at{' '}
              <span style={{ fontWeight: 700, color: EYE.shadow }}>Audi</span>,{' '}
              <span style={{ fontWeight: 700, color: EYE.shadow }}>Mars Inc.</span>,{' '}
              &{' '}<span style={{ fontWeight: 700, color: EYE.shadow }}>UbiWell Lab</span>.
              I turn complex systems into experiences that feel effortless.
            </p>

            {/* Stats row — fixed sizing, no overflow */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {STATS.map((st, i) => (
                  <div
                      key={st.label}
                      style={{
                        position: 'relative', overflow: 'hidden',
                        padding: '24px 0', borderRadius: 14,
                        background: hoveredStat === i ? st.color : 'rgba(0,0,0,0.025)',
                        border: `1.5px solid ${hoveredStat === i ? st.color : 'rgba(0,0,0,0.05)'}`,
                        cursor: 'default', textAlign: 'center',
                        transition: 'all 0.4s cubic-bezier(0.25,0,0,1)',
                        boxShadow: hoveredStat === i ? `0 12px 30px ${st.color}30` : 'none',
                      }}
                      onMouseEnter={() => setHoveredStat(i)}
                      onMouseLeave={() => setHoveredStat(null)}
                  >
                    <div style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 44, fontWeight: 800, lineHeight: 1,
                      color: hoveredStat === i ? '#fff' : st.color,
                      transition: 'color 0.3s',
                    }}>
                      <AnimatedNumber target={st.n} suffix={st.s} delay={0.8 + i * 0.2} />
                    </div>
                    <div style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12, fontWeight: 700,
                      letterSpacing: 2, textTransform: 'uppercase',
                      color: hoveredStat === i ? 'rgba(255,255,255,0.75)' : '#bbb',
                      marginTop: 6, transition: 'color 0.3s',
                    }}>{st.label}</div>
                  </div>
              ))}
            </div>
          </div>

          {/* Scroll hint */}
          <div className="ab-scroll-hint" style={{
            position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)',
            zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0,
          }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#bbb' }}>Scroll</div>
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round">
              <rect x="1" y="1" width="14" height="22" rx="7" />
              <line x1="8" y1="6" x2="8" y2="10" />
            </svg>
          </div>
        </div>

        {/* ===== STORY — editorial magazine layout ===== */}
        <div style={{ width: '100%', background: '#faf5f0', padding: 'clamp(80px, 10vw, 160px) 0', overflow: 'hidden' }}>

          {/* Pull quote — full width, dramatic */}
          <div className="ab-reveal" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(40px, 8vw, 160px)', opacity: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 60 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(80px, 10vw, 140px)', fontWeight: 900, color: EYE.rose, lineHeight: 0.8, opacity: 0.2 }}>"</span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 3.5vw, 46px)', fontWeight: 700, fontStyle: 'italic', color: EYE.shadow, lineHeight: 1.3, letterSpacing: -1, marginTop: 16 }}>
                In a great product, every element on screen should react to the user — that's the philosophy I bring to my work.
              </h3>
            </div>
          </div>

          {/* Two-column editorial */}
          <div className="ab-reveal" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(40px, 8vw, 160px)', opacity: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px, 5vw, 80px)' }}>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, lineHeight: 2, color: '#666' }}>
                  I hold a BA in Business and Film from Franklin & Marshall College and I'm currently pursuing my MS in Computer Science at Northeastern University. This blend of technical and creative backgrounds shapes how I approach every project.
                </p>
                <div style={{ margin: '32px 0', height: 1, background: `linear-gradient(90deg, ${EYE.rose}40, transparent)` }} />
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, lineHeight: 2, color: '#666' }}>
                  My professional journey includes building healthcare research tools at UbiWell Lab, designing IoT data pipelines at Audi, and developing enterprise web apps at Mars Inc. in Hong Kong.
                </p>
              </div>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, lineHeight: 2, color: '#666' }}>
                  I combine software engineering, design, and animation to create digital experiences that feel delightful to interact with. Outside of work, I founded Pet Paradise — a full-stack platform born from my love of caring for 20+ cats and dogs.
                </p>
                <div style={{ margin: '32px 0', height: 1, background: `linear-gradient(90deg, ${EYE.skin}40, transparent)` }} />
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, lineHeight: 2, color: '#666' }}>
                  When I'm not coding, you'll find me drawing, exploring new design tools, or experimenting with Rive animations — like the ones you see on this very website.
                </p>
              </div>
            </div>
          </div>

          {/* Key numbers — large editorial stats */}
          <div className="ab-reveal" style={{ maxWidth: 1100, margin: '80px auto 0', padding: '0 clamp(40px, 8vw, 160px)', opacity: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `2px solid ${EYE.shadow}10`, paddingTop: 40 }}>
              {[
                { num: '2.5M+', label: 'Data Points Processed Daily', color: EYE.rose },
                { num: '50K', label: 'Events per Second (Kafka)', color: EYE.skin },
                { num: '20+', label: 'Cats & Dogs Cared For', color: EYE.warm },
                { num: '99.9%', label: 'System Availability', color: EYE.iris },
              ].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 3.5vw, 52px)', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.num}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#aaa', marginTop: 10, lineHeight: 1.4 }}>{s.label}</div>
                  </div>
              ))}
            </div>
          </div>

          {/* Skills — infinite marquee scroll */}
          <div className="ab-reveal" style={{ marginTop: 80, opacity: 0 }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 14, color: EYE.skin, letterSpacing: 4, textTransform: 'uppercase', textAlign: 'center', marginBottom: 28 }}>My Stack</p>
            <div style={{ overflow: 'hidden', position: 'relative' }}>
              {/* Fade edges */}
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(90deg, #faf5f0, transparent)', zIndex: 2 }} />
              <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(-90deg, #faf5f0, transparent)', zIndex: 2 }} />
              {/* Row 1 — scroll right */}
              <div style={{ display: 'flex', gap: 14, animation: 'marqueeRight 30s linear infinite', width: 'max-content' }}>
                {[...SKILLS, ...SKILLS].map((s, i) => (
                    <span key={i} className="skill-pill" style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
                      padding: '12px 26px', borderRadius: 40, whiteSpace: 'nowrap',
                      background: 'white', color: s.color,
                      border: `1.5px solid ${s.color}25`,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                    }}>{s.label}</span>
                ))}
              </div>
              {/* Row 2 — scroll left */}
              <div style={{ display: 'flex', gap: 14, animation: 'marqueeLeft 35s linear infinite', width: 'max-content', marginTop: 14 }}>
                {[...SKILLS.slice().reverse(), ...SKILLS.slice().reverse()].map((s, i) => (
                    <span key={i} className="skill-pill" style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
                      padding: '12px 26px', borderRadius: 40, whiteSpace: 'nowrap',
                      background: 'white', color: s.color,
                      border: `1.5px solid ${s.color}25`,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                    }}>{s.label}</span>
                ))}
              </div>
            </div>
          </div>

          <style>{`
          @keyframes marqueeRight { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          @keyframes marqueeLeft { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        `}</style>
        </div>

        {/* ===== CONTACT — gallery-style centered layout ===== */}
        <div style={{ width: '100%', background: EYE.shadow, padding: 'clamp(80px, 10vw, 160px) clamp(40px, 8vw, 160px)', textAlign: 'center' }}>

          <div className="ab-reveal" style={{ maxWidth: 800, margin: '0 auto', opacity: 0 }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 14, color: EYE.skin, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 20 }}>Get In Touch</p>

            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, color: EYE.cream, marginBottom: 20, lineHeight: 1.1, letterSpacing: -2 }}>
              Let's create something<br/>beautiful together
            </h3>

            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: 'rgba(255,255,255,0.4)', marginBottom: 48, lineHeight: 1.7 }}>
              Whether it's a project, a job opportunity, or just to say hi — I'd love to hear from you.
            </p>

            {/* Big CTA email button */}
            <a href="mailto:choi.coco@northeastern.edu" style={{
              display: 'inline-flex', alignItems: 'center', gap: 16,
              padding: '22px 48px', borderRadius: 60,
              background: EYE.rose, color: 'white',
              fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 700,
              letterSpacing: 1.5, textDecoration: 'none',
              transition: 'all 0.4s cubic-bezier(0.25,0,0,1)',
              boxShadow: `0 8px 30px ${EYE.rose}40`,
            }}
               onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.03)'; e.currentTarget.style.boxShadow = `0 16px 50px ${EYE.rose}50` }}
               onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 8px 30px ${EYE.rose}40` }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              Say Hello
            </a>

            {/* Contact info — horizontal, minimal */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(30px, 4vw, 60px)', marginTop: 56, flexWrap: 'wrap' }}>
              {[
                { label: 'Email', value: 'choi.coco@northeastern.edu', href: 'mailto:choi.coco@northeastern.edu' },
                { label: 'Phone', value: '(617) 762-8179', href: 'tel:6177628179' },
                { label: 'Location', value: 'Wellesley, MA', href: null },
              ].map((c, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 6 }}>{c.label}</div>
                    {c.href ? (
                        <a href={c.href} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: EYE.cream, textDecoration: 'none', fontWeight: 500, transition: 'color 0.3s' }}
                           onMouseEnter={e => e.currentTarget.style.color = EYE.rose}
                           onMouseLeave={e => e.currentTarget.style.color = EYE.cream}
                        >{c.value}</a>
                    ) : (
                         <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: EYE.cream, fontWeight: 500 }}>{c.value}</div>
                     )}
                  </div>
              ))}
            </div>

            {/* Social links */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 48 }}>
              {[
                { href: 'https://github.com/Cocochoiii', label: 'GitHub', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg> },
                { href: 'https://www.linkedin.com/in/coco-choi-5a16511a2/', label: 'LinkedIn', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> },
              ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label} style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.35)', textDecoration: 'none',
                    transition: 'all 0.4s cubic-bezier(0.25,0,0,1)',
                  }}
                     onMouseEnter={e => { e.currentTarget.style.background = EYE.rose; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = EYE.rose; e.currentTarget.style.transform = 'translateY(-4px) scale(1.08)' }}
                     onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = '' }}
                  >{s.icon}</a>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ maxWidth: 900, margin: '80px auto 0', paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: EYE.cream }}>Coco Choi</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.2)', letterSpacing: 2 }}>© 2025 · Built with React, Rive & GSAP</div>
          </div>
        </div>

        <button className="page-back" onClick={() => go('home')} style={{ color: '#aaa', background: 'rgba(0,0,0,0.03)', borderColor: 'rgba(0,0,0,0.06)', zIndex: 20, position: 'fixed' }}>←</button>
        <NavOverlay go={go} current="about" light />
      </div>
  )
}