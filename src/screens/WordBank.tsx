import { useMemo, useState } from 'react'
import { Shell } from '@/components/Shell'
import { Icon } from '@/components/Icon'
import { AudioButton, Button, Chip, MasteryDots, PrimaryButton, Sheet, SyllableChips, useToast } from '@/components/ui'
import { SyllableTile } from '@/components/SyllableTile'
import { lookupWord } from '@/data/words'
import { useIsWide, useSpeaker } from '@/lib/hooks'
import { useNavigate } from '@/router'
import { useStore } from '@/store'
import type { WordEntry } from '@/types'

type Filter = 'all' | 'needs' | 'mastered'

function WordDetail({ entry, mastery, onRemove }: { entry: WordEntry; mastery: number; onRemove: () => void }) {
  const { say } = useSpeaker()
  return (
    <div className="word-detail">
      <div className="word-title">
        <h2>{entry.word}</h2>
        <AudioButton label={`Hear ${entry.word}`} size={52} onClick={() => say(entry.word)} />
      </div>
      <div className="syl-tiles">
        {entry.syllables.map((s, i) => <SyllableTile key={i} text={s} tone={i % 2 ? 'g' : 'b'} onSay={(t) => say(t)} />)}
      </div>
      <div className="meaning"><span className="eyebrow">MEANING</span><p>{entry.definition}</p></div>
      {entry.example && <div className="example-card"><div className="example-art" aria-hidden="true">📖</div><div><span className="eyebrow">IN A SENTENCE</span><p>{entry.example}</p></div></div>}
      <div className="mastery-line"><span className="eyebrow">MASTERY</span><MasteryDots level={mastery} /></div>
      <div className="panel-actions">
        <Button icon="sound" onClick={() => say(entry.example || entry.word)}>Listen</Button>
        <Button variant="secondary" onClick={onRemove}>Remove from Word Bank</Button>
      </div>
    </div>
  )
}

export function WordBank() {
  const go = useNavigate()
  const wide = useIsWide()
  const toast = useToast()
  const { state, dispatch } = useStore()
  const { say } = useSpeaker()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<string | null>(null)

  const all = useMemo(
    () => Object.entries(state.words).sort((a, b) => b[1].savedAt - a[1].savedAt),
    [state.words],
  )
  const rows = all.filter(([w, st]) => {
    if (q && !w.includes(q.trim().toLowerCase())) return false
    if (filter === 'needs') return st.mastery < 3
    if (filter === 'mastered') return st.mastery >= 3
    return true
  })
  const needs = all.filter(([, st]) => st.mastery < 3).length
  const current = selected && state.words[selected] ? selected : wide ? rows[0]?.[0] ?? null : null
  const remove = (w: string) => {
    dispatch({ type: 'toggleWord', word: w })
    setSelected(null)
    toast('Removed from your Word Bank')
  }

  return (
    <Shell active="bank">
      <div className="page bank">
        <header className="page-head">
          <span className="eyebrow">YOUR SAVED WORDS</span>
          <h1>Word Bank</h1>
          <p className="muted">Practice a little, grow a lot.</p>
        </header>
        <div className="bank-grid">
          <section className="bank-list">
            <label className="search-field">
              <Icon name="search" />
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your words" aria-label="Search your words" />
            </label>
            <div className="chip-row">
              <Chip active={filter === 'all'} onClick={() => setFilter('all')}>All</Chip>
              <Chip active={filter === 'needs'} onClick={() => setFilter('needs')}>Needs Practice</Chip>
              <Chip active={filter === 'mastered'} onClick={() => setFilter('mastered')}>Mastered</Chip>
            </div>
            {rows.length === 0 && <p className="empty">{all.length === 0 ? 'Tap a dotted word while reading, then “Save to Word Bank”.' : 'No words match.'}</p>}
            <ul className="word-rows">
              {rows.map(([w, st]) => {
                const e = lookupWord(w)
                return (
                  <li key={w} className={`word-row card ${current === w ? 'selected' : ''}`}>
                    <button className="word-row-main" onClick={() => setSelected(w)} aria-label={`${w}, mastery ${st.mastery} of 3. Show details`}>
                      <b className="rw">{w}</b>
                      <SyllableChips parts={e.syllables} small />
                    </button>
                    <span className="mastery-col"><small>MASTERY</small><MasteryDots level={st.mastery} /></span>
                    <AudioButton label={`Hear ${w}`} size={44} onClick={() => say(w)} />
                  </li>
                )
              })}
            </ul>
            <div className="sticky-cta">
              <PrimaryButton onClick={() => go('/practice')} disabled={all.length === 0}>Practice {Math.min(12, needs || all.length)} words</PrimaryButton>
            </div>
          </section>
          {wide && current && (
            <aside className="bank-detail card"><WordDetail entry={lookupWord(current)} mastery={state.words[current]?.mastery ?? 0} onRemove={() => remove(current)} /></aside>
          )}
        </div>
      </div>
      {!wide && (
        <Sheet open={!!current} onClose={() => setSelected(null)} title="Word details">
          {current && <WordDetail entry={lookupWord(current)} mastery={state.words[current]?.mastery ?? 0} onRemove={() => remove(current)} />}
        </Sheet>
      )}
    </Shell>
  )
}
