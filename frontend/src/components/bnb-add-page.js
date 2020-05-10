import { LitElement, css, html } from 'lit-element';
import '@material/mwc-formfield';
import '@material/mwc-radio';
import '@material/mwc-textfield';
import '@material/mwc-button';
import '@material/mwc-dialog';
import '@material/mwc-icon-button';
import { connect } from 'pwa-helpers';
import { store } from '../store';
import { updateRoute } from '../actions/app';
import { createPage } from '../actions/pages';
import { BnbFormElement } from './bnb-form-element';
import './bnb-card';
import './bnb-top-app-bar';

class BnbAddPage extends connect(store)(BnbFormElement(LitElement)) {
  static get properties() {
    return {
      pageName: { type: String },
      url: { type: String },
      routePath: { type: String },
      errors: { type: Object },
    };
  }

  static get styles() {
    return css`
    :host {
      display: flex;
      flex-direction: column;
    }

    mwc-textfield {
      width: 100%;
      --mdc-theme-primary: #fff;
    }

    #content {
      display: flex;
      flex-direction: row;
      justify-content: center;
    }

    #container {
      width:100%;
      max-width: 1000px;
      padding: 10px 22px 10px 22px;
    }

    #name {
      margin-bottom: 16px;
    }
    `;
  }

  get fields() {
    return ['name', 'url'];
  }

  render() {
    return html`
    <bnb-top-app-bar>
      <mwc-icon-button id="closeBtn" icon="close" slot="navigationIcon"></mwc-icon-button>
      <span slot="title">New page</span>
      <mwc-button id="createBtn" slot="actionItems">Create</mwc-button>

      <div id="content">
        <div id="container">
          <h3>Page informations</h3>
          <bnb-card>
            <mwc-textfield id="name" label="Page name" type="text" outlined value="${this.pageName}"></mwc-textfield>
            <mwc-textfield id="url" label="URL" type="url" outlined value="${this.url}"></mwc-textfield>
            <mwc-formfield label="Mobile">
              <mwc-radio id="mobileBtn" name="device" group="deviceGroup" checked></mwc-radio>
            </mwc-formfield>
            <mwc-formfield label="Desktop">
              <mwc-radio id="desktopBtn" name="device" group="deviceGroup"></mwc-radio>
            </mwc-formfield>
          </bnb-card>
        </div>
      </div>
    </bnb-top-app-bar>

    <mwc-dialog id="discardDlg" >
      <p>Are you sure you want to discard this new page.</p>
      <mwc-button dialogAction="ok" slot="primaryAction">Discard</mwc-button>
      <mwc-button dialogAction="cancel" slot="secondaryAction">Cancel</mwc-button>
    </mwc-dialog>
    `;
  }

  firstUpdated() {
    this.shadowRoot.getElementById('closeBtn').addEventListener('click', () => this.closeTapped());
    this.shadowRoot.getElementById('createBtn').addEventListener('click', () => this.createTapped());
    this.shadowRoot.getElementById('discardDlg').addEventListener('closed', (e) => this.discardDialogClosed(e.detail.action));
  }

  closeTapped() {
    if (this.pageName || this.url) {
      this.shadowRoot.getElementById('discardDlg').show();
    } else {
      this.closePage();
    }
  }

  createTapped() {
    this.validateFields(this.fields);

    store.dispatch(
      createPage(
        this.shadowRoot.getElementById('name').value,
        this.shadowRoot.getElementById('url').value,
        this.shadowRoot.getElementById('mobileBtn').checked ? 'mobile' : 'desktop',
      ),
    );
  }

  discardDialogClosed(action) {
    if (action === 'ok') {
      this.closePage();
    }
  }

  clearFields() {
    this.validateFields(this.fields);
    this.pageName = '';
    this.url = '';
  }

  closePage() {
    this.clearFields();
    store.dispatch(updateRoute(''));
  }

  stateChanged(state) {
    this.routePath = state.app.route;
    this.errors = state.app.errors;

    this.clearFields();
    if (this.errors) {
      this._litErrorsChanged();
    }
  }
}
window.customElements.define('bnb-add-page', BnbAddPage);
