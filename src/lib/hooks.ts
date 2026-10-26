import { useCallback, useEffect, useRef, useSyncExternalStore, type CSSProperties } from 'react'
import { speak as rawSpeak, stopSpeaking, type SpeakHandle, type SpeakOptions } from './speech'
import { useStore } from '@/store'
import type { Settings } from '@/types'

export function useMedia(query: string): boolean {
  const subscribe = useCallback(
    (cb: () => void) => {
      const m = window.matchMedia(query)
      m.addEventListener('change', cb)
      return () => m.removeEventListener('change', cb)
    },
    [query],
  )
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false)
}

/** Tablet / desktop layout: nav rail and two-pane screens. */
export const useIsWide = (): boolean => useMedia('(min-width: 900px)')

/** Speech helper bound to the user's voice + speed settings. Stops when the screen unmounts. */
export function useSpeaker() {
  const { state } = useStore()
  const handle = useRef<SpeakHandle | null>(null)
  const settings = useRef(state.settings)
  settings.current = state.settings

  const stop = useCallback(() => {
    handle.current?.cancel()
    handle.current = null
  }, [])

  const say = useCallback(
    (text: string, opts: Omit<SpeakOptions, 'rate' | 'voice'> & { rate?: number } = {}) => {
      handle.current?.cancel()
      handle.current = rawSpeak(text, { rate: settings.current.speed, voice: settings.current.voice, ...opts })
      return handle.current
    },
    [],
  )

  useEffect(
    () => () => {
      handle.current?.cancel()
      stopSpeaking()
    },
    [],
  )
  return { say, stop }
}

/** Data attributes + CSS variables that style a "page" of text with the reader's comfort settings. */
export function pageProps(s: Settings): { 'data-tint': string; 'data-font': string; 'data-spacing': string; style: CSSProperties } {
  return {
    'data-tint': s.tint,
    'data-font': s.font,
    'data-spacing': s.spacing,
    style: { ['--read-size' as string]: `${s.textSize}px` },
  }
}
