# 2026-10-08 — Portfolio: performance, palette tint, sculpture load

## 1. WHAT CHANGED
- `Dockerfile` (new, from sibling `ahmed-alaa-portfolio`): build stage writes a `.gz` next to every html/js/css/svg/txt/json in `out/`.
- `nginx.conf` (new): `gzip_static on` + on-the-fly `gzip` fallback, `gzip_vary`; `Cache-Control: no-cache` on HTML; 7-day `expires` on `/toolkit/` and `/flags/`; `/_next/static/` stays 1y immutable.
- `compose.yml` (new): project `ahmed-alaa-portfolio1`, web on `:3020`, opt-in dev profile on `:3021`. Own network; does not touch local-dev or the sibling project on `:3010`.
- `.dockerignore` (new, copied from sibling).
- `lib/three-subset.mjs` (new): named re-exports of the 26 three.js APIs the sculpture uses.
- `components/studio/sculpture.jsx`:
  - `import('three')` → `import('../../lib/three-subset.mjs')`.
  - three.js is fetched only after `window.load` + `requestIdleCallback` (2.5 s timeout; `setTimeout` fallback), and only while the hero is in view. Previously: as soon as the hero intersected, competing with first paint.
  - *Lite* (still) mode — pixel ratio 1, no 30 fps loop, one frame re-rendered on selection/resize — entered when any of: (a) `failIfMajorPerformanceCaveat:true` context creation throws (then retried without AA); (b) `UNMASKED_RENDERER_WEBGL` matches swiftshader/llvmpipe/softpipe/software/basic render; (c) 4 consecutive animated frames over 120 ms, counted only after the first 15 frames (shader compile / label upload warm-up). (c) is one-way until reload and has not been observed on a hardware GPU; on this host's CPU renderer a small canvas ran at 3–17 fps and tripped it in one of three runs — borderline-by-design. (a) alone did NOT trip on headless Chrome 153 + SwiftShader — measured, which is why (b) exists.
  - Camel 3D accent `#ad7545` → `#8f5a30`.
  - Arabic note: `ادخار` → `ادّخار` (matches `data/portfolio-content.mjs`).
- `app/globals.css` tokens:
  - Blue (default) light: `--paper #fbf9f5→#f5f7fb`, `--card #fffefa→#fcfdff`, `--line #deded6→#dbe0e8`, `--soft #eef1f9→#e9eef8`, `--sub #656a70→#5f6873`.
  - Camel light: now sets its own warm whites `--paper #f8f4ee`, `--card #fdfaf6`, `--line #e3dbd0`, `--sub #68645f`; deeper camel `--brand #996139→#87522c`, `--art-bright #d6a46d→#bf8650`, `--art-deep #714b30→#5c3c25`, `--soft`, `--art-paper` adjusted. Ink stays the shared navy `#15202b`.
  - Camel dark: `--paper #14151a`, `--card #211f1d`, `--line #36322e`, `--brand #d4aa80→#c9996a`, art tokens deepened.
  - Palette-toggle glyph camel `#bf8a57→#a5703f`.
- `data/portfolio-content.mjs`: AR hero intro `الـBackend` → `الخدمات الخلفية` (also removes the mixed-direction run); EN `less: 'Less detail'` → `'Fewer details'`.
- `README.md`: the Three.js load/stop sentence now describes load-after-idle, the subset import and still mode.
- `tests/three-subset.test.mjs` (new): (a) every `T.<Name>` used in sculpture.jsx / create-service-orbit / create-service-labels is exported by the subset; (b) the orbit model builds from the subset alone.

## 2. WHY
User request in session (performance review; palette-tinted whites; deeper camel; sculpture performance). No ticket.

## 3. CONTRACT IMPACT
None — static site, no API. Visual: palette colours changed (intended).

## 4. HOW TO USE
`docker compose up -d --build web` → http://localhost:3020. Dev: `docker compose --profile dev up dev` → :3021.

## 5. VERIFICATION (all measured)
- Unit tests: baseline 11/11 (before any edit, inside the build image). Closing 13/13 (11 + 2 new in `tests/three-subset.test.mjs`). Full suite `node --test tests/*.test.mjs`, run by the Dockerfile.
- Twin for the subset test: removed `TubeGeometry,` from `lib/three-subset.mjs` inside a throwaway build container (md5 f8ad76ae… → a38d4074…, host file untouched): both new tests failed, naming `TubeGeometry` / `T.TubeGeometry is not a constructor`.
- Bytes: three.js chunks 748 KB → 569 KB raw (188 → 142 KB gz). Every text response now `Content-Encoding: gzip` (curl: `/` 6.9 KB, `/ar/` 7.2 KB, linux.svg 75 KB). HTML `no-cache`; `/toolkit/` `/flags/` 7 days; `/_next/static/` 1y immutable.
- Load order (CDP, headless): `load` event 290 ms, three.js chunks requested at 408 ms.
- Still-mode: draw calls over a 6 s window after load — old build 3,708; new build 0 (SwiftShader). Positive control, same 390×1000 viewport: renderer name spoofed to a hardware GPU → 3,096 draws in 6 s (animates); spoofed "SwiftShader" → 0.
- Lighthouse 12 mobile, same session, interleaved; old = the previous build output served by the previous nginx.conf on a temporary 127.0.0.1:3029 container (removed after):
  | run | score | LCP | TBT | TTI | bytes |
  |---|---|---|---|---|---|
  | EN, WebGL off, median of 3 — old | 79 | 3.30 s | 504 ms | 9.4 s | 1,380 KiB |
  | EN, WebGL off, median of 3 — new | 97 | 2.20 s | 136 ms | 3.8 s | 382 KiB |
  | AR, WebGL off, 1 run — old / new | 93 / 98 | 2.78 / 1.75 s | 182 / 150 ms | 9.1 / 3.8 s | 1,358 / 359 KiB |
  | EN, software WebGL, 1 run — old / new | 60 / 68 | 3.30 / 2.16 s | 162,316 / 5,283 ms | 180 / 8.9 s | 1,398 / 401 KiB |
  Software-WebGL rows reflect a GPU-less device; on hardware GPUs the animation is unchanged and its cost is not measurable here.
- Full cycle: `docker compose up -d --build web` → container on :3020; `/` 200, `/ar` 301 → `/ar/` 200, `/nope` custom 404; sibling :3010 still 200; local-dev containers untouched.
- Visual: before/after full-page screenshots (EN/AR, light/dark, blue/camel, 390 px and 1440 px).
- Contrast (computed): camel brand on paper 4.84 → 5.86; blue brand on new paper 6.78; dark camel brand 7.16.

## 6. STATUS / FINDINGS
Done: compression, caching, three.js subset + deferred load + still mode, palette tint, two copy fixes.
Not done — reported to the user, their call:
- Hero `AHMED` letters touch (`letter-spacing:-.065em` on Bodoni h1).
- Many 9–11 px texts (sculpture hint, workflow node labels, "Interactive example", footer, eyebrows 10 px).
- Hero has ~140 px empty above and ~130 px below on desktop (`min-height:670px` + padding).
- Arabic paper note uses Cormorant italic → system Arabic fallback with synthetic oblique.
- Arabic copy mixes Egyptian colloquial and MSA; three terms for backend (الـBackend / الخدمات الخلفية / الباك إند).
- Project 05 (Delivery & shipping) copy and detail say the same thing.
- Nav "Profile" vs section "About me".
- `public/toolkit/linux.svg` 194 KB (75 KB gz) for a 32 px icon.
- Dead code: `components/interactions.jsx`, `theme-picker.jsx`, `payment-art.jsx`, root `investment-art.jsx`, `motion-features.js`, `hooks/use-visible-motion.js`, `lib/create-{flow-sculpture,microservices,monogram}.mjs`, `lib/identity-geometry.mjs`, `public/identity/sculpture-reference.png`; `motion` dependency used only by them. Not shipped to browsers — removing it only speeds `npm ci`.
- The whole folder is ignored by the workspace git repo (`/home/ahmedalaa/Code/.gitignore: *`) — nothing here is tracked anywhere.
