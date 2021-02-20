import { LitElement, css, html } from 'lit-element';
import '@material/mwc-icon';
import '../components/bnb-anchor';

class Bnb404Warning extends LitElement {
  static get styles() {
    return css`
    :host {
      margin-top: 16px;
      display: block;
      text-align: center;
      color: var(--app-secondary-color);
    }

    mwc-icon {
      display: inline-block;
      --mdc-icon-size: 60px;
    }

    h1 {
      margin: 50px 0 50px 0;
      font-weight: 300;
    }
    `;
  }

  render() {
    return html`
    <div>
      <mwc-icon>error</mwc-icon>
      <h1>Sorry, we couldn't find that page</h1>
    </div>
    <bnb-anchor text="Go to the home page" path="/"></bnb-anchor>
    `;
  }
}

customElements.define('bnb-404-warning', Bnb404Warning);
