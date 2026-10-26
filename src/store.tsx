import { createContext, useContext, useEffect, useMemo, useReducer, type Dispatch, type ReactNode } from 'react'
import type { Pattern, Profile, Settings, State } from '@/types'
import { addDays, dayKey } from '@/lib/dates'
import { BOOKS } from '@/data/books'
import { lookupWord } from '@/data/words'

const KEY = 'iread:v1'

const prefersReducedMotion = (): boolean => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

export const defaultSettings = (): Settings => ({
  tint: 'cream',
  font: 'dyslexic',
  spacing: 'relaxed',
  textSize: 26,
  ruler: true,
  syllables: false,
  highlight: true,
  reducedMotion: prefersReducedMotion(),
  speed: 1,
  voice: null,
})

/** Demo data so every screen looks lived-in on first launch. */
export function seedState(today: Date = new Date()): State {
  const days = [1, 2, 3, 4].map((n) => dayKey(addDays(today, -n)))
  const olderRun = [14, 15, 16, 17, 18, 19, 20].map((n) => dayKey(addDays(today, -n)))
  const minutes: Record<string, number> = {}
  ;[15, 12, 20, 9].forEach((m, i) => (minutes[days[i]] = m))
  olderRun.forEach((k, i) => (minutes[k] = 8 + i))
  const t = Date.now()
  const stat = (mastery: number) => ({ mastery, savedAt: t })
  return {
    profile: { onboarded: false, role: 'child', name: 'Leo', grade: '5th grade', avatar: '🦊', parentEmail: '', consent: false },
    settings: defaultSettings(),
    progress: {
      'creatures-of-the-night': { page: 4, done: false },
      'the-robot-who-learned-to-wait': { page: 4, done: true },
      'the-missing-lantern': { page: 4, done: true },
      'builders-of-the-old-city': { page: 4, done: true },
    },
    words: {
      shadows: stat(2),
      nocturnal: stat(1),
      gliding: stat(3),
      whiskers: stat(2),
      branches: stat(1),
      feathers: stat(3),
      moonlight: stat(2),
      hunt: stat(3),
      quietly: stat(1),
      talons: stat(1),
      burrow: stat(2),
      silent: stat(0),
    },
    readDays: [...days, ...olderRun],
    minutes,
    recent: ['Night animals', 'Space', 'Silent e'],
    shelf: ['creatures-of-the-night'],
    phonics: { syllables: 24, silentE: 16, affix: 10 },
    badges: ['explorer', 'lightning', 'globetrotter'],
    badgeBase: 9,
    parentPin: '1234',
    reminders: { on: true, time: '16:30' },
  }
}

export type Action =
  | { type: 'profile'; patch: Partial<Profile> }
  | { type: 'settings'; patch: Partial<Settings> }
  | { type: 'finishOnboarding' }
  | { type: 'replayOnboarding' }
  | { type: 'setPage'; id: string; page: number }
  | { type: 'logRead'; minutes: number; today?: Date }
  | { type: 'completeBook'; id: string }
  | { type: 'toggleWord'; word: string }
  | { type: 'practice'; word: string; got: boolean }
  | { type: 'addRecent'; q: string }
  | { type: 'clearRecent' }
  | { type: 'toggleShelf'; id: string }
  | { type: 'reminders'; patch: Partial<State['reminders']> }
  | { type: 'reset' }

const bump = (p: Pattern, phonics: State['phonics'], d: number): State['phonics'] => ({
  ...phonics,
  [p]: Math.max(0, phonics[p] + d),
})

export function reducer(state: State, a: Action): State {
  switch (a.type) {
    case 'profile':
      return { ...state, profile: { ...state.profile, ...a.patch } }
    case 'settings':
      return { ...state, settings: { ...state.settings, ...a.patch } }
    case 'finishOnboarding':
      return { ...state, profile: { ...state.profile, onboarded: true } }
    case 'replayOnboarding':
      return { ...state, profile: { ...state.profile, onboarded: false } }
    case 'setPage': {
      const prev = state.progress[a.id]
      return { ...state, progress: { ...state.progress, [a.id]: { page: a.page, done: prev?.done ?? false } } }
    }
    case 'logRead': {
      const key = dayKey(a.today)
      const readDays = state.readDays.includes(key) ? state.readDays : [...state.readDays, key]
      return { ...state, readDays, minutes: { ...state.minutes, [key]: (state.minutes[key] ?? 0) + a.minutes } }
    }
    case 'completeBook': {
      const book = BOOKS.find((b) => b.id === a.id)
      if (!book) return state
      const badges = state.badges.includes(book.trophy) ? state.badges : [...state.badges, book.trophy]
      return {
        ...state,
        badges,
        progress: { ...state.progress, [a.id]: { page: book.pages.length, done: true } },
      }
    }
    case 'toggleWord': {
      const words = { ...state.words }
      if (words[a.word]) delete words[a.word]
      else words[a.word] = { mastery: 0, savedAt: Date.now() }
      return { ...state, words }
    }
    case 'practice': {
      const cur = state.words[a.word]
      if (!cur) return state
      const mastery = Math.max(0, Math.min(3, cur.mastery + (a.got ? 1 : -1)))
      const pattern = lookupWord(a.word).pattern
      const gained = a.got && mastery === 3 && cur.mastery < 3
      return {
        ...state,
        words: { ...state.words, [a.word]: { ...cur, mastery } },
        phonics: gained ? bump(pattern, state.phonics, 1) : state.phonics,
      }
    }
    case 'addRecent': {
      const q = a.q.trim()
      if (!q) return state
      const recent = [q, ...state.recent.filter((r) => r.toLowerCase() !== q.toLowerCase())].slice(0, 6)
      return { ...state, recent }
    }
    case 'clearRecent':
      return { ...state, recent: [] }
    case 'toggleShelf':
      return {
        ...state,
        shelf: state.shelf.includes(a.id) ? state.shelf.filter((s) => s !== a.id) : [...state.shelf, a.id],
      }
    case 'reminders':
      return { ...state, reminders: { ...state.reminders, ...a.patch } }
    case 'reset':
      return seedState()
  }
}

function load(): State {
  const seed = seedState()
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seed
    const saved = JSON.parse(raw) as Partial<State>
    return {
      ...seed,
      ...saved,
      profile: { ...seed.profile, ...saved.profile },
      settings: { ...seed.settings, ...saved.settings },
      phonics: { ...seed.phonics, ...saved.phonics },
      reminders: { ...seed.reminders, ...saved.reminders },
    }
  } catch {
    return seed
  }
}

interface Ctx {
  state: State
  dispatch: Dispatch<Action>
}
const StoreCtx = createContext<Ctx | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage may be unavailable (private mode): the app still works in memory */
    }
  }, [state])
  const value = useMemo(() => ({ state, dispatch }), [state])
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore(): Ctx {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}

/** Words looked up in the current reading session (not persisted). */
const sessionWords = new Set<string>()
export const session = {
  add: (w: string) => sessionWords.add(w),
  list: () => Array.from(sessionWords),
  clear: () => sessionWords.clear(),
}
