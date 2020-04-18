import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/app-layout/app-layout';
import '@polymer/iron-a11y-keys/iron-a11y-keys';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-dialog/paper-dialog';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-radio-button/paper-radio-button';
import '@polymer/paper-radio-group/paper-radio-group';
import '@polymer/paper-toggle-button/paper-toggle-button';
import { connect } from 'pwa-helpers';
import { store } from '../store';
import { updateRoute } from '../actions/app';
import { updatePage } from '../actions/pages';
import './bnb-collapse';
import './bnb-common-styles';
import './bnb-divider';
import { BnbFormElement } from './bnb-form-element';
import './bnb-icons';

class BnbEditPage extends connect(store)(BnbFormElement(PolymerElement)) {
  static get template() {
    return html`
    <style include="bnb-common-styles">
      :host {
        @apply --layout-vertical;
      }

      #content {
        @apply --layout-horizontal;
        @apply --layout-center-justified;
      }

      #container {
        width: 100%;
        max-width: 1000px;
        padding: 10px 22px 10px 22px;
        @apply --layout-vertical;
      }

      #slackInformations {
        margin-right: 40px;
        margin-left: 40px;
        @apply --layout-horizontal;
      }

      #slack_webhook {
        margin-right: 16px;
      }
    </style>

    <iron-a11y-keys keys="enter" target="[[target]]" on-keys-pressed="saveTapped">
    </iron-a11y-keys>
    <app-header-layout fullbleed>
      <app-header slot="header" fixed condenses shadow>
        <app-toolbar>
          <paper-icon-button icon="bnb:close" on-tap="closeTapped"></paper-icon-button>
          <span class="title">Edit page</span>
          <span class="flex"></span>
          <paper-button on-tap="saveTapped">Save</paper-button>
        </app-toolbar>
      </app-header>
      <div id="content" class="fit">
        <div id="container">
          <bnb-collapse icon="bnb:info" header="General">
            <paper-input id="name" label="Page name" value="[[page.name]]" autofocus="true"></paper-input>
            <paper-input id="url" label="URL" value="[[page.url]]"></paper-input>
            <paper-radio-group id="device" selected="[[page.device]]">
              <paper-radio-button name="mobile">Mobile</paper-radio-button>
              <paper-radio-button name="desktop">Desktop</paper-radio-button>
            </paper-radio-group>
          </bnb-collapse>
          <bnb-divider></bnb-divider>
          <bnb-collapse icon="bnb:timeline" header="Uptime check">
            <paper-input id="uptimeKeyword" value="[[page.uptime_keyword]]" label="Keyword"></paper-input>
            <paper-radio-group id="uptimeKeywordType" selected="[[page.uptime_keyword_type]]">
              <paper-radio-button name="presence">Presence</paper-radio-button>
              <paper-radio-button name="absence">Absence</paper-radio-button>
            </paper-radio-group>
          </bnb-collapse>
          <bnb-divider></bnb-divider>
          <bnb-collapse icon="bnb:sms" header="Notifications">
            <paper-toggle-button id="mail_notify" checked="[[page.mail_notify]]">by mail</paper-toggle-button>
            <paper-toggle-button id="push_notify" checked="[[page.push_notify]]">by push</paper-toggle-button>
            <paper-toggle-button id="slack_notify" checked="{{page.slack_notify}}">by Slack</paper-toggle-button>
            <div id="slackInformations" hidden$="[[!page.slack_notify]]">
              <paper-input class="flex" id="slack_webhook" label="Webhook URL" value="[[page.slack_webhook]]"></paper-input>
              <paper-input class="flex" id="slack_channel" label="Channel" value="[[page.slack_channel]]">
                <div prefix>#</div>
              </paper-input>
            </div>
          </bnb-collapse>
          <bnb-divider></bnb-divider>
        </div>
      </div>
    </app-header-layout>

    <paper-dialog id="discardDlg" modal>
      <p>Discard edit.</p>
      <div class="buttons">
        <paper-button dialog-dismiss>Cancel</paper-button>
        <paper-button dialog-confirm autofocus on-tap="closePage">Discard</paper-button>
      </div>
    </paper-dialog>
    `;
  }

  static get properties() {
    return {
      page: Object,
      target: Object,
      errors: {
        type: Object,
        observer: '_errorsChanged',
      },
    };
  }

  _stateChanged(state) {
    this.page = state.app.page;
    this.errors = state.app.errors;
  }

  ready() {
    super.ready();
    this.target = this.$.content;
  }

  closeTapped() {
    if (this.$.name.value !== this.page.name || this.$.url.value !== this.page.url) {
      this.$.discardDlg.open();
    } else {
      this.closePage();
    }
  }

  closePage() {
    this.validateFields();
    store.dispatch(updateRoute(`page/${this.page.id}`));
  }

  saveTapped() {
    this.validateFields();
    const page = {
      name: this.$.name.value,
      url: this.$.url.value,
      device: this.$.device.selected,
      uptime_keyword: this.$.uptimeKeyword.value,
      uptime_keyword_type: this.$.uptimeKeywordType.selected,
      mail_notify: this.$.mail_notify.checked,
      push_notify: this.$.push_notify.checked,
      slack_notify: this.$.slack_notify.checked,
      slack_webhook: this.$.slack_webhook.value,
      slack_channel: this.$.slack_channel.value,
    };
    store.dispatch(updatePage(this.page.id, page));
  }

  validateFields() {
    this.$.name.invalid = false;
    this.$.url.invalid = false;
    this.$.uptimeKeyword.invalid = false;
    this.$.slack_webhook.invalid = false;
    this.$.slack_channel.invalid = false;
  }
}

window.customElements.define('bnb-edit-page', BnbEditPage);
