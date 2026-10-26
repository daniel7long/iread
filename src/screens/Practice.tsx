import { useMemo, useState } from 'react'
import { BackButton, Button, Progress } from '@/components/ui'
import { Icon } from '@/components/Icon'
import { SyllableTile } from '@/components/SyllableTile'
import { Owl } from '@/components/ui'
import { clean, lookupWord } from '@/data/words'
import { useSpeaker } from '@/lib/hooks'
import { listenOnce, recognitionSupported } from '@/lib/speech'
import { goBack, useNavigate } from '@/router'
import { useStore } from '@/store'

export function Practice() {
  const go = useNavigate()
  const { state, dispatch } = useStore()
  const { say } = useSpeaker()
  const queue = useMemo(
    () => Object.entries(state.words).sort((a, b) => a[1].mastery - b[1].mastery).slice(0, 12).map(([w]) => w),
    // the queue is fixed for the session so words don't reshuffle while practicing
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const [i, setI] = useState(0)
  const [got, setGot] = useState(0)
  const [heard, setHeard] = useState<string | null>(null)
  const [listening, setListening] = useState(false)

  if (queue.length === 0) {
    return (
      <div className="flow center-msg">
        <h1>No saved words yet</h1>
        <p className="lede">Save words while reading and they will show up here.</p>
        <Button onClick={() => go('/library', { replace: true })}>Back to Library</Button>
      </div>
    )
  }

  const done = i >= queue.length
  const word = queue[Math.min(i, queue.length - 1)]
  const entry = lookupWord(word)

  const answer = (ok: boolean) => {
    dispatch({ type: 'practice', word, got: ok })
    if (ok) setGot(got + 1)
    setHeard(null)
    setI(i + 1)
  }
  const sayIt = async () => {
    setListening(true)
    setHeard(null)
    const result = await listenOnce()
    setListening(false)
    setHeard(result ?? '')
  }
  const matched = heard !== null && heard !== '' && clean(heard).includes(clean(word))

  return (
    <div className="flow practice">
      <header className="flow-head">
        <BackButton onClick={() => goBack('/bank')} />
        <div className="practice-progress"><Progress value={(Math.min(i, queue.length) / queue.length) * 100} label="Practice progress" tone="navy" /><small>{Math.min(i + 1, queue.length)} of {queue.length}</small></div>
        <span />
      </header>
      {done ? (
        <div className="flow-body center">
          <Owl size={150} />
          <h1>Nice work!</h1>
          <p className="lede">You felt sure about {got} of {queue.length} words. The others will come back soon.</p>
          <div className="panel-actions">
            <Button onClick={() => go('/bank', { replace: true })}>Back to Word Bank</Button>
            <Button variant="secondary" onClick={() => go('/library', { replace: true })}>Go to Library</Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flow-body center">
            <span className="eyebrow">SAY THIS WORD</span>
            <h1 className="big-word">{entry.word}</h1>
            <div className="syl-tiles center">
              {entry.syllables.map((s, k) => <SyllableTile key={k} text={s} tone={k % 2 ? 'g' : 'b'} onSay={(t) => say(t)} />)}
            </div>
            <div className="practice-tools">
              <Button variant="tint" icon="sound" onClick={() => say(entry.word)}>Listen</Button>
              {recognitionSupported() ? (
                <Button variant="tint" icon="mic" onClick={sayIt} disabled={listening}>{listening ? 'Listening…' : 'Say it'}</Button>
              ) : (
                <Button variant="tint" icon="mic" disabled title="Voice check isn’t supported in this browser">Say it</Button>
              )}
            </div>
            <p className={`quiz-feedback ${heard === null ? '' : matched ? 'good' : 'soft'}`} role="status">
              {heard === null ? (recognitionSupported() ? '' : 'Voice check needs Chrome or Safari. You can still say it out loud.') : heard === '' ? 'I didn’t catch that. Try again.' : matched ? `Great, I heard “${heard}”.` : `I heard “${heard}”. Listen and try once more.`}
            </p>
          </div>
          <footer className="flow-foot dual">
            <Button variant="secondary" onClick={() => answer(false)}>Need more practice</Button>
            <Button onClick={() => answer(true)}><Icon name="check" size={20} /> Got it</Button>
          </footer>
        </>
      )}
    </div>
  )
}
