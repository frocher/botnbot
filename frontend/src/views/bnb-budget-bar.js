import { LitElement, css, html } from 'lit-element';
import '@material/mwc-button';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-select';
import '@material/mwc-textfield';
import './bnb-card';
import './bnb-period-dropdown';
import { styles } from './bnb-styles';

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
          <mwc-list-item value="Lighthouse">Lighthouse</mwc-list-item>
          <mwc-list-item value="Performance">Performance</mwc-list-item>
          <mwc-list-item value="Assets count">Assets count</mwc-list-item>
          <mwc-list-item value="Assets size">Assets size</mwc-list-item>
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

  renderFieldItem(item) {
    return html`<mwc-list-item value="${item}">${item}</mwc-list-item>`;
  }

  firstUpdated() {
    this.shadowRoot.getElementById('categoryField').addEventListener('selected', () => this.selectedItemChanged());
    this.shadowRoot.getElementById('budgetBtn').addEventListener('click', () => this.addTapped());
  }

  selectedItemChanged() {
    const data = [
      ['PWA', 'Performance', 'Accessibility', 'Best practices', 'SEO', 'Mean'],
      ['First byte', 'Largest paint', 'Speed index', 'Total blocking time'],
      ['HTML', 'CSS', 'Javascript', 'Image', 'Font', 'Other', 'Total'],
      ['HTML', 'CSS', 'Javascript', 'Image', 'Font', 'Other', 'Total'],
    ];
    const selectedCategory = this.shadowRoot.getElementById('categoryField').index;
    this.items = data[selectedCategory];
    this.shadowRoot.getElementById('itemField').value = '';
  }

  addTapped() {
    const categoryField = this.shadowRoot.getElementById('categoryField');
    const itemField = this.shadowRoot.getElementById('itemField');
    const budgetField = this.shadowRoot.getElementById('budgetField');

    const isItemValid = itemField.reportValidity();
    const isBudgetValid = budgetField.reportValidity();

    if (isItemValid && isBudgetValid) {
      const name = `${categoryField.value}/${itemField.value}`;
      const detail = {
        name, category: categoryField.index, item: itemField.index, budget: budgetField.value,
      };
      this.dispatchEvent(new CustomEvent('add', { detail }));
    }
  }
}
window.customElements.define('bnb-budget-bar', BnbBudgetBar);
