import { LitElement, css, html } from 'lit-element';

class BnbDivider extends LitElement {
  static get styles() {
    return css`
      :host {
        display: inline-block;
        height: 1px;
        min-height: 1px;
        max-height: 1px;
        background-color: var(--bnb-divider-color, #000);
        opacity: 0.12;
        width: 100%;
        @apply --paper-divider;
      }
    `;
  }

  render() {
    return html``;
  }
}

window.customElements.define('bnb-divider', BnbDivider);
