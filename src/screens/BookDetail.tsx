import { BackButton, Button, Chip, IconButton } from '@/components/ui'
import { Icon } from '@/components/Icon'
import { BookCover } from '@/components/BookCover'
import { getBook, readingMinutes } from '@/data/books'
import { lookupWord } from '@/data/words'
import { topicName } from '@/lib/search'
import { pageProps, useSpeaker } from '@/lib/hooks'
import { goBack, useNavigate } from '@/router'
import { useStore } from '@/store'

export function BookDetail({ id }: { id: string }) {
  const go = useNavigate()
  const { state, dispatch } = useStore()
  const { say } = useSpeaker()
  const book = getBook(id)
  if (!book) return <NotFound />
  const prog = state.progress[book.id]
  const inProgress = prog && !prog.done && prog.page > 1
  const onShelf = state.shelf.includes(book.id)

  return (
    <div className="flow detail-page">
      <header className="flow-head">
        <BackButton onClick={() => goBack('/library')} />
        <strong className="head-title">Book details</strong>
        <IconButton icon="bookmark" label={onShelf ? 'Remove from bookshelf' : 'Add to bookshelf'} className={onShelf ? 'on' : ''} aria-pressed={onShelf} onClick={() => dispatch({ type: 'toggleShelf', id: book.id })} />
      </header>
      <div className="flow-body detail">
        <div className="detail-hero"><BookCover book={book} size="lg" /></div>
        <div className="detail-info">
          <span className="tag green">Level {book.level}</span>
          <h1>{book.title}</h1>
          <p className="lede">{book.blurb}</p>
          <div className="facts card">
            <span><Icon name="book" /><b>{book.pages.length}</b><small>Pages</small></span>
            <span><Icon name="clock" /><b>{readingMinutes(book)} min</b><small>Reading time</small></span>
            <span><Icon name="library" /><b>{topicName(book.topic)}</b><small>Topic</small></span>
          </div>
          <h2 className="section-label">PHONICS FOCUS</h2>
          <div className="chip-row wrap">{[...book.tags, book.focus.replace(/ \(.*\)/, '')].filter((v, i, a) => a.indexOf(v) === i).map((t) => <Chip key={t} className="soft">{t}</Chip>)}</div>
          <h2 className="section-label">WORDS YOU’LL PRACTICE</h2>
          <div className="chip-row wrap">
            {book.practice.map((w) => <Chip key={w} onClick={() => say(w)} className="word-chip"><Icon name="speaker" size={14} /> {lookupWord(w).syllables.join('·')}</Chip>)}
          </div>
          <h2 className="section-label">PREVIEW</h2>
          <blockquote className="preview-quote" {...pageProps(state.settings)}>{book.pages[0].slice(0, 2).join(' ')}</blockquote>
        </div>
      </div>
      <footer className="flow-foot dual">
        <Button variant="secondary" icon="sound" onClick={() => say(`${book.title}. ${book.blurb}`)}>Listen first</Button>
        <Button onClick={() => go(`/read/${book.id}`)}>{inProgress ? `Resume · Page ${prog.page}` : 'Start Reading'} <Icon name="arrow" size={18} /></Button>
      </footer>
    </div>
  )
}

export function NotFound() {
  const go = useNavigate()
  return (
    <div className="flow center-msg">
      <h1>We couldn’t find that page</h1>
      <Button onClick={() => go('/library', { replace: true })}>Back to Library</Button>
    </div>
  )
}
