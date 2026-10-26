import { Shell } from '@/components/Shell'
import { Icon } from '@/components/Icon'
import { Chip, IconButton, Segmented } from '@/components/ui'
import { ContinueCard, DecodableCard, GoalRing } from '@/components/BookBits'
import { BOOKS, FOCUS_OPTIONS, LEVELS, PHONICS_TAGS, TOPICS } from '@/data/books'
import { filterBooks } from '@/lib/search'
import { currentStreak, dayKey } from '@/lib/dates'
import { navigate, useNavigate, useRoute } from '@/router'
import { useStore } from '@/store'
import type { LevelId, TopicId } from '@/types'

type Tab = 'shelf' | 'explore'

function useLibraryQuery() {
  const route = useRoute()
  const tab: Tab = route.query.get('tab') === 'explore' ? 'explore' : 'shelf'
  const topic = (route.query.get('topic') ?? 'all') as TopicId | 'all'
  const focus = route.query.get('focus') ?? 'all'
  const level = (route.query.get('level') ?? '') as LevelId | ''
  const tag = route.query.get('tag') ?? ''
  const set = (patch: Record<string, string | null>) => {
    const q = new URLSearchParams(route.query)
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === '' || v === 'all') q.delete(k)
      else q.set(k, v)
    }
    const s = q.toString()
    navigate(`/library${s ? `?${s}` : ''}`, { replace: true })
  }
  return { tab, topic, focus, level, tag, set }
}

export function Library() {
  const go = useNavigate()
  const { state } = useStore()
  const { tab, topic, focus, level, tag, set } = useLibraryQuery()
  const p = state.profile
  const streak = currentStreak(state.readDays)
  const today = state.minutes[dayKey()] ?? 0

  const unfinished = BOOKS.filter((b) => state.progress[b.id] && !state.progress[b.id].done)
  const continueBook = unfinished[0] ?? BOOKS.find((b) => !state.progress[b.id]?.done) ?? BOOKS[0]
  const recommended = filterBooks({ topic, focus, maxLevel: level || undefined, tags: tag ? [tag] : undefined }, state.progress)
    .filter((b) => b.id !== continueBook.id || topic !== 'all' || focus !== 'all')
    .sort((a, b) => Number(!!state.progress[a.id]?.done) - Number(!!state.progress[b.id]?.done))
  const needPractice = Object.values(state.words).filter((w) => w.mastery < 3).length

  return (
    <Shell active="library">
      <div className="page library">
        <header className="lib-head">
          <button className="profile-avatar" onClick={() => go('/settings')} aria-label="Open settings and profile">
            {p.name.slice(0, 2).toUpperCase()}
            <span className="lvl" aria-hidden="true">7</span>
          </button>
          <div className="lib-who">
            <span className="eyebrow">WELCOME BACK</span>
            <h1>{p.name}</h1>
            <p className="streak"><Icon name="flame" size={16} /> Reading Streak: <b>{streak} {streak === 1 ? 'day' : 'days'}</b></p>
          </div>
          <div className="lib-actions">
            <IconButton icon="search" label="Search books" className="square" onClick={() => go('/search')} />
            <IconButton icon="filter" label="Filter books" className="square" onClick={() => go('/search?filters=1')} />
          </div>
        </header>

        <Segmented<Tab>
          label="Library view"
          value={tab}
          onChange={(t) => set({ tab: t === 'explore' ? 'explore' : null })}
          options={[{ id: 'shelf', label: 'My Bookshelf' }, { id: 'explore', label: 'Explore Topics' }]}
        />

        {tab === 'shelf' ? (
          <div className="lib-grid">
            <div className="lib-main">
              <div className="chip-row" role="group" aria-label="Topics">
                <Chip active={topic === 'all'} onClick={() => set({ topic: 'all' })}>All</Chip>
                {TOPICS.map((t) => <Chip key={t.id} active={topic === t.id} onClick={() => set({ topic: t.id })}>{t.name}</Chip>)}
              </div>
              <label className="focus-row">
                <span>
                  <small>FOCUS</small>
                  <select value={focus} onChange={(e) => set({ focus: e.target.value })} aria-label="Phonics focus">
                    {FOCUS_OPTIONS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
                  </select>
                </span>
                <Icon name="chevdown" />
              </label>

              {topic === 'all' && focus === 'all' && (
                <>
                  <h2 className="section-label">CONTINUE READING</h2>
                  <ContinueCard book={continueBook} progress={state.progress[continueBook.id]} />
                </>
              )}
              <div className="section-head">
                <h2 className="section-label">{topic === 'all' && focus === 'all' ? 'RECOMMENDED DECODABLES' : 'BOOKS FOR YOU'}</h2>
                <button className="link-btn" onClick={() => set({ tab: 'explore' })}>See all</button>
              </div>
              {recommended.length ? (
                <div className="decodable-grid">
                  {recommended.map((b) => <DecodableCard key={b.id} book={b} done={state.progress[b.id]?.done} />)}
                </div>
              ) : (
                <p className="empty">No books match these filters yet. Try “All”.</p>
              )}
            </div>

            <aside className="lib-side">
              <section className="card goal-card">
                <div>
                  <span className="eyebrow">TODAY’S GOAL</span>
                  <strong>Read for 10 minutes</strong>
                  <p className="muted">{today >= 10 ? 'Goal reached. Great work!' : 'A little every day builds strong readers.'}</p>
                </div>
                <GoalRing minutes={today} />
              </section>
              <section className="card warmup-card">
                <span className="eyebrow">QUICK WARMUP</span>
                <strong>{needPractice} Saved Words Ready for Practice</strong>
                <button className="btn btn-primary" onClick={() => go('/practice')} disabled={needPractice === 0}>Practice Now →</button>
              </section>
            </aside>
          </div>
        ) : (
          <Explore />
        )}
      </div>
    </Shell>
  )
}

function Explore() {
  const { focus, level, tag, set } = useLibraryQuery()
  const { state } = useStore()
  return (
    <div className="explore">
      <aside className="explore-filters card">
        <h2 className="section-label">FILTER BY PHONICS FOCUS</h2>
        <div className="chip-row wrap">
          <Chip active={!tag} onClick={() => set({ tag: null })}>Any</Chip>
          {PHONICS_TAGS.map((t) => <Chip key={t} active={tag === t} onClick={() => set({ tag: t })}>{t}</Chip>)}
        </div>
        <h2 className="section-label">LEVEL (UP TO)</h2>
        <div className="chip-row wrap">
          <Chip active={!level} onClick={() => set({ level: null })}>Any</Chip>
          {LEVELS.map((l) => <Chip key={l} active={level === l} onClick={() => set({ level: l })}>{l}</Chip>)}
        </div>
      </aside>
      <div className="explore-main">
        <span className="eyebrow">FIND YOUR NEXT STORY</span>
        <h2 className="explore-title">Explore by topic</h2>
        <p className="muted">Pick something you’re curious about.</p>
        <div className="topic-grid">
          {TOPICS.map((t) => {
            const n = filterBooks({ topic: t.id, focus, maxLevel: level || undefined, tags: tag ? [tag] : undefined }, state.progress).length
            return (
              <button key={t.id} className={`topic-card tone-${t.tone}`} onClick={() => set({ tab: null, topic: t.id })} disabled={n === 0} aria-label={`${t.name}, ${n} ${n === 1 ? 'book' : 'books'}`}>
                <span className="topic-art"><Icon name={t.id} size={56} /></span>
                <span className="topic-foot">
                  <span><strong>{t.name}</strong><small>{n} {n === 1 ? 'book' : 'books'}</small></span>
                  <Icon name="arrow" size={20} />
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
