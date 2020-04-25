import { LitElement, css, html } from 'lit-element';
import '@material/mwc-button';
import '@material/mwc-icon-button';
import '@material/mwc-switch';
import '@material/mwc-textfield';
import '@polymer/app-layout/app-layout';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-card/paper-card';
import '@polymer/paper-dialog/paper-dialog';
import '@polymer/paper-radio-button/paper-radio-button';
import '@polymer/paper-radio-group/paper-radio-group';
import { connect } from 'pwa-helpers';
import { store } from '../store';
import { updateRoute } from '../actions/app';
import { updatePage } from '../actions/pages';
import { BnbFormElement } from './bnb-form-element';
import './bnb-icons';
import './bnb-top-app-bar';

class BnbEditPage extends connect(store)(BnbFormElement(LitElement)) {
  static get styles() {
    return css`
    :host {
      display: flex;
      flex-direction: column;
    }

    paper-card {
      width: 100%;
      padding: 16px;
    }

    mwc-switch {
      display: block;
      margin-bottom: 8px;
    }

    mwc-switch span {
      padding-left: 8px;
      vertical-align: text-bottom;
    }

    mwc-textfield {
      width: 100%;
    }

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

    #name {
      margin-bottom: 16px;
    }

    #slackInformations {
      display: flex;
      flex-direction: row;
      margin-right: 40px;
      margin-left: 40px;
    }

    #slack_webhook {
      margin-right: 16px;
    }
    `;
  }

  render() {
    return html`
    <bnb-top-app-bar>
      <mwc-icon-button id="closeBtn" icon="close" slot="navigationIcon"></mwc-icon-button>
      <span slot="title">Edit page</span>
      <mwc-button id="saveBtn" slot="actionItems">Save</mwc-button>

      <div id="content">
        <div id="container">
          <h3>General</h3>
          <paper-card>
            <mwc-textfield id="name" type="text" label="Page name" outlined value="${this.name}"></mwc-textfield>
            <mwc-textfield id="url" type="url" label="URL" outlined value="${this.url}"></mwc-textfield>
            <paper-radio-group id="device" selected="${this.device}">
              <paper-radio-button name="mobile">Mobile</paper-radio-button>
              <paper-radio-button name="desktop">Desktop</paper-radio-button>
            </paper-radio-group>
          </paper-card>
          <h3>Uptime check</h3>
          <paper-card>
            <mwc-textfield id="uptimeKeyword" type="text" label="Keyword" outlined value="${this.uptimeKeyword}"></mwc-textfield>
            <paper-radio-group id="uptimeKeywordType" selected="${this.uptimeKeywordType}">
              <paper-radio-button name="presence">Presence</paper-radio-button>
              <paper-radio-button name="absence">Absence</paper-radio-button>
            </paper-radio-group>
          </paper-card>
          <h3>Notifications</h3>
          <paper-card>
            <mwc-switch id="mailNotify" ?checked="${this.mailNotify}"><span>by mail<span></mwc-switch>
            <mwc-switch id="pushNotify" ?checked="${this.pushNotify}"><span>by push<span></mwc-switch>
            <mwc-switch id="slackNotify" ?checked="${this.slackNotify}"><span>by Slack</span></mwc-switch>
            ${this.renderSlackInformations()}
          </paper-card>
        </div>
      </div>
    </bnb-top-app-bar>

    <paper-dialog id="discardDlg" modal>
      <p>Discard edit.</p>
      <div class="buttons">
        <paper-button dialog-dismiss>Cancel</paper-button>
        <paper-button id="confirmBtn" dialog-confirm>Discard</paper-button>
      </div>
    </paper-dialog>
    `;
  }

  renderSlackInformations() {
    if (this.slackNotify) {
      return html`
        <div id="slackInformations" >
          <mwc-textfield class="flex" id="slackWebhook" type="url" label="Webhook URL" outlined value="${this.slackWebhook}"></mwc-textfield>
          <mwc-textfield class="flex" id="slackChannel" type="text" label="Channel" prefix="#" outlined value="${this.slackChannel}"></mwc-textfield>
        </div>
      `;
    }
    return html``;
  }

  static get properties() {
    return {
      pageId: { type: Number },
      name: { type: String },
      url: { type: String },
      device: { type: String },
      uptimeKeyword: { type: String },
      uptimeKeywordType: { type: String },
      mailNotify: { type: Boolean },
      pushNotify: { type: Boolean },
      slackNotify: { type: Boolean },
      slackWebhook: { type: String },
      slackChannel: { type: String },
      errors: { type: Object },
    };

  }

  get fields() {
    return ['name', 'url', 'uptimeKeyword', 'slack_webhook', 'slack_channel'];
  }

  stateChanged(state) {
    const page = state.pages.current;
    if (page) {
      this.pageId = page.id;
      this.name = page.name;
      this.url = page.url;
      this.device = page.device;
      this.uptimeKeyword = page.uptime_keyword;
      this.uptimeKeywordType = page.uptime_keyword_type;
      this.mailNotify = page.mail_notify;
      this.pushNotify = page.push_notify;
      this.slackNotify = page.slack_notify;
      this.slackWebhook = page.slack_webhook;
      this.slackChannel = page.slack_channel;
    }
    this.errors = state.app.errors;

    if (this.errors) {
      this._litErrorsChanged();
    }
  }

  firstUpdated() {
    this.shadowRoot.getElementById('slackNotify').addEventListener('change', () => this.slackNotifyChanged());
    this.shadowRoot.getElementById('closeBtn').addEventListener('tap', () => this.closeTapped());
    this.shadowRoot.getElementById('saveBtn').addEventListener('tap', () => this.saveTapped());
    this.shadowRoot.getElementById('confirmBtn').addEventListener('tap', () => this.closePage());
  }

  slackNotifyChanged() {
    this.slackNotify = this.shadowRoot.getElementById('slackNotify').checked;
  }

  closeTapped() {
    const nameValue = this.shadowRoot.getElementById('name').value;
    const urlValue = this.shadowRoot.getElementById('url').value;
    if (nameValue !== this.name || urlValue !== this.url) {
      this.shadowRoot.getElementById('discardDlg').open();
    } else {
      this.closePage();
    }
  }

  closePage() {
    this.validateFields(this.fields);
    store.dispatch(updateRoute(`page/${this.pageId}`));
  }

  saveTapped() {
    this.validateFields(this.fields);
    const page = {
      name: this.shadowRoot.getElementById('name').value,
      url: this.shadowRoot.getElementById('url').value,
      device: this.shadowRoot.getElementById('device').selected,
      uptime_keyword: this.shadowRoot.getElementById('uptimeKeyword').value,
      uptime_keyword_type: this.shadowRoot.getElementById('uptimeKeywordType').selected,
      mail_notify: this.shadowRoot.getElementById('mailNotify').checked,
      push_notify: this.shadowRoot.getElementById('pushNotify').checked,
      slack_notify: this.shadowRoot.getElementById('slackNotify').checked,
    };

    if (page.slack_notify) {
      page.slack_webhook = this.shadowRoot.getElementById('slackWebhook').value;
      page.slack_channel = this.shadowRoot.getElementById('slackChannel').value;
    }

    store.dispatch(updatePage(this.pageId, page));
  }
}

window.customElements.define('bnb-edit-page', BnbEditPage);
