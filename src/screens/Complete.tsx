import { useMemo, useState } from 'react'
import { AudioButton, Mascot, PrimaryButton, SyllableChips, useToast } from '@/components/ui'
import { Icon } from '@/components/Icon'
import { NotFound } from './BookDetail'
import { TROPHIES, getBook } from '@/data/books'
import { lookupWord } from '@/data/words'
import { currentStreak } from '@/lib/dates'
import { useSpeaker } from '@/lib/hooks'
import { useNavigate } from '@/router'
import { session, useStore } from '@/store'

export function Complete({ id }: { id: string }) {
  const go = useNavigate()
  const toast = useToast()
  const { state, dispatch } = useStore()
  const { say } = useSpeaker()
  const book = getBook(id)
  const [choice, setChoice] = useState<string | null>(null)
  const words = useMemo(() => {
    const seen = session.list().filter((w) => book?.hard.includes(w))
    const list = (seen.length >= 3 ? seen : [...seen, ...(book?.practice ?? []).filter((w) => !seen.includes(w))]).slice(0, 3)
    return list.map(lookupWord)
  }, [book])
  if (!book) return <NotFound />

  const correct = choice === book.quiz.answer
  const streak = Math.max(1, currentStreak(state.readDays))
  const trophy = TROPHIES.find((t) => t.id === book.trophy)

  const finish = () => {
    dispatch({ type: 'completeBook', id: book.id })
    session.clear()
    toast(trophy ? `${trophy.name} badge collected` : 'Story badge collected')
    go('/library', { replace: true })
  }

  return (
    <div className="flow complete-page">
      <div className="flow-body complete">
        <section className="complete-left">
          <Mascot />
          <span className="eyebrow">STORY COMPLETE</span>
          <h1>Book Completed!</h1>
          <p className="lede">Fantastic stamina! You read {book.pages.length} full pages today.</p>
          <div className="stats card">
            <span><b>{book.pages.length}</b>Pages</span>
            <span><b>{words.length}</b>New Words</span>
            <span><b>{streak}</b>Day Streak</span>
          </div>
          <h2 className="section-label">WORDS YOU UNLOCKED TODAY</h2>
          <div className="unlocked">
            {words.map((w) => (
              <div className="card unlocked-card" key={w.word}>
                <b>{w.word}</b>
                <SyllableChips parts={w.syllables} small />
                <button className="btn btn-tint btn-sm" onClick={() => say(w.word)}><Icon name="speaker" size={16} /> Replay</button>
              </div>
            ))}
          </div>
        </section>

        <section className="complete-right">
          <h2 className="section-label">VISUAL COMPREHENSION CHECK</h2>
          <div className="card quiz">
            <div className="quiz-q">
              <h3>{book.quiz.question}</h3>
              <AudioButton label="Hear the question" onClick={() => say(book.quiz.question)} />
            </div>
            <div className="answers" role="radiogroup" aria-label={book.quiz.question}>
              {book.quiz.options.map((o) => {
                const picked = choice === o.id
                const state = picked ? (o.id === book.quiz.answer ? 'correct' : 'retry') : ''
                return (
                  <button key={o.id} role="radio" aria-checked={picked} className={`answer ${state}`} onClick={() => { setChoice(o.id); say(o.label) }}>
                    <span className="answer-art" aria-hidden="true">{o.icon}</span>
                    <span>{o.label}</span>
                    {state === 'correct' && <span className="answer-mark"><Icon name="check" size={16} /></span>}
                  </button>
                )
              })}
            </div>
            <p className={`quiz-feedback ${choice ? (correct ? 'good' : 'soft') : ''}`} role="status">
              {!choice ? 'Tap the picture that answers the question.' : correct ? 'Yes! You remembered the story.' : 'Good try. Listen to the question again and pick another picture.'}
            </p>
          </div>
        </section>
      </div>
      <footer className="flow-foot">
        <PrimaryButton onClick={finish}>Collect Story Badge &amp; Finish</PrimaryButton>
      </footer>
    </div>
  )
}
