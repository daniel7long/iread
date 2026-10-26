import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Replaces the __PRECACHE__ placeholder in dist/sw.js with the list of built
 * files so the app shell works offline after the first visit.
 */
function precacheManifest(): Plugin {
  let outDir = 'dist'
  let base = '/'
  return {
    name: 'iread-precache-manifest',
    apply: 'build',
    configResolved(c) {
      outDir = c.build.outDir
      base = c.base
    },
    closeBundle() {
      const root = path.resolve(outDir)
      const swPath = path.join(root, 'sw.js')
      if (!fs.existsSync(swPath)) return
      const files: string[] = []
      const walk = (dir: string) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, entry.name)
          if (entry.isDirectory()) walk(full)
          else files.push(path.relative(root, full).split(path.sep).join('/'))
        }
      }
      walk(root)
      const urls = files.filter((f) => f !== 'sw.js').map((f) => base + f)
      const version = Date.now().toString(36)
      const src = fs
        .readFileSync(swPath, 'utf8')
        .replace('self.__PRECACHE__', JSON.stringify(urls))
        .replace('__VERSION__', version)
      fs.writeFileSync(swPath, src)
    },
  }
}

export default defineConfig({
  // Use VITE_BASE=/repo-name/ when hosting under a sub-path (e.g. GitHub Pages).
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), precacheManifest()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: { host: true, port: 5173 },
})
