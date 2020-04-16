import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/iron-icon/iron-icon';
import '@polymer/paper-card/paper-card';
import '@polymer/paper-button';
import { connect } from 'pwa-helpers';
import { store } from '../store';
import { updateRoute } from '../actions/app';
import './bnb-icons';

class BnbPageLockedCard extends connect(store)(PolymerElement) {
  static get template() {
    return html`
    <style>

    :host {
    }

    .card-content {
      display: flex;
      align-items: center;
      color: var(--paper-orange-700);
    }


    .card-content iron-icon {
      height: 48px;
      width: 48px;
    }

    .card-content div {
      position: relative;
      padding-left: 8px;
      font-size: 14px;
    }

    .card-content paper-button {
      margin-left: 8px;
    }

    paper-card {
      display: block;
      cursor: pointer;
      width: 100%;
    }

    paper-button {
      color: var(--google-blue-300);
    }
    </style>

    <paper-card>
      <div class="card-content">
        <iron-icon icon="bnb:warning"></iron-icon>
        <div>Because of your current plan, this page is no longer monitored.</div>
        <paper-button on-tap="_upgradeTapped">Upgrade your plan</paper-button>
      </div>
    </paper-card>
    `;
  }

  _stateChanged() {
  }

  _upgradeTapped() {
    store.dispatch(updateRoute('account'));
  }
}

window.customElements.define('bnb-page-locked-card', BnbPageLockedCard);
