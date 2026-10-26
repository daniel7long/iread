import { useCallback, useSyncExternalStore } from 'react'

export interface Route {
  path: string
  query: URLSearchParams
}

const parse = (): Route => {
  const raw = window.location.hash.replace(/^#/, '') || '/'
  const [path, qs] = raw.split('?')
  return { path: path || '/', query: new URLSearchParams(qs ?? '') }
}

let cache: Route | null = null
let cacheKey: string | null = null

function subscribe(cb: () => void): () => void {
  const handler = () => {
    cb()
  }
  window.addEventListener('hashchange', handler)
  return () => window.removeEventListener('hashchange', handler)
}

function snapshot(): Route {
  if (cache === null || cacheKey !== window.location.hash) {
    cacheKey = window.location.hash
    cache = parse()
  }
  return cache
}

export function useRoute(): Route {
  return useSyncExternalStore(subscribe, snapshot)
}

export function navigate(to: string, opts: { replace?: boolean } = {}): void {
  const url = `#${to}`
  if (opts.replace) window.location.replace(url)
  else window.location.hash = to
}

export function useNavigate() {
  return useCallback((to: string, opts?: { replace?: boolean }) => navigate(to, opts), [])
}

/** Go back one step in history; fall back to a path when there is no history. */
export function goBack(fallback: string): void {
  if (window.history.length > 1) window.history.back()
  else navigate(fallback, { replace: true })
}

export function matchPath(pattern: string, path: string): Record<string, string> | null {
  const a = pattern.split('/').filter(Boolean)
  const b = path.split('/').filter(Boolean)
  if (a.length !== b.length) return null
  const params: Record<string, string> = {}
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith(':')) params[a[i].slice(1)] = decodeURIComponent(b[i])
    else if (a[i] !== b[i]) return null
  }
  return params
}
