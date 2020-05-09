import { LitElement, css, html } from 'lit-element';
import '@material/mwc-button';
import '@material/mwc-dialog';
import '@material/mwc-formfield';
import '@material/mwc-icon-button';
import '@material/mwc-switch';
import '@material/mwc-textfield';
import '@polymer/paper-card/paper-card';
import { connect } from 'pwa-helpers';
import { store } from '../store';
import { updateRoute } from '../actions/app';
import { updateUser, savePushSubscription } from '../actions/account';
import { BnbFormElement } from './bnb-form-element';
import './bnb-icons';
import './bnb-install-button';
import './bnb-subscriptions';
import './bnb-top-app-bar';

class BnbAccount extends connect(store)(BnbFormElement(LitElement)) {
  static get properties() {
    return {
      user: { type: Object },
      canSubscribe: { type: Boolean },
      pushKey: { type: String },
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

    paper-card {
      width: 100%;
      padding: 16px;
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

    #installBtn {
      display: block;
      margin-top: 12px;
    }
    `;
  }

  render() {
    return html`
    <bnb-top-app-bar>
      <mwc-icon-button id="closeBtn" icon="close" slot="navigationIcon"></mwc-icon-button>
      <div slot="title">My account</div>
      <mwc-button id="saveBtn" slot="actionItems">Save</mwc-button>

      <div id="content">
        <div id="container">
          <h3>General</h3>
          <paper-card>
            <mwc-textfield id="name" label="Name" type="text" outlined value="${this.user.name}"></mwc-textfield>
            <mwc-formfield label="Send me notifications on this device">
              <mwc-switch id="pushButton" ?disabled="${!this.isNotificationsEnabled()}"></mwc-switch>
            </mwc-formfield>
          </paper-card>

          ${this.renderSubscription()}

          <h3>Install</h3>
          <paper-card>
            <div class="card-content">
              <div>
              You can install a shortcut to launch Botnbot like a native application.
              The button is disabled if your device doesn't allow web applications installation.
              </div>
              <bnb-install-button id="installBtn"></bnb-install-button>
            </div>
          </paper-card>

        </div>
      </div>
    </bnb-top-app-bar>

    <mwc-dialog id="discardDlg" modal>
      <p>Discard edit.</p>
      <mwc-button dialogAction="ok" slot="primaryAction">Discard</mwc-button>
      <mwc-button dialogAction="cancel" slot="secondaryAction">Cancel</mwc-button>
    </mwc-dialog>
    `;
  }

  renderSubscription() {
    return this.canSubscribe
      ? html`
      <div>
        <h3>Subscription</h3>
        <bnb-subscriptions></bnb-subscriptions>
      </div>
      `
      : html``;
  }


  stateChanged(state) {
    this.user = state.account.user;
    this.errors = state.app.errors;
    this.canSubscribe = state.app.stripeKey;

    if (this.pushKey !== state.app.pushKey) {
      this.pushKey = state.app.pushKey;
      this.pushKeyChanged();
    }

    if (this.errors) {
      this._litErrorsChanged();
    }
  }

  firstUpdated() {
    this.shadowRoot.getElementById('closeBtn').addEventListener('click', () => this.closeTapped());
    this.shadowRoot.getElementById('saveBtn').addEventListener('click', () => this.saveTapped());
    this.shadowRoot.getElementById('discardDlg').addEventListener('closed', (e) => this.onDiscardDialogClosed(e.detail.action));

    if (this.isNotificationsEnabled()) {
      this.shadowRoot.getElementById('pushButton').addEventListener('change', () => this.notificationsChanged());

      this.getNotificationPermissionState().then((state) => {
        this.shadowRoot.getElementById('pushButton').checked = state === 'granted';
      });
    }
  }

  notificationsChanged() {
    const pushButton = this.shadowRoot.getElementById('pushButton');
    pushButton.disabled = true;

    if (pushButton.checked) {
      this.askPermission()
        .then(() => this.subscribeUserToPush())
        .then((subscription) => {
          if (subscription) {
            this.sendSubscriptionToBackEnd(subscription);
          }
          return subscription;
        })
        .then((subscription) => {
          pushButton.disabled = false;
          pushButton.checked = subscription !== null;
        })
        .catch(() => {
          this.getNotificationPermissionState().then((state) => {
            pushButton.disabled = state === 'denied';
          });
          pushButton.checked = false;
        });
    } else {
      this.unsubscribeUserFromPush();
    }
  }

  pushKeyChanged() {
    const pushButton = this.shadowRoot.getElementById('pushButton');
    if (pushButton && this.isNotificationsEnabled()) {
      pushButton.addEventListener('checked-changed', this.notificationsChanged.bind(this));
      pushButton.disabled = !this.isNotificationsEnabled();
      this.getNotificationPermissionState().then((state) => {
        pushButton.checked = state === 'granted';
      });
    }
  }

  closeTapped() {
    const nameValue = this.shadowRoot.getElementById('name').value;
    if (nameValue !== this.user.name) {
      this.shadowRoot.getElementById('discardDlg').show();
    } else {
      this.closePage();
    }
  }

  onDiscardDialogClosed(action) {
    if (action === 'ok') {
      this.closePage();
    }
  }

  closePage() {
    this.validateFields(['name']);
    store.dispatch(updateRoute(''));
  }

  saveTapped() {
    this.validateFields(['name']);
    const user = { name: this.shadowRoot.getElementById('name').value };
    store.dispatch(updateUser(this.user.id, user));
  }

  askPermission() {
    return new Promise((resolve, reject) => {
      const permissionResult = Notification.requestPermission((result) => {
        resolve(result);
      });

      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    }).then((permissionResult) => {
      if (permissionResult !== 'granted') {
        throw new Error('We weren\'t granted permission.');
      }
    });
  }

  getNotificationPermissionState() {
    if (navigator.permissions) {
      return navigator.permissions.query({ name: 'notifications' }).then((result) => result.state);
    }

    return new Promise((resolve) => {
      resolve(Notification.permission);
    });
  }

  isNotificationsEnabled() {
    return this.pushKey && 'serviceWorker' in navigator && 'PushManager' in window;
  }

  getSWRegistration() {
    return navigator.serviceWorker.getRegistration();
  }

  subscribeUserToPush() {
    return this.getSWRegistration().then((registration) => {
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: this.urlB64ToUint8Array(this.pushKey),
      };

      return registration.pushManager.subscribe(subscribeOptions);
    }).then((pushSubscription) => pushSubscription);
  }

  unsubscribeUserFromPush() {
    return this.getSWRegistration()
      .then((registration) => registration.pushManager.getSubscription())
      .then((subscription) => {
        if (subscription) {
          return subscription.unsubscribe();
        }
        return undefined;
      })
      .then(() => {
        const pushButton = this.shadowRoot.getElementById('pushButton');
        pushButton.disabled = false;
        pushButton.checked = false;
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to subscribe the user.', err);
        this.getNotificationPermissionState().then((permissionState) => {
          const pushButton = this.shadowRoot.getElementById('pushButton');
          pushButton.disabled = permissionState === 'denied';
          pushButton.checked = false;
        });
      });
  }

  sendSubscriptionToBackEnd(subscription) {
    store.dispatch(savePushSubscription(subscription));
  }

  urlB64ToUint8Array(base64String) {
    // eslint-disable-next-line no-mixed-operators
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    // eslint-disable-next-line no-useless-escape
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i += 1) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

window.customElements.define('bnb-account', BnbAccount);
