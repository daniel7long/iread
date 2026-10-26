import { describe, expect, it } from 'vitest'
import { syllabify } from '@/lib/syllables'
import { lookupWord } from '@/data/words'
import { BOOKS, TROPHIES } from '@/data/books'
import { bestStreak, currentStreak, dayKey, weekOf, addDays } from '@/lib/dates'
import { filterBooks } from '@/lib/search'
import { reducer, seedState } from '@/store'
import { matchPath } from '@/router'

const TODAY = new Date(2026, 9, 24, 12) // Sat 24 Oct 2026

describe('syllables', () => {
  it('uses hand-checked entries first', () => {
    expect(lookupWord('shadows').syllables).toEqual(['sha', 'dows'])
    expect(lookupWord('Nocturnal,').syllables).toEqual(['noc', 'tur', 'nal'])
  })
  it('splits unknown words with simple rules', () => {
    expect(syllabify('basket')).toEqual(['bas', 'ket'])
    expect(syllabify('rabbit')).toEqual(['rab', 'bit'])
    expect(syllabify('window')).toEqual(['win', 'dow'])
    expect(syllabify('teacher')).toEqual(['tea', 'cher'])
    expect(syllabify('adventure')).toEqual(['ad', 'ven', 'ture'])
  })
  it('keeps short words whole', () => {
    expect(syllabify('cat')).toEqual(['cat'])
    expect(syllabify('')).toEqual([])
  })
  it('every dictionary word re-joins to itself', () => {
    for (const b of BOOKS) for (const w of [...b.hard, ...b.practice]) {
      const e = lookupWord(w)
      expect(e.syllables.join('')).toBe(e.word)
    }
  })
})

describe('content', () => {
  it('all books have pages, a quiz answer that exists, and a known trophy', () => {
    for (const b of BOOKS) {
      expect(b.pages.length).toBeGreaterThan(2)
      expect(b.quiz.options.map((o) => o.id)).toContain(b.quiz.answer)
      expect(TROPHIES.map((t) => t.id)).toContain(b.trophy)
    }
  })
})

describe('dates', () => {
  it('seed has a 4-day streak and a best of 7', () => {
    const s = seedState(TODAY)
    expect(currentStreak(s.readDays, TODAY)).toBe(4)
    expect(bestStreak(s.readDays)).toBe(7)
  })
  it('reading today extends the streak', () => {
    const s = reducer(seedState(TODAY), { type: 'logRead', minutes: 2, today: TODAY })
    expect(currentStreak(s.readDays, TODAY)).toBe(5)
    expect(s.minutes[dayKey(TODAY)]).toBe(2)
  })
  it('a gap resets the streak', () => {
    expect(currentStreak([dayKey(addDays(TODAY, -3))], TODAY)).toBe(0)
  })
  it('week starts on Monday', () => {
    const w = weekOf(TODAY)
    expect(w).toHaveLength(7)
    expect(w[0].label).toBe('M')
    expect(w[5].isToday).toBe(true)
  })
})

describe('search', () => {
  it('matches multi-word queries', () => {
    expect(filterBooks({ q: 'night animals' }).map((b) => b.id)).toContain('creatures-of-the-night')
  })
  it('filters by level and topic', () => {
    expect(filterBooks({ maxLevel: 'C' }).every((b) => 'ABC'.includes(b.level))).toBe(true)
    expect(filterBooks({ topic: 'ocean' }).map((b) => b.id)).toEqual(['whales-of-the-deep'])
  })
})

describe('store', () => {
  it('toggles saved words', () => {
    let s = seedState(TODAY)
    s = reducer(s, { type: 'toggleWord', word: 'burrow' })
    expect(s.words.burrow).toBeUndefined()
    s = reducer(s, { type: 'toggleWord', word: 'burrow' })
    expect(s.words.burrow.mastery).toBe(0)
  })
  it('practice moves mastery within 0-3 and counts newly mastered words', () => {
    let s = seedState(TODAY)
    const before = s.phonics.syllables
    s = reducer(s, { type: 'practice', word: 'shadows', got: true })
    expect(s.words.shadows.mastery).toBe(3)
    expect(s.phonics.syllables).toBe(before + 1)
    s = reducer(s, { type: 'practice', word: 'shadows', got: true })
    expect(s.words.shadows.mastery).toBe(3)
    s = reducer(s, { type: 'practice', word: 'silent', got: false })
    expect(s.words.silent.mastery).toBe(0)
  })
  it('completing a book marks it done and earns its trophy once', () => {
    let s = seedState(TODAY)
    s = reducer(s, { type: 'completeBook', id: 'creatures-of-the-night' })
    s = reducer(s, { type: 'completeBook', id: 'creatures-of-the-night' })
    expect(s.progress['creatures-of-the-night'].done).toBe(true)
    expect(s.badges.filter((b) => b === 'night-owl')).toHaveLength(1)
    expect(s.badgeBase + s.badges.length).toBe(13)
  })
  it('page progress keeps the done flag', () => {
    const s = reducer(seedState(TODAY), { type: 'setPage', id: 'the-missing-lantern', page: 1 })
    expect(s.progress['the-missing-lantern']).toEqual({ page: 1, done: true })
  })
  it('recent searches are de-duplicated and capped', () => {
    let s = seedState(TODAY)
    s = reducer(s, { type: 'addRecent', q: 'space' })
    expect(s.recent.filter((r) => r.toLowerCase() === 'space')).toHaveLength(1)
    for (let i = 0; i < 10; i++) s = reducer(s, { type: 'addRecent', q: `q${i}` })
    expect(s.recent).toHaveLength(6)
  })
})

describe('router', () => {
  it('matches params', () => {
    expect(matchPath('/book/:id', '/book/abc')).toEqual({ id: 'abc' })
    expect(matchPath('/book/:id', '/read/abc')).toBeNull()
  })
})
