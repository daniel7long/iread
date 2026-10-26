import { Icon } from './Icon'

export function SyllableTile({ text, tone, onSay }: { text: string; tone: 'b' | 'g'; onSay: (t: string) => void }) {
  return (
    <button type="button" className={`syl-tile ${tone}`} onClick={() => onSay(text)} aria-label={`Say ${text}`}>
      <span>{text}</span>
      <Icon name="speaker" size={18} />
    </button>
  )
}
