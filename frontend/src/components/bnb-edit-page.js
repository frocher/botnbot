import { LitElement, css, html } from 'lit-element';
import '@material/mwc-button';
import '@material/mwc-dialog';
import '@material/mwc-formfield';
import '@material/mwc-icon-button';
import '@material/mwc-radio';
import '@material/mwc-switch';
import '@material/mwc-textfield';
import '@polymer/paper-card/paper-card';
import { connect } from 'pwa-helpers';
import { store } from '../store';
import { updateRoute } from '../actions/app';
import { updatePage } from '../actions/pages';
import { BnbFormElement } from './bnb-form-element';
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
      margin-left: 12px;
      --mdc-theme-surface: var(--mdc-theme-text-primary-on-background);
      --mdc-theme-on-surface: var(--mdc-theme-text-primary-on-background);
    }

    mwc-switch {
      padding-left: 8px;
    }

    .mdc-label {
      margin-top: -12px !important;
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
      margin-top: 12px;
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
            <mwc-formfield label="Mobile">
              <mwc-radio id="mobileBtn" name="device" ?checked="${this.device === 'mobile'}"></mwc-radio>
            </mwc-formfield>
            <mwc-formfield label="Desktop">
              <mwc-radio id="desktopBtn" name="device" ?checked="${this.device === 'desktop'}"></mwc-radio>
            </mwc-formfield>
          </paper-card>
          <h3>Uptime check</h3>
          <paper-card>
            <mwc-textfield id="uptimeKeyword" type="text" label="Keyword" outlined value="${this.uptimeKeyword}"></mwc-textfield>
            <mwc-formfield label="Presence">
              <mwc-radio id="presenceBtn" name="uptimeKeywordType" ?checked="${this.uptimeKeywordType === 'presence'}"></mwc-radio>
            </mwc-formfield>
            <mwc-formfield label="Absence">
              <mwc-radio id="absenceBtn" name="uptimeKeywordType" ?checked="${this.uptimeKeywordType === 'absence'}"></mwc-radio>
            </mwc-formfield>
          </paper-card>
          <h3>Notifications</h3>
          <paper-card>
            <mwc-formfield label="by mail">
              <mwc-switch id="mailNotify" ?checked="${this.mailNotify}"></mwc-switch>
            </mwc-formfield>
            <mwc-formfield label="by push">
              <mwc-switch id="pushNotify" ?checked="${this.pushNotify}"></mwc-switch>
            </mwc-formfield>
            <mwc-formfield label="by Slack">
              <mwc-switch id="slackNotify" ?checked="${this.slackNotify}"></mwc-switch>
            </mwc-formfield>
            ${this.renderSlackInformations()}
          </paper-card>
        </div>
      </div>
    </bnb-top-app-bar>

    <mwc-dialog id="discardDlg">
      <p>Are you sure you want to discard your modifications.</p>
      <mwc-button dialogAction="ok" slot="primaryAction">Discard</mwc-button>
      <mwc-button dialogAction="cancel" slot="secondaryAction">Cancel</mwc-button>
    </mwc-dialog>
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
    this.shadowRoot.getElementById('closeBtn').addEventListener('click', () => this.closeTapped());
    this.shadowRoot.getElementById('saveBtn').addEventListener('click', () => this.saveTapped());
    this.shadowRoot.getElementById('discardDlg').addEventListener('closed', (e) => this.discardDialogClosed(e.detail.action));
  }

  slackNotifyChanged() {
    this.slackNotify = this.shadowRoot.getElementById('slackNotify').checked;
  }

  discardDialogClosed(action) {
    if (action === 'ok') {
      this.closePage();
    }
  }

  closeTapped() {
    const nameValue = this.shadowRoot.getElementById('name').value;
    const urlValue = this.shadowRoot.getElementById('url').value;
    if (nameValue !== this.name || urlValue !== this.url) {
      this.shadowRoot.getElementById('discardDlg').show();
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

    const device = this.shadowRoot.getElementById('mobileBtn').checked ? 'mobile' : 'desktop';
    const uptimeKeywordType = this.shadowRoot.getElementById('presenceBtn').checked ? 'presence' : 'absence';
    const page = {
      name: this.shadowRoot.getElementById('name').value,
      url: this.shadowRoot.getElementById('url').value,
      device,
      uptime_keyword: this.shadowRoot.getElementById('uptimeKeyword').value,
      uptime_keyword_type: uptimeKeywordType,
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
