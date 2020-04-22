import '@material/mwc-formfield';
import '@material/mwc-radio';
import '@material/mwc-textfield';
import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/app-layout/app-layout';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-card/paper-card';
import '@polymer/paper-dialog/paper-dialog';
import '@polymer/paper-icon-button/paper-icon-button';
import { connect } from 'pwa-helpers';
import { store } from '../store';
import { updateRoute } from '../actions/app';
import { createPage } from '../actions/pages';
import { BnbFormElement } from './bnb-form-element';

class BnbAddPage extends connect(store)(BnbFormElement(PolymerElement)) {
  static get template() {
    return html`
    <style>
      :host {
        display: flex;
        flex-direction: column;
      }

      mwc-textfield {
        width: 100%;
      }

      paper-card {
        width: 100%;
        padding: 16px;
      }

      #createBtn {
        margin-left: auto;
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
    </style>

    <app-header-layout>
      <app-header slot="header" fixed condenses shadow>
        <app-toolbar>
          <paper-icon-button icon="bnb:close" on-tap="closeTapped"></paper-icon-button>
          <span class="title">New page</span>
          <paper-button id="createBtn" on-tap="createTapped">Create</paper-button>
        </app-toolbar>
      </app-header>

      <div id="content" class="fit">
        <div id="container">
          <h3>Page informations</h3>
          <paper-card>
            <mwc-textfield id="name" label="Page name" type="text" outlined value="{{pageName}}"></mwc-textfield>
            <mwc-textfield id="url" label="URL" type="url" outlined value="{{url}}"></mwc-textfield>
            <mwc-formfield label="Mobile">
              <mwc-radio id="mobileBtn" name="device" group="deviceGroup" checked></mwc-radio>
            </mwc-formfield>
            <mwc-formfield label="Desktop">
              <mwc-radio id="desktopBtn" name="device" group="deviceGroup"></mwc-radio>
            </mwc-formfield>
          </paper-card>
        </div>
      </div>
    </app-header-layout>

    <paper-dialog id="discard_dlg" modal>
      <p>Discard new page.</p>
      <div class="buttons">
        <paper-button dialog-dismiss>Cancel</paper-button>
        <paper-button dialog-confirm autofocus on-tap="closePage">Discard</paper-button>
      </div>
    </paper-dialog>
    `;
  }

  static get properties() {
    return {
      pageName: String,
      url: String,
      routePath: {
        type: String,
        reflectToAttribute: true,
        observer: '_routePathChanged',
      },
      errors: {
        type: Object,
        observer: '_litErrorsChanged',
      },
    };
  }

  _stateChanged(state) {
    this.routePath = state.app.route;
    this.errors = state.app.errors;
  }

  ready() {
    super.ready();
  }

  closeTapped() {
    if (this.pageName || this.url) {
      this.$.discard_dlg.open();
    } else {
      this.closePage();
    }
  }

  createTapped() {
    this.$.name.setCustomValidity('');
    this.$.url.setCustomValidity('');

    store.dispatch(
      createPage(
        this.shadowRoot.getElementById('name').value,
        this.shadowRoot.getElementById('url').value,
        this.$.mobileBtn.checked ? 'mobile' : 'desktop',
      ),
    );
  }

  clearFields() {
    this.$.name.setCustomValidity('');
    this.$.name.reportValidity();
    this.$.url.setCustomValidity('');
    this.$.url.reportValidity();
    this.pageName = '';
    this.url = '';
  }

  closePage() {
    this.clearFields();
    store.dispatch(updateRoute('home'));
  }

  _routePathChanged(newVal) {
    if (newVal === 'add-page') {
      this.clearFields();
    }
  }
}
window.customElements.define('bnb-add-page', BnbAddPage);
