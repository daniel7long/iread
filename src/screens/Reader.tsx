import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { IconButton, useToast } from '@/components/ui'
import { Icon } from '@/components/Icon'
import { ComfortPanel, PanelIdle, SidePanel, WordPanel } from '@/components/WordPanel'
import { NotFound } from './BookDetail'
import { getBook } from '@/data/books'
import { clean, lookupWord } from '@/data/words'
import { pageProps, useIsWide, useSpeaker } from '@/lib/hooks'
import { useNavigate } from '@/router'
import { session, useStore } from '@/store'
import type { Book, Settings } from '@/types'

const SPEEDS = [0.8, 1, 1.25]

function splitWord(token: string): [string, string, string] {
  const m = token.match(/^([^A-Za-z']*)([A-Za-z']+)(.*)$/s)
  return m ? [m[1], m[2], m[3]] : ['', token, '']
}

function Syllables({ word }: { word: string }) {
  const parts = lookupWord(word).syllables
  if (parts.length < 2 || parts.join('').length !== word.length) return <>{word}</>
  let at = 0
  return (
    <>
      {parts.map((p, i) => {
        const piece = word.slice(at, at + p.length)
        at += p.length
        return <span key={i} className={i % 2 ? 'syl g' : 'syl b'}>{piece}</span>
      })}
    </>
  )
}

function Sentence({
  text, focus, dim, activeWord, hard, settings, onFocus, onWord,
}: {
  text: string
  focus: boolean
  dim: boolean
  activeWord: number
  hard: Set<string>
  settings: Settings
  onFocus: () => void
  onWord: (w: string) => void
}) {
  const tokens = text.split(' ')
  return (
    <p className={`sentence ${focus ? 'focus' : ''} ${dim ? 'dim' : ''}`} onClick={onFocus}>
      {tokens.map((tok, i) => {
        const [pre, core, post] = splitWord(tok)
        const isHard = hard.has(clean(core))
        const speaking = focus && settings.highlight && activeWord === i
        const inner = settings.syllables && core.length >= 5 ? <Syllables word={core} /> : core
        return (
          <Fragment key={i}>
            {pre}
            {isHard ? (
              <button type="button" className={`hard-word ${speaking ? 'speaking' : ''}`} onClick={(e) => { e.stopPropagation(); onWord(core) }} aria-label={`${core}, tap for help`}>
                {inner}<i className="dot" aria-hidden="true" />
              </button>
            ) : (
              <span className={speaking ? 'word speaking' : 'word'}>{inner}</span>
            )}
            {post}
            {i < tokens.length - 1 ? ' ' : ''}
          </Fragment>
        )
      })}
    </p>
  )
}

export function Reader({ id }: { id: string }) {
  const book = getBook(id)
  if (!book) return <NotFound />
  return <ReaderInner book={book} />
}

function ReaderInner({ book }: { book: Book }) {
  const go = useNavigate()
  const wide = useIsWide()
  const toast = useToast()
  const { state, dispatch } = useStore()
  const { say, stop } = useSpeaker()
  const s = state.settings
  const saved = state.progress[book.id]
  const [page, setPage] = useState(saved && !saved.done ? Math.min(saved.page, book.pages.length) : 1)
  const [focusIdx, setFocusIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [activeWord, setActiveWord] = useState(-1)
  const [panel, setPanel] = useState<'idle' | 'word' | 'aa'>('idle')
  const [helper, setHelper] = useState('')
  const last = useRef(Date.now())
  const hard = useRef(new Set(book.hard)).current
  const sentences = book.pages[page - 1]

  const flush = useCallback((force: boolean) => {
    const mins = Math.min(3, (Date.now() - last.current) / 60000)
    last.current = Date.now()
    if (force || mins >= 1 / 6) dispatch({ type: 'logRead', minutes: mins })
  }, [dispatch])

  useEffect(() => () => flush(false), [flush])

  // changing page stops audio and resets focus
  useEffect(() => {
    stop()
    setPlaying(false)
    setActiveWord(-1)
    setFocusIdx(0)
    dispatch({ type: 'setPage', id: book.id, page })
  }, [page, book.id, dispatch, stop])

  const playFrom = useCallback((i: number) => {
    setPlaying(true)
    setFocusIdx(i)
    say(sentences[i], {
      onWord: setActiveWord,
      onEnd: () => {
        setActiveWord(-1)
        if (i + 1 < sentences.length) playFrom(i + 1)
        else setPlaying(false)
      },
    })
  }, [say, sentences])

  const toggleAudio = () => {
    if (playing) {
      stop()
      setPlaying(false)
      setActiveWord(-1)
    } else playFrom(focusIdx)
  }

  const turn = (dir: 1 | -1) => {
    const next = page + dir
    if (next < 1) return
    flush(true)
    if (next > book.pages.length) {
      go(`/complete/${book.id}`)
      return
    }
    setPage(next)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).matches?.('input,select,textarea')) return
      if (e.key === 'ArrowRight') turn(1)
      if (e.key === 'ArrowLeft') turn(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const openWord = (w: string) => {
    const key = clean(w)
    setHelper(key)
    setPanel('word')
    session.add(key)
    say(key)
  }
  const entry = helper ? lookupWord(helper) : null
  const isSaved = !!(entry && state.words[entry.word])
  const cycleSpeed = () => dispatch({ type: 'settings', patch: { speed: SPEEDS[(SPEEDS.indexOf(s.speed) + 1) % SPEEDS.length] ?? 1 } })

  const panelOpen = panel !== 'idle'
  const closePanel = () => setPanel('idle')

  return (
    <div className="reader" {...pageProps(s)}>
      <header className="reader-bar">
        <IconButton icon="close" label="Close reader" onClick={() => { stop(); go(`/book/${book.id}`) }} />
        <div className="reader-title"><strong>{book.title}</strong><span>Page {page}</span></div>
        <button className={`pill-btn ${panel === 'aa' ? 'on' : ''}`} aria-pressed={panel === 'aa'} aria-label="Reading comfort settings" onClick={() => setPanel(panel === 'aa' ? 'idle' : 'aa')}>Aa</button>
        <IconButton icon="ruler" label="Toggle reading ruler" className={`pill-btn ${s.ruler ? 'on' : ''}`} aria-pressed={s.ruler} onClick={() => dispatch({ type: 'settings', patch: { ruler: !s.ruler } })} />
        <div className="speed-group">
          <button className="pill-btn speed" aria-label={`Reading speed ${s.speed}x. Tap to change`} onClick={cycleSpeed}>{s.speed.toFixed(1)}x</button>
          <IconButton icon={playing ? 'pause' : 'play'} label={playing ? 'Pause read aloud' : 'Read aloud'} className={`pill-btn on`} onClick={toggleAudio} />
        </div>
      </header>

      <div className="reader-layout">
        <section className="reader-main" aria-label={`${book.title}, page ${page}`}>
          <article className="read-page">
            {sentences.map((t, i) => (
              <Sentence key={`${page}-${i}`} text={t} focus={i === focusIdx} dim={s.ruler && i !== focusIdx} activeWord={activeWord} hard={hard} settings={s} onFocus={() => setFocusIdx(i)} onWord={openWord} />
            ))}
          </article>
          <p className="read-hint"><span>?</span> Tap a dotted word to hear it and break it into syllables.</p>
          <footer className="reader-foot">
            <div className="progress amber" role="progressbar" aria-label="Book progress" aria-valuemin={1} aria-valuemax={book.pages.length} aria-valuenow={page}>
              <span style={{ width: `${(page / book.pages.length) * 100}%` }} />
            </div>
            <div className="pager">
              <button className="round-btn" aria-label="Previous page" disabled={page === 1} onClick={() => turn(-1)}><Icon name="prev" size={24} /></button>
              <span>Page {page} of {book.pages.length}</span>
              <button className="round-btn solid" aria-label={page === book.pages.length ? 'Finish book' : 'Next page'} onClick={() => turn(1)}><Icon name="next" size={26} /></button>
            </div>
          </footer>
        </section>

        <SidePanel open={panelOpen} onClose={closePanel} label={panel === 'aa' ? 'Reading comfort' : 'Word helper'}>
          {panel === 'aa' ? (
            <ComfortPanel settings={s} onChange={(patch) => dispatch({ type: 'settings', patch })} onDone={closePanel} />
          ) : panel === 'word' && entry ? (
            <WordPanel
              entry={entry}
              saved={isSaved}
              onSay={(t) => say(t)}
              onSave={() => { dispatch({ type: 'toggleWord', word: entry.word }); toast(isSaved ? 'Removed from your Word Bank' : 'Added to your Word Bank') }}
              onClose={closePanel}
            />
          ) : (
            wide && <PanelIdle />
          )}
        </SidePanel>
      </div>
    </div>
  )
}
