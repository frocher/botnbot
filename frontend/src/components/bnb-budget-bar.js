import { LitElement, css, html } from 'lit-element';
import '@material/mwc-button';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-select';
import '@material/mwc-textfield';
import '@polymer/paper-card/paper-card';
import './bnb-period-dropdown';

class BnbBudgetBar extends LitElement {
  static get properties() {
    return {
      items: { type: Array },
      canAdd: { type: Boolean },
    };
  }

  static get styles() {
    return css`
    :host {
      display: flex;
    }

    paper-card {
      display: flex;
      flex-direction: column;
      width: 100%;
      margin: 16px;
      padding: 16px;
    }

    #budgetTools {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      margin-top: 16px;
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
      height: 44px;
      align-self: center;
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
    `;
  }

  constructor() {
    super();
    this.items = [];
    this.canAdd = true;
  }

  render() {
    return html`
    <paper-card>
      <bnb-period-dropdown></bnb-period-dropdown>
      ${this.renderBudgetTools()}
    </paper-card>
    `;
  }

  renderBudgetTools() {
    if (!this.canAdd) {
      return html``;
    }

    return html`
      <div id="budgetTools" hidden$="[[!canAdd]]">
        <mwc-select id="categoryField" outlined label="Category">
          <mwc-list-item value="Lighthouse">Lighthouse</mwc-list-item>
          <mwc-list-item value="Performance">Performance</mwc-list-item>
          <mwc-list-item value="Assets count">Assets count</mwc-list-item>
          <mwc-list-item value="Assets size">Assets size</mwc-list-item>
        </mwc-select>

        <mwc-select id="itemField" outlined required validationMessage="This field is required" label="Item">
          ${this.items.map( i => this.renderFieldItem(i))}
        </mwc-select>

        <mwc-textfield id="budgetField" outlined label="Budget" type="number" min="0" required validationMessage="This field is required" value="{{budget}}">
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
      ['PWA', 'Performance', 'Accessibility', 'Best practices', 'SEO', 'Average'],
      ['First byte', 'First paint', 'Speed index', 'Interactive'],
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
