import { useEffect, useState } from 'react'
import { AudioButton, BackButton, Button, Chip, IconButton, Segmented, Sheet, Toggle } from '@/components/ui'
import { Icon } from '@/components/Icon'
import { BookCover } from '@/components/BookCover'
import { LEVELS, PHONICS_TAGS } from '@/data/books'
import { filterBooks, topicName } from '@/lib/search'
import { useSpeaker } from '@/lib/hooks'
import { listenOnce, recognitionSupported } from '@/lib/speech'
import { goBack, useNavigate, useRoute } from '@/router'
import { useStore } from '@/store'
import type { Length, LevelId } from '@/types'

export function Search() {
  const go = useNavigate()
  const route = useRoute()
  const { state, dispatch } = useStore()
  const { say } = useSpeaker()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(route.query.get('filters') === '1')
  const [level, setLevel] = useState<LevelId>('F')
  const [tags, setTags] = useState<string[]>([])
  const [length, setLength] = useState<Length | 'any'>('any')
  const [unfinished, setUnfinished] = useState(false)
  const [listening, setListening] = useState(false)

  useEffect(() => {
    if (route.query.get('filters') === '1') setOpen(true)
  }, [route.query])

  const results = filterBooks({ q, tags, maxLevel: level, length, unfinished }, state.progress)
  const activeFilters = (level !== 'F' ? 1 : 0) + (tags.length ? 1 : 0) + (length !== 'any' ? 1 : 0) + (unfinished ? 1 : 0)
  const reset = () => {
    setLevel('F')
    setTags([])
    setLength('any')
    setUnfinished(false)
  }
  const submit = (value: string) => {
    setQ(value)
    dispatch({ type: 'addRecent', q: value })
  }
  const voice = async () => {
    setListening(true)
    const heard = await listenOnce()
    setListening(false)
    if (heard) submit(heard.replace(/[.?!]$/, ''))
  }

  return (
    <div className="flow search-page">
      <header className="flow-head">
        <BackButton onClick={() => goBack('/library')} />
        <strong className="head-title">Search books</strong>
        <span />
      </header>
      <div className="flow-body">
        <form className="search-row" role="search" onSubmit={(e) => { e.preventDefault(); submit(q) }}>
          <label className="search-field">
            <Icon name="search" />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, topic, or sound" aria-label="Search books" autoFocus />
            {recognitionSupported() && (
              <IconButton icon="mic" label={listening ? 'Listening…' : 'Search by voice'} className={`mic ${listening ? 'live' : ''}`} type="button" onClick={voice} />
            )}
          </label>
          <button type="button" className="square-btn" aria-label="Open filters" onClick={() => setOpen(true)}>
            <Icon name="sliders" />
            {activeFilters > 0 && <span className="badge-dot">{activeFilters}</span>}
          </button>
        </form>

        {state.recent.length > 0 && !q && (
          <>
            <div className="section-head">
              <h2 className="section-label">RECENT SEARCHES</h2>
              <button className="link-btn" onClick={() => dispatch({ type: 'clearRecent' })}>Clear</button>
            </div>
            <div className="chip-row wrap">{state.recent.map((r) => <Chip key={r} onClick={() => setQ(r)}>{r}</Chip>)}</div>
          </>
        )}

        <h2 className="section-label">{q ? `RESULTS (${results.length})` : 'ALL BOOKS'}</h2>
        {results.length === 0 && <p className="empty">No books found. Try a topic like “ocean” or a sound like “silent e”.</p>}
        <div className="result-list">
          {results.map((b) => (
            <div className="result" key={b.id}>
              <button className="result-main" onClick={() => go(`/book/${b.id}`)}>
                <BookCover book={b} size="sm" showTitle={false} />
                <span>
                  <b>{b.title}</b>
                  <small>Level {b.level} · {topicName(b.topic)} · {b.pages.length} pages</small>
                </span>
              </button>
              <AudioButton label={`Hear ${b.title}`} size={44} onClick={() => say(b.title)} />
            </div>
          ))}
        </div>
      </div>

      <Sheet open={open} onClose={() => setOpen(false)} title="Filter books">
        <div className="filter-block">
          <div className="filter-title"><b>Reading level</b><span className="tag blue">Up to {level}</span></div>
          <input type="range" min={0} max={5} value={LEVELS.indexOf(level)} onChange={(e) => setLevel(LEVELS[Number(e.target.value)])} aria-label="Reading level" />
          <div className="ticks">{LEVELS.map((l) => <span key={l}>{l}</span>)}</div>
        </div>
        <div className="filter-block">
          <b>Phonics focus</b>
          <div className="chip-row wrap">
            {PHONICS_TAGS.map((t) => <Chip key={t} active={tags.includes(t)} onClick={() => setTags(tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t])}>{t}</Chip>)}
          </div>
        </div>
        <div className="filter-block">
          <b>Length</b>
          <Segmented<Length | 'any'> label="Length" value={length} onChange={setLength} options={[{ id: 'any', label: 'Any' }, { id: 'short', label: 'Short' }, { id: 'medium', label: 'Medium' }, { id: 'long', label: 'Long' }]} />
        </div>
        <Toggle label="Only unfinished books" hint="Hide books you have already read" checked={unfinished} onChange={setUnfinished} />
        <div className="sheet-actions">
          <Button variant="secondary" onClick={reset}>Clear</Button>
          <Button onClick={() => setOpen(false)}>Show {results.length} {results.length === 1 ? 'book' : 'books'}</Button>
        </div>
      </Sheet>
    </div>
  )
}
