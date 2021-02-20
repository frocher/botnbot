import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers';
import '@material/mwc-button';
import { store } from '../../state/store';
import { styles } from '../components/bnb-styles';

class BnbInstallButton extends connect(store)(LitElement) {
  static get properties() {
    return {
      displayButton: {
        type: Boolean,
      },
    };
  }

  static get styles() {
    return styles;
  }

  render() {
    return html`
    <mwc-button id="installBtn" raised label="Install Botnbot App" icon="cloud_download" ?disabled="${!this.displayButton}">
    </mwc-button>
    `;
  }

  firstUpdated() {
    this.shadowRoot.getElementById('installBtn').addEventListener('click', () => this.installTapped());
  }

  stateChanged(state) {
    this.promptEvent = state.app.promptEvent;
    this.displayButton = this.promptEvent !== undefined;
  }

  installTapped() {
    this.displayButton = false;
    this.promptEvent.prompt();
    this.promptEvent.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome !== 'accepted') {
          this.displayButton = true;
        }
      });
  }
}
window.customElements.define('bnb-install-button', BnbInstallButton);
