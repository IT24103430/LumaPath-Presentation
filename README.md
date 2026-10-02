# LumaPath AI — cinematic presentation

A standalone, scroll driven presentation for the LumaPath AI student success project. It uses **Vite 8, TypeScript 5, GSAP ScrollTrigger, and Three.js**. It lives separately from the main Next.js app.

## Run

```bash
cd presentation
npm install
npm run dev
```

Open the local URL printed by Vite. Scroll to direct the story. Use the fullscreen control for presenting. Arrow keys, Page Up/Down, and Space move between scenes.

Chapter links and keyboard navigation ease between scenes over roughly 2–3 seconds. Research callouts in the problem and career-readiness chapters link to their original sources. **Explore LumaPath** opens https://lumapath-kappa.vercel.app/.

Scrolling controls the animations in both directions: chapter titles move through the frame, problem cards scatter and gather, signals flow into the decision engine, the dashboard moves into focus, the schedule replans, and the career path builds step by step. A glowing marker travels along the Three.js path in the background.

## Edit the presentation

- `src/main.ts` contains the seven scenes and navigation controls.
- `src/style.css` contains the visual design and responsive layout.
- `src/ambient.ts` creates the Three.js path and particles.
- `src/motion.ts` contains the GSAP scroll choreography for each chapter.
- `src/story.json` stores chapter labels and optional voiceover text.

Run `npm run script:export` after editing `src/story.json` to refresh `PRESENTATION_SCRIPT.md`. The on-screen product views are illustrative; no performance numbers or user results are claimed.

## Checks

```bash
npm test
npm run verify
```

The page respects reduced motion settings and keeps the content readable if WebGL is unavailable. To create a video file, capture the presentation in fullscreen with your screen recorder while navigating the chapters.
