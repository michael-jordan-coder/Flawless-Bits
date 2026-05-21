# Plan: scaffold `website/` mirroring the react-bits docs architecture

> Hand this file to a fresh Claude Code session opened at `/Users/daniel/Desktop/components-for-community/`. All planning, specs, and context for the build live in `docs/`. The actual code is built in `website/`.

## Context for you

You are working inside `/Users/daniel/Desktop/components-for-community/`. Layout convention:

- `docs/` — **planning artifacts only** (this file, future specs, notes). No code.
- `website/` — **build target.** Currently empty. This is where your code goes.
- `reactbits-clone/react-bits/` — full local clone of the upstream [react-bits](https://reactbits.dev) library. **Reference implementation.** Read from it; do not modify.
- `components/` — Daniel's WIP single-file components staged for later porting.

Your job: build a new Vite + React docs site inside `website/` that reproduces react-bits' docs-site **architecture** (routing, layout, providers, demo-page contract, registry pattern) without copying its branded content, component library, or sponsor/pro material verbatim.

Daniel is a solo design-engineer. The site will eventually host his own component collection (today: `HoneycombGrid`, `FillButton` in `components/`). Treat this as production work, not a sketch.

## Read first — do not skip

Before writing a single file, read these in order. They define the patterns you must reproduce:

1. `reactbits-clone/react-bits/package.json` — pinned versions, scripts
2. `reactbits-clone/react-bits/vite.config.js` — aliases, postcss safe-parser, glb assets
3. `reactbits-clone/react-bits/src/main.jsx` + `App.jsx` — entry, router, providers tree
4. `reactbits-clone/react-bits/src/components/layout/Providers.jsx` + `SidebarLayout.jsx`
5. `reactbits-clone/react-bits/src/pages/CategoryPage.jsx` + `LandingPage.jsx`
6. `reactbits-clone/react-bits/src/constants/{Components,Categories,Information}.js` (skim — note the shape, do not copy entries)
7. `reactbits-clone/react-bits/src/components/navs/Sidebar.jsx` (first 120 lines)
8. `reactbits-clone/react-bits/.context/new-component.md` — the demo-page contract
9. `reactbits-clone/react-bits/jsrepo.config.ts` — registry shape

When in doubt about a specific pattern, open the corresponding react-bits file before inventing one.

## Architecture you must reproduce

### Stack (pin to these versions to avoid integration drift)

- Vite 5, `@vitejs/plugin-react`, React 19, react-dom 19
- `react-router-dom` v6 + `nuqs` (with `nuqs/adapters/react-router/v6`)
- `@chakra-ui/react` v3 + `@emotion/react` (dark-mode forced)
- Tailwind v4 via `@tailwindcss/vite`
- `sonner` toaster
- `lucide-react` icons
- `react-syntax-highlighter` (Prism) for code blocks
- `jsrepo` + `@jsrepo/shadcn` for the registry build
- ESLint 8 + Prettier 3 (mirror `.eslintrc.cjs` + `.prettierrc`)

Do not add framer-motion, gsap, three, ogl, matter-js, etc. yet — those are component dependencies, not docs-site dependencies. Add them only when porting a component that needs them.

### Path aliases (vite.config.js)

```
@           → /src
@utils      → /src/utils
@content    → /src/content
@tailwind   → /src/tailwind
@ts-default → /src/ts-default
@ts-tailwind→ /src/ts-tailwind
```

### Routes (App.jsx)

```
/                              → LandingPage
/showcase                      → ShowcasePage          (stub OK in v1)
/sponsors                      → SponsorsPage          (stub OK in v1)
/tools/:toolId?                → ToolsPage             (stub OK in v1)
/favorites                     → FavoritesPage         (inside SidebarLayout)
/:category/:subcategory        → CategoryPage          (inside SidebarLayout)
```

`CategoryPage` resolves `subcategory` against `componentMap` (kebab-case slug → lazy demo import) and renders a Suspense-wrapped demo. The special slug `index` renders an `IndexPage` overview for the category. `category === 'get-started'` swaps to a different skeleton loader and points at `src/docs/{Introduction,Installation,McpServer}.jsx`.

### Providers stack (outside-in)

```
<Router>
  <NuqsAdapter>
    <ActiveRouteProvider>
      <Providers>             // composes Search → Options → Transition → Installation
        <Routes/>
        <Toaster/>
      </Providers>
      <AnnouncementModal/>
    </ActiveRouteProvider>
  </NuqsAdapter>
</Router>
```

Plus the Chakra `Provider` (from `components/setup/provider`) wrapping `<App/>` in `main.jsx`. Force dark mode via `forceChakraDarkTheme()` in a `useEffect` at the App root.

### Layout

`SidebarLayout` is a three-pane CSS grid: `Sidebar` (left) | children (center) | `right-panel` containing `ProCard` + `SponsorsCard` (right). Topped by a `<Navbar showDocs />`. Mobile gets `ProCardMobile`. Keep this exact structure but **stub** `ProCard` / `SponsorsCard` to neutral placeholders — do not reproduce react-bits' Pro/sponsor branding.

### Registry constants (the spine of the docs site)

Three files in `src/constants/`:

- `Components.js` — exports `componentMap`: `{ [kebab-slug]: () => import('../demo/<Cat>/<Name>Demo') }`. Also a `getStarted` map for `/get-started/*` routes pointing at `src/docs/*.jsx`.
- `Categories.js` — exports `CATEGORIES` (array of `{ heading, subcategories: [] }`), `NEW`, `UPDATED` arrays for sidebar badges.
- `Information.js` — exports `componentMetadata`: `{ '<Cat>/<Name>': { name, description, category, videoUrl, docsUrl, tags } }`. This is also what `jsrepo.config.ts` reads to generate registry items.

These three files are the **single source of truth** the sidebar, category page, and registry build all read from. Get the contract right; the rest follows.

### Demo-page contract (one demo file per component)

`src/demo/<Category>/<Name>Demo.jsx`:

```jsx
<ComponentPropsProvider props defaultProps resetProps hasChanges>
  <TabsLayout>
    <PreviewTab>
      <Flex className="demo-container"> <Component key={key} {...props}/> <RefreshButton/> </Flex>
      <Customize> {sliders/switches/selects} </Customize>
      <PropTable data={propData}/>
      <Dependencies dependencyList={[...]}/>
    </PreviewTab>
    <CodeTab><CodeExample codeObject={camelName} componentName="Name"/></CodeTab>
  </TabsLayout>
</ComponentPropsProvider>
```

Backed by `useComponentProps` + `useForceRerender` hooks, with code metadata in `src/constants/code/<Category>/<camelName>Code.js` using `?raw` imports across all four variants. See `reactbits-clone/react-bits/.context/new-component.md` for the full contract — reproduce it verbatim.

### Scripts (package.json)

```
dev              concurrently registry:dev + vite
build            registry:build → llms:text → sitemap → vite build
registry:build   jsrepo build
registry:dev     jsrepo build --watch
new:component    node scripts/generateComponent.js
llms:text        node scripts/generateLlmsText.js
sitemap          node scripts/generateSitemap.js
lint             eslint . --ext js,jsx --max-warnings 0
format           prettier --write .
```

You will need to **rewrite** `scripts/generateComponent.js` etc. for your project's content — do not copy the react-bits versions wholesale; read them and write equivalents that target your constants files.

## Build order (do it in this sequence — verify each before moving on)

1. **Project init.** `cd website && npm init -y`, install pinned deps from §Stack, copy `tsconfig.json`, `.eslintrc.cjs`, `.prettierrc`, `.prettierignore`, `vite.config.js` (aliases), `index.html`, `wrangler.jsonc` (only if Daniel confirms Cloudflare deploy — otherwise skip).
2. **App shell.** `src/main.jsx`, `src/App.jsx`, `src/styles.css`, `src/components/setup/provider.jsx` (Chakra), `src/components/layout/Providers.jsx`, `src/utils/utils.js` with `forceChakraDarkTheme` + `decodeLabel`.
3. **Empty context providers.** Skeletons for `ActiveRouteContext`, `SearchContext`, `OptionsContext`, `TransitionContext`, `InstallationContext`, `ComponentPropsContext` — wire them, leave logic minimal but correct.
4. **Constants spine.** `Components.js` (with an empty `componentMap`), `Categories.js` (one placeholder category), `Information.js` (empty `componentMetadata`).
5. **Layout + nav.** `SidebarLayout`, `Sidebar` (port the structure, stub the data), `Navbar`, stub `ProCard` / `SponsorsCard` / `ProCardMobile`.
6. **Category page + demo plumbing.** `CategoryPage.jsx`, `IndexPage.jsx`, `SkeletonLoader.jsx`, `TabsLayout.jsx`, `Customize.jsx`, `PreviewSlider/Switch/Select.jsx`, `RefreshButton.jsx`, `PropTable.jsx`, `CodeExample.jsx`, `CodeHighlighter.jsx`, `Dependencies.jsx`, hooks `useComponentProps` + `useForceRerender` + `useTransition`.
7. **Landing page.** Compose `LandingPage` with sectional components under `src/components/landingnew/{Hero,Features,...}/`. v1 can stub all sections except `Navbar` + `Hero` + `Footer` — make the rest empty boxes with section IDs so Daniel can fill them in.
8. **Get-started docs.** `src/docs/{Introduction,Installation,McpServer}.jsx` with placeholder copy. Wire into `getStarted` map and add to `CATEGORIES`.
9. **jsrepo registry.** Port `jsrepo.config.ts` reading from your `Information.js`. `npm run registry:build` must succeed against zero components (it will produce an empty registry — that's fine).
10. **`new:component` scaffolder.** Rewrite `scripts/generateComponent.js` so it creates the 4 variant files, demo, code metadata, and inserts entries into all three constants files.
11. **Smoke test.** `npm run dev`, hit `/`, hit `/get-started/introduction`, confirm sidebar renders, confirm a placeholder demo route 404s gracefully. Lint clean.

> Naming note: the build target is `website/` at the workspace root. The `src/docs/` folder *inside* `website/` holds the get-started article components (Introduction, Installation, McpServer) — that's unrelated to the workspace-root `docs/` folder, which is for planning markdown like this file. All paths above are relative to the project root `website/`.

## Non-goals — do not do these

- Do **not** copy react-bits' component code, demo files, landing copy, sponsor logos, brand assets, or `public/` images. Mirror **structure**, not content. react-bits is MIT + Commons Clause — architecture is fine; wholesale UI copy is not.
- Do **not** port all 110+ components. Stop at the empty shell. Daniel will port his own components afterward using `npm run new:component`.
- Do **not** install heavy component dependencies (three, gsap, ogl, motion, matter-js, etc.) until they're needed.
- Do **not** add a test runner, Storybook, or CI workflow — react-bits has none and Daniel hasn't asked for them.
- Do **not** add framer-motion route transitions beyond what `TransitionContext` provides — match react-bits' approach.
- Do **not** force-mirror the Pro / Sponsors / Showcase / Tools pages with real content; stub each as a single placeholder section.
- Do **not** write anything inside `docs/` other than planning markdown. Code goes in `website/`.

## Decisions to surface to Daniel before you start

Use `AskUserQuestion` for these — do not guess:

1. **Brand name & site title** for the new project (used in `<title>`, package `name`, logo placeholder, jsrepo registry `name`/`description`).
2. **Deployment target** — Cloudflare Pages (keep `wrangler.jsonc`), Vercel, or just local dev for now?
3. **Routing prefix** — same `/:category/:subcategory` scheme, or scope under `/components/*`?
4. **Initial categories** — start with one (`Components`) or mirror react-bits' four (`Animations`, `TextAnimations`, `Components`, `Backgrounds`)?

After Daniel answers, draft a short plan summary, then call `ExitPlanMode` for approval before writing any files.

## Definition of done (v1)

- `cd website && npm run dev` boots without console errors.
- `/` renders a dark-mode landing page with Navbar + Hero + Footer (other sections may be empty placeholders).
- `/get-started/introduction` renders inside `SidebarLayout` with sidebar populated from `Categories.js`.
- `/get-started/<unknown>` shows the "Not found" fallback from `CategoryPage`.
- `npm run new:component -- Components TestThing` creates all 8 files and registers in 3 constants files; the route `/components/test-thing` then renders an empty demo without crashing.
- `npm run lint` passes with zero warnings.
- `npm run build` produces a working static bundle in `dist/`.

Report back: what's working, what's stubbed, and the exact list of dependencies installed.
