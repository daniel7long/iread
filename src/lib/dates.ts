export const dayKey = (d: Date = new Date()): string => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const addDays = (d: Date, n: number): Date => {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

const parseKey = (k: string): Date => {
  const [y, m, d] = k.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** Current streak: consecutive days with reading, ending today or yesterday. */
export function currentStreak(readDays: string[], today: Date = new Date()): number {
  const set = new Set(readDays)
  let cursor = today
  if (!set.has(dayKey(cursor))) cursor = addDays(cursor, -1)
  let n = 0
  while (set.has(dayKey(cursor))) {
    n++
    cursor = addDays(cursor, -1)
  }
  return n
}

export function bestStreak(readDays: string[]): number {
  const sorted = Array.from(new Set(readDays)).sort()
  let best = 0
  let run = 0
  let prev: Date | null = null
  for (const k of sorted) {
    const d = parseKey(k)
    run = prev && dayKey(addDays(prev, 1)) === k ? run + 1 : 1
    best = Math.max(best, run)
    prev = d
  }
  return best
}

/** Monday-first week containing `today`. */
export function weekOf(today: Date = new Date()): { key: string; label: string; date: number; isToday: boolean; future: boolean }[] {
  const offset = (today.getDay() + 6) % 7 // Mon=0
  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const todayKey = dayKey(today)
  return labels.map((label, i) => {
    const d = addDays(today, i - offset)
    const key = dayKey(d)
    return { key, label, date: d.getDate(), isToday: key === todayKey, future: key > todayKey }
  })
}
