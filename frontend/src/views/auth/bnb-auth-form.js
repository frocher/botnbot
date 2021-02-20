import { LitElement, css, html } from 'lit-element';
import '../components/bnb-anchor';
import '../components/bnb-card';

class BnbAuthForm extends LitElement {
  static get styles() {
    return css`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    h2 {
      font-size: 24px;
      font-weight: 400;
      margin-top: 16px;
      margin-bottom: 16px;
    }

    bnb-card {
      padding-top: 0;
    }

    .auth-form {
      width: 70%;
      max-width: 380px;
      margin: 4em auto 1em auto;
    }

    .links {
      display: flex;
      flex-direction: row;
      justify-content: center;

      width: 70%;
      max-width: 380px;
      margin: 0 auto;
    }

    .card-content ::slotted(.actions) {
      position: relative;

      margin: 0;
      padding: 8px 8px 8px 24px;

      color: var(--mdc-theme-primary);

      display: flex;
      justify-content: flex-end;
    }
    `;
  }

  render() {
    return html`
    <bnb-card id="auth" class="auth-form">
      <h2>${this.title}</h2>
      <div class="card-content">
        <slot></slot>
      </div>
    </bnb-card>

    <div class="links">
      ${this.buttons.map((i, index) => this.renderLink(i, index))}
    </div>
    `;
  }

  renderLink(i, index) {
    const prefix = index !== 0 ? html`&nbsp;|&nbsp;` : html``;
    return html`${prefix}<bnb-anchor text="${i.text}" path="${i.path}"></bnb-anchor>`;
  }

  static get properties() {
    return {
      title: { type: String },
      buttons: { type: Array },
    };
  }

  constructor() {
    super();
    this.title = '';
    this.buttons = [];
  }
}

window.customElements.define('bnb-auth-form', BnbAuthForm);
