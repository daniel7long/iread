import { BookCover } from './BookCover'
import { AudioButton, Progress } from './ui'
import { topicName } from '@/lib/search'
import { useSpeaker } from '@/lib/hooks'
import { useNavigate } from '@/router'
import type { Book, State } from '@/types'

export function ContinueCard({ book, progress }: { book: Book; progress?: State['progress'][string] }) {
  const go = useNavigate()
  const page = Math.min(progress?.page ?? 1, book.pages.length)
  const pct = Math.round((page / book.pages.length) * 100)
  return (
    <article className="card continue-card">
      <button className="continue-cover" onClick={() => go(`/book/${book.id}`)} aria-label={`About ${book.title}`}>
        <BookCover book={book} size="lg" />
      </button>
      <div className="continue-info">
        <div className="tags"><span className="tag green">Level {book.level}</span><span className="tag">{book.pages.length} Pages</span></div>
        <h3>{book.title}</h3>
        <p className="muted">{topicName(book.topic)} Readers</p>
        <div className="progress-row"><span>Page {page} of {book.pages.length}</span><b>{pct}%</b></div>
        <Progress value={pct} label={`${book.title} progress`} />
        <button className="btn btn-primary" onClick={() => go(`/read/${book.id}`)}>Resume Reading → Page {page}</button>
      </div>
    </article>
  )
}

export function DecodableCard({ book, done }: { book: Book; done?: boolean }) {
  const go = useNavigate()
  const { say } = useSpeaker()
  return (
    <article className="decodable">
      <button className="decodable-main" onClick={() => go(`/book/${book.id}`)}>
        <BookCover book={book} size="md" showTitle={false} />
        <strong>{book.title}</strong>
        <span className="tag blue">{book.focus.replace(/ \(.*\)/, '')}</span>
        {done && <span className="tag green read-tag">Read ✓</span>}
      </button>
      <span className="decodable-audio">
        <AudioButton label={`Hear a preview of ${book.title}`} size={40} onClick={() => say(`${book.title}. ${book.blurb}`)} />
      </span>
    </article>
  )
}

export function GoalRing({ minutes, goal = 10 }: { minutes: number; goal?: number }) {
  const pct = Math.min(100, Math.round((minutes / goal) * 100))
  return (
    <div className="goal-ring" role="img" aria-label={`${Math.round(minutes)} of ${goal} minutes read today`} style={{ background: `conic-gradient(var(--amber) ${pct}%, rgba(45,74,115,.12) 0)` }}>
      <span><b>{Math.round(minutes)}</b><small>of {goal} min</small></span>
    </div>
  )
}
