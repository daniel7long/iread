import { useState } from 'react'
import { BackButton, Dots, PrimaryButton, Segmented, TintPicker, Toggle } from '@/components/ui'
import { Icon } from '@/components/Icon'
import { ComfortPreview } from '@/components/ComfortPreview'
import { goBack, useNavigate, useRoute } from '@/router'
import { useStore } from '@/store'
import type { FontId, Settings, Spacing, Tint } from '@/types'

type Variant = Partial<Pick<Settings, 'font' | 'spacing' | 'tint'>>
const ROUNDS: { a: Variant; b: Variant }[] = [
  { a: { font: 'dyslexic' }, b: { font: 'atkinson' } },
  { a: { spacing: 'relaxed' }, b: { spacing: 'wide' } },
  { a: { tint: 'cream' }, b: { tint: 'mint' } },
]

export function ComfortCheck() {
  const go = useNavigate()
  const { state, dispatch } = useStore()
  const [round, setRound] = useState(0)
  const [pick, setPick] = useState<Variant>({})
  const base = state.settings

  const finish = (final: Variant) => {
    dispatch({ type: 'settings', patch: final })
    go('/comfort')
  }
  const choose = (v: Variant | null) => {
    const merged = v ? { ...pick, ...v } : pick
    if (round < ROUNDS.length - 1) {
      setPick(merged)
      setRound(round + 1)
    } else finish(merged)
  }
  const cur = ROUNDS[round]
  const sample = (v: Variant) => ({ ...base, ...pick, ...v })

  return (
    <div className="flow">
      <header className="flow-head">
        <BackButton onClick={() => (round > 0 ? setRound(round - 1) : goBack('/account'))} />
        <div className="round-progress">
          <strong>{round + 1} of {ROUNDS.length}</strong>
          <div>{ROUNDS.map((_, i) => <span key={i} className={i <= round ? 'on' : ''} />)}</div>
        </div>
        <button className="link-btn right" onClick={() => finish(pick)}>Skip</button>
      </header>
      <div className="flow-body">
        <span className="eyebrow">QUICK COMFORT CHECK</span>
        <h1>Which feels easier to read?</h1>
        <p className="lede">Read both samples, then tap the one that feels more comfortable.</p>
        <div className="compare">
          {([['A', cur.a], ['B', cur.b]] as const).map(([label, v]) => {
            const s = sample(v)
            return (
              <button key={label} className="compare-card" data-tint={s.tint} data-font={s.font} data-spacing={s.spacing} onClick={() => choose(v)} aria-label={`Choose sample ${label}`}>
                <span className="compare-label">{label}</span>
                <span className="compare-text">
                  The little fox found a quiet path.<br />Soft leaves moved in the warm breeze.<br />It followed the path toward home.
                </span>
                <span className="tap-hint">Tap to choose</span>
              </button>
            )
          })}
        </div>
      </div>
      <footer className="flow-foot">
        <button className="btn btn-secondary full" onClick={() => choose(null)}>They look the same</button>
      </footer>
    </div>
  )
}

export function ComfortSetup() {
  const go = useNavigate()
  const route = useRoute()
  const fromSettings = route.query.get('from') === 'settings'
  const { state, dispatch } = useStore()
  const s = state.settings
  const set = (patch: Partial<Settings>) => dispatch({ type: 'settings', patch })
  const fonts: { id: FontId; name: string }[] = [
    { id: 'dyslexic', name: 'OpenDyslexic' },
    { id: 'atkinson', name: 'Atkinson Hyperlegible' },
    { id: 'modern', name: 'Clear Modern Sans' },
  ]
  const done = () => {
    if (fromSettings) goBack('/settings')
    else {
      dispatch({ type: 'finishOnboarding' })
      go('/library', { replace: true })
    }
  }

  return (
    <div className="flow comfort-setup">
      <header className="flow-head">
        <BackButton onClick={() => goBack(fromSettings ? '/settings' : '/comfort-check')} />
        {!fromSettings ? <Dots step={3} /> : <span />}
        <span className="step-count">{fromSettings ? '' : '3 / 3'}</span>
      </header>
      <div className="flow-body setup-grid">
        <section className="setup-controls">
          <span className="eyebrow">READING COMFORT</span>
          <h1>Set up your reading comfort</h1>
          <p className="lede">Customize your page so letters stay calm and clear.</p>

          <div className="setup-preview-mobile"><ComfortPreview settings={s} /></div>

          <div className="setting-grid">
            <section className="card setting">
              <span className="section-label">PAGE TINT</span>
              <TintPicker value={s.tint as Tint} onChange={(tint) => set({ tint })} />
            </section>
            <section className="card setting">
              <span className="section-label">FONT TYPE</span>
              <div className="font-list" role="radiogroup" aria-label="Font type">
                {fonts.map((f) => (
                  <button key={f.id} role="radio" aria-checked={s.font === f.id} className={`font-opt ${s.font === f.id ? 'selected' : ''}`} data-font={f.id} onClick={() => set({ font: f.id })}>
                    <span><strong>{f.name}</strong><small>The quick brown fox</small></span>
                    <span className="check">{s.font === f.id && <Icon name="check" size={16} />}</span>
                  </button>
                ))}
              </div>
            </section>
            <section className="card setting">
              <span className="section-label">TEXT SPACING</span>
              <Segmented<Spacing>
                label="Text spacing"
                value={s.spacing}
                onChange={(spacing) => set({ spacing })}
                options={[{ id: 'standard', label: 'Standard' }, { id: 'relaxed', label: 'Relaxed' }, { id: 'wide', label: 'Extra Wide' }]}
              />
            </section>
            <section className="card setting">
              <span className="section-label">ASSISTIVE TOOLS</span>
              <div className="toggle-list">
                <Toggle label="Reading Ruler" checked={s.ruler} onChange={(ruler) => set({ ruler })} />
                <Toggle label="Syllable Guides" checked={s.syllables} onChange={(syllables) => set({ syllables })} />
                <Toggle label="Read-Aloud Highlighting" checked={s.highlight} onChange={(highlight) => set({ highlight })} />
                <Toggle label="Reduced Motion" checked={s.reducedMotion} onChange={(reducedMotion) => set({ reducedMotion })} />
              </div>
            </section>
          </div>
        </section>
        <aside className="setup-preview"><ComfortPreview settings={s} /></aside>
      </div>
      <footer className="flow-foot save-bar">
        <span className="save-note">Your settings are saved on this device.</span>
        <PrimaryButton onClick={done}>{fromSettings ? 'Save' : 'Save & Go to Bookshelf'}</PrimaryButton>
      </footer>
    </div>
  )
}
