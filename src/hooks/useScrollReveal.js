import { useEffect } from 'react'
import gsap from 'gsap'

/**
 * Watches a scrollable container for `.ab-reveal` elements and
 * fades them in with GSAP when they enter the viewport.
 *
 * @param {React.RefObject} containerRef — the scrollable parent
 * @param {string}          selector     — CSS selector for reveal targets
 */
export default function useScrollReveal(containerRef, selector = '.ab-reveal') {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onScroll = () => {
      const sections = container.querySelectorAll(selector)
      sections.forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.85 && !el.dataset.revealed) {
          el.dataset.revealed = 'true'
          gsap.fromTo(
            el,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          )
        }
      })
    }

    container.addEventListener('scroll', onScroll)
    // Initial check after mount
    const timer = setTimeout(onScroll, 500)

    return () => {
      container.removeEventListener('scroll', onScroll)
      clearTimeout(timer)
    }
  }, [containerRef, selector])
}
