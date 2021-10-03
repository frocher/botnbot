import { LitElement, css, html } from 'lit';
import '@material/mwc-button';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-select';
import '@material/mwc-textfield';
import '../components/bnb-card';
import '../components/bnb-period-dropdown';
import { styles } from '../components/bnb-styles';
import { categories, getCategory } from './budget-model';

class BnbBudgetBar extends LitElement {
  static get properties() {
    return {
      items: { type: Array },
      canAdd: { type: Boolean },
    };
  }

  static get styles() {
    return [
      styles,
      css`
      :host {
        display: flex;
      }

      bnb-card {
        display: flex;
        flex-direction: column;
        width: 100%;
      }

      #budgetTools {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin-top: 16px;
        margin-bottom: -20px;
      }

      p {
        margin: 0;
      }

      #itemField {
        margin-left: 5px;
      }

      #budgetField {
        min-width: 170px;
        margin-left: 5px;
        width: 150px;
      }

      #budgetBtn {
        margin-top: 12px;
      }


      @media (max-width: 700px) {
        #budgetTools {
          display: flex;
          flex-direction: column;
        }

        #itemField {
          margin-top: 16px;
          margin-left: 0;
        }

        #budgetField {
          margin-left: 0;
          width: 100%;
        }
      }
      `,
    ];
  }

  constructor() {
    super();
    this.items = [];
    this.canAdd = true;
  }

  render() {
    return html`
    <bnb-card>
      <bnb-period-dropdown></bnb-period-dropdown>
      ${this.renderBudgetTools()}
    </bnb-card>
    `;
  }

  renderBudgetTools() {
    if (!this.canAdd) {
      return html``;
    }

    return html`
      <div id="budgetTools">
        <mwc-select id="categoryField" outlined label="Category">
          ${categories.map((i) => this.renderCategoryItem(i))}
        </mwc-select>

        <mwc-select id="itemField" outlined required validationMessage="This field is required" label="Item">
          ${this.items.map((i) => this.renderFieldItem(i))}
        </mwc-select>

        <mwc-textfield id="budgetField" outlined label="Budget" type="number" min="0" required validationMessage="This field is required">
        </mwc-textfield>

        <mwc-button id="budgetBtn">Add</mwc-button>
      </div>
      `;
  }

  renderCategoryItem(item) {
    return html`<mwc-list-item value="${item.key}">${item.label}</mwc-list-item>`;
  }

  renderFieldItem(item) {
    return html`<mwc-list-item value="${item.key}">${item.label}</mwc-list-item>`;
  }

  firstUpdated() {
    this.shadowRoot.getElementById('categoryField').addEventListener('selected', () => this.selectedItemChanged());
    this.shadowRoot.getElementById('budgetBtn').addEventListener('click', () => this.addTapped());
  }

  selectedItemChanged() {
    const categoryKey = parseInt(this.shadowRoot.getElementById('categoryField').value, 10);
    const category = getCategory(categoryKey);
    this.items = category.entries;
    this.shadowRoot.getElementById('itemField').value = '';
  }

  addTapped() {
    const categoryField = this.shadowRoot.getElementById('categoryField');
    const itemField = this.shadowRoot.getElementById('itemField');
    const budgetField = this.shadowRoot.getElementById('budgetField');

    const isItemValid = itemField.reportValidity();
    const isBudgetValid = budgetField.reportValidity();

    if (isItemValid && isBudgetValid) {
      const detail = {
        category: categoryField.value, item: itemField.value, budget: budgetField.value,
      };
      this.dispatchEvent(new CustomEvent('add', { detail }));
    }
  }
}
window.customElements.define('bnb-budget-bar', BnbBudgetBar);
