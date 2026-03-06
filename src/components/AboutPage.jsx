import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import NavOverlay from './NavOverlay'

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
  { label: 'React', color: '#E37B88' },
  { label: 'TypeScript', color: '#c9a96e' },
  { label: 'Next.js', color: '#8b7ecf' },
  { label: 'Node.js', color: '#7aafcb' },
  { label: 'Python', color: '#E37B88' },
  { label: 'Swift', color: '#c9a96e' },
  { label: 'SwiftUI', color: '#8b7ecf' },
  { label: 'GSAP', color: '#7aafcb' },
  { label: 'Rive', color: '#E37B88' },
  { label: 'Redux', color: '#c9a96e' },
  { label: 'Express', color: '#8b7ecf' },
  { label: 'MongoDB', color: '#7aafcb' },
  { label: 'AWS', color: '#E37B88' },
  { label: 'Airflow', color: '#c9a96e' },
  { label: 'Figma', color: '#8b7ecf' },
  { label: 'Git', color: '#7aafcb' },
]

export default function AboutPage({ go }) {
  const canvasRef = useRef(null)
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const scrollRef = useRef(null)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let r = null
    import('@rive-app/canvas').then((rive) => {
      const dpr = window.devicePixelRatio || 1
      const size = Math.min(window.innerWidth * 1.2, window.innerHeight * 1.2, 1800)
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

  useEffect(() => {
    const onMove = (e) => {
      const xP = (e.clientX / window.innerWidth - 0.5) * 2
      const yP = (e.clientY / window.innerHeight - 0.5) * 2
      if (leftRef.current) gsap.to(leftRef.current, { x: -xP * 8, y: -yP * 6, duration: 0.8, ease: 'power2.out' })
      if (rightRef.current) gsap.to(rightRef.current, { x: xP * 8, y: yP * 6, duration: 0.8, ease: 'power2.out' })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo('.ab-left', { opacity: 0, x: -35 }, { opacity: 1, x: 0, duration: 1, delay: 0.4 })
    tl.fromTo('.ab-right', { opacity: 0, x: 35 }, { opacity: 1, x: 0, duration: 1 }, '-=0.7')
    tl.fromTo('.ab-stat', { opacity: 0, y: 20, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.12 }, '-=0.5')
    tl.fromTo('.ab-scroll-hint', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.2')
  }, [])

  // Scroll-triggered animations for below-fold content
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

  return (
      <div ref={scrollRef} style={{ width: '100vw', height: '100vh', background: '#fff', position: 'relative', overflowX: 'hidden', overflowY: 'auto' }}>

        <style>{`
        .ab-input:focus { border-color: #E37B88 !important; background: #fff !important; box-shadow: 0 0 0 3px rgba(227,123,136,0.1) !important; }
        .skill-pill { transition: all 0.35s cubic-bezier(0.25,0,0,1); }
        .skill-pill:hover { transform: translateY(-3px) scale(1.06); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
        .contact-card { transition: all 0.35s cubic-bezier(0.25,0,0,1); }
        .contact-card:hover { transform: translateY(-4px); box-shadow: 0 12px 35px rgba(0,0,0,0.08); }
        .ab-scroll-hint { animation: scrollBounce 2s ease-in-out infinite; }
        @keyframes scrollBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
        .send-btn { transition: all 0.35s cubic-bezier(0.25,0,0,1); }
        .send-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(227,123,136,0.3); }
      `}</style>

        {/* ===== SECTION 1: Hero with Rive ===== */}
        <div style={{ width: '100%', height: '100vh', position: 'relative', flexShrink: 0 }}>

          <div style={{ position: 'absolute', inset: 0, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <canvas ref={canvasRef} style={{ display: 'block' }} />
          </div>

          <div ref={leftRef} className="ab-left" style={{
            position: 'absolute', left: '15%', top: '50%', transform: 'translateY(-50%)',
            maxWidth: 320, zIndex: 10, opacity: 0,
          }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, letterSpacing: 5, textTransform: 'uppercase', color: '#E37B88', marginBottom: 20 }}>About</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(70px, 7vw, 96px)', fontWeight: 800, color: '#2a2020', marginBottom: 28, lineHeight: 1.05, letterSpacing: -2 }}>
              Hi, I'm Coco
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 19, lineHeight: 1.85, color: '#555' }}>
              I'm a creative software engineer with a strong focus on motion and interactivity. I like to build things that feel alive.
            </p>
          </div>

          <div ref={rightRef} className="ab-right" style={{
            position: 'absolute', right: '15%', top: '55%', transform: 'translateY(-50%)',
            maxWidth: 280, zIndex: 10, opacity: 0,
          }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 19, lineHeight: 1.85, color: '#555', marginBottom: 36 }}>
              MS Computer Science at Northeastern University. From healthcare dashboards to IoT pipelines at Audi — I build at the intersection of engineering, design & creativity.
            </p>
            <div style={{ display: 'flex', gap: 36, paddingTop: 28, borderTop: '1px solid #eee' }}>
              {[['4.0', 'GPA', ''], ['3', 'Internships', '+'], ['10', 'Projects', '+']].map(([n, l, s], i) => (
                  <div key={l} className="ab-stat" style={{ opacity: 0 }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 800, color: '#E37B88' }}>
                      <AnimatedNumber target={n} suffix={s} delay={0.8 + i * 0.2} />
                    </div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: 2.5, textTransform: 'uppercase', color: '#bbb', marginTop: 4 }}>{l}</div>
                  </div>
              ))}
            </div>
          </div>

          {/* Scroll hint */}
          <div className="ab-scroll-hint" style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0 }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#bbb' }}>Scroll</div>
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round">
              <rect x="1" y="1" width="14" height="22" rx="7" />
              <line x1="8" y1="6" x2="8" y2="10" />
            </svg>
          </div>
        </div>

        {/* ===== SECTION 2: Extended Bio + Skills ===== */}
        <div style={{ width: '100%', background: '#faf5f0', padding: 'clamp(60px, 8vw, 120px) clamp(40px, 10vw, 200px)' }}>

          <div className="ab-reveal" style={{ maxWidth: 900, margin: '0 auto', opacity: 0 }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 14, color: '#c9a96e', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 16 }}>The Story</p>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, color: '#2a2020', marginBottom: 32, lineHeight: 1.15, letterSpacing: -1 }}>
              Building at the intersection of code, design & creativity
            </h3>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, lineHeight: 2, color: '#666', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <p>
                I'm currently pursuing my MS in Computer Science at Northeastern University (4.0 GPA), and I hold a BA in Business and Film from Franklin & Marshall College. This blend of technical and creative backgrounds shapes how I approach every project.
              </p>
              <p>
                I combine my skills in software engineering, design, and animation to create digital experiences that feel delightful to interact with. In a great product, every element on screen should react to the user's input — that's the philosophy I bring to my work.
              </p>
              <p>
                My professional journey includes building healthcare research tools at UbiWell Lab, designing IoT data pipelines at Audi Innovation Research, and developing enterprise web applications at Mars Inc. in Hong Kong. Outside of work, I founded Pet Paradise — a full-stack platform for pet care, born from my love of caring for 20+ cats and dogs.
              </p>
              <p>
                When I'm not coding, you'll find me drawing, exploring new design tools, or experimenting with Rive animations — like the ones you see on this very website.
              </p>
            </div>
          </div>

          {/* Skills */}
          <div className="ab-reveal" style={{ maxWidth: 900, margin: '60px auto 0', opacity: 0 }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 14, color: '#c9a96e', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 20 }}>My Stack</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {SKILLS.map((s, i) => (
                  <span key={i} className="skill-pill" style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
                    padding: '10px 22px', borderRadius: 40,
                    background: 'white', color: s.color,
                    border: `1.5px solid ${s.color}22`,
                    cursor: 'default',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}>{s.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ===== SECTION 3: Contact ===== */}
        <div style={{ width: '100%', background: '#2a2020', padding: 'clamp(60px, 8vw, 120px) clamp(40px, 10vw, 200px)' }}>

          <div className="ab-reveal" style={{ maxWidth: 900, margin: '0 auto', opacity: 0 }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 14, color: '#c9a96e', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 16 }}>Get In Touch</p>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, color: '#f0e8dc', marginBottom: 48, lineHeight: 1.15, letterSpacing: -1 }}>
              Let's create something beautiful together
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>

              {/* Left — Contact cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Email */}
                <a href="mailto:choi.coco@northeastern.edu" className="contact-card" style={{
                  display: 'flex', alignItems: 'center', gap: 18,
                  padding: '22px 26px', borderRadius: 18,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                  textDecoration: 'none', cursor: 'pointer',
                }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(227,123,136,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E37B88" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Email</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: '#f0e8dc', fontWeight: 500 }}>choi.coco@northeastern.edu</div>
                  </div>
                </a>

                {/* Phone */}
                <a href="tel:6177628179" className="contact-card" style={{
                  display: 'flex', alignItems: 'center', gap: 18,
                  padding: '22px 26px', borderRadius: 18,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                  textDecoration: 'none', cursor: 'pointer',
                }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(201,169,110,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Phone</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: '#f0e8dc', fontWeight: 500 }}>(617) 762-8179</div>
                  </div>
                </a>

                {/* Location */}
                <div className="contact-card" style={{
                  display: 'flex', alignItems: 'center', gap: 18,
                  padding: '22px 26px', borderRadius: 18,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(139,126,207,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b7ecf" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Location</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: '#f0e8dc', fontWeight: 500 }}>Wellesley, MA 02481</div>
                  </div>
                </div>

                {/* Social links row */}
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  {[
                    { href: 'https://github.com/Cocochoiii', label: 'GitHub', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg> },
                    { href: 'https://www.linkedin.com/in/coco-choi-5a16511a2/', label: 'LinkedIn', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> },
                  ].map((s, i) => (
                      <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label} style={{
                        width: 48, height: 48, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
                        transition: 'all 0.35s cubic-bezier(0.25,0,0,1)',
                      }}
                         onMouseEnter={e => { e.currentTarget.style.background = '#E37B88'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#E37B88'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                         onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = '' }}
                      >{s.icon}</a>
                  ))}
                </div>
              </div>

              {/* Right — Contact form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Your Name</div>
                  <input className="ab-input" style={{ ...inputStyle, background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', color: '#f0e8dc' }}
                         placeholder="Jane Doe" value={formData.name}
                         onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Your Email</div>
                  <input className="ab-input" style={{ ...inputStyle, background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', color: '#f0e8dc' }}
                         placeholder="jane@example.com" value={formData.email}
                         onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Message</div>
                  <textarea className="ab-input" rows={5} style={{ ...inputStyle, background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', color: '#f0e8dc', resize: 'vertical', minHeight: 120 }}
                            placeholder="Tell me about your project..." value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })} />
                </div>
                <button className="send-btn" onClick={handleSubmit} style={{
                  padding: '16px 36px', borderRadius: 40,
                  background: sent ? '#7aafcb' : '#E37B88', border: 'none',
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700,
                  letterSpacing: 2, textTransform: 'uppercase',
                  color: 'white', cursor: 'pointer', alignSelf: 'flex-start',
                  marginTop: 8,
                }}>
                  {sent ? '✓ Opening Mail App...' : 'Send Message →'}
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ maxWidth: 900, margin: '80px auto 0', paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#f0e8dc' }}>Coco Choi</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.2)', letterSpacing: 2 }}>© 2025 · Built with React, Rive & GSAP</div>
          </div>
        </div>

        {/* Fixed nav elements */}
        <button className="page-back" onClick={() => go('home')} style={{ color: '#aaa', background: 'rgba(0,0,0,0.03)', borderColor: 'rgba(0,0,0,0.06)', zIndex: 20, position: 'fixed' }}>←</button>
        <NavOverlay go={go} current="about" light />
      </div>
  )
}