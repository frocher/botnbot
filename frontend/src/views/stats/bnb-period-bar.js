import { LitElement, html } from 'lit-element';
import '../components/bnb-card';
import '../components/bnb-period-dropdown';

class BnbPeriodBar extends LitElement {
  render() {
    return html`
    <bnb-card>
      <bnb-period-dropdown></bnb-period-dropdown>
    </bnb-card>
    `;
  }
}
window.customElements.define('bnb-period-bar', BnbPeriodBar);
