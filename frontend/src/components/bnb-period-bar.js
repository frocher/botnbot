import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/paper-card/paper-card';
import './bnb-common-styles';
import './bnb-period-dropdown';

class BnbPeriodBar extends PolymerElement {
  static get template() {
    return html`
    <style include="bnb-common-styles">
      :host {
        display: flex;
      }

      paper-card {
        width: 100%;
        margin: 16px;
        padding: 16px;
      }
    </style>
    <paper-card>
      <bnb-period-dropdown></bnb-period-dropdown>
    </paper-card>
    `;
  }
}
window.customElements.define('bnb-period-bar', BnbPeriodBar);
