import {
  FASTElement,
  Observable,
  css,
  html,
  repeat,
  when,
} from "@microsoft/fast-element";

const serviceCardTemplate = html`
  <div
    class="${(x) => `service-card ${x.status}`}"
    data-service-id="${(x) => x.id}"
    tabindex="0"
    @click="${(x, c) => c.parent.onServiceSelect(x)}"
    @keydown="${(x, c) => c.parent.onServiceSelectKey(c.event, x)}"
  >
    <div class="service-header">
      <h3 class="service-name">${(x) => x.name}</h3>
      <div class="service-status">
        <span class="status-indicator"></span>
        <span class="status-label">${(x) => x.status}</span>
      </div>
    </div>
    <div class="service-meta">
      <div class="meta-item">
        <span class="service-value">${(x) => x.uptime}%</span>
        <span class="service-label">Uptime</span>
      </div>
      <div class="meta-item">
        <span class="service-value">${(x) => x.responseTimeMs} ms</span>
        <span class="service-label">Response time</span>
      </div>
      <div class="meta-item meta-full">
        <span class="service-label">Last incident</span>
        <span class="service-value incident-value"
          >${(x) => x.formattedLastIncident}</span
        >
      </div>
    </div>
  </div>
`;

const template = html`
  ${when(
    (x) => x.visibleServices.length > 0,
    html`
      <div class="service-list">
        ${repeat((x) => x.visibleServices, serviceCardTemplate)}
      </div>
    `,
    html`<div class="empty-state">No services to display.</div>`,
  )}
`;

const styles = css`
  :host {
    display: block;
  }
  .service-list {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
  }
  .service-card {
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 1.2rem;
    min-height: 170px;
    padding: 1.25rem;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 10px;
    color: #fff;
    cursor: pointer;
    text-align: left;
    box-shadow: 0 10px 24px rgba(20, 42, 50, 0.14);
    transition:
      transform 160ms ease,
      box-shadow 160ms ease;
  }
  .service-card:hover,
  .service-card:focus-visible {
    transform: translateY(-2px);
    box-shadow: 0 14px 28px rgba(20, 42, 50, 0.2);
    outline: 3px solid rgba(255, 255, 255, 0.7);
    outline-offset: 2px;
  }
  .service-card.operational {
    background: linear-gradient(
      135deg,
      rgba(25, 126, 83, 0.94),
      rgba(15, 84, 62, 0.94)
    );
  }
  .service-card.degraded {
    background: linear-gradient(
      135deg,
      rgba(172, 126, 22, 0.96),
      rgba(125, 81, 10, 0.96)
    );
  }
  .service-card.down {
    background: linear-gradient(
      135deg,
      rgba(180, 54, 54, 0.96),
      rgba(117, 28, 32, 0.96)
    );
  }
  .service-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
  }
  .service-name {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 700;
    line-height: 1.3;
  }
  .service-status {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    white-space: nowrap;
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    opacity: 0.92;
  }
  .status-indicator {
    width: 0.65rem;
    height: 0.65rem;
    border: 2px solid rgba(255, 255, 255, 0.85);
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
  }
  .service-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem 1rem;
    align-items: end;
  }
  .meta-full {
    grid-column: 1 / -1;
  }
  .meta-item {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }
  .service-label {
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.7);
  }
  .service-value {
    font-size: 1.35rem;
    font-weight: 800;
    line-height: 1.1;
  }
  .incident-value {
    font-size: 1.05rem;
  }
  .empty-state {
    padding: 2rem;
    border: 1px dashed var(--shell-border);
    border-radius: 8px;
    color: var(--shell-muted);
    text-align: center;
  }

  @media (max-width: 1000px) {
    .service-list {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 520px) {
    .service-list {
      grid-template-columns: 1fr;
    }
  }
`;

class ServiceStatus extends FASTElement {
  services = [];
  visibleServices = [];

  connectedCallback() {
    super.connectedCallback();
  }

  statusChanged(oldValue, newValue) {
    if (oldValue !== newValue) this.applyFilter();
  }

  set data(services) {
    this.services = Array.isArray(services) ? services : [];
    this.applyFilter();
  }

  get data() {
    return this.services;
  }

  applyFilter() {
    const statusFilter = this.status;
    const filtered = statusFilter
      ? this.services.filter((service) => service.status === statusFilter)
      : this.services;
    this.visibleServices = filtered.map((service) => ({
      ...service,
      formattedLastIncident: this.formatDate(service.lastIncident),
    }));
  }

  onServiceSelect(service) {
    this.$emit("service-selected", service);
  }

  onServiceSelectKey(event, service) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    this.onServiceSelect(service);
  }

  formatDate(timestamp) {
    const date = new Date(timestamp);
    return Number.isNaN(date.getTime()) ? timestamp : date.toLocaleDateString();
  }
}

["services", "visibleServices"].forEach((property) =>
  Observable.defineProperty(ServiceStatus.prototype, property),
);

ServiceStatus.define({
  name: "service-status",
  template,
  styles,
  attributes: ["theme", "status"],
});
