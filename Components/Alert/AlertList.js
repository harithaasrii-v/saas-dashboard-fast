import {
  FASTElement,
  Observable,
  css,
  html,
  repeat,
  when,
} from "@microsoft/fast-element";
import "./AlertItem.js";

const filterTemplate = html`
  <button
    class="filter-btn"
    type="button"
    data-filter="${(x) => x.value}"
    aria-pressed="${(x, c) => x.value === c.parent.filter}"
    @click="${(x, c) => c.parent.onFilterClick(c.event)}"
  >
    ${(x) => x.label}
  </button>
`;

const alertTemplate = html`
  <alert-item
    alert-id="${(x) => x.id}"
    severity="${(x) => x.severity}"
    message="${(x) => x.message}"
    timestamp="${(x) => x.timestamp}"
    service="${(x) => x.service}"
    alert-title="${(x) => x.title}"
    status="${(x) => x.status}"
  ></alert-item>
`;

const template = html`
  <div class="alert-list-wrapper">
    <div class="filter-bar" role="group" aria-label="Filter alerts">
      ${repeat((x) => x.filters, filterTemplate)}
    </div>
    <div class="list-container" aria-live="polite">
      ${repeat((x) => x.visibleAlerts, alertTemplate, { recycle: false })}
      ${when(
        (x) => x.visibleAlerts.length === 0,
        html`<div class="empty-state">No alerts match this filter.</div>`,
      )}
    </div>
  </div>
`;

const styles = css`
  :host {
    display: block;
    max-width: 920px;
    margin: 0 auto;
    color: var(--shell-ink);
    font-size: 14px;
    font-family: inherit;
  }
  .alert-list-wrapper {
    display: grid;
    gap: 1.25rem;
  }
  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding-bottom: 0.25rem;
    border-bottom: 1px solid var(--shell-border);
  }
  .filter-btn {
    border: 1px solid var(--shell-border);
    border-radius: 999px;
    padding: 0.55rem 0.9rem;
    background: var(--shell-surface);
    color: var(--shell-muted);
    cursor: pointer;
    font-size: 0.72rem;
    font-weight: 700;
    line-height: 1;
    font-family: inherit;
    letter-spacing: 0.06em;
  }
  .filter-btn:hover,
  .filter-btn[aria-pressed="true"] {
    border-color: var(--shell-accent);
    background: var(--shell-accent);
    color: #fff;
  }
  .filter-btn:focus-visible {
    outline: 3px solid #4ca7b8;
    outline-offset: 2px;
  }
  .list-container {
    display: grid;
    gap: 10px;
  }
  .empty-state {
    padding: 2rem;
    border: 1px dashed var(--shell-border);
    text-align: center;
  }
  :host([theme="dark"]) {
    --alert-accent: #245363;
  }
`;

class AlertList extends FASTElement {
  constructor() {
    super();
    this.alerts = [];
    this.visibleAlerts = [];
    this.filter = "all";
    this.filters = [
      { label: "ALL", value: "all" },
      { label: "INFO", value: "info" },
      { label: "WARNING", value: "warning" },
      { label: "CRITICAL", value: "critical" },
    ];
  }

  connectedCallback() {
    super.connectedCallback();
  }

  filterChanged(oldValue, newValue) {
    if (oldValue !== newValue) this.applyFilter();
  }

  set data(alerts) {
    this.alerts = Array.isArray(alerts) ? alerts : [];
    this.applyFilter();
  }

  get data() {
    return this.alerts;
  }

  onFilterClick(event) {
    this.filter = event.currentTarget.dataset.filter;
    this.applyFilter();
  }

  applyFilter() {
    this.visibleAlerts =
      this.filter === "all"
        ? this.alerts
        : this.alerts.filter((alert) => alert.severity === this.filter);
  }
}

["alerts", "visibleAlerts"].forEach((property) =>
  Observable.defineProperty(AlertList.prototype, property),
);

AlertList.define({
  name: "alert-list",
  template,
  styles,
  attributes: ["filter", "theme"],
});
