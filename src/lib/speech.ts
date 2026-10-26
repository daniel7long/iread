/**
 * Thin wrapper around the Web Speech API.
 * - Read-aloud with word-level callbacks (for the yellow word highlight).
 * - If speech synthesis is missing or silent (some desktop browsers), word
 *   callbacks are simulated on a timer so the highlight still moves.
 */
export const ttsSupported = (): boolean => typeof window !== 'undefined' && 'speechSynthesis' in window

export function listVoices(): SpeechSynthesisVoice[] {
  if (!ttsSupported()) return []
  return window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('en'))
}

export interface SpeakOptions {
  rate?: number
  voice?: string | null
  onWord?: (wordIndex: number) => void
  onEnd?: () => void
}

export interface SpeakHandle {
  cancel: () => void
}

function wordStarts(text: string): number[] {
  const out: number[] = []
  const re = /\S+/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) out.push(m.index)
  return out
}

export function stopSpeaking(): void {
  if (ttsSupported()) window.speechSynthesis.cancel()
}

export function speak(text: string, opts: SpeakOptions = {}): SpeakHandle {
  const rate = opts.rate ?? 1
  const starts = wordStarts(text)
  let finished = false
  let started = false
  let timer: number | undefined
  let watchdog: number | undefined

  const finish = () => {
    if (finished) return
    finished = true
    window.clearTimeout(watchdog)
    window.clearInterval(timer)
    opts.onEnd?.()
  }

  const simulate = () => {
    if (finished || timer !== undefined) return
    let i = 0
    opts.onWord?.(0)
    timer = window.setInterval(() => {
      i++
      if (i >= starts.length) {
        finish()
        return
      }
      opts.onWord?.(i)
    }, 420 / rate)
  }

  if (!ttsSupported()) {
    simulate()
  } else {
    const synth = window.speechSynthesis
    synth.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.rate = Math.max(0.5, Math.min(1.6, rate * 0.9)) // slightly slower than default
    u.lang = 'en-US'
    if (opts.voice) {
      const v = synth.getVoices().find((x) => x.name === opts.voice)
      if (v) u.voice = v
    }
    u.onstart = () => {
      started = true
      window.clearTimeout(watchdog)
      opts.onWord?.(0)
    }
    u.onboundary = (e) => {
      if (e.name && e.name !== 'word') return
      let idx = 0
      for (let i = 0; i < starts.length; i++) if (starts[i] <= e.charIndex) idx = i
      opts.onWord?.(idx)
    }
    u.onend = finish
    u.onerror = (e) => {
      // No usable voice: keep the highlight moving on a timer instead of skipping ahead.
      if (!started && e.error !== 'canceled' && e.error !== 'interrupted') {
        window.clearTimeout(watchdog)
        simulate()
      } else finish()
    }
    synth.speak(u)
    // Some browsers never start (no voices installed): fall back to a timer.
    watchdog = window.setTimeout(() => {
      if (!started) {
        synth.cancel()
        simulate()
      }
    }, 1200)
  }

  return {
    cancel: () => {
      if (finished) return
      finished = true
      window.clearTimeout(watchdog)
      window.clearInterval(timer)
      if (ttsSupported()) window.speechSynthesis.cancel()
    },
  }
}

/* ---------- speech recognition (optional, Chrome/Safari) ---------- */
type RecognitionCtor = new () => {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

function recognitionCtor(): RecognitionCtor | undefined {
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

export const recognitionSupported = (): boolean => typeof window !== 'undefined' && !!recognitionCtor()

/** Listens once and resolves with the best transcript, or null on error/no speech. */
export function listenOnce(): Promise<string | null> {
  const Ctor = recognitionCtor()
  if (!Ctor) return Promise.resolve(null)
  return new Promise((resolve) => {
    const rec = new Ctor()
    let got: string | null = null
    rec.lang = 'en-US'
    rec.interimResults = false
    rec.maxAlternatives = 3
    rec.onresult = (e) => {
      got = e.results[0]?.[0]?.transcript ?? null
    }
    rec.onerror = () => resolve(null)
    rec.onend = () => resolve(got)
    try {
      rec.start()
    } catch {
      resolve(null)
    }
  })
}
