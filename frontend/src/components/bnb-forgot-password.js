import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/iron-a11y-keys/iron-a11y-keys';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-input/paper-input';
import './bnb-auth-form';
import { connect } from 'pwa-helpers';
import { store } from '../store';
import { forgotPassword } from '../actions/auth';
import { getFullPath } from '../common';

class BnbForgotPassword extends connect(store)(PolymerElement) {
  static get template() {
    return html`
    <style>
      :host {
        @apply --layout-horizontal;
        @apply --layout-center-justified;
      }
    </style>

    <iron-a11y-keys keys="enter" target="[[target]]" on-keys-pressed="submitTapped"></iron-a11y-keys>

    <bnb-auth-form id="forgot-form" title="Password forgotten" buttons="[[forgotButtons]]">
      <paper-input id="forgot-email" label="E-mail" type="email" value="{{email}}" autofocus="true">
      </paper-input>

      <div class="actions">
        <paper-button on-tap="submitTapped">Reset password</paper-button>
      </div>
    </bnb-auth-form>
    `;
  }

  static get properties() {
    return {
      target: Object,
      forgotButtons: Array,
      email: {
        type: String,
        value: '',
      },
    };
  }

  _stateChanged() {
    // nothing to do
  }

  ready() {
    super.ready();
    this.target = this.$['forgot-form'];
    this.forgotButtons = [{ text: 'Sign up', path: '/signup' }, { text: 'Sign in', path: '/signin' }];
  }

  submitTapped() {
    this.$['forgot-email'].isInvalid = false;
    store.dispatch(forgotPassword(this.email, getFullPath('edit-password')));
  }
}

window.customElements.define('bnb-forgot-password', BnbForgotPassword);
