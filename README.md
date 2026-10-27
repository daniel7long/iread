# iRead — Reading that feels natural

> A calm, dyslexia-friendly reading app with syllable help, read-aloud and a personal word bank.

[![Live demo](https://img.shields.io/badge/Live%20demo-iread--rust.vercel.app-2ea44f?style=for-the-badge)](https://iread-rust.vercel.app)

iRead is a reading app for people navigating **dyslexia**. It makes text easier to approach with syllable help, read-aloud and a personal word bank, all inside a deliberately quiet interface.

This is the working build of my **UX case study**, which covered research, wireframes, high-fidelity mock-ups and an interactive prototype before any code was written.

<!-- Add 3–4 screenshots here, e.g.:
<p align="center"><img src="docs/screenshots/reader.png" width="22%"> <img src="docs/screenshots/syllables.png" width="22%"> <img src="docs/screenshots/word-bank.png" width="22%"></p>
-->

| | |
| --- | --- |
| **Live demo** | <https://iread-rust.vercel.app> |
| **Type** | Progressive web app, responsive for mobile and tablet |
| **Audience** | Readers with dyslexia, including children who often lack a phone |

---

## Key features

- **Syllable help:** support for decoding longer words.
- **Read-aloud:** hear text read aloud on demand.
- **Personal word bank:** keep the words you want to practise.
- **Calm by design:** a soft, warm off-white palette instead of a stark white page.

## Design and UX highlights

- **Research-led.** The product grew out of user research, wireframes, hi-fi mock-ups and an interactive prototype.
- **Mobile and tablet layouts.** Because many young readers use a tablet rather than a phone, the design covers both screen sizes.
- **A full Figma design system** (components plus mobile and tablet frames) that the front end is built from.

## Tech stack

| Layer | Technology |
| --- | --- |
| Front end | **React** + **TypeScript** |
| App model | **Progressive Web App**, with theme colour and iOS home-screen metadata |
| Design | **Figma** (design system, mobile and tablet), Figma Make |
| Hosting | **Vercel** |

<!-- TODO(stack): add the build tool, styling approach, how read-aloud and syllable splitting work, and any back-end services (check package.json). -->

## Engineering highlights

- **Design-to-code fidelity.** The interface was built from exported Figma designs, so spacing, colour and type follow the design system.
- **App-like on any device.** PWA metadata lets the site be saved to a phone or tablet home screen.
- **One codebase for phone and tablet layouts** rather than two separate products.

## Roadmap

- Complete the remaining tablet-landscape screens

---

**Designed and built by [Daniel Long](https://daniel7long.com)** · M.S. Human-Computer Interaction, Carnegie Mellon University
