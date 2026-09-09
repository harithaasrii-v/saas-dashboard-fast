import { FASTElement, css, html } from "@microsoft/fast-element";

const template = html`
  <article
    class="alert-card ${(x) => x.severity}"
    role="button"
    tabindex="0"
    aria-label="${(x) => `${x.severity} alert: ${x.alertTitle}`}"
    @click="${(x, c) => x.onSelect(c.event)}"
    @keydown="${(x, c) => x.onSelect(c.event)}"
  >
    <div class="alert-header">
      <span class="badge ${(x) => x.severity}"
        >${(x) => x.severity?.toUpperCase()}</span
      >
      <span class="alert-id">${(x) => x.alertId}</span>
    </div>
    <h2 class="title">${(x) => x.alertTitle}</h2>
    <p class="message">${(x) => x.message}</p>
    <div class="alert-meta">
      <span class="service">${(x) => x.service?.toUpperCase()}</span>
      <span class="status">${(x) => x.status?.toUpperCase()}</span>
      <time class="timestamp" datetime="${(x) => x.timestamp}">
        ${(x) => x.formatTimestamp(x.timestamp)}
      </time>
    </div>
  </article>
`;

const styles = css`
  :host {
    display: block;
  }
  .alert-card {
    display: grid;
    gap: 0.65rem;
    padding: 1.15rem 1.25rem;
    border: 1px solid var(--shell-border);
    border-left: 4px solid #6b7c85;
    border-radius: 8px;
    background: var(--shell-surface);
    box-shadow: 0 4px 14px rgba(21, 59, 74, 0.06);
    color: var(--shell-ink);
    font-family: inherit;
  }
  .alert-card.critical {
    border-left-color: #c64242;
  }
  .alert-card.warning {
    border-left-color: #c58a25;
  }
  .alert-card.info {
    border-left-color: #347b9d;
  }
  .alert-header,
  .alert-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  .badge,
  .status {
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .badge {
    color: #53636d;
  }
  .badge.critical {
    color: #b33131;
  }
  .badge.warning {
    color: #996819;
  }
  .badge.info {
    color: #276783;
  }
  .alert-id,
  .timestamp {
    color: #71818a;
    font-size: 0.78rem;
  }
  .title {
    margin: 0;
    font-size: 1rem;
  }
  .message {
    margin: 0;
    color: var(--shell-muted);
    line-height: 1.5;
  }
  .service {
    color: var(--shell-ink);
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
  }
  .status {
    color: var(--shell-muted);
  }

  @media (max-width: 520px) {
    .alert-header,
    .alert-meta {
      align-items: flex-start;
      flex-direction: column;
      gap: 0.35rem;
    }
  }
`;

class AlertItem extends FASTElement {
  onSelect(event) {
    if (event.type === "keydown" && event.key !== "Enter" && event.key !== " ")
      return;
    if (event.type === "keydown") event.preventDefault();
    this.$emit("alert-selected", this.alert, { bubbles: true, composed: true });
  }

  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return timestamp;
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const hours = date.getUTCHours();
    return `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}, ${hours % 12 || 12}:${String(date.getUTCMinutes()).padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
  }

  get alert() {
    return {
      id: this.alertId,
      severity: this.severity || "info",
      message: this.message || "",
      timestamp: this.timestamp || "",
      service: this.service || "",
      title: this.alertTitle || "",
      status: this.status || "unknown",
    };
  }
}

AlertItem.define({
  name: "alert-item",
  template,
  styles,
  attributes: [
    { attribute: "alert-id", property: "alertId" },
    "severity",
    "message",
    "timestamp",
    "service",
    { attribute: "alert-title", property: "alertTitle" },
    "status",
    "theme",
  ],
});
