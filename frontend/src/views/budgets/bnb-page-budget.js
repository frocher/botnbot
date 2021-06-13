import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../../state/store';
import { createBudget, deleteBudget } from '../../state/budgets/actions';
import {
  categoryKeys, getBudgetName, getCategory, getEntry,
} from './budget-model';
import './bnb-budget-bar';
import './bnb-budget-card';

class BnbPageBudget extends connect(store)(LitElement) {
  static get properties() {
    return {
      stats: { type: Object },
      budgets: { type: Array },
    };
  }

  constructor() {
    super();
    this.cards = [];
  }

  render() {
    return html`
      <bnb-budget-bar id="budgetBar" can-add="${this.page?.can_create_budget}"></bnb-budget-bar>
      ${this.cards.map((i) => this.renderCard(i))}
    `;
  }

  renderCard(item) {
    return html`
      <bnb-budget-card .budgetInfo="${item}" ?canDelete="${this.page?.can_delete_budget}" @close="${this.budgetCloseTapped}"></bnb-budget-card>
    `;
  }

  stateChanged(state) {
    this.page = state.pages.current;
    this.stats = state.stats.all;
    this.budgets = state.budgets.all;

    this.cards = this.createCards();
  }

  firstUpdated() {
    this.shadowRoot.getElementById('budgetBar').addEventListener('add', (e) => this.addTapped(e));
  }

  createCards() {
    const budgets = [];
    if (this.stats && this.budgets) {
      for (let i = 0; i < this.budgets.length; i += 1) {
        budgets.push(this.createBudgetObject(this.budgets[i]));
      }
      budgets.sort((a, b) => {
        if (a.category > b.category) {
          return 1;
        }
        if (a.category < b.category) {
          return -1;
        }
        return a.item > b.item ? 1 : -1;
      });
    }
    return budgets;
  }

  addTapped(e) {
    store.dispatch(createBudget(this.page.id, e.detail.category, e.detail.item, e.detail.budget));
  }

  createBudgetObject(src) {
    let data;
    switch (src.category) {
      case categoryKeys.lightouse:
        data = this.stats.lighthouse;
        break;
      case categoryKeys.performance:
        data = this.stats.performance;
        break;
      case categoryKeys.requests:
        data = this.stats.requests;
        break;
      case categoryKeys.bytes:
        data = this.stats.bytes;
        break;
      case categoryKeys.carbon:
        data = this.stats.carbon;
        break;
    }

    let budgetData;
    const category = getCategory(src.category);
    const budgetModel = getEntry(category, src.item);

    if (src.item >= data.length) {
      switch (src.category) {
        case categoryKeys.lightouse:
          budgetData = { key: 'mean', values: this.createMeanData(data) };
          break;
        case categoryKeys.requests:
        case categoryKeys.bytes:
          budgetData = { key: 'total', values: this.createTotalData(data) };
          break;
      }
    } else {
      budgetData = data[budgetModel.index];
    }

    return {
      id: src.id,
      category: src.category,
      item: src.item,
      name: getBudgetName(src.category, src.item),
      model: budgetModel,
      data: budgetData,
      budget: src.budget,
    };
  }

  createTotalData(data) {
    const total = [];
    for (let iSet = 0; iSet < data.length; iSet += 1) {
      for (let iData = 0; iData < data[iSet].values.length; iData += 1) {
        if (total[iData] === undefined) {
          total[iData] = JSON.parse(JSON.stringify(data[iSet].values[iData]));
        } else {
          total[iData].value = Math.round(total[iData].value + data[iSet].values[iData].value);
        }
      }
    }
    return total;
  }

  createMeanData(data) {
    const mean = this.createTotalData(data);
    if (data.length > 0) {
      for (let i = 0; i < mean.length; i += 1) {
        mean[i].value = Math.round(mean[i].value / data.length);
      }
    }
    return mean;
  }

  budgetCloseTapped(e) {
    store.dispatch(deleteBudget(this.page.id, e.detail.id));
  }
}
window.customElements.define('bnb-page-budget', BnbPageBudget);
