import { useEffect } from 'react'
import gsap from 'gsap'

/**
 * Attaches a mousemove listener that applies GSAP-based parallax to a ref.
 *
 * @param {React.RefObject} ref       — element to move
 * @param {object}          options
 * @param {number}          options.xFactor — horizontal movement multiplier
 * @param {number}          options.yFactor — vertical movement multiplier
 * @param {number}          options.duration — GSAP tween duration
 * @param {boolean}         options.enabled  — toggle on/off
 */
export default function useParallax(
  ref,
  { xFactor = 10, yFactor = 8, duration = 0.8, enabled = true } = {},
) {
  useEffect(() => {
    if (!enabled) return

    const onMove = (e) => {
      if (!ref.current) return
      const xP = (e.clientX / window.innerWidth - 0.5) * 2
      const yP = (e.clientY / window.innerHeight - 0.5) * 2
      gsap.to(ref.current, {
        x: xP * xFactor,
        y: yP * yFactor,
        duration,
        ease: 'power2.out',
      })
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [ref, xFactor, yFactor, duration, enabled])
}
