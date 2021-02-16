import { LitElement, css, html } from 'lit-element';
import '@material/mwc-button/mwc-button';
import '@material/mwc-icon/mwc-icon';
import { connect } from 'pwa-helpers';
import { store } from '../state/store';
import { updateRoute } from '../state/app/actions';
import './bnb-card';
import { styles } from './bnb-styles';

class BnbPageLockedCard extends connect(store)(LitElement) {
  static get properties() {
    return {
      isOwner: { type: Boolean },
    };
  }

  static get styles() {
    return [
      styles,
      css`
      .card-content {
        display: flex;
        align-items: center;
        color: var(--mdc-theme-warning);
      }

      .card-content mwc-icon {
        margin-right: 8px;
        font-size: 48px;
      }

      .card-content div {
        position: relative;
        padding-left: 8px;
        font-size: 14px;
      }

      .card-content mwc-button {
        margin-left: 8px;
      }
      `,
    ];
  }

  render() {
    return html`
    <bnb-card>
      <div class="card-content">
        <mwc-icon>warning</mwc-icon>
        ${this.renderContent()}
      </div>
    </bnb-card>
    `;
  }

  renderContent() {
    if (this.isOwner) {
      return html`
        <span>Because of your current plan, this page is no longer monitored.</span>
        <mwc-button @click="${this.upgradeTapped}">Upgrade your plan</mwc-button>
      `;
    }
    return html`
      <span>Because of the owner current plan, this page is no longer monitored.</span>
    `;
  }

  upgradeTapped() {
    store.dispatch(updateRoute('account'));
  }

  stateChanged(state) {
    if (state.auth.credentials && state.pages.current) {
      this.isOwner = state.auth.credentials.uid === state.pages.current.owner.uid;
    }
  }
}

window.customElements.define('bnb-page-locked-card', BnbPageLockedCard);
