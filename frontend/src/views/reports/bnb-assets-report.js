import { LitElement, html, css } from 'lit-element';
import '@material/mwc-icon-button';
import '@material/mwc-top-app-bar-fixed';
import { connect } from 'pwa-helpers';
import { styles } from '../components/bnb-styles';
import { store } from '../../state/store';
import { updateRoute } from '../../state/app/actions';

class BnbAssetsReport extends connect(store)(LitElement) {
  static get styles() {
    return [
      styles,
      css`
      `,
    ];
  }

  stateChanged(state) {
    this.page = state.pages.current;
  }

  render() {
    return html`
    <mwc-top-app-bar-fixed>
      <mwc-icon-button id="backBtn" icon="arrow_back" slot="navigationIcon"></mwc-icon-button>
      <div slot="title">Assets report</div>

      <div id="content">
        Hello
      </div>
    </mwc-top-app-bar-fixed>
    `;
  }

  firstUpdated() {
    this.shadowRoot.getElementById('backBtn').addEventListener('click', () => this.backTapped());
  }

  backTapped() {
    store.dispatch(updateRoute(`page/${this.page.id}`));
  }
}

window.customElements.define('bnb-assets-report', BnbAssetsReport);
