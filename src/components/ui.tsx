import { createContext, useCallback, useContext, useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Icon, type IconName } from './Icon'
import type { Tint } from '@/types'

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`logo ${compact ? 'compact' : ''}`} role="img" aria-label="iRead">
      <svg viewBox="0 0 64 52" aria-hidden="true">
        <path d="M5 9c9-2 18 .4 27 7v31C23 40 14 38 5 40V9ZM59 9c-9-2-18 .4-27 7v31c9-7 18-9 27-7V9Z" />
        <text x="14" y="33">a</text>
      </svg>
      <span><b>i</b>Read</span>
    </div>
  )
}

export function Owl({ size = 200 }: { size?: number }) {
  return (
    <svg className="owl" width={size} height={size * 0.94} viewBox="0 0 220 206" role="img" aria-label="A friendly owl holding a book">
      <ellipse cx="110" cy="196" rx="70" ry="8" fill="#e8e4da" />
      <path d="M52 38 66 62M168 38 154 62" stroke="#2d4a73" strokeWidth="7" strokeLinecap="round" />
      <ellipse cx="110" cy="100" rx="62" ry="72" fill="#7c8cf0" stroke="#2d4a73" strokeWidth="6" />
      <path d="M60 78c10-20 30-24 50-8 20-16 40-12 50 8-4 24-24 34-50 34S64 102 60 78Z" fill="#eaf0fa" stroke="#2d4a73" strokeWidth="5" strokeLinejoin="round" />
      <circle cx="88" cy="82" r="17" fill="#faf8f3" stroke="#2d4a73" strokeWidth="4" />
      <circle cx="132" cy="82" r="17" fill="#faf8f3" stroke="#2d4a73" strokeWidth="4" />
      <circle cx="90" cy="84" r="7" fill="#1f2733" />
      <circle cx="130" cy="84" r="7" fill="#1f2733" />
      <path d="m104 98 6 10 6-10Z" fill="#f2a33a" stroke="#2d4a73" strokeWidth="3" strokeLinejoin="round" />
      <path d="M78 122 110 146 142 122v40l-32 12-32-12v-40Z" fill="#fff" stroke="#2d4a73" strokeWidth="5" strokeLinejoin="round" />
      <path d="M110 146v28" stroke="#2d4a73" strokeWidth="4" />
      <path d="M88 138l16 10M88 150l16 10M132 138l-16 10M132 150l-16 10" stroke="#2d4a73" strokeWidth="3" strokeLinecap="round" opacity=".5" />
      <path d="M82 188v-8M96 190v-8M124 190v-8M138 188v-8" stroke="#2d4a73" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

export function Mascot() {
  return (
    <svg viewBox="0 0 64 80" width="64" height="80" aria-hidden="true" className="mascot">
      <ellipse cx="32" cy="44" rx="22" ry="26" fill="#7c8cf0" stroke="#2d4a73" strokeWidth="3" />
      <circle cx="23" cy="34" r="9" fill="#fff" stroke="#2d4a73" strokeWidth="2.5" />
      <circle cx="41" cy="34" r="9" fill="#fff" stroke="#2d4a73" strokeWidth="2.5" />
      <circle cx="24" cy="35" r="3.5" fill="#1f2733" />
      <circle cx="40" cy="35" r="3.5" fill="#1f2733" />
      <path d="m29 42 3 5 3-5Z" fill="#f2a33a" />
      <circle cx="32" cy="62" r="8" fill="#f2a33a" stroke="#2d4a73" strokeWidth="2.5" />
      <path d="m32 57 1.8 3.6 4 .6-2.9 2.8.7 4L32 66l-3.6 1.9.7-4-2.9-2.8 4-.6Z" fill="#fff" />
    </svg>
  )
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { icon?: IconName }

export function PrimaryButton({ children, className = '', ...rest }: BtnProps) {
  return (
    <button className={`btn-cta ${className}`} {...rest}>
      <span>{children}</span>
      <span className="btn-arrow"><Icon name="arrow" size={20} /></span>
    </button>
  )
}

export function Button({ children, variant = 'primary', icon, className = '', ...rest }: BtnProps & { variant?: 'primary' | 'secondary' | 'tint' | 'ghost' }) {
  return (
    <button className={`btn btn-${variant} ${className}`} {...rest}>
      {icon && <Icon name={icon} size={20} />}
      {children}
    </button>
  )
}

export function IconButton({ icon, label, className = '', size = 22, ...rest }: BtnProps & { icon: IconName; label: string; size?: number }) {
  return (
    <button className={`icon-btn ${className}`} aria-label={label} title={label} {...rest}>
      <Icon name={icon} size={size} />
    </button>
  )
}

export function BackButton({ onClick, label = 'Go back' }: { onClick: () => void; label?: string }) {
  return <IconButton icon="back" label={label} className="back-btn" onClick={onClick} />
}

export function AudioButton({ label = 'Listen', onClick, size = 48 }: { label?: string; onClick: () => void; size?: number }) {
  return (
    <button className="audio-btn" aria-label={label} title={label} style={{ width: size, height: size }} onClick={onClick}>
      <Icon name="speaker" size={Math.round(size * 0.46)} />
    </button>
  )
}

export function Chip({ children, active, onClick, className = '' }: { children: ReactNode; active?: boolean; onClick?: () => void; className?: string }) {
  const cls = `chip ${active ? 'active' : ''} ${className}`
  return onClick ? (
    <button type="button" className={cls} aria-pressed={active} onClick={onClick}>{children}</button>
  ) : (
    <span className={cls}>{children}</span>
  )
}

export function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div className="segmented" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} type="button" role="radio" aria-checked={value === o.id} className={value === o.id ? 'active' : ''} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Toggle({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} className="toggle-row" onClick={() => onChange(!checked)}>
      <span className="toggle-text">
        <span>{label}</span>
        {hint && <small>{hint}</small>}
      </span>
      <span className={`toggle ${checked ? 'on' : ''}`}><span /></span>
    </button>
  )
}

export function Progress({ value, label = 'Progress', tone = 'amber' }: { value: number; label?: string; tone?: 'amber' | 'green' | 'blue' | 'navy' }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className={`progress tone-${tone}`} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v)}>
      <span style={{ width: `${v}%` }} />
    </div>
  )
}

export function Dots({ step, total = 3 }: { step: number; total?: number }) {
  return (
    <div className="dots" role="img" aria-label={`Step ${step} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={i + 1 === step ? 'current' : i + 1 < step ? 'done' : ''} />
      ))}
    </div>
  )
}

export const TINTS: { id: Tint; name: string }[] = [
  { id: 'white', name: 'White' },
  { id: 'cream', name: 'Cream' },
  { id: 'mint', name: 'Mint' },
  { id: 'midnight', name: 'Midnight' },
]

export function TintPicker({ value, onChange }: { value: Tint; onChange: (t: Tint) => void }) {
  return (
    <div className="tint-picker" role="radiogroup" aria-label="Page tint">
      {TINTS.map((t) => (
        <button key={t.id} type="button" role="radio" aria-checked={value === t.id} className={`tint-opt ${value === t.id ? 'selected' : ''}`} onClick={() => onChange(t.id)}>
          <span className={`swatch swatch-${t.id}`}>{value === t.id && <Icon name="check" size={16} />}</span>
          <span>{t.name}</span>
        </button>
      ))}
    </div>
  )
}

export function MasteryDots({ level }: { level: number }) {
  return (
    <span className="mastery" role="img" aria-label={`Mastery ${level} of 3`}>
      {[1, 2, 3].map((n) => <i key={n} className={n <= level ? 'on' : ''} />)}
    </span>
  )
}

export function SyllableChips({ parts, small = false }: { parts: string[]; small?: boolean }) {
  return (
    <span className={`syl-chips ${small ? 'small' : ''}`}>
      {parts.map((p, i) => <b key={i} className={i % 2 ? 'g' : 'b'}>{p}</b>)}
    </span>
  )
}

/* ---------- toast ---------- */
const ToastCtx = createContext<(msg: string) => void>(() => {})
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const show = useCallback((m: string) => {
    setMsg(m)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setMsg(null), 2400)
  }, [])
  useEffect(() => () => window.clearTimeout(timer.current), [])
  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        {msg && <div className="toast"><Icon name="check" size={18} /> {msg}</div>}
      </div>
    </ToastCtx.Provider>
  )
}

/** Modal-ish bottom sheet on phones; used for filters, word info etc. */
export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="sheet-wrap">
      <div className="sheet-backdrop" onClick={onClose} />
      <section className="sheet" role="dialog" aria-modal="true" aria-label={title}>
        <div className="sheet-handle" />
        <header className="sheet-head">
          <h2>{title}</h2>
          <IconButton icon="close" label="Close" onClick={onClose} />
        </header>
        <div className="sheet-body">{children}</div>
      </section>
    </div>
  )
}
