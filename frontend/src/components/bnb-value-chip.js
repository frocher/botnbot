import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import './bnb-divider';

class BnbValueChip extends PolymerElement {
  static get template() {
    return html`
    <style>
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
        color: var(--secondary-text-color);
        font-size: 16px;
      }
    </style>
    <h3>[[computeValue(value)]]<span style="font-size:smaller">[[suffix]]</span></h3>
    <p>[[text]]</p>
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

  computeValue(value) {
    return this.value;
  }
}

window.customElements.define('bnb-value-chip', BnbValueChip);
