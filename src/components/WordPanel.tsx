import type { ReactNode } from 'react'
import { AudioButton, Button, IconButton, Owl } from './ui'
import { Icon } from './Icon'
import { SyllableTile } from './SyllableTile'
import { Segmented, TintPicker, Toggle } from './ui'
import type { Settings, WordEntry } from '@/types'

/** Shared container: a bottom sheet on phones, a fixed side panel on tablets. */
export function SidePanel({ open, onClose, label, children }: { open: boolean; onClose: () => void; label: string; children: ReactNode }) {
  return (
    <>
      <div className={`panel-backdrop ${open ? 'open' : ''}`} onClick={onClose} />
      <aside className={`side-panel ${open ? 'open' : ''}`} aria-label={label}>
        <div className="sheet-handle" />
        {children}
      </aside>
    </>
  )
}

export function PanelIdle() {
  return (
    <div className="panel-idle">
      <span className="eyebrow">WORD HELPER</span>
      <div className="panel-idle-body">
        <Owl size={120} />
        <p>Tap an underlined word to see how it sounds.</p>
      </div>
    </div>
  )
}

export function WordPanel({
  entry,
  saved,
  onSave,
  onClose,
  onSay,
}: {
  entry: WordEntry
  saved: boolean
  onSave: () => void
  onClose: () => void
  onSay: (text: string) => void
}) {
  return (
    <div className="word-panel">
      <div className="panel-top">
        <span className="eyebrow">WORD</span>
        <IconButton icon="close" label="Close word helper" onClick={onClose} className="panel-close" />
      </div>
      <div className="word-title">
        <h2>{entry.word}</h2>
        <AudioButton label={`Hear ${entry.word}`} onClick={() => onSay(entry.word)} size={52} />
      </div>

      <span className="eyebrow">SYLLABLE BREAKDOWN</span>
      <div className="syl-tiles">
        {entry.syllables.map((s, i) => (
          <SyllableTile key={i} text={s} tone={i % 2 ? 'g' : 'b'} onSay={onSay} />
        ))}
      </div>

      {(entry.base || entry.suffix) && (
        <div className="pills">
          {entry.base && <span className="pill"><b>Base: {entry.base.word}</b> ({entry.base.meaning})</span>}
          {entry.suffix && <span className="pill muted"><b>Suffix: {entry.suffix.text}</b> ({entry.suffix.meaning})</span>}
        </div>
      )}

      <div className="meaning">
        <span className="eyebrow">MEANING</span>
        <p>{entry.definition}</p>
      </div>
      {entry.example && (
        <div className="example-card">
          <div className="example-art" aria-hidden="true">📖</div>
          <div>
            <span className="eyebrow">IN A SENTENCE</span>
            <p>{highlightWord(entry.example, entry.word)}</p>
          </div>
        </div>
      )}

      <div className="panel-actions">
        <Button variant={saved ? 'tint' : 'secondary'} onClick={onSave} aria-pressed={saved}>
          {saved ? <Icon name="check" size={20} /> : <Icon name="star" size={20} />}
          {saved ? 'Saved to Word Bank' : 'Save to Word Bank'}
        </Button>
        <Button onClick={onClose}>Resume Reading</Button>
      </div>
    </div>
  )
}

function highlightWord(sentence: string, word: string): ReactNode {
  const re = new RegExp(`(${word.replace(/s$/, '')}\\w*)`, 'i')
  const parts = sentence.split(re)
  return parts.map((p, i) => (re.test(p) && i % 2 === 1 ? <mark key={i}>{p}</mark> : <span key={i}>{p}</span>))
}

export function ComfortPanel({ settings, onChange, onDone }: { settings: Settings; onChange: (p: Partial<Settings>) => void; onDone: () => void }) {
  return (
    <div className="comfort-panel">
      <div className="panel-top">
        <div>
          <span className="eyebrow">READING COMFORT</span>
          <h2>Text settings</h2>
        </div>
        <Button variant="primary" className="btn-sm" onClick={onDone}>Done</Button>
      </div>
      <label className="field-row">
        <span>Text size <em>{settings.textSize}px</em></span>
        <input type="range" min={20} max={34} step={1} value={settings.textSize} onChange={(e) => onChange({ textSize: Number(e.target.value) })} aria-label="Text size" />
      </label>
      <span className="field-label">Spacing</span>
      <Segmented
        label="Text spacing"
        value={settings.spacing}
        onChange={(spacing) => onChange({ spacing })}
        options={[{ id: 'standard', label: 'Standard' }, { id: 'relaxed', label: 'Relaxed' }, { id: 'wide', label: 'Extra Wide' }]}
      />
      <span className="field-label">Page tint</span>
      <TintPicker value={settings.tint} onChange={(tint) => onChange({ tint })} />
      <label className="field-row">
        <span className="field-label">Font</span>
        <select value={settings.font} onChange={(e) => onChange({ font: e.target.value as Settings['font'] })}>
          <option value="dyslexic">OpenDyslexic</option>
          <option value="atkinson">Atkinson Hyperlegible</option>
          <option value="modern">Clear Modern Sans</option>
        </select>
      </label>
      <div className="toggle-list">
        <Toggle label="Reading ruler" hint="Focus one line" checked={settings.ruler} onChange={(ruler) => onChange({ ruler })} />
        <Toggle label="Syllable guides" hint="Break apart words" checked={settings.syllables} onChange={(syllables) => onChange({ syllables })} />
      </div>
    </div>
  )
}
