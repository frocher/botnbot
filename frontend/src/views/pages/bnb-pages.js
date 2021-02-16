import { LitElement, css, html } from 'lit-element';
import '@material/mwc-icon-button';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-menu';
import '@material/mwc-top-app-bar-fixed';
import 'wc-spinners/dist/fulfilling-bouncing-circle-spinner';
import { connect } from 'pwa-helpers';
import { store } from '../../state/store';
import { updateRoute } from '../../state/app/actions';
import { signout } from '../../state/auth/actions';
import { styles } from '../components/bnb-styles';
import './bnb-page-card';

class BnbPages extends connect(store)(LitElement) {
  static get styles() {
    return [
      styles,
      css`
      #noData, #loading {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: calc(100vh - 65px);
        color: #999;
        font-size: 24px;
      }

      #spinner {
        margin-left: 24px;
      }

      #withData {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;

        position: relative;
        margin-top: 10px;
      }

      #withData > .item {
        -webkit-flex: 1 calc(20% - 30px);
        flex: 1 calc(20% - 30px);
        max-width: calc(20% - 30px);
        margin: 10px;
        text-decoration: none;
      }

      @media (max-width: 1600px) {
        #withData {
          padding-left: 10px;
          padding-right: 10px;
        }
        #withData > .item {
          -webkit-flex: 1 calc(25% - 30px);
          flex: 1 calc(25% - 30px);
          max-width: calc(25% - 30px);
        }
      }

      @media (max-width: 1200px) {
        #withData {
          padding-left: 10px;
          padding-right: 10px;
        }
        #withData > .item {
          -webkit-flex: 1 calc(33% - 20px);
          flex: 1 calc(33% - 20px);
          max-width: calc(33% - 20px);
        }
      }

      @media (max-width: 700px) {
        #withData {
          padding-left: 10px;
          padding-right: 10px;
        }
        #withData > .item {
          -webkit-flex: 1 calc(50% - 20px);
          flex: 1 calc(50% - 20px);
          max-width: calc(50% - 20px);
        }
      }

      @media (max-width: 400px) {
        #withData{
          padding-left: 10px;
          padding-right: 10px;
        }
        #withData> .item {
          -webkit-flex: 1 calc(100% - 10px);
          flex: 1 calc(100% - 10px);
          max-width: calc(100% - 10px);
          margin: 5px;
        }
      }
      `,
    ];
  }

  render() {
    return html`
      <mwc-top-app-bar-fixed>
        <div slot="title">All pages</div>
        <mwc-icon-button id="addBtn" slot="actionItems" icon="add"></mwc-icon-button>
        <mwc-icon-button id="moreBtn" slot="actionItems" icon="more_vert"></mwc-icon-button>
        <mwc-menu id="moreMenu">
          <mwc-list-item id="accountItem">My account</mwc-list-item>
          <mwc-list-item id="logoutItem">Log out</mwc-list-item>
        </mwc-menu>
        ${this.renderContent()}
      </mwc-top-app-bar-fixed>
      `;
  }

  renderContent() {
    switch (this.selectedSection) {
      case 0:
        return html`
          <div id="loading">
            <div>Loading</div>
            <fulfilling-bouncing-circle-spinner id="spinner"></fulfilling-bouncing-circle-spinner>
          </div>
        `;

      case 1:
        return html`
          <div id="noData">Don't you dare try the + button in the toolbar !</div>
        `;

      case 2:
        return html`
          <div id="withData">
            ${this.pages ? this.pages.map((i) => this.renderCard(i)) : html``}
          </div>
        `;
    }
    return html`Unknown error`;
  }

  renderCard(card) {
    return html`
      <bnb-page-card .page="${card}" class="item"></bnb-page-card>
    `;
  }

  static get properties() {
    return {
      pages: { type: Array },
      selectedSection: { type: Number },
    };
  }

  constructor() {
    super();
    this.selectedSection = 0;
  }

  stateChanged(state) {
    if (state.pages.all) {
      this.pages = [...state.pages.all].sort(this.sortPages);
    } else {
      this.pages = null;
    }

    if (this.pages === null || this.pages === undefined) {
      this.selectedSection = 0;
    } else if (this.pages.length === 0) {
      this.selectedSection = 1;
    } else {
      this.selectedSection = 2;
    }
  }

  firstUpdated() {
    this.shadowRoot.getElementById('addBtn').addEventListener('click', () => this.addTapped());
    this.shadowRoot.getElementById('moreBtn').addEventListener('click', () => this.moreTapped());
    this.shadowRoot.getElementById('accountItem').addEventListener('click', () => this.accountTapped());
    this.shadowRoot.getElementById('logoutItem').addEventListener('click', () => this.signoutTapped());
  }

  sortPages(first, second) {
    const a = first.name.toUpperCase();
    const b = second.name.toUpperCase();
    return a.localeCompare(b);
  }

  moreTapped() {
    const menu = this.shadowRoot.getElementById('moreMenu');
    menu.anchor = this.shadowRoot.getElementById('moreBtn');
    menu.corner = 'BOTTOM_START';
    menu.open = true;
  }

  addTapped() {
    store.dispatch(updateRoute('add-page'));
  }

  accountTapped() {
    store.dispatch(updateRoute('account'));
  }

  signoutTapped() {
    store.dispatch(signout());
  }
}

customElements.define('bnb-pages', BnbPages);
