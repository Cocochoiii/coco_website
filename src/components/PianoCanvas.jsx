import { useEffect, useRef, memo } from 'react'
import gsap from 'gsap'

/**
 * Rive piano canvas with three movement modes:
 *   "follow" — GSAP mouse parallax (Home page)
 *   "float"  — gentle breathing animation
 *   "static" — no movement
 */
function PianoCanvas({ scale = 1.3, intensity = 0.08, mode = 'follow' }) {
  const canvasRef = useRef(null)
  const wrapRef   = useRef(null)
  const riveRef   = useRef(null)

  /* ── Load Rive ── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let r = null
    let onResize = null

    import('@rive-app/canvas').then((rive) => {
      const dpr = window.devicePixelRatio || 1
      const W = window.innerWidth * scale
      const H = window.innerHeight * scale

      canvas.width  = W * dpr
      canvas.height = H * dpr
      canvas.style.width  = W + 'px'
      canvas.style.height = H + 'px'

      r = new rive.Rive({
        src: '/piano.riv',
        canvas,
        artboard: 'Bye Quincy',
        stateMachines: 'State Machine 1',
        autoplay: true,
        layout: new rive.Layout({ fit: rive.Fit.Cover, alignment: rive.Alignment.Center }),
        onLoad: () => {
          r.resizeDrawingSurfaceToCanvas()
          const inputs = r.stateMachineInputs('State Machine 1')
          const roll = inputs?.find((i) => i.name === 'roll')
          if (roll) setTimeout(() => { roll.value = true }, 800)
        },
      })
      riveRef.current = r

      onResize = () => {
        const W2 = window.innerWidth  * scale
        const H2 = window.innerHeight * scale
        canvas.width  = W2 * dpr
        canvas.height = H2 * dpr
        canvas.style.width  = W2 + 'px'
        canvas.style.height = H2 + 'px'
        r.layout = new rive.Layout({ fit: rive.Fit.Cover, alignment: rive.Alignment.Center })
        r.resizeDrawingSurfaceToCanvas()
      }
      window.addEventListener('resize', onResize)
    })

    return () => {
      if (onResize) window.removeEventListener('resize', onResize)
      if (riveRef.current) riveRef.current.cleanup()
      riveRef.current = null
    }
  }, [scale])

  /* ── Mouse follow mode ── */
  useEffect(() => {
    if (mode !== 'follow') return
    const wrap = wrapRef.current
    if (!wrap) return

    const onMove = (e) => {
      const xP = (e.clientX / window.innerWidth  - 0.5) * 2
      const yP = (e.clientY / window.innerHeight - 0.5) * 2
      gsap.to(wrap, {
        x: -xP * window.innerWidth  * intensity,
        y: -yP * window.innerHeight * intensity,
        rotateX:  yP * 1.5,
        rotateY: -xP * 1.5,
        duration: 0.8,
        ease: 'power2.out',
      })
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [mode, intensity])

  /* ── Float mode ── */
  useEffect(() => {
    if (mode !== 'float') return
    const wrap = wrapRef.current
    if (!wrap) return

    const tween = gsap.to(wrap, {
      y: -8, rotateZ: 0.5,
      duration: 3, yoyo: true, repeat: -1,
      ease: 'sine.inOut',
    })

    return () => tween.kill()
  }, [mode])

  const offset = ((scale - 1) / 2) * 100

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'absolute',
        top:  `-${offset}%`,
        left: `-${offset}%`,
        width:  `${scale * 100}%`,
        height: `${scale * 100}%`,
        willChange: 'transform',
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}

export default memo(PianoCanvas)
