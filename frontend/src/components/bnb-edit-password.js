import { LitElement, css, html } from 'lit-element';
import '@material/mwc-button/mwc-button';
import '@material/mwc-textfield';
import { connect } from 'pwa-helpers';
import { store } from '../store';
import { updatePassword } from '../actions/auth';
import './bnb-auth-form';
import { BnbFormElement } from './bnb-form-element';

class BnbEditPassword extends connect(store)(BnbFormElement(LitElement)) {
  static get styles() {
    return css`
    mwc-textfield {
      width: 100%;
    }

    #password {
      margin-bottom: 16px;
    }
    `;
  }

  render() {
    return html`
    <bnb-auth-form id="edit-form" title="Edit your new password" buttons="${this.editButtons}">

      <mwc-textfield id="password" label="Password" type="password" outlined value="${this.password}">
      </mwc-textfield>

      <mwc-textfield id="password_confirmation" label="Password confirmation" type="password" outlined value="${this.passwordConfirmation}">
      </mwc-textfield>

      <div class="actions">
        <mwc-button id="submitBtn" title="Change your password">Change</mwc-button>
      </div>
    </bnb-auth-form>
    `;
  }

  static get properties() {
    return {
      editButtons: { type: Array },
      password: { type: String },
      passwordConfirmation: { type: String },
      errors: { type: Object },
    };
  }

  constructor() {
    super();
    this.email = '';
    this.password = '';
    this.passwordConfirmation = '';
    this.editButtons = [{ text: 'Sign in', path: '/signin' }];
  }

  stateChanged(state) {
    this.errors = state.app.errors;
    if (this.errors) {
      this._litErrorsChanged();
    }
  }

  firstUpdated() {
    this.shadowRoot.getElementById('submitBtn').addEventListener('click', () => this.submitTapped());
  }

  submitTapped() {
    this.shadowRoot.getElementById('password').setCustomValidity('');
    this.shadowRoot.getElementById('password_confirmation').setCustomValidity('');

    const headers = {
      'access-token': this._getQueryVariable('token'),
      client: this._getQueryVariable('client_id'),
      uid: this._getQueryVariable('uid'),
    };

    const password = this.shadowRoot.getElementById('password').value;
    const confirmation = this.shadowRoot.getElementById('password_confirmation').value;

    store.dispatch(updatePassword(password, confirmation, headers));
  }

  _getQueryVariable(variable) {
    const hrefPart = window.location.href;
    const query = hrefPart.substring(hrefPart.indexOf('?') + 1);
    const vars = query.split('&');
    for (let i = vars.length - 1; i >= 0; i -= 1) {
      const pair = vars[i].split('=');
      if (pair[0] === variable) {
        return decodeURIComponent(pair[1]);
      }
    }
    return undefined;
  }
}

window.customElements.define('bnb-edit-password', BnbEditPassword);
