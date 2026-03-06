import { useState, useEffect, useCallback } from 'react'

/**
 * Cycles through an array of strings with a typing / deleting animation.
 * Call `start()` to begin (e.g. after an entrance animation completes).
 */
export default function useTypewriter(
  strings,
  {
    typingSpeed     = 65,
    deletingSpeed   = 35,
    pauseAfterType  = 1800,
    pauseAfterDelete = 400,
  } = {},
) {
  const [displayed, setDisplayed] = useState('')
  const [index, setIndex]         = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [ready, setReady]         = useState(false)

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
