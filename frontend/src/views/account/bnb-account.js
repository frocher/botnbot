import { LitElement, css, html } from 'lit';
import '@material/mwc-button';
import '@material/mwc-dialog';
import '@material/mwc-formfield';
import '@material/mwc-icon-button';
import '@material/mwc-switch';
import '@material/mwc-textfield';
import '@material/mwc-top-app-bar-fixed';
import { connect } from 'pwa-helpers';
import { store } from '../../state/store';
import { updateRoute } from '../../state/app/actions';
import { deleteUser, updateUser, savePushSubscription } from '../../state/account/actions';
import { BnbFormElement } from '../components/bnb-form-element';
import '../components/bnb-card';
import './bnb-install-button';
import './bnb-subscriptions';
import { styles } from '../components/bnb-styles';

class BnbAccount extends connect(store)(BnbFormElement(LitElement)) {
  static get properties() {
    return {
      user: { type: Object },
      canSubscribe: { type: Boolean },
      pushKey: { type: String },
      errors: { type: Object },
      pushState: { type: Boolean },
    };
  }

  static get styles() {
    return [
      styles,
      css`
      :host {
        display: flex;
        flex-direction: column;
      }

      mwc-textfield {
        width: 100%;
      }

      h3.danger {
        color: var(--mdc-theme-error);
      }

      mwc-button.danger {
        --mdc-theme-primary: #cf6679;
        --mdc-theme-on-primary: white;
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

      #saveBtn {
        display: block;
        margin-top: 12px;
      }
      `,
    ];
  }

  render() {
    return html`
    <mwc-top-app-bar-fixed>
      <mwc-icon-button icon="arrow_back" slot="navigationIcon" @click="${this.backTapped}"></mwc-icon-button>
      <div slot="title">My account</div>

      <div id="content">
        <div id="container">
          <h3>General</h3>
          <bnb-card>
            <div class="card-content">
              <mwc-textfield id="name" label="Name" type="text" outlined value="${this.user?.name}"></mwc-textfield>
              <mwc-formfield label="Send me notifications on this device">
                <mwc-switch id="pushButton"></mwc-switch>
              </mwc-formfield>
              <mwc-formfield label="Send me weekly email report">
                <mwc-switch id="weeklyReportButton" ?selected="${this.user?.weekly_report}"></mwc-switch>
              </mwc-formfield>
            </div>
            <mwc-button id="saveBtn">Save</mwc-button>
          </bnb-card>

          ${this.renderSubscription()}

          <h3>Install</h3>
          <bnb-card>
            <div class="card-content">
              <div>
              You can install a shortcut to launch Botnbot like a native application.
              The button is disabled if your device doesn't allow web applications installation.
              </div>
              <bnb-install-button id="installBtn"></bnb-install-button>
            </div>
          </bnb-card>

          <h3 class="danger">Danger zone</h3>
          <bnb-card>
            <div class="card-content">
              <div>
              If you delete your account, all your data will be definitly erased, including your shared monitored pages.
              You won't be able to retrieve them even if you recreate your account.
              </div>
              <mwc-button id="deleteAccountBtn" class="danger" slot="actionItems">Delete my account</mwc-button>
            </div>
          </bnb-card>

        </div>
      </div>
    </mwc-top-app-bar-fixed>

    <mwc-dialog id="deleteAccountDlg" modal>
      <p>Confim your account deletion by entering your email address.</p>
      <mwc-textfield id="deleteAccountEmail" label="Email" type="text" outlined></mwc-textfield>
      <mwc-button class="danger" dialogAction="ok" slot="primaryAction">Delete my account</mwc-button>
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
    this.shadowRoot.getElementById('saveBtn').addEventListener('click', () => this.saveTapped());
    this.shadowRoot.getElementById('deleteAccountBtn').addEventListener('click', () => this.deleteAccountTapped());
    this.shadowRoot.getElementById('deleteAccountDlg').addEventListener('closed', (e) => this.onDeleteAccountDialogClosed(e.detail.action));

    this.updatePushState();
  }

  updatePushState() {
    const pushButton = this.shadowRoot.getElementById('pushButton');
    if (this.isNotificationsEnabled()) {
      pushButton.disabled = false;
      this.getSWRegistration()
        .then((registration) => registration.pushManager.getSubscription()).then((subscription) => {
          if (subscription) {
            this.getNotificationPermissionState().then((state) => {
              this.pushState = state === 'granted';
              pushButton.selected = this.pushState;
            });
          } else {
            this.pushState = false;
            pushButton.selected = this.pushState;
          }
        });
    } else {
      this.pushState = false;
      pushButton.disabled = true;
      pushButton.selected = this.pushState;
    }
  }

  updateSubscription() {
    const pushButton = this.shadowRoot.getElementById('pushButton');

    if (!pushButton.disabled && pushButton.selected !== this.pushState) {
      if (pushButton.selected) {
        this.askPermission()
          .then(() => this.subscribeUserToPush())
          .then((subscription) => {
            if (subscription) {
              this.sendSubscriptionToBackEnd(subscription);
            }
            return subscription;
          })
          .then(() => {
            this.updatePushState();
          })
          .catch(() => {
            this.updatePushState();
          });
      } else {
        this.unsubscribeUserFromPush();
        this.updatePushState();
      }
    }
  }

  pushKeyChanged() {
    const pushButton = this.shadowRoot.getElementById('pushButton');
    if (pushButton) {
      this.updatePushState();
    }
  }

  backTapped() {
    this.closePage();
  }

  closePage() {
    this.validateFields(['name']);
    store.dispatch(updateRoute(''));
  }

  saveTapped() {
    this.validateFields(['name']);
    const user = {
      name: this.shadowRoot.getElementById('name').value,
      weekly_report: this.shadowRoot.getElementById('weeklyReportButton').selected,
    };
    store.dispatch(updateUser(this.user.id, user));
    this.updateSubscription();
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
        return subscription;
      })
      .then(() => {
        this.updatePushState();
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to subscribe the user.', err);
        this.updatePushState();
      });
  }

  sendSubscriptionToBackEnd(subscription) {
    store.dispatch(savePushSubscription(subscription));
  }

  deleteAccountTapped() {
    this.shadowRoot.getElementById('deleteAccountDlg').show();
  }

  onDeleteAccountDialogClosed(action) {
    if (action === 'ok') {
      const email = this.shadowRoot.getElementById('deleteAccountEmail').value;
      store.dispatch(deleteUser(this.user.id, email));
    }
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
