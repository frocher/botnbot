import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/paper-card/paper-card';
import '@polymer/paper-icon-button/paper-icon-button';
import './bnb-budget';
import './bnb-common-styles';
import './bnb-icons';

class BnbBudgetCard extends PolymerElement {
  static get template() {
    return html`
    <style include="bnb-common-styles">
      :host {
        display: flex;
        margin: 16px;
      }

      paper-card {
        width: 100%;
      }

      #chart {
        width: 100%;
        height: 340px;
      }

      .budget-header {
        @apply --paper-font-headline;
        margin-bottom: 16px;
      }

      .budget-header-buttons {
        float: right;
        font-size: 14px;
        vertical-align: middle;
      }
    </style>
    <paper-card>
      <div class="card-content">
        <div class="budget-header">[[budgetInfo.name]]
          <div class="budget-header-buttons">
            <paper-icon-button icon="bnb:close" hidden$="[[!canDelete]]" on-tap="closeTapped"></paper-icon-button>
          </div>
        </div>
        <bnb-budget id="chart" data="[[budgetInfo.data]]" model="[[budgetInfo.model]]" budget="[[budgetInfo.budget]]"></bnb-budget>
      </div>
    </paper-card>
    `;
  }

  static get properties() {
    return {
      budgetInfo: Object,
      canDelete: {
        type: Boolean,
        value: true,
      },
    };
  }

  closeTapped() {
    this.dispatchEvent(new CustomEvent('close', { detail: this.budgetInfo }));
  }
}
window.customElements.define('bnb-budget-card', BnbBudgetCard);
