import type { ReactNode } from 'react'
import { Icon, type IconName } from './Icon'
import { Logo } from './ui'
import { useNavigate } from '@/router'
import { useStore } from '@/store'

export type Tab = 'library' | 'bank' | 'journey' | 'settings'

const ITEMS: { id: Tab; label: string; icon: IconName; path: string; railOnly?: boolean }[] = [
  { id: 'library', label: 'Library', icon: 'library', path: '/library' },
  { id: 'bank', label: 'Word Bank', icon: 'bank', path: '/bank' },
  { id: 'journey', label: 'My Journey', icon: 'journey', path: '/journey' },
  { id: 'settings', label: 'Settings', icon: 'settings', path: '/settings', railOnly: true },
]

/** Main tabs: left nav rail on tablets, bottom tab bar on phones. */
export function Shell({ active, children }: { active: Tab; children: ReactNode }) {
  const go = useNavigate()
  const { state } = useStore()
  const initials = state.profile.name.slice(0, 2).toUpperCase()
  return (
    <div className="shell">
      <nav className="rail" aria-label="Main navigation">
        <div className="rail-logo"><Logo compact /></div>
        {ITEMS.map((it) => (
          <button key={it.id} className={`nav-item ${active === it.id ? 'active' : ''}`} aria-current={active === it.id ? 'page' : undefined} onClick={() => go(it.path)}>
            <Icon name={it.icon} size={24} />
            <span>{it.label}</span>
          </button>
        ))}
        <button className="rail-avatar" aria-label="Open settings" onClick={() => go('/settings')}>{initials}</button>
      </nav>
      <main className="shell-main">{children}</main>
      <nav className="tabbar" aria-label="Main navigation">
        {ITEMS.filter((i) => !i.railOnly).map((it) => (
          <button key={it.id} className={`nav-item ${active === it.id ? 'active' : ''}`} aria-current={active === it.id ? 'page' : undefined} onClick={() => go(it.path)}>
            <Icon name={it.icon} size={24} />
            <span>{it.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
