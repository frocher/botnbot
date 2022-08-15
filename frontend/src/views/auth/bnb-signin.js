import { LitElement, css, html } from 'lit';
import '@material/mwc-button/mwc-button';
import '@material/mwc-textfield';
import { connect } from 'pwa-helpers';
import { store } from '../../state/store';
import { signin } from '../../state/auth/actions';
import './bnb-auth-form';
import './bnb-oauth';

class BnbSignIn extends connect(store)(LitElement) {
  static get styles() {
    return css`
    mwc-textfield {
      width: 100%;
    }

    #email {
      margin-bottom: 16px;
    }
    `;
  }

  render() {
    return html`
    <bnb-auth-form id="signinForm" name="signin" title="Welcome to Botnbot" .buttons="${this.signinButtons}">

      <bnb-oauth></bnb-oauth>

      <mwc-textfield id="email" label="E-mail" type="email" outlined value="${this.email}">
      </mwc-textfield>

      <mwc-textfield id="password" label="Password" type="password" outlined value="${this.password}" >
      </mwc-textfield>

      <div class="actions">
        <mwc-button id="signinBtn">Log in</mwc-button>
      </div>

    </bnb-auth-form>
    `;
  }

  static get properties() {
    return {
      credentials: { type: Object },
      email: { type: String, reflect: true },
      password: { type: String, reflect: true },
      signinButtons: { type: Array },
    };
  }

  constructor() {
    super();
    this.email = '';
    this.password = '';
    this.signinButtons = [{ text: 'Sign up', path: '/signup' }, { text: 'Forgot your password', path: '/forgot-password' }];
  }

  firstUpdated() {
    this.shadowRoot.getElementById('signinBtn').addEventListener('click', () => this.signinSubmitTapped());
    this.shadowRoot.getElementById('email').addEventListener('keypress', (event) => this.keyPressed(event));
    this.shadowRoot.getElementById('password').addEventListener('keypress', (event) => this.keyPressed(event));
  }

  stateChanged(state) {
    if (!state.auth.credentials && this.credentials !== state.auth.credentials) {
      this.email = '';
      this.password = '';
    }

    this.credentials = state.auth.credentials;
  }

  keyPressed(event) {
    if (event.keyCode === 13) {
      this.signinSubmitTapped();
    }
  }

  signinSubmitTapped() {
    this.email = this.shadowRoot.getElementById('email').value;
    this.password = this.shadowRoot.getElementById('password').value;
    store.dispatch(signin(this.email, this.password));
  }
}

window.customElements.define('bnb-signin', BnbSignIn);
