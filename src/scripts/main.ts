// ═══════════════════════════════════════════════════════════════
//  UI Architecture Demo — Runtime
//  Theme switching, tabs, modal, and toast notifications.
//  Compiled via Vite → TypeScript → vanilla JS.
// ═══════════════════════════════════════════════════════════════

// CSS imports — Vite bundles these into the production build
import "../styles/theme.css";
import "../styles/base.css";
import "../styles/components.css";

/** Available theme identifiers */
type ThemeName = "corporate" | "midnight" | "sunset";

/** Configuration for a toast notification */
interface ToastConfig {
  icon: string;
  text: string;
}

/** Lookup of toast presets by type */
const TOAST_PRESETS: Record<string, ToastConfig> = {
  success: { icon: "\u2713", text: "Changes saved successfully!" },
  info: { icon: "\u2139", text: "Theme has been updated." },
  error: { icon: "\u2715", text: "Something went wrong. Try again." },
};

// ─── Theme Switcher ───

function switchTheme(name: ThemeName): void {
  document.documentElement.setAttribute("data-theme", name);

  document.querySelectorAll<HTMLElement>(".theme-preview").forEach((el) => {
    el.classList.toggle("active", el.dataset.themeName === name);
  });
}

// Make globally accessible for onclick handlers
(window as unknown as Record<string, unknown>).switchTheme = switchTheme;

// ─── Tabs ───

function switchTab(btn: HTMLElement): void {
  const group = btn.closest(".tabs");
  if (!group) return;

  group.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
  group.querySelectorAll<HTMLElement>("[data-tab-content]").forEach((c) => {
    c.style.display = "none";
  });

  btn.classList.add("active");
  const content = group.querySelector<HTMLElement>(
    `[data-tab-content="${btn.dataset.tab}"]`
  );
  if (content) content.style.display = "";
}

(window as unknown as Record<string, unknown>).switchTab = switchTab;

// ─── Modal ───

interface ModalContent {
  title: string;
  body: string;
  actions: string;
}

const MODAL_PRESETS: Record<string, ModalContent> = {
  confirm: {
    title: "Confirm Action",
    body: "Are you sure you want to delete this project? This action cannot be undone.",
    actions:
      '<button class="btn btn-ghost" onclick="closeModal()">Cancel</button>' +
      '<button class="btn btn-danger" onclick="closeModal()">Delete</button>',
  },
  info: {
    title: "About This Demo",
    body: "This design system demonstrates white-label UI architecture using CSS custom properties across 16 components and 3 themes.",
    actions:
      '<button class="btn btn-primary" onclick="closeModal()">Got it</button>',
  },
  form: {
    title: "Save Configuration",
    body: [
      '<div class="input-group" style="margin-bottom:12px">',
      '  <label class="input-label">Config Name</label>',
      '  <input class="input" type="text" placeholder="My Config">',
      "</div>",
      '<div class="input-group">',
      '  <label class="input-label">Environment</label>',
      '  <div class="select-wrapper">',
      '    <select class="input">',
      "      <option>Development</option>",
      "      <option>Staging</option>",
      "      <option>Production</option>",
      "    </select>",
      "  </div>",
      "</div>",
    ].join(""),
    actions:
      '<button class="btn btn-ghost" onclick="closeModal()">Cancel</button>' +
      '<button class="btn btn-primary" onclick="closeModal()">Save</button>',
  },
};

function openModal(type: string): void {
  const overlay = document.getElementById("modalOverlay") as HTMLElement | null;
  const title = document.getElementById("modalTitle") as HTMLElement | null;
  const body = document.getElementById("modalBody") as HTMLElement | null;
  const actions = document.getElementById("modalActions") as HTMLElement | null;
  if (!overlay || !title || !body || !actions) return;

  const preset = MODAL_PRESETS[type];
  if (preset) {
    title.textContent = preset.title;
    body.innerHTML = preset.body;
    actions.innerHTML = preset.actions;
  }

  overlay.classList.add("open");
}

(window as unknown as Record<string, unknown>).openModal = openModal;

function closeModal(e?: MouseEvent): void {
  if (e && e.target !== e.currentTarget) return;
  const overlay = document.getElementById("modalOverlay") as HTMLElement | null;
  if (overlay) overlay.classList.remove("open");
}

(window as unknown as Record<string, unknown>).closeModal = closeModal;

// ─── Toast Notifications ───

function showToast(type: string): void {
  const container = document.getElementById("toastContainer") as HTMLElement | null;
  if (!container) return;

  const config = TOAST_PRESETS[type];
  if (!config) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span class="toast-icon">${config.icon}</span><span>${config.text}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

(window as unknown as Record<string, unknown>).showToast = showToast;

// ─── Keyboard ───

document.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    const overlay = document.getElementById("modalOverlay") as HTMLElement | null;
    if (overlay) overlay.classList.remove("open");
  }
});