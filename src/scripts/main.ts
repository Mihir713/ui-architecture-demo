// ═══════════════════════════════════════════════════════════════
//  UI Architecture Demo — Runtime (TypeScript)
//  Theme switching, tabs, modals, toggles.
//  Compiled via Vite → deployed as vanilla JS.
// ═══════════════════════════════════════════════════════════════

/** Available theme identifiers */
type ThemeName = "corporate" | "midnight" | "sunset";

function init(): void {
  // ─── Theme Switcher ───
  document.querySelectorAll<HTMLElement>("[data-theme-btn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-theme-btn]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.documentElement.setAttribute("data-theme", btn.dataset.themeBtn ?? "corporate");
    });
  });

  // ─── Sidebar Navigation ───
  document.querySelectorAll<HTMLAnchorElement>(".sidebar-link").forEach((link) => {
    link.addEventListener("click", () => {
      document.querySelectorAll(".sidebar-link").forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // ─── Tabs ───
  document.querySelectorAll<HTMLElement>("[data-tabs]").forEach((tabs) => {
    const panels: Record<string, HTMLElement> = {};
    (tabs.closest(".component-card")?.querySelectorAll<HTMLElement>("[data-tab-panel]") ?? []).forEach((p) => {
      panels[p.dataset.tabPanel ?? ""] = p;
    });
    tabs.querySelectorAll<HTMLElement>(".tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const target = tab.dataset.tab ?? "";
        Object.entries(panels).forEach(([key, panel]) => {
          panel.style.display = key === target ? "block" : "none";
        });
      });
    });
  });

  // ─── Modals ───
  document.querySelectorAll<HTMLElement>("[data-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.modal;
      if (id) document.getElementById(id)?.classList.add("open");
    });
  });

  document.querySelectorAll<HTMLElement>("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest(".modal-overlay")?.classList.remove("open");
    });
  });

  document.querySelectorAll<HTMLElement>(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.remove("open");
    });
  });

  // ─── Toggle Switches ───
  document.querySelectorAll<HTMLElement>(".toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      toggle.querySelector(".toggle-track")?.classList.toggle("active");
    });
  });

  // ─── Escape key closes modals ───
  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      document.querySelectorAll<HTMLElement>(".modal-overlay.open").forEach((o) => o.classList.remove("open"));
    }
  });
}

document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", init)
  : init();