import { useEffect, type ReactNode } from 'react'
import { StoreProvider, useStore } from '@/store'
import { ToastProvider } from '@/components/ui'
import { matchPath, navigate, useRoute } from '@/router'
import { Account, Splash, Welcome } from '@/screens/Onboarding'
import { ComfortCheck, ComfortSetup } from '@/screens/Comfort'
import { Library } from '@/screens/Library'
import { Search } from '@/screens/Search'
import { BookDetail, NotFound } from '@/screens/BookDetail'
import { Reader } from '@/screens/Reader'
import { Complete } from '@/screens/Complete'
import { WordBank } from '@/screens/WordBank'
import { Practice } from '@/screens/Practice'
import { Journey } from '@/screens/Journey'
import { Settings, SettingsSection } from '@/screens/Settings'
import { Parent } from '@/screens/Parent'

const ONBOARDING = ['/', '/welcome', '/account', '/comfort-check', '/comfort']

function resolve(path: string): ReactNode {
  let m: Record<string, string> | null
  if (path === '/') return <Splash />
  if (path === '/welcome') return <Welcome />
  if (path === '/account') return <Account />
  if (path === '/comfort-check') return <ComfortCheck />
  if (path === '/comfort') return <ComfortSetup />
  if (path === '/library') return <Library />
  if (path === '/search') return <Search />
  if ((m = matchPath('/book/:id', path))) return <BookDetail id={m.id} />
  if ((m = matchPath('/read/:id', path))) return <Reader id={m.id} />
  if ((m = matchPath('/complete/:id', path))) return <Complete id={m.id} />
  if (path === '/bank') return <WordBank />
  if (path === '/practice') return <Practice />
  if (path === '/journey') return <Journey />
  if (path === '/settings') return <Settings />
  if ((m = matchPath('/settings/:section', path))) return <SettingsSection section={m.section} />
  if (path === '/parent') return <Parent />
  return <NotFound />
}

function Screens() {
  const { path } = useRoute()
  const { state } = useStore()
  const onboarded = state.profile.onboarded
  const gated = !onboarded && !ONBOARDING.includes(path)
  const launch = onboarded && path === '/'

  useEffect(() => {
    if (gated) navigate('/', { replace: true })
    if (launch) navigate('/library', { replace: true })
  }, [gated, launch])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [path])

  if (gated || launch) return null
  return <div className="screen" key={path}>{resolve(path)}</div>
}

function RootAttrs() {
  const { state } = useStore()
  useEffect(() => {
    document.documentElement.dataset.reduced = String(state.settings.reducedMotion)
  }, [state.settings.reducedMotion])
  return null
}

export default function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <RootAttrs />
        <Screens />
      </ToastProvider>
    </StoreProvider>
  )
}
