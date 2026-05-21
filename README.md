# UI Architecture Demo

> A white-label-ready component library and theming engine — 16 reusable UI components driven entirely by CSS custom properties. Switch between three distinct themes instantly with zero JavaScript re-rendering.

![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite)
![Node](https://img.shields.io/badge/Node.js-%3E%3D18-339933?style=flat-square&logo=node.js)
![CSS](https://img.shields.io/badge/CSS-Custom%20Properties-1572B6?style=flat-square&logo=css3)
![Themes](https://img.shields.io/badge/themes-3-9742FF?style=flat-square)
![Components](https://img.shields.io/badge/components-16-3B82F6?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-9742FF?style=flat-square)

---

## Tech Stack

| Technology | Use |
|-----------|-----|
| **TypeScript 5.7** | Strict-mode type safety for all interaction logic (theme switching, tabs, modal, toasts) |
| **Vite 6** | Build pipeline with HMR dev server, TypeScript compilation, CSS bundling, and tree-shaking |
| **Node.js 18+** | Production HTTP server (`server.js`) with CSP headers and fallback routing |
| **CSS Custom Properties** | Full theming engine — all visual tokens are `var()` references, enabling runtime theme switching without JavaScript |
| **HTML5** | Semantic markup with ARIA-compatible component structure |

## Overview

This project demonstrates a **UI architecture pattern** for building white-label applications — products that need to be deployed across multiple customer environments, each with its own branding, while sharing 100% of the component logic.

The entire visual layer is controlled through CSS custom properties (design tokens). Changing a single attribute on `<html>` swaps every color, shadow, radius, font, and spacing across all 16 components simultaneously. No React context providers. No styled-components. No runtime JavaScript for theming.

## Why This Architecture Matters

Most UI frameworks handle theming at the component level — each button, card, and modal needs explicit theme awareness. This approach scales poorly when you have 5, 10, or 50 customers, each with unique brand requirements.

This demo uses the opposite approach: **theme at the token level**. Components never know about themes. They only reference `var(--color-accent)`, `var(--radius-md)`, etc. New themes are just a new set of token values — no component changes required.

## Architecture

```
├── index.html                  # Entry point — loads Vite bundle
├── src/
│   ├── scripts/
│   │   └── main.ts              # TypeScript — theme switching, tabs, modal, toast
│   └── styles/
│       ├── theme.css             # Design tokens as CSS custom properties × 3 themes
│       ├── base.css              # Reset, typography, layout grid, sidebar, header
│       └── components.css        # 16 component styles — all use var() references
├── server.js                    # Node.js production server with CSP headers
├── package.json                 # Vite + TypeScript dev dependencies
├── tsconfig.json                # TypeScript strict config
├── vite.config.ts               # Vite build configuration
├── README.md
└── .gitignore
```

### Theme Engine (`css/themes/theme.css`)

Every visual property is defined as a CSS custom property under `:root`:

```css
:root, [data-theme="corporate"] {
  --color-accent:          #3b82f6;
  --color-bg:              #f8fafc;
  --color-surface:         #ffffff;
  --color-text-primary:    #0f172a;
  --color-sidebar-bg:      #1e293b;
  --radius-md:             8px;
  --shadow-lg:             0 10px 15px -3px rgba(0,0,0,0.08);
  /* ... 50+ tokens total */
}
```

New themes override only the values that differ:

```css
[data-theme="midnight"] {
  --color-accent:          #7c3aed;    /* purple instead of blue */
  --color-bg:              #0c0e19;    /* dark background */
  --color-sidebar-bg:      #0f1120;
  /* everything else inherits from :root */
}
```

Switching themes is a one-line operation:
```js
document.documentElement.setAttribute('data-theme', 'midnight');
```

### Component Layer (`css/components/components.css`)

Components never reference specific colors or values. Every style declaration uses `var()`:

```css
.btn-primary {
  background: var(--color-accent);
  color: var(--color-accent-text);
  border-color: var(--color-accent);
  border-radius: var(--radius-md);
}

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}
```

This means **every component is theme-agnostic by default**. Adding a new theme requires zero component changes.

## Component Inventory

| Component | Variants | CSS Classes |
|-----------|----------|-------------|
| **Button** | 4 variants × 3 sizes + icon | `.btn`, `.btn-primary/secondary/ghost/danger`, `.btn-sm/lg/icon` |
| **Card** | Header, body, footer sections | `.card`, `.card-header`, `.card-title`, `.card-subtitle`, `.card-body`, `.card-footer` |
| **Badge** | 5 styles (accent, success, warning, danger, info) | `.badge`, `.badge-{accent,success,warning,danger,info}` |
| **Input** | Text, email, textarea, select + error state | `.input`, `.input-group`, `.input-label`, `.input-hint`, `.input-error` |
| **Toggle** | Switch with animated thumb | `.toggle`, `.toggle-track`, `.toggle-thumb` |
| **Table** | Full-width with hover states | `.table-wrap`, `table`, `th`, `td` |
| **Tabs** | Active indicator with content panels | `.tabs`, `.tab-btn`, `.tab-content` |
| **Modal** | Overlay with backdrop + transitions | `.modal-overlay`, `.modal`, `.modal-actions` |
| **Toolbar** | Action bar with dividers | `.toolbar`, `.toolbar-divider` |
| **Avatar** | 3 sizes with initials | `.avatar`, `.avatar-sm/lg` |
| **Progress Bar** | Animated fill | `.progress`, `.progress-bar` |
| **Stat Card** | Metric display | `.stat-card`, `.stat-value`, `.stat-label` |
| **Empty State** | Fallback UI | `.empty-state` |
| **Toast** | Notification (auto-dismiss) | `.toast`, `.toast-container` |
| **Sidebar** | Navigation shell | `.sidebar`, `.sidebar-item`, `.sidebar-section` |
| **Header** | Top bar with breadcrumb + actions | `.header`, `.header-left/right` |

## Quick Start

```bash
git clone https://github.com/Mihir713/ui-architecture-demo.git
cd ui-architecture-demo

# Install dependencies
npm install

# Development server (with HMR)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Or serve with Node.js
npm run serve
```

Then open `http://localhost:8082` in your browser.

## How to Extend

### Add a New Theme

Add a block to `css/themes/theme.css`:

```css
[data-theme="ocean"] {
  --color-accent:          #0ea5e9;
  --color-bg:              #ecfeff;
  --color-surface:         #ffffff;
  --color-sidebar-bg:      #0c4a6e;
  --color-text-primary:    #0c4a6e;
  /* override as many or as few tokens as needed */
}
```

That's it. All 16 components render with the new theme. No component code changes.

### Add a New Component

Create a new CSS file in `css/components/`:

```css
/* css/components/slider.css */
.slider {
  background: var(--color-border);
  border-radius: var(--radius-full);
}
.slider-thumb {
  background: var(--color-accent);
  box-shadow: var(--shadow-md);
}
```

Reference `var()` tokens. It's theme-aware immediately.

## Deployment to Customer Environments

This architecture maps to a deployment workflow for white-label SaaS:

1. **Build the component library** — shared across all customers
2. **Define a theme per customer** — a CSS file with their token overrides
3. **Serve the customer's theme** — either bundled at build time or injected at runtime
4. **No forking** — every customer runs the same component code

For React/Vue integration, wrap the token system in a provider:

```jsx
// React example — 3 lines of integration
function ThemeProvider({ theme, children }) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  return children;
}
```

## Design Decisions

- **CSS custom properties over preprocessor variables** — dynamic, runtime-switchable, inherited through the DOM
- **No CSS-in-JS** — zero runtime cost for theming, works with any framework or no framework
- **Component classes over utility classes** — semantic class names (`.btn-primary`) over atomic utilities (`.bg-blue-500`) because this is a component library, not a design system playground
- **Dark mode = just another theme** — the Midnight theme is a simple token swap, not a `prefers-color-scheme` media query hack
- **Framework-agnostic** — works with React, Vue, Angular, Svelte, or vanilla HTML. The JS for modals/tabs/toasts is ~50 lines total and easily ported.

## License

MIT