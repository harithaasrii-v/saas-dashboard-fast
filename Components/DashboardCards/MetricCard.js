import {
  FASTElement,
  Observable,
  css,
  html,
  when,
} from "@microsoft/fast-element";

const template = html`
  <article class="metric-card">
    <div class="card-header">
      <p class="title">${(x) => x.metric?.title ?? x.cardTitle}</p>
      ${when(
        (x) => x.metric?.status ?? x.status,
        html`
          <span class="status ${(x) => x.metric?.status ?? x.status}">
            ${(x) => x.metric?.status ?? x.status}
          </span>
        `,
      )}
    </div>
    <strong class="value">${(x) => x.metric?.value ?? x.value}</strong>
    <p class="trend">${(x) => x.metric?.trend ?? x.trend}</p>
  </article>
`;

const styles = css`
  :host {
    display: block;
    min-width: 0;
    color: var(--shell-ink);
  }
  .metric-card {
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    min-height: 0;
    padding: clamp(0.85rem, 2vw, 1.1rem);
    border: 1px solid var(--shell-border);
    border-radius: 10px;
    background: var(--shell-surface);
    box-shadow: 0 8px 22px rgba(20, 42, 50, 0.06);
  }
  .card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
  }
  .title,
  .trend {
    margin: 0;
    color: var(--shell-muted);
  }
  .title {
    font-size: clamp(0.65rem, 1.2vw, 0.72rem);
    font-weight: 800;
    letter-spacing: 0.08em;
    line-height: 1.25;
    text-transform: uppercase;
  }
  .value {
    margin: clamp(0.9rem, 2vw, 1.25rem) 0 0.5rem;
    font-size: clamp(1.6rem, 3vw, 2rem);
    font-weight: 800;
    letter-spacing: 0;
    line-height: 1.1;
  }
  .trend {
    font-size: clamp(0.68rem, 1.2vw, 0.75rem);
    line-height: 1.35;
  }
  .status {
    border-radius: 999px;
    padding: 0.3rem 0.5rem;
    background: #e3f5eb;
    color: #176b42;
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .status.warning {
    background: #fff1d2;
    color: #805800;
  }
  .status.critical {
    background: #fbe7e7;
    color: #9b2d31;
  }
`;

class MetricCard extends FASTElement {
  constructor() {
    super();
    this.cardTitle = "Metric";
    this.value = "—";
    this.trend = "—";
    this.status = "unknown";
    this.metric = null;
  }

  set data(metric) {
    this.metric = metric && typeof metric === "object" ? metric : {};
  }

  get data() {
    return this.metric || {};
  }
}

Observable.defineProperty(MetricCard.prototype, "metric");

MetricCard.define({
  name: "metric-card",
  template,
  styles,
  attributes: [
    { attribute: "card-title", property: "cardTitle" },
    "value",
    "trend",
    "status",
    "theme",
  ],
});
