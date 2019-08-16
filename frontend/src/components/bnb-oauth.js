import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/iron-icon/iron-icon';
import '@polymer/paper-button/paper-button';
import { getRequestUrl } from '../common';
import './bnb-common-styles';
import './bnb-divider';
import './bnb-oauth-icons';

class BnbOAuth extends PolymerElement {
  static get template() {
    return html`
    <style include="bnb-common-styles">
      paper-button {
        text-transform:none;
      }

      iron-icon {
        width: 24px;
        height: 24px;
        margin-right: 6px;
      }

      .buttons {
        display: flex;
      }

      .buttons paper-button {
        flex-grow: 1;
      }

      .title {
        margin-bottom: 16px;
      }

      .title span {
        padding-left: 16px;
        padding-right: 16px;
        color: var(--secondary-text-color);
        text-align: center;
      }

      .facebook {
        background-color: #3C5A99;
        font-weight: bold;
      }

      .github {
        background-color: #333;
        color: white;
        font-weight: bold;
      }

      .google {
        background-color: #fff;
        color: var(--paper-grey-600);
        font-weight: bold;
      }

      @media (max-width: 500px) {
        paper-button {
          font-size: 10px;
        }

        iron-icon {
          display: none;
        }
      }
    </style>
    <div class="layout vertical center-justified">

      <div class="title layout horizontal center-justified center">
        <bnb-divider class="flex"></bnb-divider>
        <span>or log in using</span>
        <bnb-divider class="flex"></bnb-divider>
      </div>
      <div class="buttons">
        <paper-button on-tap="facebookTapped" class="facebook" title="Sign in with Facebook">
          <iron-icon icon="oauth:facebook"></iron-icon>
          <span>Facebook</span>
        </paper-button>
        <paper-button on-tap="githubTapped" class="github" title="Sign in with GitHub">
          <iron-icon icon="oauth:github"></iron-icon>
          <span>GitHub</span>
        </paper-button>
        <paper-button on-tap="googleTapped" class="google" title="Sign in with Google">
          <iron-icon icon="oauth:google"></iron-icon>
          <span>Google</span>
        </paper-button>
      </div>
    </div>
    `;
  }

  facebookTapped() {
    this._callService('facebook');
  }

  githubTapped() {
    this._callService('github');
  }

  googleTapped() {
    this._callService('google_oauth2');
  }

  _callService(service) {
    const origin = `${window.location.protocol}//${window.location.host}`;
    const url = getRequestUrl(`auth/${service}?auth_origin_url=${origin}`);
    window.location.replace(url);
  }
}

window.customElements.define('bnb-oauth', BnbOAuth);
