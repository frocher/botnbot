import { LitElement, css, html } from 'lit-element';

class BnbAnchor extends LitElement {
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
    <a href="${this.path}">${this.text}</a>
    `;
  }

  static get properties() {
    return {
      text: String,
      path: String,
    };
  }
}

window.customElements.define('bnb-anchor', BnbAnchor);
