import {
  FASTElement,
  Observable,
  css,
  html,
  repeat,
  when,
} from "@microsoft/fast-element";

const rowTemplate = html`
  <tr
    class="${(x) => (x.selected ? "selected" : "")}"
    data-activity-id="${(x) => x.id}"
    tabindex="0"
    @click="${(x, c) => c.parent.onRowSelect(c.event)}"
    @keydown="${(x, c) => c.parent.onRowSelect(c.event)}"
  >
    <td class="timestamp">
      <time datetime="${(x) => x.timestamp}"
        >${(x) => x.formattedTimestamp}</time
      >
    </td>
    <td class="user">${(x) => x.user}</td>
    <td class="action">${(x) => x.action}</td>
    <td class="resource">${(x) => x.resource}</td>
    <td>
      <span class="${(x) => `status${x.status === "failed" ? " failed" : ""}`}">
        ${(x) => x.status}
      </span>
    </td>
    <td>${(x) => x.ipAddress}</td>
  </tr>
`;

const pageButtonTemplate = html`
  <button
    type="button"
    class="page-button"
    data-page="${(x) => x}"
    aria-label="${(x) => `Go to activity page ${x}`}"
    aria-current="${(x, c) => (x === c.parent.currentPage ? "page" : null)}"
    @click="${(x, c) => c.parent.onPageChange(c.event)}"
  >
    ${(x) => x}
  </button>
`;

const template = html`
  <section class="activity-panel" aria-labelledby="activity-title">
    <header class="table-header">
      <div>
        <h2 id="activity-title">Recent activity</h2>
      </div>
      <label class="filter-label">
        Filter activity
        <input
          class="filter-input"
          type="search"
          placeholder="Search events"
          value="${(x) => x.filterText}"
          @input="${(x, c) => x.onFilterInput(c.event)}"
        />
      </label>
    </header>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th
              aria-sort="${(x) =>
                x.sortKey === "timestamp" ? x.sortDirection : "none"}"
            >
              <button
                class="sort-button"
                data-sort="timestamp"
                data-sort-direction="${(x) =>
                  x.sortKey === "timestamp" ? x.sortDirection : "none"}"
                @click="${(x, c) => x.onSort(c.event)}"
              >
                Time
              </button>
            </th>
            <th
              aria-sort="${(x) =>
                x.sortKey === "user" ? x.sortDirection : "none"}"
            >
              <button
                class="sort-button"
                data-sort="user"
                data-sort-direction="${(x) =>
                  x.sortKey === "user" ? x.sortDirection : "none"}"
                @click="${(x, c) => x.onSort(c.event)}"
              >
                Actor
              </button>
            </th>
            <th
              aria-sort="${(x) =>
                x.sortKey === "action" ? x.sortDirection : "none"}"
            >
              <button
                class="sort-button"
                data-sort="action"
                data-sort-direction="${(x) =>
                  x.sortKey === "action" ? x.sortDirection : "none"}"
                @click="${(x, c) => x.onSort(c.event)}"
              >
                Action
              </button>
            </th>
            <th
              aria-sort="${(x) =>
                x.sortKey === "resource" ? x.sortDirection : "none"}"
            >
              <button
                class="sort-button"
                data-sort="resource"
                data-sort-direction="${(x) =>
                  x.sortKey === "resource" ? x.sortDirection : "none"}"
                @click="${(x, c) => x.onSort(c.event)}"
              >
                Resource
              </button>
            </th>
            <th>Status</th>
            <th>IP address</th>
          </tr>
        </thead>
        <tbody>
          ${when(
            (x) => x.pageActivities.length === 0,
            html`
              <tr>
                <td class="empty-state" colspan="6">
                  No activity matches this filter.
                </td>
              </tr>
            `,
          )}
          ${repeat((x) => x.pageActivities, rowTemplate)}
        </tbody>
      </table>
    </div>
    <footer class="table-footer">
      <p class="result-count">
        ${(x) =>
          `${x.visibleCount} ${x.visibleCount === 1 ? "event" : "events"}`}
      </p>
      ${when(
        (x) => x.pages.length > 1,
        html`
          <nav class="pagination" aria-label="Activity pages">
            ${repeat((x) => x.pages, pageButtonTemplate)}
          </nav>
        `,
      )}
    </footer>
  </section>
`;

const styles = css`
  :host {
    display: block;
    margin-top: 2rem;
    color: var(--shell-ink);
  }
  .activity-panel {
    overflow: hidden;
    border: 1px solid var(--shell-border);
    border-radius: 10px;
    background: var(--shell-surface);
  }
  .table-header,
  .table-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
  }
  .table-header {
    border-bottom: 1px solid var(--shell-border);
  }
  h2 {
    margin: 0;
    font-size: 1.2rem;
  }
  .filter-label {
    display: grid;
    gap: 0.35rem;
    color: var(--shell-muted);
    font-size: 0.7rem;
    font-weight: 700;
    font-family: inherit;
  }
  .filter-input {
    width: min(32vw, 280px);
    box-sizing: border-box;
    border: 1px solid var(--shell-border);
    border-radius: 6px;
    padding: 0.65rem 0.75rem;
    background: var(--activity-input, var(--shell-surface));
    color: inherit;
    font: inherit;
  }
  .filter-input:focus-visible,
  .sort-button:focus-visible,
  tr:focus-visible,
  .page-button:focus-visible {
    outline: 3px solid #4ca7b8;
    outline-offset: 2px;
  }
  .table-wrap {
    overflow-x: auto;
  }
  table {
    width: 100%;
    min-width: 760px;
    border-collapse: collapse;
    text-align: left;
  }
  th {
    padding: 0.75rem 1.5rem;
    background: var(--activity-header, var(--shell-background));
    color: var(--shell-muted);
    font-size: 0.68rem;
    font-weight: 800;
    font-family: inherit;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }
  td {
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--shell-border);
    font-size: 0.86rem;
    font-family: inherit;
  }
  tbody tr {
    cursor: pointer;
    transition: background 140ms ease;
  }
  tbody tr:hover,
  tbody tr.selected {
    background: var(--activity-hover, #edf5f6);
  }
  .timestamp,
  .resource {
    color: var(--shell-muted);
  }
  .timestamp {
    white-space: nowrap;
  }
  .user {
    font-weight: 700;
    white-space: nowrap;
  }
  .action {
    min-width: 170px;
  }
  .status {
    display: inline-block;
    border-radius: 999px;
    padding: 0.35rem 0.55rem;
    background: #e3f5eb;
    color: #176b42;
    font-size: 0.65rem;
    font-weight: 800;
    font-family: inherit;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .status.failed {
    background: #fbe7e7;
    color: #9b2d31;
  }
  .sort-button,
  .page-button {
    border: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font: inherit;
  }
  .sort-button {
    padding: 0;
    font-weight: 800;
    letter-spacing: inherit;
    text-transform: inherit;
  }
  .sort-button::after {
    content: " ↕";
    opacity: 0.45;
  }
  .sort-button[data-sort-direction="ascending"]::after {
    content: " ↑";
    opacity: 1;
  }
  .sort-button[data-sort-direction="descending"]::after {
    content: " ↓";
    opacity: 1;
  }
  .result-count {
    margin: 0;
    color: var(--shell-muted);
    font-size: 0.78rem;
    font-family: inherit;
  }
  .pagination {
    display: flex;
    gap: 0.35rem;
  }
  .page-button {
    min-width: 2rem;
    min-height: 2rem;
    border: 1px solid var(--shell-border);
    border-radius: 5px;
    background: var(--shell-surface);
    color: inherit;
    font-size: 0.78rem;
  }
  .page-button[aria-current="page"] {
    border-color: var(--shell-accent);
    background: var(--shell-accent);
    color: #fff;
  }
  .empty-state {
    padding: 2rem;
    color: var(--shell-muted);
    text-align: center;
  }
  :host([theme="dark"]) {
    --activity-header: #16272d;
    --activity-input: #102026;
    --activity-hover: #263d45;
  }
  @media (max-width: 700px) {
    .table-header,
    .table-footer {
      align-items: flex-start;
      flex-direction: column;
      padding: 1rem;
    }
    .filter-input {
      width: min(100%, 340px);
    }
    th,
    td {
      padding-right: 1rem;
      padding-left: 1rem;
    }
    .pagination {
      align-self: stretch;
      justify-content: center;
    }
  }
`;

class ActivityTable extends FASTElement {
  activities = [];
  pageActivities = [];
  pages = [];
  filterText = "";
  currentPage = 1;
  selectedActivity = null;
  visibleCount = 0;
  hasExternalData = false;
  visibleActivities = [];
  sortKey = "timestamp";
  sortDirection = "descending";

  connectedCallback() {
    super.connectedCallback();
    if (this.hasExternalData) {
      this.refresh();
    } else {
      this.loadActivities();
    }
  }

  pageSizeAttributeChanged(oldValue, newValue) {
    if (oldValue !== newValue && this.activities.length) {
      this.currentPage = 1;
      this.refresh();
    }
  }

  set data(activities) {
    this.hasExternalData = true;
    this.activities = Array.isArray(activities) ? activities : [];
    this.currentPage = 1;
    this.refresh();
  }

  get data() {
    return this.activities;
  }

  get pageSize() {
    const value = Number.parseInt(this.pageSizeAttribute, 10);
    return Number.isInteger(value) && value > 0 ? value : 5;
  }

  async loadActivities() {
    try {
      const response = await fetch("/Data/activity.json");
      if (!response.ok)
        throw new Error(`Unable to load activity (${response.status})`);
      this.data = await response.json();
    } catch (error) {
      this.activities = [];
      this.refresh();
      console.error(error);
    }
  }

  onFilterInput(event) {
    this.filterText = event.target.value.trim().toLowerCase();
    this.currentPage = 1;
    this.refresh();
  }

  onSort(event) {
    const sortKey = event.currentTarget.dataset.sort;
    if (this.sortKey === sortKey) {
      this.sortDirection =
        this.sortDirection === "ascending" ? "descending" : "ascending";
    } else {
      this.sortKey = sortKey;
      this.sortDirection = "ascending";
    }
    this.currentPage = 1;
    this.refresh();
  }

  onPageChange(event) {
    this.currentPage = Number(event.currentTarget.dataset.page);
    this.refresh();
  }

  onRowSelect(event) {
    if (event.type === "keydown" && event.key !== "Enter" && event.key !== " ")
      return;
    if (event.type === "keydown") event.preventDefault();

    const activity = this.activities.find(
      (item) => String(item.id) === event.currentTarget.dataset.activityId,
    );
    if (!activity) return;

    this.selectedActivity = activity;
    this.refresh();
    this.$emit("activity-selected", activity);
  }

  refresh() {
    this.visibleActivities = this.getVisibleActivities();

    const pageCount = Math.max(
      1,
      Math.ceil(this.visibleActivities.length / this.pageSize),
    );
    this.currentPage = Math.min(this.currentPage, pageCount);

    const start = (this.currentPage - 1) * this.pageSize;

    this.pageActivities = this.visibleActivities
      .slice(start, start + this.pageSize)
      .map((activity) => ({
        ...activity,
        formattedTimestamp: this.formatDate(activity.timestamp),
        selected: this.selectedActivity?.id === activity.id,
      }));

    this.pages = Array.from({ length: pageCount }, (_, index) => index + 1);
    this.visibleCount = this.visibleActivities.length;
  }

  getVisibleActivities() {
    const filtered = this.activities.filter(
      (activity) =>
        !this.filterText ||
        Object.values(activity).some((value) =>
          String(value).toLowerCase().includes(this.filterText),
        ),
    );

    return filtered.sort((left, right) => {
      const leftValue =
        this.sortKey === "timestamp"
          ? Date.parse(left[this.sortKey])
          : String(left[this.sortKey]).toLowerCase();
      const rightValue =
        this.sortKey === "timestamp"
          ? Date.parse(right[this.sortKey])
          : String(right[this.sortKey]).toLowerCase();

      const comparison =
        leftValue < rightValue ? -1 : leftValue > rightValue ? 1 : 0;
      return this.sortDirection === "ascending" ? comparison : -comparison;
    });
  }

  formatDate(timestamp) {
    const date = new Date(timestamp);
    return Number.isNaN(date.getTime())
      ? timestamp
      : date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
  }
}

[
  "activities",
  "pageActivities",
  "pages",
  "filterText",
  "currentPage",
  "selectedActivity",
  "visibleCount",
  "pageSizeAttribute",
  "visibleActivities",
  "sortKey",
  "sortDirection",
].forEach((property) =>
  Observable.defineProperty(ActivityTable.prototype, property),
);

ActivityTable.define({
  name: "activity-table",
  template,
  styles,
  attributes: [
    "theme",
    { attribute: "page-size", property: "pageSizeAttribute" },
  ],
});
