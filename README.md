# UI Architecture Demo — Multi-Tenant Theming Engine

> White-label component architecture • CSS custom property theming • JSON-driven customer environments

16 reusable UI components that restyle instantly per tenant — no code changes, just a JSON config file. Switch between customers in the environment dropdown; every component inherits the new brand in one paint cycle.

## How It Works

```
┌─ Customer Config ──────────────────────────────┐
│  acme-logistics.json                            │
│  ├─ companyName: "Acme Logistics"               │
│  ├─ primaryColor: #ea580c                       │
│  ├─ accentColor: #f97316                        │
│  ├─ backgroundColor: #0a0806                    │
│  ├─ borderRadius: 4                             │
│  └─ theme: { bgBase, textPrimary, border, ... } │
└─────────────────────────────────────────────────┘
        │
        ▼
┌─ Config Loader (fetch → CSS vars) ─────────────┐
│  root.style.setProperty('--accent', '#f97316')  │
│  root.style.setProperty('--bg-base', '#0f0a06') │
│  ...20+ tokens applied in one batch             │
└─────────────────────────────────────────────────┘
        │
        ▼
┌─ Component Layer (var() references) ───────────┐
│  .btn-primary { background: var(--accent) }      │
│  .card { background: var(--bg-elevated) }        │
│  All 16 components update simultaneously         │
└─────────────────────────────────────────────────┘
```

## Customer Environments

| Environment | Accent | Background | Radius | Vibe |
|-------------|--------|------------|--------|------|
| **Default** (Corporate) | Indigo `#5e6ad2` | `#0f1011` | 6px | Professional blue |
| **Acme Logistics** | Orange `#f97316` | `#0f0a06` | 4px | Utilitarian, grounded |
| **Nordic Bank** | Blue `#3b82f6` | `#080b15` | 2px | Conservative, precise |
| **Vertex Health** | Teal `#14b8a6` | `#080f0c` | 8px | Clean, approachable |

## Tech Stack

| Layer | Technology | Role |
|-------|-----------|------|
| **TypeScript** | 5.7, strict mode | Typed interaction layer + config loader |
| **CSS** | Custom Properties + Cascade | Complete theming engine — all `var()` driven |
| **HTML** | Semantic markup | 16-component showcase |
| **JSON** | Per-tenant schema | Brand tokens, zero code changes per client |
| **Node.js** | 18+, http module, Vite | Production server + build pipeline |

## Architecture

```
ui-architecture-demo/
├── customer-configs/          ← Multi-tenant brand configs
│   ├── acme-logistics.json
│   ├── nordic-bank.json
│   └── vertex-health.json
├── src/
│   └── scripts/
│       ├── main.ts            ← TypeScript interaction layer
│       └── config-loader.ts   ← Typed config fetcher + CSS var injector
├── index.html                 ← 16-component showcase
├── ARCHITECTURE.md            ← Design decisions deep-dive
├── server.js                  ← Node.js production server
├── vite.config.ts             ← Vite bundler config
└── tsconfig.json              ← TypeScript strict mode
```

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the full rationale on CSS custom properties vs. prop-based theming, how this scales to React, and the zero-code-change client onboarding flow.

## Quick Start

```bash
npm install
npm run dev      # Vite HMR dev server
npm run build    # Production build → dist/
npm run serve    # Node.js server → http://localhost:8082
```

## Onboarding a New Client

```bash
cp customer-configs/acme-logistics.json customer-configs/new-brand.json
# Edit colors, font, radius
# Add <option value="new-brand"> in index.html
npm run build && npm run serve
```

Zero component changes. Zero pipeline changes. One JSON file.

## Languages

| Language | Purpose | Size |
|----------|---------|------|
| HTML | Component markup | 28KB |
| CSS | Theming engine + components | 22KB |
| TypeScript | Interaction logic + config loader | 8KB |
| JavaScript | Node.js server | 1.7KB |
| JSON | Customer brand configs | 1.4KB |