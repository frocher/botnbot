import { LitElement, css, html } from 'lit-element';
import '@material/mwc-icon-button';
import '@material/mwc-top-app-bar-fixed';
import { connect } from 'pwa-helpers';
import { fromHar } from 'perf-cascade';
import { styles } from '../components/bnb-styles';
import { harStyles } from './bnb-har-styles';
import { store } from '../../state/store';
import { updateRoute } from '../../state/app/actions';
import '../components/bnb-card';

export class BnbAssetsReport extends connect(store)(LitElement) {
  static get styles() {
    return [
      styles,
      harStyles,
      css`
      #content {
        display: flex;
        flex-direction: row;
        justify-content: center;
      }

      #container {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 1000px;
        padding: 10px 22px 10px 22px;
      }
      `,
    ];
  }

  static get properties() {
    return {
      har: { type: Object },
    };
  }

  stateChanged(state) {
    this.page = state.pages.current;
    if (state.reports.assets) {
      this.har = state.reports.assets;
    }
  }

  render() {
    return html`
    <mwc-top-app-bar-fixed>
      <mwc-icon-button id="backBtn" icon="arrow_back" slot="navigationIcon"></mwc-icon-button>
      <div id="content">
        <div id="container">
          <bnb-card>
            <div id="harContent"></div>
            <div id="harLegend"></div>
          </bnb-card>
        </div>
      </div>

      <div slot="title">Assets report</div>
    </mwc-top-app-bar-fixed>
    `;
  }

  firstUpdated() {
    this.shadowRoot.getElementById('backBtn').addEventListener('click', () => this.backTapped());
  }

  update(changedProperties) {
    super.update(changedProperties);
    if (changedProperties.has('har')) {
      const content = this.shadowRoot.getElementById('harContent');
      if (content.firstChild) {
        content.removeChild(content.firstChild);
      }
      const options = {
        legendHolder: this.shadowRoot?.getElementById('harLegend'),
        showUserTiming: true,
      };
      const cascadeSvg = fromHar(this.har, options);
      content.appendChild(cascadeSvg);
    }
  }

  backTapped() {
    // Nothing here
  }

  goto(url) {
    store.dispatch(updateRoute(url));
  }
}

export { BnbAssetsReport as default };
