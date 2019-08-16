
import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/iron-icon/iron-icon';
import './bnb-anchor';
import './bnb-icons';

class Bnb404Warning extends PolymerElement {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
      text-align: center;
      color: var(--app-secondary-color);
    }

    iron-icon {
      display: inline-block;
      width: 60px;
      height: 60px;
    }

    h1 {
      margin: 50px 0 50px 0;
      font-weight: 300;
    }
    </style>

    <div>
      <iron-icon icon="bnb:error"></iron-icon>
      <h1>Sorry, we couldn't find that page</h1>
    </div>
    <bnb-anchor text="Go to the home page" path="/home"></bnb-anchor>
    `;
  }
}

customElements.define('bnb-404-warning', Bnb404Warning);
