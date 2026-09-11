import { FASTElement, Observable, css, html } from "@microsoft/fast-element";

const template = html`
  <div class="app-shell">
    <aside class="sidebar">
      <p class="brand">Operations<br />Dashboard</p>
      <nav aria-label="Primary navigation">
        <a
          href="#home"
          aria-current="${(x) =>
            x.currentSection === "home" ? "page" : "false"}"
          >Home</a
        >
        <a
          href="#alerts"
          aria-current="${(x) =>
            x.currentSection === "alerts" ? "page" : "false"}"
          >Alerts</a
        >
        <a
          href="#activity"
          aria-current="${(x) =>
            x.currentSection === "activity" ? "page" : "false"}"
          >Activity</a
        >
      </nav>
    </aside>
    <main>
      <header>
        <h1>${(x) => x.sectionHeadings[x.currentSection]}</h1>
        <button
          class="theme-toggle"
          type="button"
          aria-pressed="${(x) => x.theme === "dark"}"
          @click="${(x) => x.toggleTheme()}"
        >
          ${(x) => (x.theme === "dark" ? "LIGHT MODE" : "DARK MODE")}
        </button>
      </header>
      <div class="content"><slot></slot></div>
    </main>
  </div>
`;

const styles = css`
  :host {
    font-family: system-ui, sans-serif;
    --shell-ink: #18303a;
    --shell-surface: #fff;
    --shell-border: #d9e2e8;
    --shell-background: #f3f6f7;
    --shell-accent: #153b4a;
    --shell-muted: #63747d;
    display: block;
    min-height: 100vh;
    color: var(--shell-ink);
    background: var(--shell-background);
  }

  :host([theme="dark"]) {
    --shell-ink: #edf5f6;
    --shell-surface: #1c2b31;
    --shell-border: #38505a;
    --shell-background: #102026;
    --shell-accent: #08171c;
    --shell-muted: #aec1c8;
  }

  .app-shell {
    display: grid;
    grid-template-columns: 240px 1fr;
    min-height: 100vh;
  }
  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 1.5rem;
    background: var(--shell-accent);
    color: #fff;
  }
  .brand {
    margin: 0;
    font-size: 1rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  nav {
    display: grid;
    gap: 6px;
  }
  nav a {
    color: #9eabb6;
    border-radius: 4px;
    padding: 12px 10px;
    text-decoration: none;
    font-size: 16px;
    font-family: inherit;
  }
  nav a:hover,
  nav a[aria-current="page"] {
    color: #fff;
    background: #365f70;
  }
  main {
    min-width: 0;
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 25px;
    border-bottom: 1px solid var(--shell-border);
    background: var(--shell-surface);
  }
  h1 {
    margin: 0;
    color: var(--shell-ink);
    font-size: 28px;
    font-weight: 800;
    line-height: 1.05;
    font-family: inherit;
  }
  .theme-toggle {
    border: 1px solid var(--shell-border);
    border-radius: 5px;
    padding: 7px 11px;
    background: var(--shell-surface);
    color: var(--shell-ink);
    cursor: pointer;
    font-size: 10px;
    font-weight: 800;
    font-family: inherit;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .theme-toggle:focus-visible,
  nav a:focus-visible {
    outline: 3px solid #4ca7b8;
    outline-offset: 2px;
  }
  .content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 25px;
  }
  ::slotted([data-section-view]) {
    display: none;
  }
  ::slotted([data-section-view][data-active="true"]) {
    display: block;
  }
  @media (max-width: 820px) {
    .app-shell {
      grid-template-columns: 1fr;
    }
    aside {
      padding: 16px;
    }
    .brand {
      margin-bottom: 14px;
    }
    nav {
      grid-template-columns: repeat(3, 1fr);
    }
    nav a {
      padding: 9px 4px;
      text-align: center;
      font-size: 12px;
    }
    header,
    .content {
      padding: 22px 18px;
    }
  }
`;

class AppShell extends FASTElement {
  constructor() {
    super();
    this.theme = "light";
    this.currentSection = "home";
    this.sectionHeadings = {
      home: "System overview",
      alerts: "Alerts",
      activity: "Activity",
    };
    this.onHashChange = () => this.setSection(window.location.hash.slice(1));
  }

  propagateTheme() {
    this.querySelectorAll(
      "service-status, alert-list, app-modal, metric-card, activity-table, toast-container, alert-item, toast-message",
    ).forEach((component) => component.setAttribute("theme", this.theme));
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("hashchange", this.onHashChange);
    const saved = localStorage.getItem("theme");
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    this.theme = saved || preferred;
    this.propagateTheme();
    this.setSection(window.location.hash.slice(1) || "home");
  }

  disconnectedCallback() {
    window.removeEventListener("hashchange", this.onHashChange);
    super.disconnectedCallback();
  }

  setSection(section) {
    const activeSection = Object.hasOwn(this.sectionHeadings, section)
      ? section
      : "home";
    this.currentSection = activeSection;
    this.querySelectorAll("[data-section-view]").forEach((view) => {
      const active = view.dataset.sectionView === activeSection;
      view.dataset.active = String(active);
    });
  }

  toggleTheme() {
    this.theme = this.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", this.theme);
    this.propagateTheme();
    this.$emit(
      "theme-changed",
      { theme: this.theme },
      { bubbles: true, composed: true },
    );
    this.$emit(
      "show-toast",
      {
        title: "Theme updated",
        message: `${this.theme === "dark" ? "Dark" : "Light"} mode is now active.`,
        type: "info",
      },
      { bubbles: true, composed: true },
    );
  }
}

Observable.defineProperty(AppShell.prototype, "currentSection");
AppShell.define({
  name: "app-shell",
  template,
  styles,
  attributes: ["theme"],
});
