import { LitElement, css, html } from 'lit-element';
import '@material/mwc-button/mwc-button';
import '@material/mwc-dialog';
import { connect } from 'pwa-helpers';
import { store } from '../store';
import { stripeCheckout, updateStripeSubscription, deleteStripeSubscription } from '../actions/account';
import { styles } from './bnb-styles';
import './bnb-card';

class BnbSubscriptions extends connect(store)(LitElement) {
  static get properties() {
    return {
      plans: { type: Object },
      currentPlan: { type: Object },
      stripeKey: { type: Object },
    };
  }

  static get styles() {
    return [
      styles,
      css`
      ul {
        list-style-type: none;
        padding-left: 0;
      }

      bnb-card {
        margin-right: 8px;
        margin-bottom: 8px;
        padding-bottom: 0;
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
        color: var(--mdc-theme-primary);
      }

      .card-actions {
        border-top: 1px solid var(--mdc-theme-on-surface);
        height: 36px;
        padding-top: 8px;
        padding-bottom: 8px;
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
      `,
    ];
  }

  render() {
    return html`
    <div class="plans">
      ${this.plans?.map((item, index) => this.renderPlan(item, index))}
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
        If you confirm, your payment informations will be deleted and there will be no more billing.
      </p>
      <mwc-button dialogAction="ok" slot="primaryAction">Yes, I confirm !</mwc-button>
      <mwc-button dialogAction="cancel" slot="secondaryAction">No</mwc-button>
    </mwc-dialog>
    `;
  }

  renderPlan(item, index) {
    return html`
    <bnb-card>
      <div class="card-content">
        <div class="card-header">${item.name}</div>
        <div class="card-price">${item.amount} per month</div>
        <ul>
          <li>
            <span class="card-label">Pages</span>
            <span class="card-value">${item.pages}</span>
          </li>
          <li>
            <span class="card-label">Team members</span>
            <span class="card-value">${this.computeTeamMembers(item.members)}</span>
          </li>
          <li>
            <span class="card-label">Uptime check every</span>
            <span class="card-value">${item.uptime}m</span>
          </li>
        </ul>
      </div>
      <div class="card-actions">
        ${this.renderCardButton(item, index)}
      </div>
    </bnb-card>
    `;
  }

  renderCardButton(item, index) {
    return this.computeHideSubscribe(item, this.currentPlan)
      ? html`<div class="card-current">YOUR CURRENT PLAN</div>`
      : html`<mwc-button @click="${this.subscribeTapped}" data-index="${index}">Subscribe</mwc-button>`;
  }

  firstUpdated() {
    this.shadowRoot.getElementById('freePlanDlg').addEventListener('closed', (e) => this.onFreePlanDialogClosed(e.detail.action));
    this.shadowRoot.getElementById('upgradePlanDlg').addEventListener('closed', (e) => this.onUpgradePlanDialogClosed(e.detail.action));
    this.shadowRoot.getElementById('downgradePlanDlg').addEventListener('closed', (e) => this.onDowngradePlanDialogClosed(e.detail.action));
  }

  stateChanged(state) {
    this.stripeKey = state.app.stripeKey;
    this.plans = state.app.subscriptionPlans;
    this.currentPlan = state.account.stripeSubscription;
  }

  computeTeamMembers(value) {
    return value < 0 ? 'infinite' : value;
  }

  computeHideSubscribe(item, plan) {
    if (item && plan) {
      return plan.pages === item.pages;
    }
    return false;
  }

  subscribeTapped(e) {
    this.selectedPlan = this.plans[e.currentTarget.dataset.index];

    if (this.selectedPlan.id !== -1) {
      if (this.currentPlan.planId === -1) {
        store.dispatch(stripeCheckout(this.stripeKey, this.selectedPlan.id));
      } else if (this.currentPlan.pages > this.selectedPlan.pages) {
        this.shadowRoot.getElementById('downgradePlanDlg').show();
      } else {
        this.shadowRoot.getElementById('upgradePlanDlg').show();
      }
    } else {
      this.shadowRoot.getElementById('freePlanDlg').show();
    }
  }

  onFreePlanDialogClosed(action) {
    if (action === 'ok') {
      store.dispatch(deleteStripeSubscription());
    }
  }

  onUpgradePlanDialogClosed(action) {
    if (action === 'ok') {
      store.dispatch(updateStripeSubscription(this.selectedPlan.id));
    }
  }

  onDowngradePlanDialogClosed(action) {
    if (action === 'ok') {
      store.dispatch(updateStripeSubscription(this.selectedPlan.id));
    }
  }
}

window.customElements.define('bnb-subscriptions', BnbSubscriptions);
