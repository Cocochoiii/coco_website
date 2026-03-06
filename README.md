# Coco Choi — Piano Portfolio

## Setup
```bash
npm install
npm run dev
```

Export `piano.riv` from Rive → place in `/public/piano.riv`

## Rive Config
- Artboard: `"Bye Quincy"`
- State Machine: `"State Machine 1"`
- Inputs: `roll` (bool), `clicNotes` (bool)

## Design
Fixed-viewport pages. GSAP slide transitions between Home / Work / About.
Piano fills hero, responds to mouse movement natively via Rive listeners.
