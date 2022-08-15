import { LitElement, css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import '@material/mwc-button';
import '@material/mwc-dialog';
import '@material/mwc-icon-button';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-menu';
import '@material/mwc-tab';
import '@material/mwc-tab-bar';
import '@material/mwc-top-app-bar-fixed';
import { connect } from 'pwa-helpers';
import { store } from '../../state/store';
import { updateRoute } from '../../state/app/actions';
import { deletePageMember } from '../../state/members/actions';
import { deletePage } from '../../state/pages/actions';
import { styles } from '../components/bnb-styles';
import '../components/bnb-divider';
import '../budgets/bnb-page-budget';
import '../stats/bnb-page-stats';
import './bnb-page-locked-card';

class BnbPage extends connect(store)(LitElement) {
  static get properties() {
    return {
      page: { type: Object },
      selectedTab: { type: Number },
    };
  }

  static get styles() {
    return [
      styles,
      css`
        :host {
          display: flex;
          flex-direction: column;
        }

        #charts {
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          justify-content: center;
        }

        .view {
          display: none;
        }

        .view.active {
          display: block;
        }
        `,
    ];
  }

  constructor() {
    super();
    this.selectedTab = 0;
  }

  render() {
    return html`
    <mwc-top-app-bar-fixed>
      <mwc-icon-button icon="arrow_back" slot="navigationIcon" @click="${this.backTapped}"></mwc-icon-button>
      <span slot="title">${this.page?.name}</span>
      <mwc-icon-button id="moreBtn" slot="actionItems" icon="more_vert"></mwc-icon-button>
      <mwc-menu id="moreMenu">
        ${this.renderMenuContent()}
      </mwc-menu>

      <div id="content">
        <mwc-tab-bar id="tabs" sticky>
          <mwc-tab label="Statistics"></mwc-tab>
          <mwc-tab label="Budget"></mwc-tab>
        </mwc-tab-bar>

        <div id="charts">
          ${this.renderLockedCard()}
          <bnb-page-stats class="${classMap(this.renderClass(0))}"></bnb-page-stats>
          <bnb-page-budget class="${classMap(this.renderClass(1))}"></bnb-page-budget>
        </div>
      </div>
    </mwc-top-app-bar-fixed>

    <mwc-dialog id="deleteDlg">
      <p>Are you really sure you want to delete page ? All data will be lost</p>
      <mwc-button dialogAction="ok" slot="primaryAction">Delete</mwc-button>
      <mwc-button dialogAction="cancel" slot="secondaryAction">Cancel</mwc-button>
    </mwc-dialog>

    <mwc-dialog id="leaveDlg">
      <p>Leave this page, sure ?</p>
      <mwc-button dialogAction="ok" slot="primaryAction">Leave</mwc-button>
      <mwc-button dialogAction="cancel" slot="secondaryAction">Cancel</mwc-button>
    </mwc-dialog>
    `;
  }

  renderMenuContent() {
    const itemTemplates = [];

    if (this.page && this.page.can_edit) {
      itemTemplates.push(html`<mwc-list-item @click="${this.editTapped}">Settings</mwc-list-item>`);
    }

    itemTemplates.push(html`<mwc-list-item @click="${this.membersTapped}">Members</mwc-list-item><bnb-divider></bnb-divider>`);

    if (this.page && this.page.can_delete) {
      itemTemplates.push(html`<mwc-list-item @click="${this.deleteTapped}">Delete</mwc-list-item>`);
    } else {
      itemTemplates.push(html`<mwc-list-item @click="${this.leaveTapped}">Leave</mwc-list-item>`);
    }

    return itemTemplates;
  }

  renderLockedCard() {
    return this.page && this.page.locked ? html`<bnb-page-locked-card></bnb-page-locked-card>` : html``;
  }

  renderClass(index) {
    return index === this.selectedTab ? { view: true, active: true } : { view: true };
  }

  firstUpdated() {
    this.shadowRoot.getElementById('moreBtn').addEventListener('click', () => this.moreTapped());
    this.shadowRoot.getElementById('tabs').addEventListener('MDCTabBar:activated', () => this.tabActivated());
    this.shadowRoot.getElementById('deleteDlg').addEventListener('closed', (e) => this.deleteDialogClosed(e.detail.action));
    this.shadowRoot.getElementById('leaveDlg').addEventListener('closed', (e) => this.leaveDialogClosed(e.detail.action));
  }

  stateChanged(state) {
    this.page = state.pages.current;
  }

  tabActivated() {
    this.selectedTab = this.shadowRoot.getElementById('tabs').activeIndex;
  }

  moreTapped() {
    const menu = this.shadowRoot.getElementById('moreMenu');
    menu.anchor = this.shadowRoot.getElementById('moreBtn');
    menu.corner = 'BOTTOM_START';
    menu.open = true;
  }

  backTapped() {
    store.dispatch(updateRoute(''));
  }

  editTapped() {
    store.dispatch(updateRoute(`edit-page/${this.page.id}`));
  }

  membersTapped() {
    store.dispatch(updateRoute(`members/${this.page.id}`));
  }

  deleteTapped() {
    this.shadowRoot.getElementById('deleteDlg').show();
  }

  deleteDialogClosed(action) {
    if (action === 'ok') {
      store.dispatch(deletePage(this.page.id));
    }
  }

  leaveTapped() {
    this.shadowRoot.getElementById('leaveDlg').show();
  }

  leaveDialogClosed(action) {
    if (action === 'ok') {
      store.dispatch(deletePageMember(this.page.id, -1));
    }
  }
}
window.customElements.define('bnb-page', BnbPage);
