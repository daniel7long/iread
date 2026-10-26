import { useEffect, useState, type ReactNode } from 'react'
import { Shell } from '@/components/Shell'
import { Icon, type IconName } from '@/components/Icon'
import { BackButton, Button, Segmented, Toggle, useToast } from '@/components/ui'
import { NotFound } from './BookDetail'
import { listVoices, ttsSupported } from '@/lib/speech'
import { useSpeaker } from '@/lib/hooks'
import { installPrompt } from '@/pwa'
import { goBack, useNavigate } from '@/router'
import { useStore } from '@/store'

const ROWS: { id: string; icon: IconName; title: string; sub: (s: ReturnType<typeof useStore>['state']) => string; path: string }[] = [
  { id: 'comfort', icon: 'sliders', title: 'Reading Comfort', sub: () => 'Font, spacing, tint, and reading ruler', path: '/comfort?from=settings' },
  { id: 'audio', icon: 'sound', title: 'Audio & Voice', sub: (s) => `Speed: ${s.settings.speed.toFixed(1)}×`, path: '/settings/audio' },
  { id: 'reminders', icon: 'bell', title: 'Reminders', sub: (s) => (s.reminders.on ? `Weekdays at ${fmtTime(s.reminders.time)}` : 'Off'), path: '/settings/reminders' },
  { id: 'profile', icon: 'user', title: 'Profile', sub: (s) => `${s.profile.name} · ${s.profile.grade}`, path: '/settings/profile' },
  { id: 'privacy', icon: 'lock', title: 'Privacy', sub: () => 'Your data and controls', path: '/settings/privacy' },
  { id: 'help', icon: 'help', title: 'Help', sub: () => 'Tips, accessibility, and install', path: '/settings/help' },
]

const fmtTime = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

export function Settings() {
  const go = useNavigate()
  const { state } = useStore()
  const p = state.profile
  return (
    <Shell active="settings">
      <div className="page settings">
        <header className="flow-head left"><BackButton onClick={() => goBack('/library')} /><strong className="head-title">Settings</strong><span /></header>
        <section className="card profile-card">
          <span className="profile-avatar static">{p.name.slice(0, 2).toUpperCase()}</span>
          <div><span className="eyebrow">READER PROFILE</span><strong>{p.name}</strong><small className="muted">Reading Level D</small></div>
        </section>
        <div className="card list">
          {ROWS.map((r) => (
            <button key={r.id} className="list-row" onClick={() => go(r.path)}>
              <span className="list-icon"><Icon name={r.icon} /></span>
              <span><strong>{r.title}</strong><small>{r.sub(state)}</small></span>
              <Icon name="chevron" size={20} />
            </button>
          ))}
        </div>
        <button className="card adults" onClick={() => go('/parent')}>
          <span className="list-icon"><Icon name="shield" /></span>
          <span><span className="eyebrow">FOR ADULTS</span><strong>Parent / Educator Dashboard</strong><small>Review progress and learning patterns</small></span>
          <Icon name="lock" size={20} />
        </button>
        <p className="foot-note">iRead 1.0 · Built for comfortable reading</p>
      </div>
    </Shell>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Shell active="settings">
      <div className="page settings">
        <header className="flow-head left"><BackButton onClick={() => goBack('/settings')} /><strong className="head-title">{title}</strong><span /></header>
        <div className="section-body">{children}</div>
      </div>
    </Shell>
  )
}

function download(name: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function SettingsSection({ section }: { section: string }) {
  const go = useNavigate()
  const toast = useToast()
  const { state, dispatch } = useStore()
  const { say } = useSpeaker()
  const [voices, setVoices] = useState(listVoices())
  const [confirm, setConfirm] = useState(false)
  const [canInstall, setCanInstall] = useState(installPrompt.available())

  useEffect(() => {
    if (!ttsSupported()) return
    const update = () => setVoices(listVoices())
    window.speechSynthesis.addEventListener('voiceschanged', update)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', update)
  }, [])
  useEffect(() => installPrompt.subscribe(() => setCanInstall(installPrompt.available())), [])

  const s = state.settings
  const p = state.profile

  if (section === 'audio') {
    return (
      <Section title="Audio & Voice">
        <div className="card pad">
          <span className="section-label">READ-ALOUD SPEED</span>
          <Segmented label="Read-aloud speed" value={String(s.speed)} onChange={(v) => dispatch({ type: 'settings', patch: { speed: Number(v) } })} options={[{ id: '0.8', label: 'Slow' }, { id: '1', label: 'Normal' }, { id: '1.25', label: 'Fast' }]} />
          <span className="section-label">VOICE</span>
          {ttsSupported() ? (
            <select value={s.voice ?? ''} onChange={(e) => dispatch({ type: 'settings', patch: { voice: e.target.value || null } })} aria-label="Voice">
              <option value="">Device default</option>
              {voices.map((v) => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
            </select>
          ) : <p className="muted">This browser doesn’t offer read-aloud voices. The word highlight will still move along.</p>}
          <Button icon="sound" variant="tint" onClick={() => say('Silent night, bright moonlight. The owl glides through the shadows.')}>Test voice</Button>
          <Toggle label="Read-aloud highlighting" hint="Highlight each word as it is read" checked={s.highlight} onChange={(highlight) => dispatch({ type: 'settings', patch: { highlight } })} />
        </div>
      </Section>
    )
  }
  if (section === 'reminders') {
    return (
      <Section title="Reminders">
        <div className="card pad">
          <Toggle label="Daily reading reminder" hint="Saved as a preference on this device" checked={state.reminders.on} onChange={(on) => dispatch({ type: 'reminders', patch: { on } })} />
          <label className="field"><span>Time</span><input type="time" value={state.reminders.time} onChange={(e) => dispatch({ type: 'reminders', patch: { time: e.target.value } })} disabled={!state.reminders.on} /></label>
          <p className="muted small">This demo stores your preference only. Push notifications are not enabled.</p>
        </div>
      </Section>
    )
  }
  if (section === 'profile') {
    const avatars = ['🦊', '🦉', '🐻', '🐱', '🐼', '🐰']
    return (
      <Section title="Profile">
        <div className="card pad">
          <label className="field"><span>First name</span><input value={p.name} maxLength={20} onChange={(e) => dispatch({ type: 'profile', patch: { name: e.target.value } })} /></label>
          <label className="field"><span>Grade</span><input value={p.grade} maxLength={20} onChange={(e) => dispatch({ type: 'profile', patch: { grade: e.target.value } })} /></label>
          <fieldset className="avatar-field"><legend>Avatar</legend>
            <div className="avatar-grid">{avatars.map((a) => <button key={a} className={`avatar-opt ${p.avatar === a ? 'selected' : ''}`} aria-pressed={p.avatar === a} aria-label={`Avatar ${a}`} onClick={() => dispatch({ type: 'profile', patch: { avatar: a } })}>{a}</button>)}</div>
          </fieldset>
        </div>
      </Section>
    )
  }
  if (section === 'privacy') {
    return (
      <Section title="Privacy">
        <div className="card pad">
          <p>Everything you do in iRead is stored only on this device: your settings, saved words, and progress. Nothing is uploaded, shared, or sold.</p>
          <Button icon="download" variant="secondary" onClick={() => download('iread-data.json', JSON.stringify(state, null, 2), 'application/json')}>Export my data</Button>
          <Button variant="secondary" onClick={() => { dispatch({ type: 'replayOnboarding' }); go('/', { replace: true }) }}>Replay onboarding</Button>
          {confirm ? (
            <div className="confirm-row">
              <Button variant="secondary" onClick={() => setConfirm(false)}>Keep my data</Button>
              <Button onClick={() => { dispatch({ type: 'reset' }); setConfirm(false); toast('Demo data reset'); go('/', { replace: true }) }}>Yes, delete everything</Button>
            </div>
          ) : <Button variant="secondary" onClick={() => setConfirm(true)}>Reset demo data</Button>}
        </div>
      </Section>
    )
  }
  if (section === 'help') {
    return (
      <Section title="Help">
        <div className="card pad help">
          <h3>Reading tips</h3>
          <ul>
            <li>Tap a word with a dotted red underline to hear it and see its syllables.</li>
            <li>Tap <b>Aa</b> while reading to change the font, spacing, tint, or size.</li>
            <li>Turn on the reading ruler to focus on one sentence at a time.</li>
            <li>Use the left and right arrow keys to turn pages on a keyboard.</li>
          </ul>
          <h3>Install the app</h3>
          <p>On iPad or iPhone: Share, then “Add to Home Screen”. On Chrome or Edge: use the install icon in the address bar.</p>
          {canInstall && <Button onClick={() => installPrompt.prompt()}>Install iRead</Button>}
        </div>
      </Section>
    )
  }
  return <NotFound />
}
