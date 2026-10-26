# iRead

A calm, dyslexia-friendly reading app, built as a **responsive PWA** (React 19 + TypeScript + Vite).
It is a portfolio demo: all data lives on the device, and read-aloud uses the browser's built-in voices.

- **Tablet landscape first** (nav rail, two-pane reader with a 360px Word Helper side panel), with a compact **phone** layout (bottom tabs, bottom sheets). Breakpoint: 900px.
- **Installable and offline-capable** (web manifest + service worker generated at build time).
- **No backend.** State is persisted in `localStorage`; a sensible demo dataset is seeded on first launch.

## Run it

```powershell
npm install        # also copies the OpenDyslexic + Atkinson fonts into public/fonts
npm run dev        # http://localhost:5173
npm run typecheck
npm test
npm run build      # outputs dist/ (service worker + precache list included)
npm run preview    # serve the production build; try "Install app" / go offline
```

Hosting under a sub-path (for example GitHub Pages): `$env:VITE_BASE="/iread/"; npm run build`.
Routing uses the URL hash (`#/library`), so no server rewrite rules are needed.

## What is in the app

| Area | Screens |
| --- | --- |
| Onboarding | Splash, Welcome, 3-step account, Quick Comfort Check, Reading Comfort setup (live preview) |
| Library | My Bookshelf (continue reading, recommended decodables, topic + phonics filters), Explore Topics, Search with filter sheet |
| Reading | Book detail, Reader (focus band + ruler, read-aloud word highlight, syllable guides, Aa panel), Word Helper, Book Completed + visual comprehension check |
| Practice | Word Bank (master-detail on tablet), Practice cards with optional voice check |
| Progress | My Reading Journey (streak calendar, phonics progress, trophies) |
| Adults | Settings (comfort, audio, reminders, profile, privacy, help), PIN-gated Parent/Educator dashboard with CSV export |

Demo PIN for the adult area: `1234`.

## Code map

```
src/
  App.tsx, main.tsx, router.tsx (tiny hash router), store.tsx (reducer + persistence), pwa.ts
  data/       books.ts (stories, topics, trophies), words.ts (hand-checked syllables + definitions)
  lib/        syllables.ts (rule-based fallback), speech.ts (TTS + recognition wrapper), dates.ts (streaks), search.ts, hooks.ts
  components/ ui.tsx (buttons, chips, toggles, sheet, toast), Shell, WordPanel (side panel / sheet), BookBits, ...
  screens/    one file per screen group
  styles/     tokens.css (colors, fonts, page tints), base.css (primitives, shell), screens.css (screens + tablet layout)
public/       manifest.webmanifest, sw.js, icons/
tests/        logic.test.ts (syllables, streaks, reducer, search, router)
```

## Adding content

Add a book to `src/data/books.ts` (pages are arrays of sentences; list the tricky words in `hard`) and give each
`hard`/`practice` word an entry in `src/data/words.ts`. Words without an entry still work: the rule-based
syllable splitter in `src/lib/syllables.ts` is used, with a generic definition.

## Known limits

- Read-aloud and the "Say it" voice check depend on browser support (voice check: Chrome and Safari). Without voices, the word highlight still advances on a timer.
- Reminders are stored as a preference only; push notifications are not implemented.
- Covers and illustrations are generated (gradient + emoji) so the app works offline.
