import { LitElement, css, html } from 'lit';
import '@material/mwc-icon-button';
import '../components/bnb-card';
import './bnb-budget';

class BnbBudgetCard extends LitElement {
  static get properties() {
    return {
      budgetInfo: { type: Object },
      canDelete: { type: Boolean },
    };
  }

  static get styles() {
    return css`
    :host {
      display: flex;
      margin: 16px;
    }

    bnb-card {
      width: 100%;
    }

    #chart {
      width: 100%;
      height: 340px;
    }

    .budget-header {
      font-size: 24px;
      margin-bottom: 16px;
    }

    .budget-header-buttons {
      float: right;
      font-size: 14px;
      vertical-align: middle;
    }
    `;
  }

  render() {
    return html`
    <bnb-card>
      <div class="card-content">
        <div class="budget-header">${this.budgetInfo.name}
          <div class="budget-header-buttons">
            ${this.renderCloseBtn()}
          </div>
        </div>
        <bnb-budget id="chart" .data="${this.budgetInfo.data}" .model="${this.budgetInfo.model}" .budget="${this.budgetInfo.budget}"></bnb-budget>
      </div>
    </bnb-card>
    `;
  }

  renderCloseBtn() {
    return this.canDelete ? html`<mwc-icon-button id="closeBtn" icon="close"></mwc-icon-button>` : html``;
  }

  firstUpdated() {
    this.shadowRoot.getElementById('closeBtn').addEventListener('click', () => this.closeTapped());
  }

  closeTapped() {
    this.dispatchEvent(new CustomEvent('close', { detail: this.budgetInfo }));
  }
}
window.customElements.define('bnb-budget-card', BnbBudgetCard);
