import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/app-layout/app-layout';
import '@polymer/iron-pages/iron-pages';
import '@polymer/paper-dialog/paper-dialog';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-menu-button/paper-menu-button';
import '@polymer/paper-tabs/paper-tab';
import '@polymer/paper-tabs/paper-tabs';
import { connect } from 'pwa-helpers';
import { store } from '../store';
import { updateRoute } from '../actions/app';
import { deletePageMember } from '../actions/members';
import { deletePage } from '../actions/pages';
import './bnb-common-styles';
import './bnb-divider';
import './bnb-icons';
import './bnb-page-budget';
import './bnb-page-stats';

class BnbPage extends connect(store)(PolymerElement) {
  static get template() {
    return html`
    <style include="bnb-common-styles">
    :host {
      @apply --layout-vertical;
    }

    #charts {
      @apply --layout-vertical;
      @apply --layout-wrap;
      @apply --layout-center-justified;
    }

    paper-item {
      cursor: pointer;
    }
    </style>

    <app-header-layout fullbleed>
      <app-header slot="header" fixed condenses shadow>
        <app-toolbar>
          <paper-icon-button icon="bnb:arrow-back" on-tap="backTapped"></paper-icon-button>
          <span main-title>[[page.name]]</span>
          <paper-menu-button horizontal-align="right">
            <paper-icon-button icon="bnb:more-vert" slot="dropdown-trigger"></paper-icon-button>
            <paper-listbox slot="dropdown-content">
              <paper-item on-tap="editTapped" hidden$="{{!page.can_edit}}">Settings</paper-item>
              <paper-item on-tap="membersTapped">Members</paper-item>
              <bnb-divider></bnb-divider>
              <paper-item on-tap="deleteTapped" hidden$="{{!page.can_delete}}">Delete</paper-item>
              <paper-item on-tap="leaveTapped" hidden$="{{page.can_delete}}">Leave</paper-item>
            </paper-listbox>
          </paper-menu-button>
        </app-toolbar>
        <paper-tabs selected="{{selectedTab}}" sticky>
          <paper-tab>Statistics</paper-tab>
          <paper-tab>Budget</paper-tab>
        </paper-tabs>
      </app-header>

      <div id="content" class="fit">
        <div id="charts">
          <iron-pages selected="[[selectedTab]]">
            <bnb-page-stats></bnb-page-stats>
            <bnb-page-budget></bnb-page-budget>
          </iron-pages>
        </div>
      </div>
    </app-header-layout>

    <paper-dialog id="deleteDlg" modal>
      <p>Are you really sure you want to delete page ? All data will be lost</p>
      <div class="buttons">
        <paper-button dialog-dismiss>Cancel</paper-button>
        <paper-button dialog-confirm autofocus on-tap="deletePageTapped">Delete</paper-button>
      </div>
    </paper-dialog>

    <paper-dialog id="leaveDlg" modal>
      <p>Leave this page, sure ?</p>
      <div class="buttons">
        <paper-button dialog-dismiss>Cancel</paper-button>
        <paper-button dialog-confirm autofocus on-tap="leavePageTapped">Leave</paper-button>
      </div>
    </paper-dialog>
    `;
  }

  static get properties() {
    return {
      page: {
        type: Object,
      },
      selectedTab: {
        type: Number,
        reflectToAttribute: true,
        value: 0,
      },
    };
  }

  _stateChanged(state) {
    this.page = state.app.page;
  }

  backTapped() {
    store.dispatch(updateRoute('home'));
  }

  editTapped() {
    store.dispatch(updateRoute(`edit-page/${this.page.id}`));
  }

  membersTapped() {
    store.dispatch(updateRoute(`members/${this.page.id}`));
  }

  deleteTapped() {
    this.$.deleteDlg.open();
  }

  deletePageTapped() {
    store.dispatch(deletePage(this.page.id));
  }

  leaveTapped() {
    this.$.leaveDlg.open();
  }

  leavePageTapped() {
    store.dispatch(deletePageMember(this.page.id, -1));
  }
}
window.customElements.define('bnb-page', BnbPage);
