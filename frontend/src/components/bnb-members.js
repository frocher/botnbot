import '@material/mwc-button/mwc-button';
import '@material/mwc-dialog';
import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/app-layout/app-layout';
import '@polymer/iron-pages/iron-pages';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-item/paper-item';
import '@polymer/paper-listbox/paper-listbox';
import '@vaadin/vaadin-grid/vaadin-grid';
import { find } from 'lodash-es';
import { connect } from 'pwa-helpers';
import { store } from '../store';
import { updateRoute } from '../actions/app';
import { createPageMember, updatePageMember, deletePageMember, updatePageOwner } from '../actions/members';
import './bnb-collapse';
import './bnb-grid-styles';
import './bnb-icons';

class BnbMembers extends connect(store)(PolymerElement) {
  static get template() {
    return html`
    <style>
      #content {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      #container {
        width: 100%;
        max-width: 1000px;
        padding: 10px 22px 10px 22px;
      }

      #form {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: flex-end;
        margin-top: -16px;
        margin-bottom: 8px;
      }

      #email {
        min-width: 280px;
        margin-right: 16px;
      }

      #roleMenu {
        min-width: 200px;
      }

      #members {
        max-height: 400px;
      }
    </style>
    <app-header-layout fullbleed>
      <app-header slot="header" fixed condenses shadow>
        <app-toolbar>
          <paper-icon-button icon="bnb:arrow-back" on-tap="closeTapped"></paper-icon-button>
          <span class="title">Members</span>
        </app-toolbar>
      </app-header>
      <div id="content">
        <div id="container">
          <bnb-collapse icon="bnb:people" header="Members" opened>
            <div id="form">
              <paper-input id="email" label="E-mail" on-input="emailChanged" required="true" disabled="[[!page.can_add_member]]" error-message="You should enter a valid email address"></paper-input>
              <paper-dropdown-menu id="roleMenu" label="Role" required="true" disabled="[[!page.can_update_member]]" error-message="You should select a role">
                <paper-listbox id="role" slot="dropdown-content" attr-for-selected="role">
                  <paper-item role="admin">Administrator</paper-item>
                  <paper-item role="master">Master</paper-item>
                  <paper-item role="editor">Editor</paper-item>
                  <paper-item role="guest">Guest</paper-item>
                </paper-listbox>
              </paper-dropdown-menu>

              <iron-pages id="buttons" selected="0">
                <section>
                  <paper-button id="addBtn" hidden$="[[!page.can_add_member]]" on-tap="addTapped">Add</paper-button>
                </section>
                <section>
                  <paper-button id="updateBtn" hidden$="[[!page.can_update_member]]" on-tap="updateTapped">Update</paper-button>
                  <paper-button id="removeBtn" hidden$="[[!page.can_remove_member]]" on-tap="removeTapped">Remove</paper-button>
                  <paper-button id="transferBtn" hidden$="[[!page.can_update_member]]" on-tap="transferTapped">Transfer ownership</paper-button>
                </section>
              </iron-pages>
            </div>

            <vaadin-grid id="membersGrid" theme="bnb-grid" items="[[_computeMembers(members)]]" active-item="{{activeMember}}">
              <vaadin-grid-column>
                <template class="header">Name</template>
                <template>
                  <div>[[item.username]]</div>
                </template>
              </vaadin-grid-column>
              <vaadin-grid-column>
                <template class="header">Email</template>
                <template>
                  <div>[[item.email]]</div>
                </template>
              </vaadin-grid-column>
              <vaadin-grid-column id="roleColumn">
                <template class="header">Role</template>
              </vaadin-grid-column>
            </vaadin-grid>
          </bnb-collapse>
        </div>
      </div>
    </app-header-layout>
    <mwc-dialog id="confirmTransferDlg" heading="Transfering ownership">
      <p>Are-you sure to you want to loose ownership of this page ?</p>
      <mwc-button dialogAction="ok" slot="primaryAction">Yes, sure !</mwc-button>
      <mwc-button dialogAction="cancel" slot="secondaryAction">No</mwc-button>
    </mwc-dialog>

    `;
  }

  static get properties() {
    return {
      page: Object,
      members: {
        type: Array,
        observer: '_membersChanged',
      },
      target: Object,
      activeMember: {
        observer: '_activeMemberChanged',
      },
    };
  }

  _stateChanged(state) {
    if (state.app.credentials) {
      this.currentUser = state.app.credentials.uid;
    }
    this.page = state.app.page;
    this.members = state.app.page_members;
    this.uptimeDetails = state.app.uptimeDetails;
  }

  ready() {
    super.ready();
    this.target = this.$.content;
    this.$.confirmTransferDlg.addEventListener('closed', (e) => this._onConfirmTransferDialogClosed(e.detail.action));

    this.$.roleColumn.renderer = function(root, column, rowData) {
      const item = rowData.item;
      let text = 'unknown';
      if (item.isOwner) {
        text = 'Owner';
      }
      else if (item.role === 'admin') {
        text = 'Administrator';
      }
      else if (item.role === 'master') {
        text = 'Master';
      }
      else if (item.role === 'editor') {
        text = 'Editor';
      }
      else if (item.role === 'guest') {
        text = 'Guest';
      }
      root.textContent = text;
    };
  }

  closeTapped() {
    this.$.email.invalid = false;
    this.$.email.value = '';
    this.$.role.selected = -1;
    store.dispatch(updateRoute(`page/${this.page.id}`));
  }

  emailChanged() {
    const email = this.$.email.value;
    const member = find(this.members, o => o.email === email);
    if (!member) {
      this.$.buttons.selected = 0;
    } else {
      this.$.buttons.selected = 1;

      let display;

      display = (this._isCurrentUserOwner() && member.email !== this.currentUser) ? 'inline' : 'none';
      this.$.transferBtn.style.display = display;

      display = !member.isOwner ? 'inline' : 'none';
      this.$.removeBtn.style.display = display;
    }
  }

  addTapped() {
    if (this.validateInputs()) {
      const email = this.$.email.value;
      const role = this.$.role.selected;
      store.dispatch(createPageMember(this.page.id, { email, role }));
    }
  }

  updateTapped() {
    if (this.validateInputs()) {
      const email = this.$.email.value;
      const role = this.$.role.selected;
      const member = find(this.members, o => o.email === email);
      store.dispatch(updatePageMember(this.page.id, { id: member.id, email, role }));
    }
  }

  removeTapped() {
    if (this.validateInputs()) {
      const email = this.$.email.value;
      const member = find(this.members, o => o.email === email);
      store.dispatch(deletePageMember(this.page.id, member.id));
    }
  }

  transferTapped() {
    this.$.confirmTransferDlg.show();
  }

  validateInputs() {
    const emailOK = this.$.email.validate();
    const roleOK = this.$.roleMenu.validate();
    return emailOK && roleOK;
  }

  _onConfirmTransferDialogClosed(action) {
    if (action === 'ok') {
      const email = this.$.email.value;
      const member = find(this.members, o => o.email === email);
      store.dispatch(updatePageOwner(this.page.id, member.id));
    }
  }

  _isCurrentUserOwner() {
    const owner = this._findOwner();
    return owner.email === this.currentUser;
  }

  _findOwner() {
    return find(this.members, m => m.isOwner);
  }

  _membersChanged() {
    this.emailChanged();
  }

  _activeMemberChanged(item) {
    this.$.membersGrid.selectedItems = item ? [item] : [];
    if (item) {
      this.$.email.value = item.email;
      this.$.role.selected = item.role;
      this.emailChanged();
    }
  }

  _computeMembers(members) {
    return members || [];
  }
}
customElements.define('bnb-members', BnbMembers);
