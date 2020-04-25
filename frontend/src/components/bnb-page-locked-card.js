import { LitElement, css, html } from 'lit-element';
import '@material/mwc-button/mwc-button';
import '@material/mwc-icon/mwc-icon';
import '@polymer/paper-card/paper-card';
import { connect } from 'pwa-helpers';
import { store } from '../store';
import { updateRoute } from '../actions/app';

class BnbPageLockedCard extends connect(store)(LitElement) {

  static get properties() {
    return {
      isOwner: { type: Boolean },
    };
  }

  static get styles() {
    return css`
    .card-content {
      display: flex;
      align-items: center;
      color: var(--paper-orange-700);
    }

    .card-content mwc-icon {
      font-size: 48px;
    }

    .card-content div {
      position: relative;
      padding-left: 8px;
      font-size: 14px;
    }

    .card-content mwc-button {
      margin-left: 8px;
      --mdc-theme-primary: var(--google-blue-300);
    }

    paper-card {
      display: block;
      cursor: pointer;
      width: 100%;
    }
    `;
  }

  render() {
    return html`
    <paper-card>
      <div class="card-content">
        <mwc-icon>warning</mwc-icon>
        ${this.renderContent()}
      </div>
    </paper-card>
    `;
  }

  renderContent() {
    if (this.isOwner) {
      return html`
        <span>Because of your current plan, this page is no longer monitored.</span>
        <mwc-button @click="${this.upgradeTapped}">Upgrade your plan</paper-button>
      `;
    }
    return html`
      <span>Because of the owner current plan, this page is no longer monitored.</span>
    `;
  }

  upgradeTapped() {
    store.dispatch(updateRoute('account'));
  }

  _stateChanged(state) {
    if (state.auth.credentials && state.pages.current) {
      this.isOwner = state.auth.credentials.uid === state.pages.current.owner.uid;
    }
  }
}

window.customElements.define('bnb-page-locked-card', BnbPageLockedCard);
