import { LitElement, css, html } from 'lit-element';
import '@material/mwc-button/mwc-button';
import '@material/mwc-textfield';
import './bnb-auth-form';
import { connect } from 'pwa-helpers';
import { store } from '../../state/store';
import { forgotPassword } from '../../state/auth/actions';
import { getFullPath } from '../../utilities/location';

class BnbForgotPassword extends connect(store)(LitElement) {
  static get styles() {
    return css`
    mwc-textfield {
      width: 100%;
    }
    `;
  }

  render() {
    return html`
    <bnb-auth-form id="forgot" title="Password forgotten" .buttons="${this.forgotButtons}">
      <mwc-textfield id="email" label="E-mail" type="email" outlined value="${this.email}">
      </mwc-textfield>

      <div class="actions">
        <mwc-button id="forgotBtn">Reset password</mwc-button>
      </div>
    </bnb-auth-form>
    `;
  }

  static get properties() {
    return {
      forgotButtons: { type: Array },
      email: { type: String },
    };
  }

  stateChanged() {
    // nothing to do
  }

  constructor() {
    super();
    this.email = '';
    this.forgotButtons = [{ text: 'Sign up', path: '/signup' }, { text: 'Sign in', path: '/signin' }];
  }

  firstUpdated() {
    this.shadowRoot.getElementById('forgotBtn').addEventListener('click', () => this.submitTapped());
    this.shadowRoot.getElementById('email').addEventListener('keypress', (event) => this.keyPressed(event));
  }

  keyPressed(event) {
    if (event.keyCode === 13) {
      this.submitTapped();
    }
  }

  submitTapped() {
    const email = this.shadowRoot.getElementById('email').value;
    store.dispatch(forgotPassword(email, getFullPath('edit-password')));
  }
}

window.customElements.define('bnb-forgot-password', BnbForgotPassword);
