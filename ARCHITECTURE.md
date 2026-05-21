# Architecture — Multi-Tenant Theming Engine

## Why CSS Custom Properties Over Prop-Based Theming

**Prop-based theming** (passing `theme` objects through React context, Vue inject, or styled-components) couples every component to a runtime theming system. Changing a color means re-rendering the entire tree — every component evaluates `props.theme.colors.primary` at render time.

**CSS custom properties** invert this. The browser's cascade is the theming engine:

```
<button class="btn btn-primary">  ← no theme reference in markup
  ↓
.btn-primary { background: var(--accent); }
  ↓
:root { --accent: #5e6ad2; }     ← one-line change, zero re-renders
```

The critical difference: `var()` lookups resolve at paint time, not script time. Changing `--accent` on `<html>` restyles every button in a single composite frame — no React reconcile, no Vue patch, no styled-components generate. For a 16-component library, that's ~4KB of CSS vs. the equivalent context provider + theme registry + HOC chain.

**Measurable trade-offs:**

| Concern | CSS Custom Properties | Prop-Based |
|---------|----------------------|------------|
| Runtime overhead | 0 JS bytes | ~2-5KB (theme context + resolver) |
| Style recalculation | 1 paint frame | N re-renders × component count |
| Framework coupling | None | Tight (React context, Vue inject) |
| Debugging | DevTools → Computed tab | React DevTools → component tree |
| SSR compatibility | Native | Requires theme serialization |

## How This Scales to React

The CSS variable approach maps directly to React without any library overhead:

```tsx
// Button.tsx — no theme imports
export function Button({ variant, children }: Props) {
  return <button className={`btn btn-${variant}`}>{children}</button>;
}
```

The theming layer lives entirely in the host application:

```tsx
// App.tsx — single point of configuration
import config from "./customer-configs/acme-logistics.json";

function App() {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", config.accentColor);
    root.style.setProperty("--bg-base", config.theme.bgBase);
    // ... remaining tokens
  }, []);

  return <Button variant="primary">Ship</Button>;
}
```

**Scaling patterns:**

- **Server-rendered themes:** Set CSS vars in a `<style>` block during SSR — zero FOUC, zero JS
- **Dynamic switching:** `root.style.setProperty()` updates all descendants in one frame
- **Component libraries:** Ship with `var()` defaults, let consumers override at mount
- **Themed sub-trees:** Set vars on any DOM node, not just `:root` — scoped overrides via cascade

This is the same pattern used by Radix UI, Shadcn, and Linear's own design system.

## Onboarding a New Client (Config-Only, Zero Code Changes)

Adding a new tenant is a JSON file, not a code review.

```bash
# 1. Drop a config file
cp -r customer-configs/template.json customer-configs/new-client.json

# 2. Edit brand values
code customer-configs/new-client.json
# → companyName, colors, borderRadius, fontFamily

# 3. Add to the environment dropdown
# → One <option> in index.html

# 4. Deploy
npm run build && node server.js
```

**The JSON schema enforces isolation.** Every brand token is self-contained: colors, typography, spacing, radii. There is no shared state, no global CSS override, no theme registry to update.

**What changes per client:**
- `customer-configs/<client>.json` — brand tokens
- `index.html` — one `<option>` in the environment selector

**What never changes:**
- Component CSS — all values reference `var()` tokens
- TypeScript logic — the config loader is generic
- Build pipeline — no per-client webpack configs
- Test suite — components render identically, only colors differ

This is white-label UI architecture: the same components, the same layout, the same behavior — different brand in under 20 lines of JSON.