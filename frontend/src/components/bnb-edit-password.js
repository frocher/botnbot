import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/iron-a11y-keys/iron-a11y-keys';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-input/paper-input';
import { connect } from 'pwa-helpers';
import { store } from '../store';
import { updatePassword } from '../actions/auth';
import './bnb-auth-form';
import { BnbFormElement } from './bnb-form-element';

class BnbEditPassword extends connect(store)(BnbFormElement(PolymerElement)) {
  static get template() {
    return html`
    <iron-a11y-keys keys="enter" target="[[target]]" on-keys-pressed="submitTapped">
    </iron-a11y-keys>

    <bnb-auth-form id="edit-form" title="Edit your new password" buttons="[[editButtons]]">

      <paper-input id="password" label="Password" type="password" value="{{password}}" autofocus="true">
      </paper-input>

      <paper-input id="password_confirmation" label="Password confirmation" autocomplete="off" type="password" value="{{passwordConfirmation}}">
      </paper-input>

      <div class="actions">
        <iron-pages id="actionButtons" selected="0">
          <paper-button title="Change your password" on-tap="submitTapped">Change</paper-button>
        </iron-pages>
      </div>
    </bnb-auth-form>
    `;
  }

  static get properties() {
    return {
      target: Object,
      editButtons: Array,
      password: {
        type: String,
        value: '',
      },
      passwordConfirmation: {
        type: String,
        value: '',
      },
      errors: {
        type: Object,
        observer: '_errorsChanged',
      },
    };
  }

  _stateChanged(state) {
    this.errors = state.app.errors;
  }

  ready() {
    super.ready();
    this.target = this.$['edit-form'];
    this.editButtons = [{ text: 'Sign in', path: '/signin' }];
  }

  submitTapped() {
    this.$.password.invalid = false;
    this.$.password_confirmation.invalid = false;

    const headers = {
      'access-token': this._getQueryVariable('token'),
      client: this._getQueryVariable('client_id'),
      uid: this._getQueryVariable('uid'),
    };

    store.dispatch(updatePassword(this.password, this.passwordConfirmation, headers));
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
