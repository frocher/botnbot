import { LitElement, css, html } from 'lit';
import './bnb-divider';

class BnbValueChip extends LitElement {
  static get styles() {
    return css`
    :host {
      padding-right: 8px;
      padding-left: 8px;
    }

    h3 {
      margin: 0 0 5px 0;
      padding: 0;
      white-space: nowrap;
      font-size: 32px;
      font-weight: bold;
    }

    p {
      margin-top: 5px;
      margin-bottom: 5px;
      color: var(--mdc-theme-on-surface);
      font-size: 16px;
    }
    `;
  }

  render() {
    return html`
    <h3>${this.value}<span style="font-size:smaller">${this.suffix}</span></h3>
    <p>${this.text}</p>
    <bnb-divider></bnb-divider>
    `;
  }

  static get properties() {
    return {
      text: {
        type: String,
        value: null,
      },

      value: {
        type: Number,
        value: null,
      },

      suffix: {
        type: String,
        value: null,
      },
    };
  }
}

window.customElements.define('bnb-value-chip', BnbValueChip);
