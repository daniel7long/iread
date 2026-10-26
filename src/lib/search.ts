import { BOOKS, LEVELS, TOPICS, bookLength } from '@/data/books'
import type { Book, Length, LevelId, State, TopicId } from '@/types'

export interface BookFilter {
  q?: string
  topic?: TopicId | 'all'
  focus?: string // full focus label or 'all'
  tags?: string[]
  maxLevel?: LevelId
  length?: Length | 'any'
  unfinished?: boolean
}

export function filterBooks(filter: BookFilter, progress: State['progress'] = {}, books: Book[] = BOOKS): Book[] {
  const q = filter.q?.trim().toLowerCase()
  return books.filter((b) => {
    if (filter.topic && filter.topic !== 'all' && b.topic !== filter.topic) return false
    if (filter.focus && filter.focus !== 'all' && b.focus !== filter.focus) return false
    if (filter.tags?.length && !filter.tags.some((t) => b.tags.includes(t))) return false
    if (filter.maxLevel && LEVELS.indexOf(b.level) > LEVELS.indexOf(filter.maxLevel)) return false
    if (filter.length && filter.length !== 'any' && bookLength(b) !== filter.length) return false
    if (filter.unfinished && progress[b.id]?.done) return false
    if (q) {
      const topicName = TOPICS.find((t) => t.id === b.topic)?.name ?? ''
      const hay = `${b.title} ${b.blurb} ${topicName} ${b.focus} ${b.tags.join(' ')} ${b.hard.join(' ')}`.toLowerCase()
      // match every word of the query ("night animals" -> night + animal(s))
      return q.split(/\s+/).every((part) => hay.includes(part.replace(/s$/, '')))
    }
    return true
  })
}

export const topicName = (id: TopicId): string => TOPICS.find((t) => t.id === id)?.name ?? id
