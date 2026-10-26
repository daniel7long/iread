import { syllabify } from '@/lib/syllables'
import { pageProps } from '@/lib/hooks'
import type { Settings } from '@/types'

const dotted = (word: string) => {
  const clean = word.replace(/[^A-Za-z]/g, '')
  if (clean.length < 5) return word
  const parts = syllabify(clean)
  return parts.length > 1 ? word.replace(clean, parts.join('·')) : word
}

/** Live preview of how a page will look with the current comfort settings. */
export function ComfortPreview({ settings }: { settings: Settings }) {
  const first = 'When the sun goes down, the quiet forest wakes up.'
  const words = first.split(' ')
  return (
    <div className="preview-card">
      <div className="preview-head">
        <div>
          <span className="eyebrow">LIVE PREVIEW</span>
          <strong>Your reading page</strong>
        </div>
        <span className="live-pill"><i /> Updates live</span>
      </div>
      <div className="sample-page" {...pageProps(settings)}>
        <span className="sample-kicker">A QUIET NIGHT</span>
        <h3 className="sample-title">The forest wakes</h3>
        <p className={`sample-text ${settings.ruler ? 'ruled' : ''}`}>
          {words.map((w, i) => (
            <span key={i}>
              {settings.highlight && i < 4 ? <mark>{settings.syllables ? dotted(w) : w}</mark> : settings.syllables ? dotted(w) : w}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>
        <p className="sample-text sample-extra">Soft paws move between the trees. An owl listens from a branch above.</p>
      </div>
    </div>
  )
}
