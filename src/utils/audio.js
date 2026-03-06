import { Howl } from 'howler'

/* ─── Background music (singleton) ─── */

let bgMusic = null
try {
  bgMusic = new Howl({
    src: ['/music.mp3'],
    loop: true,
    volume: 0.3,
    html5: true,
    preload: true,
  })
} catch (e) {
  /* Music file may not exist — silently degrade */
}

export { bgMusic }

/* ─── Piano tone synthesizer ─── */

let audioCtx = null

/**
 * Plays a simple piano-like tone using Web Audio API.
 *
 * @param {number} freq     — frequency in Hz (e.g. 261.6 for middle C)
 * @param {number} duration — note length in seconds
 */
export function playNote(freq, duration = 0.6) {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }

  const now  = audioCtx.currentTime
  const gain = audioCtx.createGain()
  const osc  = audioCtx.createOscillator()
  const osc2 = audioCtx.createOscillator()

  osc.type  = 'triangle'
  osc.frequency.value = freq

  osc2.type = 'sine'
  osc2.frequency.value = freq * 2.01

  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(0.12, now + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

  osc.connect(gain)
  osc2.connect(gain)
  gain.connect(audioCtx.destination)

  osc.start()
  osc2.start()
  osc.stop(now + duration)
  osc2.stop(now + duration)
}
