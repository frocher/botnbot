import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@material/mwc-top-app-bar-fixed';
import '@material/mwc-button';
import '@material/mwc-icon-button';
import '@material/mwc-switch';
import '@material/mwc-textfield'
import '@polymer/paper-button/paper-button';
import '@polymer/paper-card/paper-card';
import '@polymer/paper-dialog/paper-dialog';
import { connect } from 'pwa-helpers';
import { store } from '../store';
import { updateRoute } from '../actions/app';
import { updateUser, savePushSubscription } from '../actions/account';
import { BnbFormElement } from './bnb-form-element';
import './bnb-icons';
import './bnb-install-button';
import './bnb-subscriptions';

class BnbAccount extends connect(store)(BnbFormElement(PolymerElement)) {
  static get template() {
    return html`
    <style>
      :host {
        display: flex;
        flex-direction: column;
      }

      mwc-switch {
        display: block;
      }

      mwc-switch span {
        padding-left: 8px;
        vertical-align: text-bottom;
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

      #saveBtn {
        --mdc-theme-primary: white;
      }

      #name {
        margin-bottom: 16px;
      }

    </style>

    <mwc-top-app-bar-fixed>
      <mwc-icon-button id="closeBtn" icon="close" slot="navigationIcon"></mwc-icon-button>
      <div slot="title">My account</div>
      <mwc-button id="saveBtn" slot="actionItems">Save</mwc-button>

      <div id="content">
        <div id="container">
          <h3>General</h3>
          <paper-card>
            <mwc-textfield id="name" label="Name" type="text" outlined value="[[user.name]]"></mwc-textfield>
            <mwc-switch id="pushButton" ?disabled="[[!isNotificationsEnabled()]]"><span>Send me notifications on this device<span></mwc-switch>
          </paper-card>

          <div hidden$="[[!canSubscribe]]">
            <h3>Subscription</h3>
            <bnb-subscriptions></bnb-subscriptions>
          </div>

          <h3>Install</h3>
          <paper-card>
            <div class="card-content">
              You can install a shortcut to launch Botnbot like a native application.
              The button is disabled if your device doesn't allow web applications installation.
            </div>

            <div class="card-actions">
              <bnb-install-button></bnb-install-button>
            </div>
          </paper-card>

        </div>
      </div>
    </mwc-top-app-bar-fixed>

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
      user: Object,
      canSubscribe: Boolean,
      pushKey: {
        type: String,
        observer: 'pushKeyChanged',
      },
      errors: {
        type: Object,
        observer: '_errorsChanged',
      },
    };
  }

  stateChanged(state) {
    this.user = state.account.user;
    this.pushKey = state.app.pushKey;
    this.errors = state.app.errors;
    this.canSubscribe = state.app.stripeKey;
  }

  ready() {
    super.ready();

    this.shadowRoot.getElementById('closeBtn').addEventListener('click', () => this.closeTapped());
    this.shadowRoot.getElementById('saveBtn').addEventListener('click', () => this.saveTapped());

    if (this.isNotificationsEnabled()) {
      this.$.pushButton.addEventListener('checked-changed', this.notificationsChanged.bind(this));

      this.getNotificationPermissionState().then((state) => {
        this.$.pushButton.checked = state === 'granted';
      });
    }
  }

  notificationsChanged() {
    this.$.pushButton.disabled = true;

    if (this.$.pushButton.checked) {
      this.askPermission()
        .then(() => this.subscribeUserToPush())
        .then((subscription) => {
          if (subscription) {
            this.sendSubscriptionToBackEnd(subscription);
          }
          return subscription;
        })
        .then((subscription) => {
          this.$.pushButton.disabled = false;
          this.$.pushButton.checked = subscription !== null;
        })
        .catch(() => {
          this.getNotificationPermissionState().then((state) => {
            this.$.pushButton.disabled = state === 'denied';
          });
          this.$.pushButton.checked = false;
        });
    } else {
      this.unsubscribeUserFromPush();
    }
  }

  pushKeyChanged() {
    if (this.isNotificationsEnabled()) {
      this.$.pushButton.addEventListener('checked-changed', this.notificationsChanged.bind(this));
      this.$.pushButton.disabled = !this.isNotificationsEnabled();
      this.getNotificationPermissionState().then((state) => {
        this.$.pushButton.checked = state === 'granted';
      });
    }
  }

  closeTapped() {
    const nameValue = this.shadowRoot.getElementById('name').value;
    if (nameValue !== this.user.name) {
      this.$.discardDlg.open();
    } else {
      this.closePage();
    }
  }

  closePage() {
    this.validateFields(['name']);
    store.dispatch(updateRoute('home'));
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
      return navigator.permissions.query({ name: 'notifications' }).then(result => result.state);
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
    }).then(pushSubscription => pushSubscription);
  }

  unsubscribeUserFromPush() {
    return this.getSWRegistration()
      .then(registration => registration.pushManager.getSubscription())
      .then((subscription) => {
        if (subscription) {
          return subscription.unsubscribe();
        }
        return undefined;
      })
      .then(() => {
        this.$.pushButton.disabled = false;
        this.$.pushButton.checked = false;
      })
      .catch((err) => {
        console.error('Failed to subscribe the user.', err);
        this.getNotificationPermissionState().then((permissionState) => {
          this.$.pushButton.disabled = permissionState === 'denied';
          this.$.pushButton.checked = false;
        });
      });
  }

  sendSubscriptionToBackEnd(subscription) {
    store.dispatch(savePushSubscription(subscription));
  }

  urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
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
