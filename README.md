# Coco Choi — Piano Portfolio

## Setup
```bash
npm install
npm run dev
```

Export Rive files → place in `/public/`:
- `piano.riv` — Home page hero
- `warhol.riv` — Projects page
- `experience.riv` — Experience page eye
- `about_me.riv` — About page character

Optional: `music.mp3` → `/public/music.mp3`

## Rive Config
- Piano: Artboard `"Bye Quincy"`, State Machine `"State Machine 1"`, Inputs: `roll` (bool)
- Experience: Artboard `"AO Eyes"`, State Machine `"Eyes"`
- Projects: Artboard `"New Artboard"`, Animation `"Animation 1"`
- About: State Machine `"State Machine 1"`

## Architecture

```
src/
  constants/
    theme.js          — Color palettes (EYE, PAL, BG), design tokens
    data.js           — All data arrays (experiences, projects, skills, etc.)
  hooks/
    useTypewriter.js  — Typing/deleting animation loop
    useParallax.js    — Mouse-follow GSAP parallax
    useRiveCanvas.js  — Generic Rive loader (DPR, resize, cleanup)
    useScrollReveal.js— GSAP scroll-triggered fade-in
  utils/
    audio.js          — Web Audio piano synth + Howler bg music
  components/
    shared/
      AnimatedNumber.jsx — GSAP number counter
      Particles.jsx      — Canvas floating particles
    cards/
      CardInner.jsx    — Experience card inner content layer
      ExpCard.jsx      — Experience card with 3D tilt + clip-path hover
      CardContent.jsx  — Project card inner content layer
      ArtCard.jsx      — Project card with 3D tilt + clip-path hover
    HomePage.jsx
    ExperiencePage.jsx
    ProjectsPage.jsx
    AboutPage.jsx
    NavOverlay.jsx
    PianoCanvas.jsx
  App.jsx
  main.jsx
  styles.css
```

## Design Principles
- Fixed-viewport pages with GSAP strip transitions
- Rive animations as page hero elements
- Two-layer card system: base + clip-path hover for always-readable text
- Film grain overlay with separate animation refs per layer
- Mouse parallax on Home (piano) and About (character panels)
