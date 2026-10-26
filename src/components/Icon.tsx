import type { ReactNode } from 'react'

export type IconName =
  | 'back' | 'close' | 'search' | 'speaker' | 'library' | 'bank' | 'journey' | 'settings' | 'next' | 'prev'
  | 'check' | 'mic' | 'filter' | 'play' | 'pause' | 'ruler' | 'bookmark' | 'star' | 'chevron' | 'chevdown'
  | 'lock' | 'bell' | 'user' | 'shield' | 'help' | 'sliders' | 'flame' | 'book' | 'clock' | 'arrow' | 'sound'
  | 'download' | 'plus'
  | 'wildlife' | 'space' | 'tech' | 'mysteries' | 'history' | 'ocean'

const P: Record<IconName, ReactNode> = {
  back: <path d="m15 5-7 7 7 7" />,
  close: <path d="m7 7 10 10M17 7 7 17" />,
  search: (<><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></>),
  speaker: (<><path d="M5 10v4h3.5l4.5 3.5v-11L8.5 10H5Z" fill="currentColor" stroke="none" /><path d="M16 9.2a4 4 0 0 1 0 5.6M18.4 6.8a7.4 7.4 0 0 1 0 10.4" /></>),
  sound: (<><path d="M5 10v4h3.5l4.5 3.5v-11L8.5 10H5Z" /><path d="M16 9.2a4 4 0 0 1 0 5.6M18.4 6.8a7.4 7.4 0 0 1 0 10.4" /></>),
  library: <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5v-16ZM20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5v-16Z" />,
  bank: (<><rect x="4" y="4" width="16" height="16" rx="3" /><path d="m8 16 3-8 3 8M9.2 13.2h3.6M16.5 9h1.5" /></>),
  journey: (<><path d="M5 20V10M12 20V4M19 20v-7" /></>),
  settings: (<><circle cx="12" cy="12" r="3" /><path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6" /></>),
  next: <path d="m9 6 6 6-6 6" />,
  prev: <path d="m15 6-6 6 6 6" />,
  check: <path d="m5.5 12.5 4 4 9-10" />,
  mic: (<><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M6 11a6 6 0 0 0 12 0M12 17v4" /></>),
  filter: <path d="M4 7h16M7 12h10M10 17h4" />,
  play: <path d="m9 6.5 8 5.5-8 5.5z" fill="currentColor" />,
  pause: (<><path d="M9 6v12M15 6v12" strokeWidth="3" /></>),
  ruler: (<><rect x="3" y="8" width="18" height="8" rx="2" /><path d="M7 8v3M11 8v4M15 8v3M19 8v2" /></>),
  bookmark: <path d="M7 4h10v16l-5-3.5L7 20V4Z" />,
  star: <path d="m12 4 2.3 4.9 5.2.7-3.8 3.6.9 5.3-4.6-2.5-4.6 2.5.9-5.3L4.5 9.6l5.2-.7L12 4Z" />,
  chevron: <path d="m9 6 6 6-6 6" />,
  chevdown: <path d="m6 9 6 6 6-6" />,
  lock: (<><rect x="5" y="11" width="14" height="9" rx="2.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>),
  bell: <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16ZM10 20.5a2 2 0 0 0 4 0" />,
  user: (<><circle cx="12" cy="8.5" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></>),
  shield: <path d="M12 3.5 19 6v5.5c0 4.3-2.8 7.4-7 9-4.2-1.6-7-4.7-7-9V6l7-2.5Z" />,
  help: (<><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.6 2.6 0 1 1 3.6 2.4c-.7.4-1.1.9-1.1 1.7M12 17h.01" /></>),
  sliders: <path d="M4 7h9M17 7h3M4 17h3M11 17h9M13 5v4M7 15v4" />,
  flame: <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4.1 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5Z" fill="currentColor" />,
  book: <path d="M5 4.5h10a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3V4.5ZM5 17a3 3 0 0 1 3-3h10" />,
  clock: (<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>),
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  download: <path d="M12 4v11m-4-4 4 4 4-4M5 20h14" />,
  plus: <path d="M12 5v14M5 12h14" />,
  wildlife: (<><path d="M4 8 7 4l3 3.3h4L17 4l3 4v5a8 8 0 0 1-16 0V8Z" /><circle cx="9" cy="12" r="1.4" /><circle cx="15" cy="12" r="1.4" /><path d="m11 15.5 1 1 1-1" /></>),
  space: (<><circle cx="12" cy="12" r="4.5" /><path d="M3 17c4.5 1.6 13.5-3.4 18-8" /><path d="M5 5.5l.5 1M19 18l-1-1" /></>),
  tech: (<><rect x="5" y="8" width="14" height="11" rx="3.5" /><circle cx="9.5" cy="13.5" r="1.4" /><circle cx="14.5" cy="13.5" r="1.4" /><path d="M12 8V4.5M10 17h4M3 12.5v3M21 12.5v3" /></>),
  mysteries: (<><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4M9.2 9.5a2 2 0 1 1 2.8 1.8c-.6.3-1 .8-1 1.5M11 15h.01" /></>),
  history: <path d="M3.5 8.5 12 4l8.5 4.5M5.5 10v7M10 10v7M14 10v7M18.5 10v7M3.5 19.5h17" />,
  ocean: <path d="M3 9c2.5-2 4.5-2 6 0s3.5 2 6 0 4.5-2 6 0M3 14c2.5-2 4.5-2 6 0s3.5 2 6 0 4.5-2 6 0M3 19c2.5-2 4.5-2 6 0s3.5 2 6 0 4.5-2 6 0" />,
}

export function Icon({ name, size = 22, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {P[name]}
    </svg>
  )
}
