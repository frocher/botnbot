import { LitElement, css, html } from 'lit-element';
import '@material/mwc-icon-button'
import '@material/mwc-list/mwc-list-item'
import '@material/mwc-menu'
import '@material/mwc-top-app-bar-fixed'
import '@polymer/iron-pages/iron-pages';
import '@polymer/paper-spinner/paper-spinner';
import { connect } from 'pwa-helpers';
import { store } from '../store';
import { updateRoute } from '../actions/app';
import { signout } from '../actions/auth';
import './bnb-page-card';

class BnbHome extends connect(store)(LitElement) {
  static get styles() {
    return css`
      #noData, #loading {
        display: flex;
        width: 100%;
        height: calc(100vh - 65px);
        color: #999;
        font-size: 24px;
        align-items: center;
        justify-content: center;
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
      `;
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
        <iron-pages selected="${this.selectedSection}">
          <section id="loading">
            <span>Loading&nbsp;</span>
            <paper-spinner active></paper-spinner>
          </section>
          <section id="noData">Don't you dare try the + button in the toolbar !</section>
          <section id="withData">
            ${this.pages ? this.pages.map(i => this.renderCard(i)) : html``}
          </section>
        </iron-pages>
      </mwc-top-app-bar-fixed>
      `;
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

  _stateChanged(state) {
    if (state.pages.all) {
      this.pages = [...state.pages.all].sort(this._sortPages);
    }
    else {
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
    this.shadowRoot.getElementById('addBtn').addEventListener('click', () => this._addTapped());
    this.shadowRoot.getElementById('moreBtn').addEventListener('click', () => this._moreTapped());
    this.shadowRoot.getElementById('accountItem').addEventListener('click', () => this._accountTapped());
    this.shadowRoot.getElementById('logoutItem').addEventListener('click', () => this._signoutTapped());
  }

  _sortPages(first, second) {
    const a = first.name.toUpperCase();
    const b = second.name.toUpperCase();
    return a.localeCompare(b);
  }

  _moreTapped() {
    const menu = this.shadowRoot.getElementById('moreMenu');
    menu.anchor = this.shadowRoot.getElementById('moreBtn');
    menu.corner = 'BOTTOM_START';
    menu.open = true;
  }

  _addTapped() {
    store.dispatch(updateRoute('add-page'));
  }

  _accountTapped() {
    store.dispatch(updateRoute('account'));
  }

  _signoutTapped() {
    store.dispatch(signout());
  }
}

customElements.define('bnb-home', BnbHome);
