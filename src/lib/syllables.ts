/**
 * A small rule-based syllable splitter used as a fallback for words that are
 * not in the hand-checked dictionary (src/data/words.ts). It is intentionally
 * simple (English spelling is irregular), so hand-checked entries always win.
 */
const VOWELS = new Set(['a', 'e', 'i', 'o', 'u'])
const DIGRAPHS = ['sh', 'ch', 'th', 'ph', 'wh', 'ck', 'ng', 'qu']

const isVowel = (word: string, i: number): boolean => {
  const c = word[i]
  if (VOWELS.has(c)) return true
  return c === 'y' && i > 0
}

export function syllabify(input: string): string[] {
  const word = input.toLowerCase().replace(/[^a-z]/g, '')
  if (word.length <= 3) return word ? [word] : []

  // Find vowel groups; a final silent "e" after a consonant does not count.
  const groups: { start: number; end: number }[] = []
  let i = 0
  while (i < word.length) {
    if (isVowel(word, i)) {
      const start = i
      while (i < word.length && isVowel(word, i)) i++
      groups.push({ start, end: i })
    } else i++
  }
  const last = groups[groups.length - 1]
  if (groups.length > 1 && last && word[word.length - 1] === 'e' && last.end === word.length && last.end - last.start === 1 && !word.endsWith('le')) {
    groups.pop()
  }
  if (groups.length <= 1) return [word]

  const cuts: number[] = []
  for (let g = 0; g < groups.length - 1; g++) {
    const from = groups[g].end
    const to = groups[g + 1].start
    const cons = word.slice(from, to)
    if (cons.length === 0) {
      cuts.push(from) // vowel/vowel boundary
    } else if (cons.length === 1) {
      cuts.push(from) // V/CV
    } else {
      // keep digraphs together; otherwise split after the first consonant
      const pairAt = (n: number) => DIGRAPHS.includes(cons.slice(n, n + 2))
      let cut = from + 1
      if (pairAt(0)) cut = from
      else if (cons.length >= 3 && pairAt(1)) cut = from + 1
      cuts.push(cut)
    }
  }
  const parts: string[] = []
  let prev = 0
  for (const c of cuts) {
    parts.push(word.slice(prev, c))
    prev = c
  }
  parts.push(word.slice(prev))
  return parts.filter(Boolean)
}
