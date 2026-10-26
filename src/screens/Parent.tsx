import { useState } from 'react'
import { BackButton, Button, Progress } from '@/components/ui'
import { Icon } from '@/components/Icon'
import { BOOKS } from '@/data/books'
import { lookupWord } from '@/data/words'
import { addDays, currentStreak, dayKey } from '@/lib/dates'
import { goBack } from '@/router'
import { useStore } from '@/store'
import type { Pattern, State } from '@/types'

const PATTERN_NAME: Record<Pattern, string> = { syllables: 'Syllable splitting', silentE: 'Silent ‘e’ patterns', affix: 'Prefixes & suffixes' }

export function Parent() {
  const { state } = useStore()
  const [pin, setPin] = useState('')
  const [ok, setOk] = useState(false)
  const [bad, setBad] = useState(false)

  const unlock = () => {
    if (pin === state.parentPin) {
      setOk(true)
      setBad(false)
    } else setBad(true)
  }

  return (
    <div className="flow parent-page">
      <header className="flow-head">
        <BackButton onClick={() => goBack('/settings')} />
        <strong className="head-title">Parent / Educator</strong>
        <span />
      </header>
      {!ok ? (
        <div className="flow-body center">
          <span className="list-icon big"><Icon name="lock" size={32} /></span>
          <h1>Enter your PIN</h1>
          <p className="lede">This area is for adults. Demo PIN: <b>1234</b></p>
          <form className="pin-form" onSubmit={(e) => { e.preventDefault(); unlock() }}>
            <input className="pin" type="password" inputMode="numeric" autoComplete="off" maxLength={4} value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, '')); setBad(false) }} aria-label="4-digit PIN" aria-invalid={bad} />
            <p className={`quiz-feedback ${bad ? 'soft' : ''}`} role="status">{bad ? 'That PIN doesn’t match. Try again.' : ''}</p>
            <Button type="submit" disabled={pin.length !== 4}>Unlock</Button>
          </form>
        </div>
      ) : (
        <Dashboard state={state} />
      )}
    </div>
  )
}

function Dashboard({ state }: { state: State }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(new Date(), i - 6)
    return { key: dayKey(d), label: d.toLocaleDateString(undefined, { weekday: 'short' }), min: Math.round(state.minutes[dayKey(d)] ?? 0) }
  })
  const total = days.reduce((a, d) => a + d.min, 0)
  const max = Math.max(20, ...days.map((d) => d.min))
  const finished = BOOKS.filter((b) => state.progress[b.id]?.done).length
  const mastered = Object.values(state.words).filter((w) => w.mastery >= 3).length

  const byPattern = (Object.keys(PATTERN_NAME) as Pattern[]).map((p) => {
    const ws = Object.entries(state.words).filter(([w]) => lookupWord(w).pattern === p)
    const need = ws.filter(([, s]) => s.mastery < 3).length
    return { p, need, total: ws.length }
  }).filter((x) => x.total > 0).sort((a, b) => b.need - a.need)

  const exportCsv = () => {
    const rows = [['word', 'mastery_0_to_3', 'pattern'], ...Object.entries(state.words).map(([w, s]) => [w, String(s.mastery), lookupWord(w).pattern]),
      [], ['date', 'minutes'], ...days.map((d) => [d.key, String(d.min)])]
    const csv = rows.map((r) => r.join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'iread-progress-report.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div className="flow-body dash">
      <h1>{state.profile.name}’s progress</h1>
      <div className="metrics">
        <div className="card metric"><b>{total}</b><span>Minutes this week</span></div>
        <div className="card metric"><b>{finished}</b><span>Books finished</span></div>
        <div className="card metric"><b>{mastered}</b><span>Words mastered</span></div>
        <div className="card metric"><b>{currentStreak(state.readDays)}</b><span>Day streak</span></div>
      </div>
      <div className="dash-grid">
        <section className="card pad">
          <h2 className="section-label">MINUTES READ, LAST 7 DAYS</h2>
          <div className="bars" role="img" aria-label={`Minutes read per day: ${days.map((d) => `${d.label} ${d.min}`).join(', ')}`}>
            {days.map((d) => (
              <div key={d.key} className="bar-col"><span className="bar-val">{d.min}</span><span className="bar" style={{ height: `${(d.min / max) * 100}%` }} /><small>{d.label}</small></div>
            ))}
          </div>
        </section>
        <section className="card pad">
          <h2 className="section-label">PATTERNS TO PRACTICE</h2>
          {byPattern.map((x) => (
            <div className="track" key={x.p}>
              <div><b>{PATTERN_NAME[x.p]}</b><span>{x.need} of {x.total} words need practice</span></div>
              <Progress value={x.total ? ((x.total - x.need) / x.total) * 100 : 0} tone={x.need > 2 ? 'amber' : 'green'} label={PATTERN_NAME[x.p]} />
            </div>
          ))}
        </section>
      </div>
      <Button icon="download" onClick={exportCsv}>Export progress report</Button>
    </div>
  )
}
