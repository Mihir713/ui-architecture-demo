// ═══════════════════════════════════════════════════════════════
//  Customer Config Loader — multi-tenant theming engine
//  Fetches a JSON config file and applies all brand tokens
//  as CSS custom properties on <html>. Zero runtime overhead.
// ═══════════════════════════════════════════════════════════════

interface CustomerTheme {
  bgBase: string;
  bgElevated: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  borderColor: string;
  successColor: string;
}

interface CustomerConfig {
  companyName: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  fontFamily: string;
  borderRadius: number;
  logoInitials: string;
  theme: CustomerTheme;
}

const CONFIG_CACHE = new Map<string, CustomerConfig>();

/**
 * Load a customer config JSON and apply it as CSS custom properties.
 * Falls back to cached version if already fetched.
 */
async function loadCustomerConfig(customerKey: string): Promise<void> {
  if (CONFIG_CACHE.has(customerKey)) {
    applyConfig(CONFIG_CACHE.get(customerKey)!);
    return;
  }

  try {
    const res = await fetch(`/customer-configs/${customerKey}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const config: CustomerConfig = await res.json();
    CONFIG_CACHE.set(customerKey, config);
    applyConfig(config);
  } catch (err) {
    console.error(`[config-loader] Failed to load ${customerKey}:`, err);
  }
}

/**
 * Apply all config values as CSS custom properties on <html>
 * and update UI placeholders (logo, company name).
 */
function applyConfig(config: CustomerConfig): void {
  const root = document.documentElement;
  const t = config.theme;

  // ── CSS Custom Properties ──
  const vars: Record<string, string> = {
    "--bg-deep": config.backgroundColor,
    "--bg-base": t.bgBase,
    "--bg-elevated": t.bgElevated,
    "--bg-hover": t.bgElevated,
    "--surface": `rgba(255,255,255,0.02)`,
    "--surface-hover": `rgba(255,255,255,0.04)`,
    "--surface-active": `rgba(255,255,255,0.06)`,
    "--text-primary": t.textPrimary,
    "--text-secondary": t.textSecondary,
    "--text-tertiary": t.textTertiary,
    "--text-quaternary": `rgba(255,255,255,0.35)`,
    "--accent": config.accentColor,
    "--accent-hover": config.primaryColor,
    "--accent-active": config.accentColor,
    "--accent-glow": `${config.accentColor}33`,
    "--accent-muted": `${config.accentColor}1A`,
    "--success": t.successColor,
    "--success-bg": `${t.successColor}1A`,
    "--warning": "#f59e0b",
    "--warning-bg": "rgba(245,158,11,0.1)",
    "--error": "#ef4444",
    "--error-bg": "rgba(239,68,68,0.1)",
    "--info": "#3b82f6",
    "--info-bg": "rgba(59,130,246,0.1)",
    "--border-subtle": t.borderColor,
    "--border": t.borderColor,
    "--border-strong": t.borderColor.replace("0.12", "0.2"),
    "--r-md": `${config.borderRadius}px`,
    "--r-lg": `${Math.min(config.borderRadius + 2, 12)}px`,
    "--r-xl": `${Math.min(config.borderRadius + 4, 16)}px`,
  };

  // Remove old customer theme class, apply new one
  document.querySelectorAll("[class*='customer-']").forEach((el) => {
    el.classList.forEach((c) => { if (c.startsWith("customer-")) el.classList.remove(c); });
  });
  root.classList.add(`customer-${config.companyName.toLowerCase().replace(/\s+/g, "-")}`);

  // Batch-set CSS vars
  Object.entries(vars).forEach(([key, val]) => {
    root.style.setProperty(key, val);
  });

  // ── Update UI placeholders ──
  // Hero badge
  const heroBadge = document.querySelector(".hero-badge");
  if (heroBadge) heroBadge.textContent = `✦ ${config.companyName}`;

  // Logo initials in sidebar
  const logoIcon = document.querySelector(".sidebar-logo .logo-icon");
  if (logoIcon) logoIcon.textContent = config.logoInitials;

  // Breadcrumb in topbar
  const breadcrumbSpan = document.querySelector(".topbar-breadcrumb span:last-child");
  if (breadcrumbSpan) breadcrumbSpan.textContent = config.companyName;
}

// Expose to global scope for inline script usage
(window as any).loadCustomerConfig = loadCustomerConfig;
(window as any).CONFIG_KEYS = ["acme-logistics", "nordic-bank", "vertex-health"];