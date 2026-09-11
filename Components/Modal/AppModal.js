import {
  FASTElement,
  Observable,
  css,
  html,
  ref,
} from "@microsoft/fast-element";

const template = html`
  <dialog
    class="dialog"
    aria-labelledby="modal-title"
    ${ref("dialog")}
    @close="${(x) => x.onNativeClose()}"
    @click="${(x, c) => c.event.target === x.dialog && x.dialog.close()}"
  >
    <div class="modal-header">
      <h2 id="modal-title" class="modal-title">${(x) => x.serviceTitle}</h2>
      <button
        class="close-button"
        type="button"
        aria-label="Close modal"
        @click="${(x) => x.close()}"
      >
        ✕
      </button>
    </div>
    <div class="modal-body">
      <div class="service-details">
        <p><span>Status:</span> ${(x) => x.serviceData?.status}</p>
        <p><span>Uptime:</span> ${(x) => x.serviceData?.uptime}%</p>
        <p>
          <span>Response time:</span> ${(x) => x.serviceData?.responseTimeMs} ms
        </p>
        <p><span>Last incident:</span> ${(x) => x.serviceData?.lastIncident}</p>
      </div>
      <p class="service-description">${(x) => x.serviceData?.description}</p>
    </div>
  </dialog>
`;

const styles = css`
  :host {
    display: contents;
  }
  .dialog {
    position: relative;
    width: min(100%, 480px);
    padding: 1.5rem;
    border: 1px solid var(--shell-border);
    border-radius: 10px;
    background: var(--shell-surface);
    color: var(--shell-ink);
    box-shadow: 0 20px 60px rgba(8, 23, 28, 0.3);
  }
  .dialog::backdrop {
    background: rgba(10, 25, 35, 0.68);
    cursor: pointer;
  }
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }
  .modal-title {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 700;
  }
  .close-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    flex-shrink: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--shell-muted);
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 140ms ease;
  }
  .close-button:hover {
    background: var(--modal-hover, #f0f5f7);
  }
  .close-button:focus-visible {
    outline: 3px solid #4ca7b8;
    outline-offset: 2px;
  }
  .modal-body {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    overflow-y: auto;
    max-height: 60vh;
  }
  .service-details {
    display: grid;
    gap: 0.32rem;
  }
  .service-details p {
    margin: 0;
    color: var(--shell-muted);
    font-size: 0.82rem;
    line-height: 1.25;
  }
  .service-details span {
    font-weight: 500;
  }
  .service-description {
    margin: 0;
    color: var(--shell-muted);
    font-size: 0.82rem;
    line-height: 1.5;
  }
  :host([theme="dark"]) {
    --modal-hover: #263d45;
  }
  @media (max-width: 520px) {
    .dialog {
      padding: 1rem;
    }
    .service-details {
      grid-template-columns: 1fr;
    }
  }
`;

class AppModal extends FASTElement {
  isOpen = false;
  serviceTitle = "Service Details";
  serviceData = null;

  onServiceSelected = (event) => {
    const service = event.detail;
    if (!service) return;
    this.serviceTitle = service.name;
    this.serviceData = service;
    this.show();
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("service-selected", this.onServiceSelected);
  }

  disconnectedCallback() {
    window.removeEventListener("service-selected", this.onServiceSelected);
    super.disconnectedCallback();
  }

  show() {
    this.isOpen = true;
    this.dialog.showModal();
    this.dialog.querySelector(".close-button")?.focus();
  }

  onNativeClose() {
    this.isOpen = false;
    this.$emit("modal-closed");
  }

  close() {
    this.dialog?.close();
  }
}

["isOpen", "serviceTitle", "serviceData"].forEach((property) =>
  Observable.defineProperty(AppModal.prototype, property),
);

AppModal.define({
  name: "app-modal",
  template,
  styles,
  attributes: ["theme"],
});
