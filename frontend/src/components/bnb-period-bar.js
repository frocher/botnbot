import { LitElement, css, html } from 'lit-element';
import '@polymer/paper-card/paper-card';
import './bnb-period-dropdown';

class BnbPeriodBar extends LitElement {
  static get styles() {
    return css`
    :host {
      display: flex;
    }

    paper-card {
      width: 100%;
      margin: 16px;
      padding: 16px;
    }
    `;
  }

  render() {
    return html`
    <paper-card>
      <bnb-period-dropdown></bnb-period-dropdown>
    </paper-card>
    `;
  }
}
window.customElements.define('bnb-period-bar', BnbPeriodBar);
