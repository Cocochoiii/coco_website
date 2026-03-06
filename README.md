# Coco Choi — Piano Portfolio

## Setup
```bash
npm install
npm run dev
```

Place Rive files in `/public/`:
`piano.riv`, `warhol.riv`, `experience.riv`, `about_me.riv`
Optional: `music.mp3`

## Font Fix (Vercel)
Fonts are loaded via `<link>` tags in `index.html` — NOT via CSS `@import`.
This ensures reliable loading on Vercel, Netlify, and all CDN-based hosts.

## Mobile Responsive
All pages adapt to mobile viewports (≤900px):
- **Home**: Scaled piano, repositioned name/typewriter, touch-friendly nav buttons
- **Experience**: Vertical scrollable card list replaces 3×3 grid
- **Projects**: 2-column compact grid replaces side-by-side layout
- **About**: Stacked panels, single-column editorial, smaller Rive
- **Nav overlay**: Smaller labels, adjusted spacing

## Architecture
```
src/
  constants/     — theme.js, data.js
  hooks/         — useTypewriter, useParallax, useRiveCanvas, useScrollReveal, useIsMobile
  utils/         — audio.js
  components/
    shared/      — AnimatedNumber, Particles
    cards/       — CardInner, ExpCard, CardContent, ArtCard
    HomePage, ExperiencePage, ProjectsPage, AboutPage, NavOverlay, PianoCanvas
  App.jsx, main.jsx, styles.css
```
