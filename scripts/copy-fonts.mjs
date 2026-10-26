// Copies the OpenDyslexic + Atkinson Hyperlegible web fonts into public/fonts
// so the app works offline and never calls a font CDN. Runs on `npm install`.
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const out = path.join(root, 'public', 'fonts')
const wanted = [
  ['@fontsource/opendyslexic', 'opendyslexic-latin-400-normal.woff2'],
  ['@fontsource/opendyslexic', 'opendyslexic-latin-700-normal.woff2'],
  ['@fontsource/atkinson-hyperlegible', 'atkinson-hyperlegible-latin-400-normal.woff2'],
  ['@fontsource/atkinson-hyperlegible', 'atkinson-hyperlegible-latin-700-normal.woff2'],
]
fs.mkdirSync(out, { recursive: true })
let copied = 0
for (const [pkg, file] of wanted) {
  const src = path.join(root, 'node_modules', pkg, 'files', file)
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(out, file))
    copied++
  } else {
    console.warn(`[copy-fonts] missing ${pkg}/files/${file}`)
  }
}
console.log(`[copy-fonts] copied ${copied}/${wanted.length} font files`)
