import { useEffect, useRef } from 'react'

/**
 * Loads a Rive file onto a <canvas> element and returns the canvas ref.
 *
 * Handles DPR scaling, resize listener, and cleanup automatically.
 *
 * @param {object} options
 * @param {string} options.src          — path to the .riv file
 * @param {string} [options.artboard]   — artboard name (optional)
 * @param {string} [options.stateMachine] — state machine to start
 * @param {string} [options.animation]  — simple animation name (use instead of stateMachine)
 * @param {string} [options.fit]        — 'Cover' | 'Contain' | etc.
 * @param {string} [options.alignment]  — 'Center' | etc.
 * @param {Function} [options.onLoad]   — callback after Rive loads (receives rive instance)
 * @param {Function} [options.getSize]  — returns { width, height } for the canvas; called on mount & resize
 */
export default function useRiveCanvas({
  src,
  artboard,
  stateMachine,
  animation,
  fit = 'Cover',
  alignment = 'Center',
  onLoad,
  getSize,
}) {
  const canvasRef = useRef(null)
  const riveRef   = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let r = null
    let onResize = null

    import('@rive-app/canvas').then((rive) => {
      const dpr = window.devicePixelRatio || 1
      const { width: W, height: H } = getSize()

      canvas.width  = W * dpr
      canvas.height = H * dpr
      canvas.style.width  = W + 'px'
      canvas.style.height = H + 'px'

      const riveConfig = {
        src,
        canvas,
        autoplay: true,
        layout: new rive.Layout({
          fit: rive.Fit[fit],
          alignment: rive.Alignment[alignment],
        }),
        onLoad: () => {
          r.resizeDrawingSurfaceToCanvas()
          onLoad?.(r)
        },
      }

      if (artboard)     riveConfig.artboard = artboard
      if (stateMachine)  riveConfig.stateMachines = stateMachine
      if (animation)     riveConfig.animations = animation

      r = new rive.Rive(riveConfig)
      riveRef.current = r

      onResize = () => {
        const { width: W2, height: H2 } = getSize()
        canvas.width  = W2 * dpr
        canvas.height = H2 * dpr
        canvas.style.width  = W2 + 'px'
        canvas.style.height = H2 + 'px'
        r.layout = new rive.Layout({
          fit: rive.Fit[fit],
          alignment: rive.Alignment[alignment],
        })
        r.resizeDrawingSurfaceToCanvas()
      }

      window.addEventListener('resize', onResize)
    }).catch(() => {})

    return () => {
      if (onResize) window.removeEventListener('resize', onResize)
      if (r) r.cleanup()
      riveRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  return { canvasRef, riveRef }
}
