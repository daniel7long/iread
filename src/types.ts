export type Tint = 'white' | 'cream' | 'mint' | 'midnight'
export type FontId = 'dyslexic' | 'atkinson' | 'modern'
export type Spacing = 'standard' | 'relaxed' | 'wide'
export type Role = 'child' | 'teen' | 'parent'
export type Pattern = 'syllables' | 'silentE' | 'affix'
export type TopicId = 'wildlife' | 'space' | 'tech' | 'mysteries' | 'history' | 'ocean'
export type LevelId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
export type Length = 'short' | 'medium' | 'long'

export interface Settings {
  tint: Tint
  font: FontId
  spacing: Spacing
  textSize: number // px, 20-34
  ruler: boolean
  syllables: boolean
  highlight: boolean
  reducedMotion: boolean
  speed: number // read-aloud rate
  voice: string | null
}

export interface Profile {
  onboarded: boolean
  role: Role
  name: string
  grade: string
  avatar: string
  parentEmail: string
  consent: boolean
}

export interface WordStat {
  mastery: number // 0-3
  savedAt: number
}

export interface BookProgress {
  page: number // 1-based
  done: boolean
}

export interface Quiz {
  question: string
  options: { id: string; label: string; icon: string }[]
  answer: string
}

export interface Book {
  id: string
  title: string
  blurb: string
  topic: TopicId
  level: LevelId
  focus: string // phonics focus label
  tags: string[]
  cover: { from: string; to: string; icon: string }
  pages: string[][] // pages -> sentences
  hard: string[]
  practice: string[]
  quiz: Quiz
  trophy: string
}

export interface WordEntry {
  word: string
  syllables: string[]
  definition: string
  example: string
  pattern: Pattern
  base?: { word: string; meaning: string }
  suffix?: { text: string; meaning: string }
}

export interface Trophy {
  id: string
  name: string
  icon: string
  tone: 'yellow' | 'blue' | 'green'
  how: string
}

export interface State {
  profile: Profile
  settings: Settings
  progress: Record<string, BookProgress>
  words: Record<string, WordStat>
  readDays: string[]
  minutes: Record<string, number>
  recent: string[]
  shelf: string[]
  phonics: Record<Pattern, number>
  badges: string[]
  badgeBase: number
  parentPin: string
  reminders: { on: boolean; time: string }
}
