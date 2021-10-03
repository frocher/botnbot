import { LitElement, css, html } from 'lit';
import '@material/mwc-button';
import '@material/mwc-dialog';
import '@material/mwc-icon-button';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-select';
import '@material/mwc-textfield';
import '@material/mwc-top-app-bar-fixed';
import { find } from 'lodash-es';
import { connect } from 'pwa-helpers';
import { store } from '../../state/store';
import { updateRoute } from '../../state/app/actions';
import {
  createPageMember, updatePageMember, deletePageMember, updatePageOwner,
} from '../../state/members/actions';
import '../components/bnb-card';
import '../components/bnb-textfield';
import { styles } from '../components/bnb-styles';

class BnbMembers extends connect(store)(LitElement) {
  static get properties() {
    return {
      page: { type: Object },
      currentUser: { type: Object },
      selectedMember: { type: Object },
      members: { type: Array },
    };
  }

  static get styles() {
    return [
      styles,
      css`
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
        margin-bottom: 12px;
      }

      #email {
        min-width: 280px;
        margin-right: 16px;
      }

      #roleMenu {
        min-width: 200px;
      }

      #buttons {
        padding-top: 12px;
      }

      #members {
        max-height: 400px;
      }

      table {
        border-collapse: collapse;
        background: #fff;
        border-radius: 4px;
        width: 100%;
      }

      table thead tr {
        height: 60px;
        background: #212121;
        font-size: 16px;
        color: #fff;
        line-height: 1.2;
        font-weight: unset;
      }

      table tbody tr {
        height: 50px;
        font-size: 14px;
        color: gray;
        line-height: 1.2;
        font-weight: unset;
      }

      table tbody tr td:nth-child(1n) {
        padding-left: 16px;
      }

      table tbody tr:hover {
        background-color: var(--mdc-theme-secondary);
        color: var(--mdc-theme-on-secondary);
      }

      #roles {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
      }

      #roles div {
        min-width: 250px;
      }
      `,
    ];
  }

  render() {
    return html`
    <mwc-top-app-bar-fixed>
      <mwc-icon-button id="closeBtn" icon="arrow_back" slot="navigationIcon"></mwc-icon-button>
      <span slot="title">Members</span>

      <div id="content">
        <div id="container">
          <h3>Edit page members</h3>
          <bnb-card>
            <div id="form">
              <bnb-textfield id="email" type="email" label="E-mail" outlined required ?disabled="${!this.page.can_add_member}" validationMessage="You should enter a valid email address"></bnb-textfield>
              <mwc-select id="role" outlined required label="Role" ?disabled="${!this.page.can_update_member}" validationMessage="You should enter a role">
                <mwc-list-item value="admin">Administrator</mwc-list-item>
                <mwc-list-item value="master">Maintainer</mwc-list-item>
                <mwc-list-item value="editor">Editor</mwc-list-item>
                <mwc-list-item value="guest">Guest</mwc-list-item>
              </mwc-select>

              <div id="buttons">
                ${this.renderButtons()}
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                ${this.members.map((i) => this.renderMemberItem(i))}
              </tbody>
            </table>
          </bnb-card>
          <h3>Roles</h3>
          <bnb-card id="roles">
            <div>
              <p><strong>Guests</strong> can:</p>
              <ul>
                <li>access page statistics</li>
                <li>access page budgets</li>
                <li>access page members</li>
                <li>leave page members</li>
              </ul>
            </div>
            <div>
              <p><strong>Editors</strong> can:</p>
              <ul>
                <li>do all the things guests are able to</li>
                <li>update page settings</li>
                <li>create a new budget</li>
                <li>delete an existing budget</li>
              </ul>
            </div>
            <div>
              <p><strong>Maintainers</strong> can:</p>
              <ul>
                <li>do all the things editors are able to</li>
                <li>add a new member</li>
                <li>change a page member role</li>
                <li>remove a page member</li>
              </ul>
            </div>
            <div>
              <p><strong>Administators</strong> can:</p>
              <ul>
                <li>do all the things maintainers are able to</li>
                <li>give administrator privilege</li>
                <li>delete the page</li>
              </ul>
            </div>
          </bnb-card>

        </div>
      </div>
    </mwc-top-app-bar-fixed>

    <mwc-dialog id="confirmTransferDlg" heading="Transfering ownership">
      <p>Are you sure to you want to loose ownership of this page ?</p>
      <mwc-button dialogAction="ok" slot="primaryAction">Yes, sure !</mwc-button>
      <mwc-button dialogAction="cancel" slot="secondaryAction">No</mwc-button>
    </mwc-dialog>

    `;
  }

  constructor() {
    super();
    this.members = [];
  }

  renderButtons() {
    const itemTemplates = [];

    if (!this.selectedMember && this.page && this.page.can_add_member) {
      itemTemplates.push(html`<mwc-button id="addBtn" @click="${this.addTapped}">Add</mwc-button>`);
    }

    if (this.page && this.selectedMember) {
      if (this.page.can_update_member) {
        itemTemplates.push(html`<mwc-button id="updateBtn" @click="${this.updateTapped}">Update</mwc-button>`);
      }
      if (this.page.can_remove_member) {
        itemTemplates.push(html`<mwc-button id="removeBtn" @click="${this.removeTapped}">Remove</mwc-button>`);
      }
      if (this.page.can_update_member) {
        if (this.isCurrentUserOwner() && this.selectedMember.email !== this.currentUser) {
          itemTemplates.push(html`<mwc-button id="transferBtn" @click="${this.transferTapped}">Transfer ownership</mwc-button>`);
        }
      }
    }

    return itemTemplates;
  }

  renderMemberItem(item) {
    return html`
      <tr @click="${this.rowClicked}" data-id="${item.id}">
        <td>${item.username}</td>
        <td>${item.email}</td>
        <td>${this.renderMemberRole(item)}</td>
      </tr>
    `;
  }

  renderMemberRole(item) {
    let text = 'unknown';
    if (item.isOwner) {
      text = 'Owner';
    } else if (item.role === 'admin') {
      text = 'Administrator';
    } else if (item.role === 'master') {
      text = 'Maintainer';
    } else if (item.role === 'editor') {
      text = 'Editor';
    } else if (item.role === 'guest') {
      text = 'Guest';
    }
    return html`${text}`;
  }

  stateChanged(state) {
    if (state.auth.credentials) {
      this.currentUser = state.auth.credentials.uid;
    }
    this.page = state.pages.current;
    this.members = state.members.all;
    this.emailChanged();
  }

  firstUpdated() {
    this.shadowRoot.getElementById('email').addEventListener('change', () => this.emailChanged());
    this.shadowRoot.getElementById('confirmTransferDlg').addEventListener('closed', (e) => this.onConfirmTransferDialogClosed(e.detail.action));
    this.shadowRoot.getElementById('closeBtn').addEventListener('click', () => this.closeTapped());
  }

  rowClicked(e) {
    const member = find(this.members, (o) => o.id === Number(e.currentTarget.dataset.id));
    if (member) {
      this.shadowRoot.getElementById('email').value = member.email;
      this.shadowRoot.getElementById('role').value = member.role;
      this.emailChanged();
    }
  }

  closeTapped() {
    this.shadowRoot.getElementById('email').value = '';
    this.shadowRoot.getElementById('role').select(-1);
    store.dispatch(updateRoute(`page/${this.page.id}`));
  }

  emailChanged() {
    const emailField = this.shadowRoot.getElementById('email');
    if (emailField) {
      this.selectedMember = find(this.members, (o) => o.email === emailField.value);
    }
  }

  addTapped() {
    if (this.validateInputs()) {
      const email = this.shadowRoot.getElementById('email').value;
      const role = this.shadowRoot.getElementById('role').value;
      store.dispatch(createPageMember(this.page.id, { email, role }));
    }
  }

  updateTapped() {
    if (this.validateInputs()) {
      const email = this.shadowRoot.getElementById('email').value;
      const role = this.shadowRoot.getElementById('role').value;
      const member = find(this.members, (o) => o.email === email);
      store.dispatch(updatePageMember(this.page.id, { id: member.id, email, role }));
    }
  }

  removeTapped() {
    if (this.validateInputs()) {
      const email = this.shadowRoot.getElementById('email').value;
      const member = find(this.members, (o) => o.email === email);
      store.dispatch(deletePageMember(this.page.id, member.id));
    }
  }

  transferTapped() {
    this.shadowRoot.getElementById('confirmTransferDlg').show();
  }

  validateInputs() {
    const emailOK = this.shadowRoot.getElementById('email').reportValidity();
    const roleOK = this.shadowRoot.getElementById('role').reportValidity();
    return emailOK && roleOK;
  }

  onConfirmTransferDialogClosed(action) {
    if (action === 'ok') {
      const email = this.shadowRoot.getElementById('email').value;
      const member = find(this.members, (o) => o.email === email);
      store.dispatch(updatePageOwner(this.page.id, member.id));
    }
  }

  isCurrentUserOwner() {
    const owner = find(this.members, (m) => m.isOwner);
    return owner.email === this.currentUser;
  }
}
customElements.define('bnb-members', BnbMembers);
