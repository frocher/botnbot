import { LitElement, css, html } from 'lit';
import '@material/mwc-button/mwc-button';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-select';
import { connect } from 'pwa-helpers';
import { store } from '../../state/store';
import { stripeCheckout, stripeManageSubscription } from '../../state/stripe/actions';
import { styles } from '../components/bnb-styles';
import '../components/bnb-card';

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

      #currentPlan {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        padding-bottom: 8px;
      }

      #currentPlan span {
        padding-right: 8px;
        min-width: 350px;
      }

      .dollar {
        font-size: 0.6em;
        vertical-align: top;
        position: relative;
        line-height: 2em;
      }

      .currency {
        font-size: 0.5em;
        position: absolute;
        bottom: -2.4em;
        right: -0.35em;
        font-weight: normal;
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
        font-size: 22px;
      }

      .card-label {
        padding-right: 8px;
      }

      .card-value {
        float: right;
        font-weight: bold;
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
    <bnb-card>${this.renderCurrentPlan()}</bnb-card>
    <div class="plans">
      ${this.plans?.map((item) => this.renderPlan(item))}
    </div>
    `;
  }

  renderCurrentPlan() {
    if (!this.currentPlan) {
      return html``;
    }

    if (this.currentPlan.planId === -1) {
      return html`
        <div id="currentPlan">
          <span>You are currently on the <strong>Free Plan</strong>. Select one of the following plans to suscribe to :</span>
          <mwc-select id="plansSelect" outlined>
            ${this.plans?.map((item, index) => this.renderPlanItem(item, index))}
          </mwc-select>
          <mwc-button id="suscribeBtn" @click="${this.subscribeTapped}">Subscribe</mwc-button>
        </div>
      `;
    }
    const plan = this.findPlanById(this.currentPlan.planId);
    return html`
      <div id="currentPlan">
        <span>Your are currently on the <strong>${plan.name}</strong> plan.
          You can downgrade or upgrade your subscription by clicking the Manage button.</span>
        <mwc-button id="manageBtn" @click="${this.manageTapped}">Manage</mwc-button>
      </div>
    `;
  }

  renderPlanItem(item, index) {
    if (item.id !== -1) {
      return html`<mwc-list-item data-index="${index}">${item.name}</mwc-list-item>`;
    }
    return html``;
  }

  renderPlan(item) {
    return html`
    <bnb-card>
      <div class="card-content">
        <div class="card-header">${item.name}</div>
        <div class="card-price">
          <span class="dollar">$<span class="currency">USD</span></span>
          ${item.amount} per month</div>
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
     </bnb-card>
    `;
  }

  findPlanById(id) {
    return this.plans.find((item) => item.id === id);
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

  subscribeTapped() {
    const selectedItem = this.shadowRoot.getElementById('plansSelect').selected;
    this.selectedPlan = this.plans[selectedItem.dataset.index];
    store.dispatch(stripeCheckout(this.stripeKey, this.selectedPlan.id));
  }

  manageTapped() {
    store.dispatch(stripeManageSubscription());
  }
}

window.customElements.define('bnb-subscriptions', BnbSubscriptions);
