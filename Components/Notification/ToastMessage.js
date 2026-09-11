import { FASTElement, Observable, css, html } from "@microsoft/fast-element";

const template = html`
  <article class="toast ${(x) => x.type}" role="status">
    <div>
      <strong class="toast-title"
        >${(x) => x.toastTitle || "Notification"}</strong
      >
      <p class="toast-message">${(x) => x.message}</p>
    </div>
    <button
      class="close-button"
      type="button"
      aria-label="Close notification"
      @click="${(x) => x.close()}"
    >
      ✕
    </button>
  </article>
`;

const styles = css`
  :host {
    display: block;
    color: var(--shell-ink);
  }
  .toast {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    min-width: min(320px, calc(100vw - 2rem));
    max-width: 380px;
    padding: 1rem;
    border: 1px solid var(--shell-border);
    border-left: 4px solid #2f8f65;
    border-radius: 8px;
    background: var(--shell-surface);
    box-shadow: 0 12px 28px rgba(20, 42, 50, 0.16);
    animation: toast-in 220ms ease-out both;
    transition:
      opacity 180ms ease,
      transform 180ms ease;
    font-size: 14px;
    font-family: inherit;
  }
  .toast.closing {
    opacity: 0;
    transform: translateX(1rem);
  }
  @keyframes toast-in {
    from {
      opacity: 0;
      transform: translateX(1rem);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  .toast.warning {
    border-left-color: #bb851b;
  }
  .toast.error {
    border-left-color: #b83d43;
  }
  .toast.info {
    border-left-color: #347e9a;
  }
  .toast-title,
  .toast-message {
    display: block;
  }
  .toast-title {
    font-size: 0.82rem;
  }
  .toast-message {
    margin: 0.3rem 0 0;
    color: var(--shell-muted);
    font-size: 0.78rem;
    line-height: 1.4;
  }
  .close-button {
    flex: 0 0 auto;
    border: 0;
    background: transparent;
    color: var(--shell-muted);
    cursor: pointer;
    font-size: 1.25rem;
    line-height: 1;
  }
  .close-button:focus-visible {
    outline: 3px solid #4ca7b8;
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .toast {
      animation: none;
      transition: none;
    }
  }
`;

class ToastMessage extends FASTElement {
  constructor() {
    super();
    this.toastTitle = "Notification";
    this.message = "";
    this.type = "info";
    this.duration = 5000;
    this.timer = null;
    this.isClosing = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.startTimer();
  }

  disconnectedCallback() {
    clearTimeout(this.timer);
    super.disconnectedCallback();
  }

  set data(toast) {
    if (!toast || typeof toast !== "object") return;
    if (toast.title !== undefined) this.toastTitle = toast.title;
    if (toast.message !== undefined) this.message = toast.message;
    if (toast.type !== undefined) this.type = toast.type;
    if (toast.duration !== undefined) this.duration = toast.duration;
  }

  get data() {
    return {
      title: this.toastTitle || "Notification",
      message: this.message || "",
      type: this.type || "info",
      duration: Number(this.duration) || 5000,
    };
  }

  durationChanged() {
    this.startTimer();
  }

  startTimer() {
    clearTimeout(this.timer);
    if (this.isConnected && Number(this.duration) > 0) {
      this.timer = window.setTimeout(() => this.close(), Number(this.duration));
    }
  }

  close() {
    if (this.isClosing) return;
    this.isClosing = true;
    clearTimeout(this.timer);
    this.shadowRoot?.querySelector(".toast")?.classList.add("closing");
    this.$emit("toast-closed", this.data, { bubbles: true, composed: true });
    window.setTimeout(() => this.remove(), 180);
  }
}

ToastMessage.define({
  name: "toast-message",
  template,
  styles,
  attributes: [
    { attribute: "toast-title", property: "toastTitle" },
    "message",
    "type",
    "duration",
    "theme",
  ],
});
