import { LitElement, css, html } from 'lit-element';
import '@material/mwc-button/mwc-button';
import '@material/mwc-textfield';
import { connect } from 'pwa-helpers';
import { getFullPath } from '../../utilities/location';
import { store } from '../../state/store';
import { signup } from '../../state/auth/actions';
import { BnbFormElement } from '../components/bnb-form-element';
import './bnb-auth-form';

class BnbSignUp extends connect(store)(BnbFormElement(LitElement)) {
  static get styles() {
    return css`
    mwc-textfield {
      width: 100%;
    }

    #name, #email, #password {
      margin-bottom: 16px;
    }
    `;
  }

  render() {
    return html`
      <bnb-auth-form id="signup-form" name="signup" title="Sign up for Botnbot" .buttons="${this.signupButtons}">

        <mwc-textfield id="name" label="Full name" type="text" outlined value="${this.fullname}">
        </mwc-textfield>

        <mwc-textfield id="email" label="E-mail" type="email" outlined value="${this.email}">
        </mwc-textfield>

        <mwc-textfield id="password" label="Password" type="password" outlined value="${this.password}">
        </mwc-textfield>

        <mwc-textfield id="password_confirmation" label="Retype password" type="password" outlined value="${this.passwordConfirmation}">
        </mwc-textfield>

        <div class="actions">
          <mwc-button id="signupBtn">Sign me up</mwc-button>
        </div>
      </bnb-auth-form>
    `;
  }

  static get properties() {
    return {
      fullname: { type: String },
      email: { type: String },
      password: { type: String },
      passwordConfirmation: { type: String },
      errors: { type: Object },
      signupButtons: { type: Array },
    };
  }

  constructor() {
    super();
    this.fullname = '';
    this.email = '';
    this.password = '';
    this.passwordConfirmation = '';
    this.signupButtons = [{ text: 'Sign in', path: '/signin' }, { text: 'Forgot your password', path: '/forgot-password' }];
  }

  stateChanged(state) {
    this.errors = state.app.errors;
    if (this.errors) {
      this._litErrorsChanged();
    }
  }

  firstUpdated() {
    this.shadowRoot.getElementById('signupBtn').addEventListener('click', () => this.signupSubmitTapped());
  }

  signupSubmitTapped() {
    this.shadowRoot.getElementById('name').setCustomValidity('');
    this.shadowRoot.getElementById('email').setCustomValidity('');
    this.shadowRoot.getElementById('password').setCustomValidity('');
    this.shadowRoot.getElementById('password_confirmation').setCustomValidity('');

    const fullname = this.shadowRoot.getElementById('name').value;
    const email = this.shadowRoot.getElementById('email').value;
    const password = this.shadowRoot.getElementById('password').value;
    const confirmation = this.shadowRoot.getElementById('password_confirmation').value;

    store.dispatch(signup(fullname, email, password, confirmation, this._homeUrl()));
  }

  _homeUrl() {
    return getFullPath('');
  }
}

window.customElements.define('bnb-signup', BnbSignUp);
