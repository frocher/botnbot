import '@material/mwc-button/mwc-button';
import '@material/mwc-dialog';
import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/polymer/lib/elements/dom-repeat';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-card/paper-card';
import { connect } from 'pwa-helpers';
import { store } from '../store';
import { createStripeSubscription, updateStripeSubscription, deleteStripeSubscription } from '../actions/account';
import './bnb-common-styles';

class BnbSubscriptions extends connect(store)(PolymerElement) {
  static get template() {
    return html`
    <style include="bnb-common-styles">
      ul {
        list-style-type: none;
        padding-left: 0;
      }
      paper-card {
        margin-right: 8px;
        margin-bottom: 8px;
      }
      .plans {
        display: grid;
        grid-template-columns: 25% 25% 25% 25%;
        padding: 8px;
      }
      .card-header {
        font-size: 28px;
      }
      .card-price {
        font-size: 20px;
      }
      .card-label {
        padding-right: 8px;
      }
      .card-value {
        float: right;
        font-weight: bold;
      }
      .card-current {
        margin-top: 8px;
        font-weight: bold;
        color: var(--google-blue-300);
      }
      @media (max-width: 850px) {
        .plans {
          grid-template-columns: 50% 50%;
        }
      }
      @media (max-width: 500px) {
        .plans {
          grid-template-columns: 100%;
        }
      }
    </style>
    <div class="plans">
      <template is="dom-repeat" items="[[plans]]">
        <paper-card>
          <div class="card-content">
            <div class="card-header">[[item.name]]</div>
            <div class="card-price">$[[item.amount]] per month</div>
            <ul>
              <li>
                <span class="card-label">Pages</span>
                <span class="card-value">[[item.pages]]</span>
              </li>
              <li>
                <span class="card-label">Team members</span>
                <span class="card-value">[[_computeTeamMembers(item.members)]]</span>
              </li>
              <li>
                <span class="card-label">Uptime check every</span>
                <span class="card-value">[[item.uptime]]m</span>
              </li>
            </ul>
          </div>
          <div class="card-actions">
            <paper-button hidden$="[[_computeHideSubscribe(item, currentPlan)]]" on-tap="_subscribeTapped">Subscribe</paper-button>
            <div class="card-current" hidden$="[[!_computeHideSubscribe(item, currentPlan)]]">YOUR CURRENT PLAN</div>
          </div>
        </paper-card>
      </template>
    </div>
    <mwc-dialog id="downgradePlanDlg" heading="Downgrading your plan">
      <p>You are downgrading your current plan.
        If you have more pages than the future plan allows, you will not loose your current data
        but the monitoring for the more recent pages will be stopped.
        Are you sure to downgrade ?</p>
      <mwc-button dialogAction="ok" slot="primaryAction">Yes, sure !</mwc-button>
      <mwc-button dialogAction="cancel" slot="secondaryAction">No</mwc-button>
    </mwc-dialog>
    <mwc-dialog id="upgradePlanDlg" heading="Upgrading your plan">
      <p>Thank you for choosing a better plan. Can you please confirm your choice to upgrade your subscription ?</p>
      <mwc-button dialogAction="ok" slot="primaryAction">Yes, I confirm</mwc-button>
      <mwc-button dialogAction="cancel" slot="secondaryAction">No</mwc-button>
    </mwc-dialog>
    <mwc-dialog id="freePlanDlg" heading="Free Plan">
      <p>You have chosen to go back to free plan.
        If you have more pages than the free plan allows, you will not loose your current data
        but the monitoring for the more recent pages will be stopped.
        Are you sure to downgrade to free plan ?
        If you confirm, your paiement informations will be deleted and there will be no more billing.
      </p>
      <mwc-button dialogAction="ok" slot="primaryAction">Yes, I confirm !</mwc-button>
      <mwc-button dialogAction="cancel" slot="secondaryAction">No</mwc-button>
    </mwc-dialog>
    `;
  }

  static get properties() {
    return {
      plans: Object,
      currentPlan: Object,
      stripeKey: Object,
    };
  }

  ready() {
    super.ready();
    this.checkout = this._initCheckout();
    window.addEventListener('popstate', () => this.checkout.close());
    this.$.freePlanDlg.addEventListener('closed', (e) => this._onFreePlanDialogClosed(e.detail.action));
    this.$.upgradePlanDlg.addEventListener('closed', (e) => this._onUpgradePlanDialogClosed(e.detail.action));
    this.$.downgradePlanDlg.addEventListener('closed', (e) => this._onDowngradePlanDialogClosed(e.detail.action));
  }

  _stateChanged(state) {
    this.stripeKey = state.app.stripeKey;
    this.plans = state.app.subscriptionPlans;
    this.currentPlan = state.app.stripeSubscription;
  }

  _computeTeamMembers(value) {
    return value < 0 ? 'infinite' : value;
  }

  _computeHideSubscribe(item, plan) {
    if (item && plan) {
      return plan.pages === item.pages;
    }
    return false;
  }

  _subscribeTapped(e) {
    this.selectedPlan = e.model.item;

    if (this.selectedPlan.id !== -1) {
      if (this.currentPlan.planId === -1) {
        const config = {
          amount: e.model.item.amount * 100,
          key: this.stripeKey,
          name: e.model.item.name,
        };
        this.checkout.open(config);
      } else if (this.currentPlan.pages > this.selectedPlan.pages) {
        this.$.downgradePlanDlg.show();
      } else {
        this.$.upgradePlanDlg.show();
      }
    } else {
      this.$.freePlanDlg.show();
    }
  }

  _onFreePlanDialogClosed(action) {
    if (action === 'ok') {
      store.dispatch(deleteStripeSubscription());
    }
  }

  _onUpgradePlanDialogClosed(action) {
    if (action === 'ok') {
      store.dispatch(updateStripeSubscription(this.selectedPlan.id));
    }
  }

  _onDowngradePlanDialogClosed(action) {
    if (action === 'ok') {
      store.dispatch(updateStripeSubscription(this.selectedPlan.id));
    }
  }

  _initCheckout() {
    return StripeCheckout.configure({
      allowRememberMe: true,
      locale: 'auto',
      image: 'https://my.botnbot.com/images/ms-touch-icon-144x144-precomposed.png',
      key: this.stripeKey,
      zipCode: true,
      token: (token) => {
        store.dispatch(createStripeSubscription(token.email, token.id, this.selectedPlan.id));
      },
    });
  }
}

window.customElements.define('bnb-subscriptions', BnbSubscriptions);