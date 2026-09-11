import { FASTElement, Observable, css, html } from "@microsoft/fast-element";
import "./ToastMessage.js";

const template = html`
  <section
    class="toast-container"
    aria-label="Notifications"
    aria-live="polite"
  >
    <slot></slot>
  </section>
`;

const styles = css`
  :host {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1000;
    display: grid;
    gap: 0.75rem;
    pointer-events: none;
  }
  ::slotted(toast-message) {
    pointer-events: auto;
  }
  @media (max-width: 460px) {
    :host {
      top: auto;
      right: 1rem;
      bottom: 1rem;
      left: 1rem;
    }
  }
`;

class ToastContainer extends FASTElement {
  constructor() {
    super();
    this.position = "top-right";
    this.theme = "light";
  }

  onShowToast = (event) => this.show(event.detail || {});
  onToastClosed = (event) => event.stopPropagation();

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("show-toast", this.onShowToast);
    this.addEventListener("toast-closed", this.onToastClosed);
  }

  disconnectedCallback() {
    window.removeEventListener("show-toast", this.onShowToast);
    this.removeEventListener("toast-closed", this.onToastClosed);
    super.disconnectedCallback();
  }

  show(toast) {
    const message = document.createElement("toast-message");
    message.data = toast;
    message.theme = this.theme || "light";
    this.appendChild(message);
    return message;
  }
}

ToastContainer.define({
  name: "toast-container",
  template,
  styles,
  attributes: ["position", "theme"],
});
