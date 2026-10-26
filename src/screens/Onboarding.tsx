import { useEffect, useState } from 'react'
import { BackButton, Dots, Logo, Owl, PrimaryButton } from '@/components/ui'
import { Icon } from '@/components/Icon'
import { goBack, useNavigate } from '@/router'
import { useStore } from '@/store'
import type { Role } from '@/types'

export function Splash() {
  const go = useNavigate()
  useEffect(() => {
    const t = window.setTimeout(() => go('/welcome', { replace: true }), 1600)
    return () => window.clearTimeout(t)
  }, [go])
  return (
    <button className="splash" onClick={() => go('/welcome', { replace: true })} aria-label="Continue to welcome">
      <Logo />
    </button>
  )
}

export function Welcome() {
  const go = useNavigate()
  const { dispatch } = useStore()
  return (
    <div className="flow welcome">
      <header><Logo compact /></header>
      <div className="welcome-copy">
        <span className="eyebrow">WELCOME TO IREAD</span>
        <h1>Reading that feels natural and rewarding</h1>
        <p>Build confidence and enjoy stories at your own pace.</p>
      </div>
      <div className="welcome-art"><Owl size={260} /></div>
      <div className="welcome-actions">
        <PrimaryButton onClick={() => go('/account')}>Get Started</PrimaryButton>
        <button
          className="link-btn"
          onClick={() => {
            dispatch({ type: 'finishOnboarding' })
            go('/library', { replace: true })
          }}
        >
          I already have an account
        </button>
      </div>
    </div>
  )
}

const ROLES: { id: Role; title: string; sub: string; icon: string }[] = [
  { id: 'child', title: 'Child', sub: 'Ages 8–12', icon: '🐱' },
  { id: 'teen', title: 'Teen', sub: 'Ages 13–17', icon: '🦉' },
  { id: 'parent', title: 'Parent or educator', sub: 'Setting up for someone', icon: '🐻' },
]
const AVATARS = ['🦊', '🦉', '🐻', '🐱', '🐼', '🐰']
const GRADES = ['2nd grade', '3rd grade', '4th grade', '5th grade', '6th grade', '7th grade', '8th grade', '9th grade', '10th grade+']

export function Account() {
  const go = useNavigate()
  const { state, dispatch } = useStore()
  const p = state.profile
  const [step, setStep] = useState(1)
  const emailOk = /.+@.+\..+/.test(p.parentEmail)
  const valid = step === 1 ? true : step === 2 ? p.name.trim().length > 0 : emailOk && p.consent

  const next = () => {
    if (step < 3) setStep(step + 1)
    else go('/comfort-check')
  }
  const back = () => (step > 1 ? setStep(step - 1) : goBack('/welcome'))

  const copy = [
    ['LET’S GET STARTED', 'Who is reading?', 'This helps us shape the reading experience.'],
    ['READER PROFILE', 'Make it feel like yours', 'A few details to personalize your reading space.'],
    ['ONE LAST STEP', 'Keep the account safe', 'We use a parent or educator email for account help only.'],
  ][step - 1]

  return (
    <div className="flow">
      <header className="flow-head">
        <BackButton onClick={back} />
        <Dots step={step} />
        <span className="step-count">{step} / 3</span>
      </header>
      <div className="flow-body">
        <span className="eyebrow">{copy[0]}</span>
        <h1>{copy[1]}</h1>
        <p className="lede">{copy[2]}</p>

        {step === 1 && (
          <div className="choice-list" role="radiogroup" aria-label="Who is reading">
            {ROLES.map((r) => (
              <button key={r.id} role="radio" aria-checked={p.role === r.id} className={`role-card ${p.role === r.id ? 'selected' : ''}`} onClick={() => dispatch({ type: 'profile', patch: { role: r.id } })}>
                <span className="role-icon" aria-hidden="true">{r.icon}</span>
                <span><strong>{r.title}</strong><small>{r.sub}</small></span>
                <span className="radio" />
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="fields">
            <label className="field">
              <span>First name</span>
              <input value={p.name} maxLength={20} autoComplete="given-name" onChange={(e) => dispatch({ type: 'profile', patch: { name: e.target.value } })} />
            </label>
            <label className="field">
              <span>Grade</span>
              <select value={p.grade} onChange={(e) => dispatch({ type: 'profile', patch: { grade: e.target.value } })}>
                {GRADES.map((g) => <option key={g}>{g}</option>)}
              </select>
            </label>
            <fieldset className="avatar-field">
              <legend>Choose an avatar</legend>
              <div className="avatar-grid">
                {AVATARS.map((a) => (
                  <button key={a} className={`avatar-opt ${p.avatar === a ? 'selected' : ''}`} aria-pressed={p.avatar === a} aria-label={`Avatar ${a}`} onClick={() => dispatch({ type: 'profile', patch: { avatar: a } })}>{a}</button>
                ))}
              </div>
            </fieldset>
          </div>
        )}

        {step === 3 && (
          <div className="fields">
            <label className="field">
              <span>Parent or educator email</span>
              <input type="email" inputMode="email" autoComplete="email" placeholder="name@example.com" value={p.parentEmail} onChange={(e) => dispatch({ type: 'profile', patch: { parentEmail: e.target.value } })} />
            </label>
            <div className="privacy-note">
              <span className="privacy-icon"><Icon name="shield" size={18} /></span>
              <div>
                <strong>Your details stay private</strong>
                <p>This demo keeps everything on your device. Nothing is sent to a server or sold.</p>
              </div>
            </div>
            <label className="consent">
              <input type="checkbox" checked={p.consent} onChange={(e) => dispatch({ type: 'profile', patch: { consent: e.target.checked } })} />
              <span>A parent or educator agrees to create this reader profile.</span>
            </label>
          </div>
        )}
      </div>
      <footer className="flow-foot">
        <PrimaryButton disabled={!valid} onClick={next}>{step === 3 ? 'Create profile' : 'Continue'}</PrimaryButton>
      </footer>
    </div>
  )
}

