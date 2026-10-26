import { useState } from 'react'
import { Shell } from '@/components/Shell'
import { Icon } from '@/components/Icon'
import { Button, Progress, Sheet } from '@/components/ui'
import { TROPHIES } from '@/data/books'
import { bestStreak, currentStreak, weekOf } from '@/lib/dates'
import { useNavigate } from '@/router'
import { useStore } from '@/store'
import type { Pattern } from '@/types'

const ROWS: { id: Pattern; label: string; unit: string; goal: number; tone: 'green' | 'amber' | 'blue' }[] = [
  { id: 'syllables', label: 'Syllable Splits Mastered', unit: 'words', goal: 30, tone: 'green' },
  { id: 'silentE', label: 'Silent ‘e’ Patterns', unit: 'words', goal: 35, tone: 'amber' },
  { id: 'affix', label: 'Prefix & Suffix Rules', unit: 'rules', goal: 25, tone: 'blue' },
]

export function Journey() {
  const go = useNavigate()
  const { state } = useStore()
  const [open, setOpen] = useState<string | null>(null)
  const streak = currentStreak(state.readDays)
  const best = bestStreak(state.readDays)
  const week = weekOf()
  const set = new Set(state.readDays)
  const earned = state.badgeBase + state.badges.length
  const needPractice = Object.values(state.words).filter((w) => w.mastery < 3).length
  const trophy = TROPHIES.find((t) => t.id === open)

  return (
    <Shell active="journey">
      <div className="page journey">
        <header className="page-head row">
          <div>
            <span className="eyebrow">YOUR PROGRESS</span>
            <h1>My Reading Journey</h1>
          </div>
          <span className="pill-label">This Month</span>
        </header>

        <div className="journey-grid">
          <section className="card streak-card">
            <div className="card-head"><span className="eyebrow">WEEKLY STREAK</span><span className="tag amber">Best: {best} days</span></div>
            <strong className="streak-line"><Icon name="flame" size={22} /> {streak} {streak === 1 ? 'day' : 'days'} strong</strong>
            <div className="week" role="list">
              {week.map((d, i) => {
                const read = set.has(d.key)
                return (
                  <div key={i} role="listitem" aria-label={`${d.key}${read ? ', read' : d.future ? '' : ', not read'}`} className={`day ${read ? 'read' : ''} ${d.isToday ? 'today' : ''}`}>
                    <small>{d.label}</small>
                    <span>{read ? <Icon name="check" size={16} /> : d.date}</span>
                  </div>
                )
              })}
            </div>
            <p className="muted small">{set.has(week.find((d) => d.isToday)?.key ?? '') ? 'You read today. Your streak is safe!' : 'Read one page today to keep your streak growing.'}</p>
          </section>

          <section className="card phonics-card">
            <span className="eyebrow">PHONICS &amp; WORD STRATEGIES</span>
            {ROWS.map((r) => (
              <div className="track" key={r.id}>
                <div><b>{r.label}</b><span>{state.phonics[r.id]} {r.unit}</span></div>
                <Progress value={(state.phonics[r.id] / r.goal) * 100} tone={r.tone} label={r.label} />
              </div>
            ))}
          </section>

          <section className="card trophies-card">
            <div className="card-head"><span className="eyebrow">STORY TROPHIES</span><b className="muted small">{earned} earned</b></div>
            <div className="trophy-grid">
              {TROPHIES.map((t) => {
                const has = state.badges.includes(t.id)
                return (
                  <button key={t.id} className={`trophy tone-${t.tone} ${has ? '' : 'locked'}`} onClick={() => setOpen(t.id)} aria-label={`${t.name}${has ? '' : ', locked'}`}>
                    <span className="trophy-medal"><span aria-hidden="true">{t.icon}</span></span>
                    <small>{t.name}</small>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="card warmup-card tinted">
            <span className="eyebrow">QUICK WARMUP</span>
            <strong>{needPractice} Saved Words Ready for Practice</strong>
            <Button onClick={() => go('/practice')} disabled={needPractice === 0}>Practice Now →</Button>
          </section>
        </div>
      </div>

      <Sheet open={!!trophy} onClose={() => setOpen(null)} title={trophy?.name ?? 'Trophy'}>
        {trophy && (
          <div className="trophy-detail">
            <span className={`trophy-medal big tone-${trophy.tone} ${state.badges.includes(trophy.id) ? '' : 'locked'}`}><span aria-hidden="true">{trophy.icon}</span></span>
            <p className="lede">{state.badges.includes(trophy.id) ? 'Earned! ' : 'Not earned yet. '}{trophy.how}</p>
            {!state.badges.includes(trophy.id) && <Button onClick={() => go('/library')}>Find the story</Button>}
          </div>
        )}
      </Sheet>
    </Shell>
  )
}
