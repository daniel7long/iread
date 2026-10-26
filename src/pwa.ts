/** Service-worker registration and the "Install app" prompt. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
}

let deferred: BeforeInstallPromptEvent | null = null
const listeners = new Set<() => void>()

export const installPrompt = {
  available: () => deferred !== null,
  prompt: async () => {
    if (!deferred) return
    await deferred.prompt()
    deferred = null
    listeners.forEach((l) => l())
  },
  subscribe: (l: () => void) => {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}

export function setupPwa(): void {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferred = e as BeforeInstallPromptEvent
    listeners.forEach((l) => l())
  })
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
        /* offline support is optional */
      })
    })
  }
}
