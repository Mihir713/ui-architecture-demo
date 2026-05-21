# UI Architecture Demo

> White-label component library • CSS custom property theming • Framework-agnostic

16 reusable UI components driven entirely by CSS custom properties. Switch themes with a single attribute — every component restyles in one paint cycle. Zero framework overhead, zero runtime for styling.

## Tech Stack

| Layer | Technology | Role |
|-------|-----------|------|
| **TypeScript** | TypeScript 5.7, strict mode | Typed interaction layer (modals, tabs, toggles, keyboard nav) |
| **CSS** | Custom Properties + Cascade | Complete theming engine — 3 themes, 16 components, all `var()` driven |
| **HTML** | Semantic markup | Component showcase, accessible structure |
| **Node.js** | v18+, http module, Vite | Production server (CSP headers, compression) + build pipeline |

**Languages detected:** HTML (28KB), CSS (22KB), TypeScript (6KB), JavaScript (1.7KB)

## Architecture

```
ui-architecture-demo/
├── src/
│   └── scripts/
│       └── main.ts          ← TypeScript source (typed, compiled by Vite)
├── index.html                ← Single-page component showcase (68KB)
├── server.js                 ← Node.js production server with CSP
├── vite.config.ts            ← Vite bundler config
├── tsconfig.json             ← TypeScript strict mode config
├── package.json
└── dist/                     ← Production build output
```

### Theming Engine

CSS custom properties define every visual value: colors, borders, shadows, radii, spacing. Changing `data-theme` on `<html>` cascades through all components via `var()` references — no JavaScript re-rendering, no class toggling per element.

```
[data-theme="corporate"] { --accent: #5e6ad2; --bg-base: #0f1011; ... }
[data-theme="midnight"]  { --accent: #7850ff; --bg-base: #0e0e15; ... }
[data-theme="sunset"]    { --accent: #f97316; --bg-base: #150b08; ... }
```

### Component Architecture

- **Framework-agnostic:** Semantic HTML + atomic CSS classes → translates directly to React, Vue, or any component framework
- **Theme-aware by default:** No per-component theme code — every component inherits via `var()`
- **Decoupled patterns:** Modifier classes (`.btn-primary`, `.btn-lg`, `.card-header`) instead of prop drilling

## Components

| # | Component | Variants |
|---|-----------|----------|
| 1 | Buttons | Primary, secondary, ghost, danger, disabled · sm/md/lg · icon |
| 2 | Cards | Project, analytics/stat, team list |
| 3 | Forms | Text input, email, select, textarea, toggle · validation states |
| 4 | Badges | Accent, success, warning, error, info · dot indicators |
| 5 | Table | Sortable columns, progress bars, status badges |
| 6 | Tabs | Animated active state, 4-panel content switching |
| 7 | Modals | Confirm, info, form · backdrop blur, slide-up animation |
| 8 | Stats & Metrics | Accent-colored values, trend indicators |
| 9 | Toolbar | Action groups with dividers |
| 10 | Empty State | Dashed border fallback with CTA |
| 11 | Notifications | Success, info, error toast variants |

## Quick Start

```bash
# Install
npm install

# Development (Vite HMR)
npm run dev

# Production build
npm run build

# Serve (Node.js)
npm run serve
# → http://localhost:8082
```

## Themes

| Theme | Accent | Vibe |
|-------|--------|------|
| **Corporate** (default) | Indigo `#5e6ad2` | Dark, professional, blue |
| **Midnight** | Purple `#7850ff` | Rich, deep, purple-toned |
| **Sunset** | Orange `#f97316` | Warm, earthy, cozy |

Switch via the top bar — instant restyle, zero flicker.

## Deployment

```bash
npm run build   # outputs to dist/
node server.js  # serves dist/ with CSP headers
```

Supports any static host (Netlify, Vercel, Cloudflare Pages, S3).