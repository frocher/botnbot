import { LitElement, css, html } from 'lit-element';


class BnbCard extends LitElement {
  static get styles() {
    return css`
      :host {
        box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.20);
        border-radius: 2px;
        background-color: var(--mdc-theme-surface, #fff);
        color: var(--mdc-theme-on-surface, #000);
        display: block;
        position: relative;
      }
    `;
  }

  render() {
    return html`
    <slot></slot>
    `;
  }
}
window.customElements.define('bnb-card', BnbCard);
