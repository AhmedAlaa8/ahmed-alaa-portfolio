# Ahmed Alaa — Software Engineer

A bilingual, mobile-first Next.js portfolio. Static English `/` and Arabic `/ar/` pages, blue/camel palettes, light/dark appearance, and a Three.js orbital microservices sculpture.

## Run locally

Requires Node.js 20.9 or newer.

```sh
npm ci
npm run dev
npm test
npm run build
```

The static output is in `out/`. It can be hosted on a static host including GitHub Pages. A repository-subpath deployment needs a matching `basePath` and asset paths; the current build expects a domain root.

## Architecture

- `data/portfolio-content.mjs`: bilingual copy, work areas, contact links.
- `repositories/portfolio-repository.mjs`: injected content source and locale resolution; components consume this boundary.
- `components/preferences.jsx`: React context for language, palette, theme and motion; preference persistence.
- `components/studio/sculpture.jsx`: lazy Three.js renderer, visibility and motion lifecycle, input, disposal.
- `lib/create-service-orbit.mjs`: geometry/material factory independent of React; chamfered API hub, four ceramic service modules, two metallic rotating orbits, and a request packet.
- `components/studio/work-art.jsx`: five local vector illustrations; no image network requests.
- `components/studio/toolkit.jsx`: language and tooling rails with local logo assets.
- `components/portfolio.jsx`: responsive composition, expandable work descriptions, payment stepper, profile and contact.
- `app/(en)` and `app/(ar)/ar`: separate static language pages sharing `root-document.jsx`.

The repository pattern is used at the content boundary. Rendering, preferences and geometry are separate components/modules; no database or artificial service layer is required for this static site.

## Interaction and performance

The Three.js bundle loads separately, only after the page has loaded and the browser is idle, and only while the hero is in view; it imports just the Three.js classes the sculpture uses (`lib/three-subset.mjs`). The renderer caps pixel ratio at 1.5 and updates at approximately 30 frames/second. It stops its animation loop outside the viewport, in a hidden tab, when motion is switched off, or when reduced motion is requested. On software-rendered WebGL (no usable GPU), or when frames stay slower than 120 ms after warm-up, it draws a single still frame that still responds to service selection. Geometries, materials, renderer and observers are disposed on unmount. No postprocessing, shadow-map loop, remote HDR or heavy 3D asset downloads are used. The sculpture is an illustrative microservices network: API, Auth, Orders, Payments and Events. Both rings rotate gently while idle. Selecting a service turns its ring along the shortest angular path to bring the module toward the viewer, then resumes idle rotation. Direct pointer selection, touch input and service buttons are supported. An explicit selection brings the service module forward at 2.6× scale with bilingual role details. Its ring holds position while the other keeps rotating; closing the detail view restores the full network and idle rotation. With motion disabled, selection changes orientation immediately without an animation. Rotation uses elapsed frame time and pauses when hidden or offscreen. A 64-pixel procedural studio reflection map is generated once and disposed with the scene. It is not a diagram of any employer’s production architecture. The transparent header and footer identity uses the same handwritten signature vector as the profile, with no duplicate footer mark. The signature beneath the hero name has been removed.

The logo and handwritten signature are transparent vectors. The signature is a redrawn interpretation; an exact original signature needs its vector or high-resolution source. Typography uses locally served Bodoni Moda, Cormorant Garamond, Manrope and Tajawal font packages.

The two CSS skill rails pause on hover, offscreen, in a hidden tab, on the motion toggle, and under reduced-motion preferences. Reduced motion lays out the full skill list without movement.

The single language button displays the destination language’s flag (Saudi for Arabic, US for English), with an accessible label. An explicit switch saves language and updates the URL; shared `/ar/` visits do not overwrite the saved preference. A returning Arabic reader opening `/` is redirected to `/ar/`, retaining query and hash.

## Verification

Repository tests cover bilingual content shape, locale fallback, all five work identities and injection of an alternate content source. Production static build is validated. Browser visual comparison and device performance measurement are not available in the managed authoring environment; no Lighthouse/FPS result is claimed.

## Assets

Devicon technology marks and flag-icons flags are stored locally with their licenses. The CI/CD mark, portfolio logo, signature and work illustrations are repository-native SVG. The previous reference thumbnail remains as design history; it is not displayed as the 3D hero.

## Content

The site uses confirmed experience without invented client names, dates, certifications or performance metrics. Kubernetes and cloud experience is explicitly basic. LinkedIn's full skills and posts could not be verified from public access; provide a profile export to expand the CV.

Project illustrations use event-driven, requestAnimationFrame-batched pointer tilt and a subtle pointer highlight. No continuous JavaScript loop is used for card interaction. Reduced motion and the site motion switch disable it. The payment example includes a service path, completed-stage ledger, previous/next controls and direct stage selection. It performs no network payment.

Investment artwork uses distinct cash, broker-order and unit illustrations. A local subscription/redemption switch reverses the illustrated flow and changes the explanatory steps. It performs no investment transaction.

Service inspection fades the surrounding geometry to a faint backdrop, keeping the selected module solid. The module itself displays a locally drawn icon, bilingual service name and role hint. Labels are canvas textures generated when language or palette changes, not per frame. Clicking the open model or its active service button closes inspection, restores materials and resumes the orbit. The workflow example switches between payments/refunds, investment subscription and shipping, resetting to the first step on each switch.
