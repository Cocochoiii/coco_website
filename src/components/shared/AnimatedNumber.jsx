import { useState, useEffect, memo } from 'react'
import gsap from 'gsap'

/**
 * Animates a number from 0 to `target` using GSAP.
 */
function AnimatedNumber({ target, suffix = '', duration = 1.5, delay = 0.8 }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const num = parseFloat(target)
    const obj = { val: 0 }
    const hasDecimal = target.includes('.')

    const tween = gsap.to(obj, {
      val: num,
      duration,
      delay,
      ease: 'power2.out',
      onUpdate: () => {
        setValue(hasDecimal ? obj.val.toFixed(1) : Math.round(obj.val))
      },
    })

    return () => tween.kill()
  }, [target, duration, delay])

  return (
    <span>
      {value}
      {suffix}
    </span>
  )
}

export default memo(AnimatedNumber)
