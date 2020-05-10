import { LitElement, css, html } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../store';
import { updateRoute } from '../actions/app';

class BnbAnchor extends connect(store)(LitElement) {
  static get styles() {
    return css`
    a {
      cursor:pointer;
      text-decoration: none;
      color: var(--secondary-text-color);
    }

    a:hover {
      text-decoration: underline;
    }
  `;
  }

  render() {
    return html`
    <a href="${this.path}" @click="${this.clicked}">${this.text}</a>
    `;
  }

  stateChanged() {
    // nothing to do
  }

  clicked(e) {
    store.dispatch(updateRoute(this.path));
    e.preventDefault();
  }

  static get properties() {
    return {
      text: String,
      path: String,
    };
  }
}

window.customElements.define('bnb-anchor', BnbAnchor);
