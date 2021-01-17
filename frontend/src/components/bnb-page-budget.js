import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../store';
import { createBudget, deleteBudget } from '../actions/budgets';
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

    this.lighthouseModel = [
      { name: 'pwa', color: '#4A148C', label: 'pwa' },
      { name: 'performance', color: '#7B1FA2', label: 'performance' },
      { name: 'accessibility', color: '#9C27B0', label: 'accessibility' },
      { name: 'best_practices', color: '#BA68C8', label: 'best practices' },
      { name: 'seo', color: '#E1BEE7', label: 'seo' },
    ];

    this.performanceModel = [
      {
        name: 'first_byte', color: '#E65100', label: 'first byte', suffix: 'ms',
      },
      {
        name: 'first_paint', color: '#F57C00', label: 'first paint', suffix: 'ms',
      },
      {
        name: 'speed_index', color: '#FF9800', label: 'speed index',
      },
      {
        name: 'interactive', color: '#FFB74D', label: 'interactive', suffix: 'ms',
      },
    ];

    this.uptimeModel = [
      {
        name: 'uptime', color: '#00C853', label: 'uptime', suffix: '%',
      },
    ];

    this.requestsModel = [
      { name: 'html', color: '#01579B', label: 'html' },
      { name: 'css', color: '#0288D1', label: 'css' },
      { name: 'js', color: '#03A9F4', label: 'javascript' },
      { name: 'image', color: '#4FC3F7', label: 'image' },
      { name: 'font', color: '#81D4FA', label: 'font' },
      { name: 'other', color: '#B3E5FC', label: 'other' },
    ];

    this.bytesModel = [
      {
        name: 'html', color: '#880E4F', label: 'html', suffix: 'KiB',
      },
      {
        name: 'css', color: '#C2185B', label: 'css', suffix: 'KiB',
      },
      {
        name: 'js', color: '#D81B60', label: 'javascript', suffix: 'KiB',
      },
      {
        name: 'image', color: '#EC407A', label: 'image', suffix: 'KiB',
      },
      {
        name: 'font', color: '#F48FB1', label: 'font', suffix: 'KiB',
      },
      {
        name: 'other', color: '#F8BBD0', label: 'other', suffix: 'KiB',
      },
    ];
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

  createBudgetName(category, item) {
    const data = [
      { name: 'Lighthouse', values: ['PWA', 'Performance', 'Accessibility', 'Best practices', 'SEO', 'Mean'] },
      { name: 'Performance', values: ['First byte', 'Largest paint', 'Speed index', 'Total blocking time'] },
      { name: 'Assets count', values: ['HTML', 'CSS', 'Javascript', 'Image', 'Font', 'Other', 'Total'] },
      { name: 'Assets size', values: ['HTML', 'CSS', 'Javascript', 'Image', 'Font', 'Other', 'Total'] },
    ];
    return `${data[category].name}/${data[category].values[item]}`;
  }

  createBudgetObject(src) {
    let model;
    let data;
    switch (src.category) {
      case 0:
        model = this.lighthouseModel;
        data = this.stats.lighthouse;
        break;
      case 1:
        model = this.performanceModel;
        data = this.stats.performance;
        break;
      case 2:
        model = this.requestsModel;
        data = this.stats.requests;
        break;
      case 3:
        model = this.bytesModel;
        data = this.stats.bytes;
        break;
    }

    let budgetModel;
    let budgetData;
    if (src.item >= data.length) {
      switch (src.category) {
        case 0:
          budgetModel = { label: 'mean', color: '#D500F9' };
          budgetData = { key: 'mean', values: this.createMeanData(data) };
          break;
        case 2:
          budgetModel = { label: 'total', color: '#00B0FF' };
          budgetData = { key: 'total', values: this.createTotalData(data) };
          break;
        case 3:
          budgetModel = { label: 'total', color: '#FF80AB' };
          budgetData = { key: 'total', values: this.createTotalData(data) };
          break;
      }
    } else {
      budgetModel = model[src.item];
      budgetData = data[src.item];
    }

    return {
      id: src.id,
      category: src.category,
      item: src.item,
      name: this.createBudgetName(src.category, src.item),
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
